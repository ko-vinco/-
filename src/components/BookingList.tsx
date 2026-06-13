/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking } from '../types';
import { Calendar, Car, Clock, Phone, Navigation, XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface BookingListProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export default function BookingList({ bookings, onCancelBooking }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl">
        <div className="w-11 h-11 bg-white shadow-xs border border-slate-200/50 rounded-xl flex items-center justify-center text-slate-400 mb-2.5">
          <Car className="w-5 h-5 stroke-[1.5]" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">활성화된 예약 없음</h4>
        <p className="text-xs text-slate-400 max-w-[220px] mt-0.5 leading-relaxed">
          필요한 지역을 검색하거나 지도의 핀을 클릭해 검단동의 공유 주차를 시작해 보세요.
        </p>
      </div>
    );
  }

  // Helper mock to call host
  const handleCallHost = (phone: string) => {
    alert(`[비대면 호스트 안심번호 연결]\n\n📞 번호: ${phone}\n주차 위치 확보 및 입출차 관련 전화를 무상 지원합니다.`);
  };

  const handleOpenNavi = (address: string) => {
    alert(`[위치 길찾기 가이드 안내]\n\n📍 상세 주소: ${address}\n사용하시는 내비 앱(카카오/티맵/원내비)으로 주차장 위치를 전송 완료했습니다.`);
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const isActive = booking.status === 'active';
        return (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-2xl overflow-hidden shadow-xs bg-white ${
              isActive ? 'border-emerald-200 ring-1 ring-emerald-500/10' : 'border-slate-100'
            }`}
          >
            {/* Header section with statuses */}
            <div className={`px-4.5 py-3 flex items-center justify-between border-b ${
              isActive ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50/50 border-slate-100'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isActive ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="text-emerald-800">이용 중 (차량 진입 상태)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">예약 취소됨</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                번호: {booking.id}
              </span>
            </div>

            <div className="p-4.5 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{booking.spotTitle}</h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{booking.spotAddress}</p>
              </div>

              {/* Grid of info details */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-3 rounded-xl border border-slate-150/40 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">대여차량 번호</span>
                  <p className="font-semibold text-slate-800 font-mono mt-0.5 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-indigo-500" />
                    {booking.carNumber}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">예약 기간 및 이용일시</span>
                  <p className="font-semibold text-slate-800 font-mono mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {booking.startTime.split(' ')[1]}~ (총 ₩{booking.totalPrice.toLocaleString()})
                  </p>
                </div>
              </div>

              {/* Reservation Warning alert */}
              {isActive && (
                <div className="text-[10px] font-medium text-amber-700 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 shrink-0 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    주차가 끝난 뒤에는 반드시 출차 상태로 변경해주세요. 비매너 주정차 적발 시 서비스 이용이 영구 제한될 수 있습니다.
                  </span>
                </div>
              )}

              {/* Actions controller for the booking */}
              <div className="pt-1.5 flex gap-2">
                {isActive ? (
                  <>
                    <button
                      onClick={() => handleOpenNavi(booking.spotAddress)}
                      className="cursor-pointer flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5 text-slate-500" />
                      길안내 내비
                    </button>
                    <button
                      onClick={() => handleCallHost('010-4493-2032')}
                      className="cursor-pointer flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      호스트 연결
                    </button>
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="cursor-pointer flex-1 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      예약 취소
                    </button>
                  </>
                ) : (
                  <div className="text-xs text-slate-400">
                    취소 처리일시: {booking.startTime.split(' ')[0]}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
