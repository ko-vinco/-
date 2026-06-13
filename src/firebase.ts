import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { ParkingSpot, Booking } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);


// Operation Types for error reporting
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

// Global exception formatter as mandated by SDK patterns
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error Detailed Info:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 1. Connection Validation Check
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test-connection-virtual-doc', 'test'));
    console.log("Firebase Firestore Connection validated successfully!");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client is offline");
    }
  }
}

// 2. Fetch Spots Real-time Listener Wrapper
export function listenSpots(onUpdate: (spots: ParkingSpot[]) => void, onError: (err: unknown) => void) {
  const collectionRef = collection(db, 'spots');
  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const spots: ParkingSpot[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        spots.push({
          id: docSnap.id,
          title: data.title || '',
          neighborhood: data.neighborhood || '',
          address: data.address || '',
          pricePerHour: Number(data.pricePerHour) || 0,
          availableHours: data.availableHours || '',
          type: data.type || 'villa',
          features: Array.isArray(data.features) ? data.features : [],
          description: data.description || '',
          hostPhone: data.hostPhone || '',
          coordinates: data.coordinates || { x: 0, y: 0 },
          status: data.status || 'available',
          createdAt: data.createdAt || new Date().toISOString(),
          totalRatingsCount: Number(data.totalRatingsCount) || 0,
          averageRating: Number(data.averageRating) || 5.0,
          hostUid: data.hostUid || '',
          hostEmail: data.hostEmail || '',
        });
      });
      // Sort: newest first
      spots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(spots);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'spots');
      onError(error);
    }
  );
}

// 3. Fetch Bookings Real-time Listener Wrapper
export function listenBookings(onUpdate: (bookings: Booking[]) => void, onError: (err: unknown) => void) {
  const collectionRef = collection(db, 'bookings');
  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const bookings: Booking[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        bookings.push({
          id: docSnap.id,
          spotId: data.spotId || '',
          spotTitle: data.spotTitle || '',
          spotAddress: data.spotAddress || '',
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          totalPrice: Number(data.totalPrice) || 0,
          status: data.status || 'active',
          reservedAt: data.reservedAt || new Date().toISOString(),
          carNumber: data.carNumber || '',
          userId: data.userId || '',
          userEmail: data.userEmail || '',
        });
      });
      // Sort newest bookings first
      bookings.sort((a, b) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime());
      onUpdate(bookings);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'bookings');
      onError(error);
    }
  );
}

// 4. Register a new Parking Spot
export async function addParkingSpot(spot: ParkingSpot) {
  const path = `spots/${spot.id}`;
  try {
    await setDoc(doc(db, 'spots', spot.id), {
      title: spot.title,
      neighborhood: spot.neighborhood,
      address: spot.address,
      pricePerHour: spot.pricePerHour,
      availableHours: spot.availableHours,
      type: spot.type,
      features: spot.features,
      description: spot.description,
      hostPhone: spot.hostPhone,
      coordinates: spot.coordinates,
      status: spot.status,
      createdAt: spot.createdAt,
      totalRatingsCount: spot.totalRatingsCount,
      averageRating: spot.averageRating,
      hostUid: spot.hostUid || '',
      hostEmail: spot.hostEmail || '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// 5. Update Status of Parking Spot (e.g. reserving or cancelling)
export async function updateParkingSpotStatus(spotId: string, status: 'available' | 'reserved') {
  const path = `spots/${spotId}`;
  try {
    await updateDoc(doc(db, 'spots', spotId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 5a. Delete a Parking Spot
export async function deleteParkingSpot(spotId: string) {
  const path = `spots/${spotId}`;
  try {
    await deleteDoc(doc(db, 'spots', spotId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 6. Create Booking
export async function addBooking(booking: Booking) {
  const path = `bookings/${booking.id}`;
  try {
    await setDoc(doc(db, 'bookings', booking.id), {
      id: booking.id,
      spotId: booking.spotId,
      spotTitle: booking.spotTitle,
      spotAddress: booking.spotAddress,
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalPrice: booking.totalPrice,
      status: booking.status,
      reservedAt: booking.reservedAt,
      carNumber: booking.carNumber,
      userId: booking.userId || '',
      userEmail: booking.userEmail || '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// 7. Update Booking Status (e.g. cancel booking)
export async function updateBookingStatus(bookingId: string, status: 'active' | 'completed' | 'cancelled') {
  const path = `bookings/${bookingId}`;
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 8. Seeding Helper Function to populate empty database with default spots
export async function seedInitialSpots(defaultSpots: ParkingSpot[]) {
  try {
    const querySnapshot = await getDocs(collection(db, 'spots'));
    if (querySnapshot.empty) {
      console.log("Firestore is empty. Seeding initial parking spots...");
      for (const spot of defaultSpots) {
        await addParkingSpot(spot);
      }
      console.log("Initial seed successful!");
    }
  } catch (error) {
    console.error("Failed to seed initial spots: ", error);
  }
}
