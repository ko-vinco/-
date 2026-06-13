/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ParkingSpot, Booking } from '../types';
import { User } from 'firebase/auth';
import { AlertCircle, Trash2, MapPin, ExternalLink, Car, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface MySpotListProps {
  spots: ParkingSpot[];
  bookings: Booking[];
  currentUser: User | null;
  localRegisteredSpotIds: string[];
  onDeleteSpot: (spotId: string) => void;
  onSelectSpot: (spot: ParkingSpot) => void;
}

export default function MySpotList({
  spots,
  bookings,
  currentUser,
  localRegisteredSpotIds,
  onDeleteSpot,
  onSelectSpot,
}: MySpotListProps) {
  // Filter spots registered by me
  const mySpots = spots.filter((spot) => {
    const isOwnedByAccount = currentUser && spot.hostUid === currentUser.uid;
    const isOwnedByGuestBrowser = localRegisteredSpotIds.includes(spot.id);
    return isOwnedByAccount || isOwnedByGuestBrowser;
  });

  if (mySpots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl">
        <div className="w-11 h-11 bg-white shadow-xs border border-slate-200/50 rounded-xl flex items-center justify-center text-slate-400 mb-2.5">
          <Trash2 className="w-5 h-5 stroke-[1.5]" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">등록한 주차장 공간 없음</h4>
        <p className="text-xs text-slate-400 max-w-[240px] mt-0.5 leading-relaxed">
          우측 상단 '내 주차장 공유하기' 버튼을 통해 비어있는 유휴 주차면을 검단 이웃들에게 공유해보세요!
        </p>
      </div>
    );
  }

  const getKoreanTypeStr = (type: string) => {
    switch (type) {
      case 'villa': return '빌라 필로티';
      case 'apartment': return '아파트 단지';
      case 'detached': return '단독마당';
      case 'commercial': return '상가빌딩';
      case 'land': return '나대지';
      default: return '일반유휴지';
    }
  };

  return (
    <div className="space-y-4">
      {mySpots.map((spot) => {
        const isReserved = spot.status === 'reserved';
        
        // Find if there is an active reservation
        const activeBooking = bookings.find(
          (b) => b.spotId === spot.id && b.status === 'active'
        );

        return (
          <motion.div
            key={spot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-2xl overflow-hidden shadow-xs bg-white transition-all ${
              isReserved ? 'border-amber-200 ring-1 ring-amber-500/10' : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            {/* Header with status badge */}
            <div className={`px-4.5 py-3 flex items-center justify-between border-b ${
              isReserved ? 'bg-amber-50/20 border-amber-100' : 'bg-slate-50/50 border-slate-100'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isReserved ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-amber-800 font-bold">이웃 대여 이용 중 🚗</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-emerald-700">대여 대기 중 (공유 활성)</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                금액: ₩{spot.pricePerHour?.toLocaleString() || '1,000'}/시간
              </span>
            </div>

            <div className="p-4.5 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 md:text-sm">{spot.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {spot.address}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectSpot(spot)}
                  className="cursor-pointer p-1 px-2 hover:bg-slate-100 rounded-lg text-indigo-600 hover:text-indigo-800 text-[11px] font-extrabold shrink-0 flex items-center gap-1 whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  위치 확인
                </button>
              </div>

              {/* If reserved, show renting details */}
              {isReserved && activeBooking && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>대여중인 이웃 차량 정보</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-amber-800">
                    <div>
                      <span className="text-slate-400 text-[9px] block">차량번호</span>
                      <strong className="text-amber-950 font-mono text-xs">{activeBooking.carNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">이용 개시시각</span>
                      <strong className="text-amber-950 font-mono text-xs">{activeBooking.startTime}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Details of the spot configured */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl flex flex-wrap gap-x-2 gap-y-1">
                <span><strong>형태:</strong> {getKoreanTypeStr(spot.type)}</span>
                <span>•</span>
                <span><strong>개방유형:</strong> {spot.availableHours}</span>
                {spot.features && spot.features.length > 0 && (
                  <>
                    <span>•</span>
                    <span><strong>제공시설:</strong> {spot.features.join(', ')}</span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="pt-1 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onDeleteSpot(spot.id)}
                  className="cursor-pointer px-3 py-1.5 hover:bg-red-50 text-red-650 rounded-xl font-bold border border-red-100 hover:border-red-200 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-550" />
                  공유 중단 및 삭제
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
