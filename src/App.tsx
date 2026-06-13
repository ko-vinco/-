/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ParkingSpot, Booking } from './types';
import GeomdanMiniMap from './components/GeomdanMiniMap';
import ParkingSpotCard from './components/ParkingSpotCard';
import SpotRegistrationModal from './components/SpotRegistrationModal';
import BookingList from './components/BookingList';
import {
  Search,
  Filter,
  Plus,
  Car,
  Compass,
  AlertTriangle,
  Coins,
  History,
  CheckCircle2,
  MapPin,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Prepopulated high-fidelity seed data of Incheon Geomdan spots
const DEFAULT_SPOTS: ParkingSpot[] = [
  {
    id: 'spot-1',
    title: '아라동 금호어울림 센트럴 아파트 상가 후면 공유주차',
    neighborhood: '아라동',
    address: '인천 서구 이음대로 123 (아라동)',
    pricePerHour: 1200,
    availableHours: '평일 업무시간 (09:00 - 18:00)',
    type: 'commercial',
    features: ['CCTV', 'ENTRY_CONTROL'],
    description: '상업 중심구역 내 상가 정비 사업으로 비워둔 넓고 쾌적한 전용 지상 칸입니다. 입출차 시 차단 게이트에서 자동으로 번호 인식되어 편리하며, 아라동 먹자골목 및 지하철역과 도보 3분 연결됩니다.',
    hostPhone: '010-9112-9023',
    coordinates: { x: 340, y: 360 },
    status: 'available',
    createdAt: new Date().toISOString(),
    totalRatingsCount: 12,
    averageRating: 4.8,
  },
  {
    id: 'spot-2',
    title: '당하동 완정역 3번출구 미소빌 주차장 102호 전용칸',
    neighborhood: '당하동',
    address: '인천 서구 완정로64번길 8 (당하동)',
    pricePerHour: 1000,
    availableHours: '24시간',
    type: 'villa',
    features: ['CCTV', 'LARGE_VEHICLE'],
    description: '완정역과 도보 2분 거리의 다세대 주택 필로티 대여 주차 공간입니다. 직장 동료 교대 근무 등으로 낮과 밤 시간 가릴 것 없이 상시 비어 있는 고정 칸으로, 중대형 SUV도 쾌적하게 투입할 수 있습니다.',
    hostPhone: '010-3444-2391',
    coordinates: { x: 130, y: 350 },
    status: 'available',
    createdAt: new Date().toISOString(),
    totalRatingsCount: 8,
    averageRating: 4.9,
  },
  {
    id: 'spot-3',
    title: '원당동 삼정프라자 상가 후면 지상 야간 개방지',
    neighborhood: '원당동',
    address: '인천 서구 고산후로 95 (원당동)',
    pricePerHour: 1500,
    availableHours: '야간 개방 (18:00 - 익일 08:00)',
    type: 'commercial',
    features: ['CCTV', 'GUARD', 'EV_CHARGER'],
    description: '퇴근 이후 상가 이용 고객이 줄어드는 시각에 맞춰 안전하게 대면/비대면 공유하는 지상 전용구역입니다. 보안등이 밝고 아파트 단지 주민들의 단기 일시 주정차용으로 최상의 방범 퀄리티를 자랑합니다.',
    hostPhone: '010-7711-2093',
    coordinates: { x: 350, y: 220 },
    status: 'available',
    createdAt: new Date().toISOString(),
    totalRatingsCount: 24,
    averageRating: 4.7,
  },
  {
    id: 'spot-4',
    title: '마전동 마전테니스장 골목 단독주택 잔디자갈 마당',
    neighborhood: '마전동',
    address: '인천 서구 마전들로 15 (마전동)',
    pricePerHour: 800,
    availableHours: '24시간',
    type: 'detached',
    features: ['LARGE_VEHICLE'],
    description: '조용하고 한적한 주택 마당 보도블록 유휴 구역 주차장입니다. 골목 이면도로에 복잡함 없이 편안하게 단/장기 주차가 가능하며, 테니스장 및 체육공원 바로 옆으로 출입문 가시성이 탁월합니다.',
    hostPhone: '010-8911-3042',
    coordinates: { x: 210, y: 260 },
    status: 'available',
    createdAt: new Date().toISOString(),
    totalRatingsCount: 5,
    averageRating: 4.6,
  },
  {
    id: 'spot-5',
    title: '불로동 e편한세상 아파트 단지 주간 유휴 주차면',
    neighborhood: '불로동',
    address: '인천 서구 불로로 32 (불로동)',
    pricePerHour: 1200,
    availableHours: '평일 업무시간 (09:00 - 18:00)',
    type: 'apartment',
    features: ['CCTV', 'GUARD', 'EV_CHARGER'],
    description: '낮 시간대(09~18시) 주민 출근으로 텅텅 마주하게 되는 최상의 편의성을 지닌 단내 지정칸입니다. 아파트 단지 경비원이 상시 관리하며 완속 및 고성능 급속 충전 완비되어 배터리 걱정 없이 주차 가능합니다.',
    hostPhone: '010-5231-1002',
    coordinates: { x: 260, y: 130 },
    status: 'available',
    createdAt: new Date().toISOString(),
    totalRatingsCount: 4,
    averageRating: 5.0,
  },
  {
    id: 'spot-6',
    title: '오류동 검단오류역 도보 4분 전원 주차부지',
    neighborhood: '오류동',
    address: '인천 서구 검단로 712 (오류동)',
    pricePerHour: 500,
    availableHours: '24시간',
    type: 'land',
    features: ['LARGE_VEHICLE'],
    description: '검단오류 주택 개발 예정 구역의 쇄석 정비 임시 자갈 야적 주차 부지입니다. 단차가 없고 넓기 때문에 카라반, 중대형 화물 SUV나 캠핑카 탑차까지 대 수용 가능한 매머드급 가성비 필지입니다.',
    hostPhone: '010-1844-3811',
    coordinates: { x: 95, y: 190 },
    status: 'available',
    createdAt: new Date().toISOString(),
    totalRatingsCount: 15,
    averageRating: 4.5,
  },
];

const neighborhoodOffsets: Record<string, { x: number; y: number }> = {
  오류동: { x: 95, y: 190 },
  불로동: { x: 260, y: 130 },
  마전동: { x: 210, y: 260 },
  원당동: { x: 350, y: 220 },
  당하동: { x: 130, y: 350 },
  아라동: { x: 340, y: 360 },
};

export default function App() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings'>('explore');
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  
  // Advanced Filter state
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [requiredFeatures, setRequiredFeatures] = useState<string[]>([]);

  // Load database from localStorage or fallback to standard seed data
  useEffect(() => {
    const savedSpots = localStorage.getItem('geomdan_spots');
    const savedBookings = localStorage.getItem('geomdan_bookings');

    if (savedSpots) {
      setSpots(JSON.parse(savedSpots));
    } else {
      setSpots(DEFAULT_SPOTS);
      localStorage.setItem('geomdan_spots', JSON.stringify(DEFAULT_SPOTS));
    }

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      setBookings([]);
      localStorage.setItem('geomdan_bookings', JSON.stringify([]));
    }
  }, []);

  // Save changes to localStorage helper
  const saveSpots = (newSpots: ParkingSpot[]) => {
    setSpots(newSpots);
    localStorage.setItem('geomdan_spots', JSON.stringify(newSpots));
  };

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('geomdan_bookings', JSON.stringify(newBookings));
  };

  // Neighborhood selectors (matching visual map)
  const neighborhoods = [
    { key: 'all', label: '전체 동별' },
    { key: '아라동', label: '아라동 (검단신도시)' },
    { key: '원당동', label: '원당동' },
    { key: '당하동', label: '당하동 (완정역)' },
    { key: '마전동', label: '마전동' },
    { key: '불로동', label: '불로동' },
    { key: '오류동', label: '오류동 (검단오류)' },
  ];

  // Types list
  const spotTypes = [
    { key: 'all', label: '형태 전체' },
    { key: 'villa', label: '빌라 필로티' },
    { key: 'apartment', label: '아파트 단지' },
    { key: 'detached', label: '단독마당' },
    { key: 'commercial', label: '상가빌딩' },
    { key: 'land', label: '나대지' },
  ];

  // Feature filter togglers
  const handleFeatureToggle = (featureKey: string) => {
    setRequiredFeatures((prev) =>
      prev.includes(featureKey) ? prev.filter((f) => f !== featureKey) : [...prev, featureKey]
    );
  };

  // Filter spots criteria
  const filteredSpots = spots.filter((spot) => {
    // Neighborhood Filter
    if (selectedNeighborhood !== 'all' && spot.neighborhood !== selectedNeighborhood) return false;

    // Search Query (title, address, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = spot.title.toLowerCase().includes(q);
      const matchAddress = spot.address.toLowerCase().includes(q);
      const matchDesc = spot.description.toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchDesc) return false;
    }

    // Max Price range Filter
    if (spot.pricePerHour > maxPrice) return false;

    // Spot Type Filter
    if (selectedType !== 'all' && spot.type !== selectedType) return false;

    // Features Checklist Filter
    if (requiredFeatures.length > 0) {
      const hasAll = requiredFeatures.every((feat) => spot.features.includes(feat));
      if (!hasAll) return false;
    }

    return true;
  });

  // Handle spot selection
  const handleSelectSpot = (spot: ParkingSpot | null) => {
    if (spot) {
      setSelectedSpotId(spot.id);
      setActiveTab('explore');
    } else {
      setSelectedSpotId(null);
    }
  };

  // Register a new spot with automatic coordinate placement calculation
  const handleRegisterSpot = (formData: Omit<ParkingSpot, 'id' | 'createdAt' | 'status' | 'coordinates' | 'totalRatingsCount' | 'averageRating'>) => {
    const baseCoords = neighborhoodOffsets[formData.neighborhood] || { x: 250, y: 220 };
    
    // Add minor randomized offset to prevent duplicate overlapping pins in same neighborhood
    const randomizedCoords = {
      x: baseCoords.x + Math.floor(Math.random() * 40 - 20),
      y: baseCoords.y + Math.floor(Math.random() * 40 - 20),
    };

    const newSpotId = `spot-${Date.now()}`;
    const newSpot: ParkingSpot = {
      ...formData,
      id: newSpotId,
      status: 'available',
      coordinates: randomizedCoords,
      createdAt: new Date().toISOString(),
      totalRatingsCount: 0,
      averageRating: 5.0,
    };

    const updatedSpots = [newSpot, ...spots];
    saveSpots(updatedSpots);
    
    // Auto focus on the newly added spot!
    setSelectedSpotId(newSpotId);
    setSelectedNeighborhood(formData.neighborhood);
    setActiveTab('explore');

    // Friendly alert
    alert(`🎉 [공유등록 성공]\n\n'${formData.title}' 주차장 공유 등록이 정상 처리되었습니다.\n검단이웃들이 즉시 예약을 개시할 수 있습니다.`);
  };

  // Complete a booking transaction
  const handleBookSpot = (spotId: string, carNumber: string, hours: number) => {
    const targetSpot = spots.find((s) => s.id === spotId);
    if (!targetSpot) return;

    // Total fare computation
    const totalFare = targetSpot.pricePerHour * hours;

    // Create Booking entity
    const newBooking: Booking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      spotId,
      spotTitle: targetSpot.title,
      spotAddress: targetSpot.address,
      carNumber,
      startTime: new Date().toLocaleString('ko-KR'),
      endTime: new Date(Date.now() + hours * 60 * 60 * 1000).toLocaleString('ko-KR'),
      totalPrice: totalFare,
      status: 'active',
      reservedAt: new Date().toISOString(),
    };

    // Update spot status to reserved
    const updatedSpots = spots.map((spot) => {
      if (spot.id === spotId) {
        return { ...spot, status: 'reserved' as const };
      }
      return spot;
    });

    const updatedBookings = [newBooking, ...bookings];

    saveSpots(updatedSpots);
    saveBookings(updatedBookings);
    
    // UI shift to 예약내역
    setActiveTab('bookings');
    setSelectedSpotId(null);

    // Dynamic success modal info alert
    alert(
      `🚗 [주차장 대여가 확정되었습니다]\n\n📍 위치: ${targetSpot.title}\n💬 연락처: ${targetSpot.hostPhone}\n🚙 차량번호: ${carNumber}\n⏰ 대여시간: ${hours}시간\n💵 이용금액: ${totalFare.toLocaleString()}원\n\n지정된 호스트 공간에 매너 주차를 준수해 주십시오.`
    );
  };

  // Cancel reservation and restore spot availability
  const handleCancelBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    if (!confirm('정말로 이 주차 예약을 취소하시겠습니까? 호스트에게 취소 알림이 전달됩니다.')) {
      return;
    }

    // Set spot back to available
    const updatedSpots = spots.map((spot) => {
      if (spot.id === targetBooking.spotId) {
        return { ...spot, status: 'available' as const };
      }
      return spot;
    });

    // Update booking status
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' as const };
      }
      return b;
    });

    saveSpots(updatedSpots);
    saveBookings(updatedBookings);
    
    alert('🚨 예약이 정상적으로 취소되었습니다. 대여 공간은 다시 타 이웃들이 탐색할 수 있도록 개방됩니다.');
  };

  const activeReservationsCount = bookings.filter((b) => b.status === 'active').length;

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Decorative top strip */}
      <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-indigo-600"></div>

      {/* Main Top Header Navigation */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-4.5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-650/40 flex items-center justify-center text-indigo-700 font-bold shrink-0 shadow-xs">
              <Car className="w-5.5 h-5.5 text-indigo-600 stroke-[2.2px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">검단 주차공유</h1>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  G-Share
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">인천 검단지구 실시간 빈 주차 공간 이웃 나눔 플랫폼</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
            {/* Quick stats indicator */}
            <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block text-[9px] font-semibold">전체 주차공간</span>
                <span className="font-bold text-slate-800">{spots.length}개소</span>
              </div>
              <div className="h-6 w-[1px] bg-slate-200"></div>
              <div>
                <span className="text-emerald-600 block text-[9px] font-semibold">지금 즉시 대여가능</span>
                <span className="font-bold text-emerald-700">{spots.filter((s) => s.status === 'available').length}칸</span>
              </div>
            </div>

            {/* CTA action button to open registration modal */}
            <button
              onClick={() => setIsRegModalOpen(true)}
              type="button"
              className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-slate-950/5 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
              내 주차장 공유하기
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="max-w-7xl mx-auto px-5 py-6.5 flex-1 w-full flex flex-col lg:grid lg:grid-cols-12 gap-6.5">
        {/* LEFT COLUMN: Explorer and Listings list (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Main search and view Toggle switcher */}
          <div className="bg-white border border-slate-150/80 p-5 rounded-3xl space-y-4 shadow-xs">
            {/* Nav tabs (Explore spots or check active bookings) */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setActiveTab('explore')}
                className={`flex-1 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'explore'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-150/20'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Compass className="w-4 h-4 text-slate-500" />
                지도로 맛있는 주차정보
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'bookings'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-150/20'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <History className="w-4 h-4 text-slate-500" />
                내 대여 및 예약 현황
                {activeReservationsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-mono font-black flex items-center justify-center animate-bounce">
                    {activeReservationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search interface */}
            {activeTab === 'explore' && (
              <div className="space-y-3.5">
                {/* Search Term input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="건물, 도로명 주소, 명칭으로 쉽고 빠른 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-850 focus:outline-none rounded-xl font-medium transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      지우기
                    </button>
                  )}
                </div>

                {/* Micro Category Pills: Neighborhood Filter */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">빠른 법정동 필터</span>
                  <div className="flex flex-wrap gap-1.5">
                    {neighborhoods.map((n) => (
                      <button
                        key={n.key}
                        onClick={() => setSelectedNeighborhood(n.key)}
                        className={`cursor-pointer px-2.5 py-1.5 rounded-xl border text-[11px] transition-all whitespace-nowrap outline-none ${
                          selectedNeighborhood === n.key
                            ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collapsible Advanced filter expander */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      고급 세부 필터링
                    </span>
                    {(maxPrice < 2000 || selectedType !== 'all' || requiredFeatures.length > 0) && (
                      <button
                        onClick={() => {
                          setMaxPrice(2000);
                          setSelectedType('all');
                          setRequiredFeatures([]);
                        }}
                        type="button"
                        className="text-[10px] text-indigo-600 font-semibold hover:underline"
                      >
                        필터 초기화
                      </button>
                    )}
                  </div>

                  {/* Price slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>시간당 희망 금액 상한</span>
                      <span className="text-slate-800 font-mono">{maxPrice.toLocaleString()}원 이하</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="2000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Grid selector for Types and Features */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Types */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-semibold text-slate-400 block uppercase">공유 구역 형태</span>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full text-[11px] font-medium border border-slate-200 p-2 rounded-lg bg-white"
                      >
                        {spotTypes.map((t) => (
                          <option key={t.key} value={t.key}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Features options (CCTV or EV) */}
                    <div className="col-span-1 space-y-1.5">
                      <span className="text-[9px] font-semibold text-slate-400 block uppercase">필수 편의시설</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleFeatureToggle('CCTV')}
                          className={`flex-1 text-[10px] p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                            requiredFeatures.includes('CCTV')
                              ? 'bg-slate-900 border-slate-900 text-white font-bold'
                              : 'bg-white border-slate-250 text-slate-600'
                          }`}
                        >
                          CCTV 상주
                        </button>
                        <button
                          onClick={() => handleFeatureToggle('EV_CHARGER')}
                          className={`flex-1 text-[10px] p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                            requiredFeatures.includes('EV_CHARGER')
                              ? 'bg-slate-900 border-slate-900 text-white font-bold'
                              : 'bg-white border-slate-250 text-slate-600'
                          }`}
                        >
                          전기충전
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scrolling Listings container */}
          <div className="flex-1 overflow-y-auto max-h-[520px] lg:max-h-[600px] space-y-4.5 pr-1">
            {activeTab === 'explore' ? (
              filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <ParkingSpotCard
                    key={spot.id}
                    spot={spot}
                    isSelected={selectedSpotId === spot.id}
                    onSelect={() => setSelectedSpotId(spot.id)}
                    onBook={handleBookSpot}
                  />
                ))
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <AlertTriangle className="w-5.5 h-5.5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">검색 조건에 맞는 공간 없음</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-sm">
                    필터 기준이나 금액 범위를 넓히거나, 법정동을 다른 지역으로 변경해보세요.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedNeighborhood('all');
                      setMaxPrice(2000);
                      setSelectedType('all');
                      setRequiredFeatures([]);
                    }}
                    className="mt-4 cursor-pointer bg-slate-900 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-all"
                  >
                    모든 필터 초기화
                  </button>
                </div>
              )
            ) : (
              <BookingList bookings={bookings} onCancelBooking={handleCancelBooking} />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Map (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col min-h-[460px] lg:h-[720px]">
          <GeomdanMiniMap
            spots={spots}
            selectedSpotId={selectedSpotId}
            onSelectSpot={handleSelectSpot}
            selectedNeighborhood={selectedNeighborhood}
            onSelectNeighborhood={(n) => setSelectedNeighborhood(n)}
          />
        </div>
      </main>

      {/* FOOTER Info panel */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-7 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">검단 주차공유 G-Share</span>
            <span className="text-slate-500">|</span>
            <span>상해 임대차 사기 방지 및 안심 안심 인증 등록제 운영</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => alert('[안심 보장 서비스 수칙]\n\n1. 본인 주차 구역이 아님에도 허위 공유 적발 시 패널티 10만원\n2. 임차 차량 손괴 발생 시 안심공유 배상 책임보험 최고 3천만원 보장')}
              className="hover:text-white transition-colors"
            >
              이용약관 및 보장 제도
            </button>
            <span className="text-slate-700">•</span>
            <span>인천 서구 검단 신도시 자치위원회 협력</span>
          </div>
        </div>
      </footer>

      {/* Shared Registry Form Modal overlay popup */}
      <SpotRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onSubmit={handleRegisterSpot}
      />
    </div>
  );
}
