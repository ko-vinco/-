/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { ParkingSpot } from '../types';
import {
  MapPin,
  Clock,
  BatteryCharging,
  Eye,
  ShieldAlert,
  Phone,
  CheckCircle,
  Car,
  Star,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ParkingSpotCardProps {
  key?: string;
  spot: ParkingSpot;
  isSelected: boolean;
  onSelect: () => void;
  onBook: (spotId: string, carNumber: string, hours: number) => void;
}

export default function ParkingSpotCard({
  spot,
  isSelected,
  onSelect,
  onBook,
}: ParkingSpotCardProps) {
  const [carNumber, setCarNumber] = useState('');
  const [hours, setHours] = useState(2);
  const [isExpanding, setIsExpanding] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookError, setBookError] = useState('');

  const typeLabels: Record<string, { label: string; color: string }> = {
    villa: { label: '빌라 필로티', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    apartment: { label: '아파트 공유', color: 'bg-sky-50 text-sky-700 border-sky-100' },
    detached: { label: '단독주택', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    commercial: { label: '상가 주차장', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    land: { label: '나대지 정비', color: 'bg-slate-50 text-slate-700 border-slate-100' },
  };

  const featureMetadata: Record<string, { label: string; classNames: string }> = {
    CCTV: { label: '🛡️ CCTV 촬영', classNames: 'bg-slate-50 border-slate-200 text-slate-600' },
    EV_CHARGER: { label: '⚡ 충전시설', classNames: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    ENTRY_CONTROL: { label: '🚧 차단 게이트', classNames: 'bg-blue-50 border-blue-200 text-blue-700' },
    GUARD: { label: '👮 경비 상주', classNames: 'bg-purple-50 border-purple-200 text-purple-700' },
    LARGE_VEHICLE: { label: '🚙 대형 가능', classNames: 'bg-amber-50 border-amber-200 text-amber-800' },
  };

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(spot.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookError('');

    // Korean Car License Plate validation pattern
    const trimmedCarNum = carNumber.trim().replace(/\s+/g, '');
    if (!trimmedCarNum) {
      setBookError('차량 번호를 입력해주세요.');
      return;
    }

    if (trimmedCarNum.length < 5) {
      setBookError('올바른 차량 번호를 입력해주세요 (예: 12가3456 또는 123가4567).');
      return;
    }

    onBook(spot.id, trimmedCarNum, hours);
    setCarNumber('');
  };

  const isAvailable = spot.status === 'available';

  return (
    <motion.div
      id={`spot-card-${spot.id}`}
      whileHover={{ y: -2 }}
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50/10 shadow-md ring-1 ring-indigo-600/30'
          : 'border-slate-100 bg-white hover:border-slate-300/80 shadow-xs'
      }`}
    >
      <div className="p-5 cursor-pointer" onClick={onSelect}>
        {/* Card Header status and type */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${typeLabels[spot.type]?.color}`}>
              {typeLabels[spot.type]?.label}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {spot.neighborhood}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-slate-700">{spot.averageRating}</span>
            <span className="text-[10px] text-slate-400">({spot.totalRatingsCount})</span>
          </div>
        </div>

        {/* Spot Title */}
        <h4 className="text-base font-bold text-slate-800 line-clamp-1">{spot.title}</h4>

        {/* Spot Address block */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="line-clamp-1 flex-1">{spot.address}</span>
          <button
            onClick={handleCopyAddress}
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
            title="주소 복사"
          >
            <Copy className="w-3 h-3" />
          </button>
          {copied && (
            <span className="text-[10px] text-emerald-600 font-medium whitespace-nowrap bg-emerald-50 px-1 py-0.5 rounded animate-fade-in">
              복사 완료
            </span>
          )}
        </div>

        {/* Quick detail grids */}
        <div className="grid grid-cols-2 gap-4 mt-3.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
              ₩
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">시간당 요금</p>
              <p className="text-xs font-bold text-slate-800">{spot.pricePerHour.toLocaleString()}원</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">공유 및 운영</p>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{spot.availableHours}</p>
            </div>
          </div>
        </div>

        {/* Feature badges list */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {spot.features.map((feature) => {
            const meta = featureMetadata[feature];
            if (!meta) return null;
            return (
              <span
                key={feature}
                className={`inline-flex items-center gap-1 text-[11px] border px-2 py-0.5 rounded-lg ${meta.classNames}`}
              >
                {meta.label}
              </span>
            );
          })}
        </div>

        {/* Status indicator / prompt bar */}
        <div className="flex items-center justify-between mt-4/2 pt-3 border-t border-slate-100/60 mt-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className={`text-xs font-semibold ${isAvailable ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isAvailable ? '지금 주정차 가능' : '사용 완료 / 예약 마감'}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
              setIsExpanding(!isExpanding);
            }}
            type="button"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-0.5"
          >
            {isExpanding ? '상세 예약 접기' : '상세 예약/정보'}
            {isExpanding ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Actions Form for Booking */}
      <AnimatePresence>
        {(isExpanding || isSelected) && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-slate-50/40"
          >
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">HOST INFORMATION</span>
                <p className="text-xs text-slate-600 bg-white border border-slate-100 rounded-xl p-3 leading-relaxed">
                  {spot.description}
                </p>
              </div>

              {isAvailable ? (
                <form onSubmit={handleBookSubmit} className="space-y-3.5 bg-white border border-slate-200/60 p-4 rounded-xl shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1 justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Car className="w-4 h-4 text-indigo-600" />
                      실시간 비대면 대여 신규예약
                    </span>
                    <span className="text-[10px] text-slate-400">즉시 예약 가능</span>
                  </div>

                  {bookError && (
                    <p className="text-[11px] text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-500 shrink-0" />
                      {bookError}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Input Car Number */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-semibold text-slate-500">차량 번호 *</label>
                      <input
                        type="text"
                        placeholder="예: 12가 3456"
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-850 font-mono font-medium"
                        maxLength={11}
                      />
                    </div>

                    {/* Input Booking Hours */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-semibold text-slate-500">사용 대여 시간 *</label>
                      <select
                        value={hours}
                        onChange={(e) => setHours(parseInt(e.target.value))}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white font-medium"
                      >
                        <option value={1}>1시간</option>
                        <option value={2}>2시간 (기본)</option>
                        <option value={3}>3시간</option>
                        <option value={4}>4시간</option>
                        <option value={8}>8시간 (일반)</option>
                        <option value={12}>12시간 (반일)</option>
                        <option value={24}>24시간 (전일)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Price and summary details */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs bg-slate-50/50 -mx-4 -mb-4 p-4 rounded-b-xl border-t">
                    <div>
                      <span className="text-slate-400 text-[10px]">최종 결제 예정 금액</span>
                      <p className="text-base font-bold text-slate-800">
                        ₩{(spot.pricePerHour * hours).toLocaleString()}원
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      대여 확정하기
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-100/60 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-medium">현재 사용 중이거나 이미 예약된 매물로 예약이 불가능합니다.</p>
                  <p className="text-[10px] text-slate-400 mt-1">호스트 연결 창은 기존 예약 내역에서 제공됩니다.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
