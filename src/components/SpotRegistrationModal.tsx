/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { ParkingSpot } from '../types';
import { X, ShieldAlert, Check, Plus, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SpotRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newSpot: Omit<ParkingSpot, 'id' | 'createdAt' | 'status' | 'coordinates' | 'totalRatingsCount' | 'averageRating'>) => void;
}

const neighborhoodCoordinates: Record<string, { x: number; y: number }> = {
  오류동: { x: 95, y: 190 },
  불로동: { x: 260, y: 130 },
  마전동: { x: 210, y: 260 },
  원당동: { x: 350, y: 220 },
  당하동: { x: 130, y: 350 },
  아라동: { x: 340, y: 360 },
};

export default function SpotRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
}: SpotRegistrationModalProps) {
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('아라동');
  const [address, setAddress] = useState('');
  const [pricePerHour, setPricePerHour] = useState(1000);
  const [availableHours, setAvailableHours] = useState('24시간');
  const [type, setType] = useState<'villa' | 'apartment' | 'detached' | 'commercial' | 'land'>('villa');
  const [description, setDescription] = useState('');
  const [hostPhone, setHostPhone] = useState('010-');
  const [features, setFeatures] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const featureOptions = [
    { key: 'CCTV', label: 'CCTV 상시 모니터링' },
    { key: 'EV_CHARGER', label: '전기차 충전 가능' },
    { key: 'ENTRY_CONTROL', label: '차단기 게이트 제어' },
    { key: 'GUARD', label: '경비초소 지원' },
    { key: 'LARGE_VEHICLE', label: '대형 SUV 주차 허용' },
  ];

  const handleToggleFeature = (key: string) => {
    setFeatures((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('주차장 이름을 입력해주세요.');
      return;
    }
    if (!address.trim()) {
      setError('상세 주소를 입력해주세요.');
      return;
    }
    if (pricePerHour < 0) {
      setError('이용 금액은 0원 이상 입력해야 합니다.');
      return;
    }
    if (!hostPhone.trim() || hostPhone === '010-') {
      setError('예약 확인을 위한 연락처를 정확히 입력해주세요.');
      return;
    }

    onSubmit({
      title,
      neighborhood,
      address,
      pricePerHour,
      availableHours,
      type,
      features,
      description: description.trim() || '추가 세부 사항이 제공되지 않은 청결한 주차 구역입니다.',
      hostPhone,
    });

    // Reset controls
    setTitle('');
    setAddress('');
    setPricePerHour(1000);
    setAvailableHours('24시간');
    setType('villa');
    setFeatures([]);
    setDescription('');
    setHostPhone('010-');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-8 border border-slate-100"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800">새 빈 주차공간 등록</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              사용하지 않는 개인/상가 주차 구역을 이웃과 나누어보세요.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[80vh]">
          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">주차장 구역 명칭 *</label>
            <input
              type="text"
              placeholder="예: 당하동 완정빌라 필로티 남은 1칸"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-850 bg-slate-50/20"
              maxLength={36}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Neighborhood select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">법정동 선택 *</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium"
              >
                <option value="아라동">아라동 (검단신도시)</option>
                <option value="원당동">원당동 (검단사거리)</option>
                <option value="당하동">당하동 (완정역)</option>
                <option value="마전동">마전동 (마전지구)</option>
                <option value="불로동">불로동 (대곡지구)</option>
                <option value="오류동">오류동 (검단오류역)</option>
              </select>
            </div>

            {/* Parking type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">주차장 형태 *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium"
              >
                <option value="villa">빌라/다세대</option>
                <option value="apartment">아파트 단지</option>
                <option value="detached">단독주택 마당</option>
                <option value="commercial">상가 빌딩</option>
                <option value="land">나대지/야지</option>
              </select>
            </div>
          </div>

          {/* Detailed Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">상세 지번/도로명 주소 *</label>
            <input
              type="text"
              placeholder="예: 인천 서구 원당대로 654번길 12, 102동 후면"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-850 bg-slate-50/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Hourly Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">시간당 이용 요금 (원) *</label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="예: 1000"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-850 bg-slate-50/20 font-mono"
                required
              />
            </div>

            {/* Available Hours */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">공유 시간범위 *</label>
              <select
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none bg-white"
              >
                <option value="24시간">24시간 개방</option>
                <option value="평일 업무시간 (09:00 - 18:00)">평일 주중 (09:00 - 18:00)</option>
                <option value="주말 전용 (토/일)">주말 및 공휴일 전용</option>
                <option value="야간 개방 (18:00 - 익일 08:00)">심야 야간 (18:00 - 08:00)</option>
              </select>
            </div>
          </div>

          {/* Contact (Host Phone) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">호스트 연락처 (예약 안내용) *</label>
            <input
              type="text"
              placeholder="010-XXXX-XXXX"
              value={hostPhone}
              onChange={(e) => setHostPhone(e.target.value)}
              className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-850 bg-slate-50/20 font-mono"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">상세 이용 안내 (선택)</label>
            <textarea
              placeholder="예: 경차나 준중형 전용 공간입니다. 이중주차 불가하며, 진입로 CCTV 촬영 중이니 예약 후 주차해주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-850 bg-slate-50/20 h-18 resize-none"
              maxLength={200}
            />
          </div>

          {/* Feature Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">추가 제공 안전/지원 시설</label>
            <div className="grid grid-cols-2 gap-2">
              {featureOptions.map((opt) => {
                const checked = features.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleToggleFeature(opt.key)}
                    className={`cursor-pointer text-left text-xs px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-200 ${
                      checked
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium shadow-xs'
                        : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:border-slate-350'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {checked && <Check className="w-3 h-3 stroke-[3px]" />}
                    </div>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 text-center flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              여기에 등록하기
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
