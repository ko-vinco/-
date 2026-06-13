/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ParkingSpot {
  id: string;
  title: string;
  neighborhood: string; // 마전동, 당하동, 원당동, 아라동, 불로대곡동, 오류왕길동, 검단동
  address: string;
  pricePerHour: number;
  availableHours: string; // e.g. "09:00 - 18:00", "24시간"
  type: 'villa' | 'apartment' | 'detached' | 'commercial' | 'land';
  features: string[]; // CCTV, EV_CHARGER, ENTRY_CONTROL, GUARD, LARGE_VEHICLE
  description: string;
  hostPhone: string;
  coordinates: { x: number; y: number }; // Relative position on the 0-100 map grid
  status: 'available' | 'reserved';
  createdAt: string;
  totalRatingsCount: number;
  averageRating: number;
}

export interface Booking {
  id: string;
  spotId: string;
  spotTitle: string;
  spotAddress: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
  reservedAt: string;
  carNumber: string;
}

export type NeighborhoodType = 'all' | '마전동' | '당하동' | '원당동' | '아라동' | '불로동' | '오류동' | '검정동';
