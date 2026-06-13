/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ParkingSpot } from '../types';
import { MapPin, Navigation, Info, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeomdanMiniMapProps {
  spots: ParkingSpot[];
  selectedSpotId: string | null;
  onSelectSpot: (spot: ParkingSpot | null) => void;
  selectedNeighborhood: string;
  onSelectNeighborhood: (neighborhood: string) => void;
}

interface NeighborhoodRegion {
  id: string;
  name: string;
  points: string;
  labelX: number;
  labelY: number;
  colorClass: string;
  hoverColorClass: string;
}

export default function GeomdanMiniMap({
  spots,
  selectedSpotId,
  onSelectSpot,
  selectedNeighborhood,
  onSelectNeighborhood,
}: GeomdanMiniMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Stylized map of Incheon Geomdan (West Incheon, Korea)
  const regions: NeighborhoodRegion[] = [
    {
      id: '오류동',
      name: '오류동',
      points: '30,120 150,110 160,200 110,290 20,240',
      labelX: 80,
      labelY: 180,
      colorClass: 'fill-sky-50/70 stroke-sky-200/50',
      hoverColorClass: 'fill-sky-100/90 stroke-sky-300',
    },
    {
      id: '불로동',
      name: '불로동',
      points: '150,110 320,60 360,150 250,210 160,200',
      labelX: 230,
      labelY: 140,
      colorClass: 'fill-teal-50/70 stroke-teal-200/50',
      hoverColorClass: 'fill-teal-100/90 stroke-teal-300',
    },
    {
      id: '마전동',
      name: '마전동',
      points: '160,200 250,210 270,290 190,320 150,260',
      labelX: 205,
      labelY: 250,
      colorClass: 'fill-amber-50/70 stroke-amber-200/50',
      hoverColorClass: 'fill-amber-100/90 stroke-amber-300',
    },
    {
      id: '원당동',
      name: '원당동',
      points: '250,210 360,150 460,210 390,310 270,290',
      labelX: 340,
      labelY: 245,
      colorClass: 'fill-indigo-50/70 stroke-indigo-200/50',
      hoverColorClass: 'fill-indigo-100/90 stroke-indigo-300',
    },
    {
      id: '당하동',
      name: '당하동',
      points: '110,290 190,320 180,410 80,400 65,340',
      labelX: 130,
      labelY: 350,
      colorClass: 'fill-emerald-50/70 stroke-emerald-200/50',
      hoverColorClass: 'fill-emerald-100/90 stroke-emerald-300',
    },
    {
      id: '아라동',
      name: '아라동',
      points: '270,290 390,310 470,330 420,430 300,420 180,410',
      labelX: 330,
      labelY: 375,
      colorClass: 'fill-rose-50/70 stroke-rose-200/50',
      hoverColorClass: 'fill-rose-100/90 stroke-rose-300',
    },
  ];

  // Helper to get number of spots in a region
  const getSpotCount = (neighborhood: string) => {
    return spots.filter((spot) => spot.neighborhood === neighborhood && spot.status === 'available').length;
  };

  const selectedSpot = spots.find((s) => s.id === selectedSpotId);

  return (
    <div className="relative w-full h-full bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col overflow-hidden shadow-xs">
      {/* Map Header Controls */}
      <div className="flex justify-between items-center mb-3 z-10">
        <div>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-widest">MAP INTERACTIVE</span>
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
            <Navigation className="w-4 h-4 text-emerald-500 animate-pulse" />
            검단 신도시 위성 공간 지도
          </h3>
        </div>
        
        <div className="flex gap-1.5 text-xs">
          <button
            onClick={() => onSelectNeighborhood('all')}
            className={`cursor-pointer px-3 py-1 rounded-full border transition-all ${
              selectedNeighborhood === 'all'
                ? 'bg-slate-900 border-slate-900 text-white font-medium'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            전체 보기
          </button>
          <div className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded-full text-slate-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            공유 중 {spots.filter((s) => s.status === 'available').length}곳
          </div>
        </div>
      </div>

      {/* Stylized Vector Map Interface */}
      <div className="relative flex-1 w-full bg-white border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
        
        {/* SVG Container */}
        <svg
          viewBox="0 0 500 450"
          className="w-full h-full max-h-[420px] transition-transform duration-300 select-none"
        >
          {/* Render neighborhoods */}
          <g>
            {regions.map((region) => {
              const isSelected = selectedNeighborhood === region.id;
              const isHovered = hoveredRegion === region.id;
              const slotCount = getSpotCount(region.name);

              return (
                <g key={region.id} className="cursor-pointer">
                  {/* Outer shadow / active glow */}
                  <polygon
                    points={region.points}
                    className={`transition-all duration-300 ${
                      isSelected
                        ? 'fill-indigo-500/20 stroke-indigo-400 stroke-2'
                        : isHovered
                        ? region.hoverColorClass + ' stroke-1.5'
                        : region.colorClass + ' stroke-1'
                    }`}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => onSelectNeighborhood(region.name)}
                  />
                  {/* Text Label */}
                  <text
                    x={region.labelX}
                    y={region.labelY}
                    textAnchor="middle"
                    className={`font-sans font-medium text-[11px] pointer-events-none transition-colors duration-200 ${
                      isSelected
                        ? 'fill-indigo-800 font-bold text-[12px]'
                        : 'fill-slate-600'
                    }`}
                  >
                    {region.name}
                  </text>
                  {/* Mini Badge (spot count) */}
                  {slotCount > 0 && (
                    <g transform={`translate(${region.labelX + 22}, ${region.labelY - 14})`}>
                      <circle
                        r="8"
                        className={`transition-colors duration-200 ${
                          isSelected ? 'fill-indigo-600' : 'fill-slate-700'
                        }`}
                      />
                      <text
                        textAnchor="middle"
                        y="3"
                        className="fill-white font-mono text-[9px] font-bold"
                      >
                        {slotCount}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Render parking spot markers */}
          {spots.map((spot) => {
            const isSelected = selectedSpotId === spot.id;
            const isAvailable = spot.status === 'available';
            
            // If we filtered by neighborhood and this spot is not in it, dim or hide
            const isNeighborhoodFiltered = selectedNeighborhood !== 'all' && spot.neighborhood !== selectedNeighborhood;
            if (isNeighborhoodFiltered) return null;

            return (
              <g
                key={spot.id}
                transform={`translate(${spot.coordinates.x}, ${spot.coordinates.y})`}
                className="cursor-pointer"
                onClick={() => onSelectSpot(spot)}
              >
                {/* Available ping effect */}
                {isAvailable && (
                  <circle
                    r="12"
                    className={`fill-emerald-500/30 animate-ping opacity-75 origin-center`}
                  />
                )}
                
                {/* Main pin background */}
                <circle
                  r={isSelected ? 10 : 8}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? 'fill-indigo-600 stroke-white stroke-2 shadow-lg'
                      : isAvailable
                      ? 'fill-emerald-500 stroke-white stroke-1.5'
                      : 'fill-slate-400 stroke-white stroke-1.5'
                  }`}
                />

                {/* Star on center of pin if selected */}
                {isSelected && (
                  <circle
                    r="3"
                    className="fill-white"
                  />
                )}

                {/* Price Tag Tooltip Floating above Pin */}
                <g transform="translate(0, -18)">
                  <rect
                    x="-26"
                    y="-10"
                    width="52"
                    height="17"
                    rx="4"
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'fill-indigo-900'
                        : isAvailable
                        ? 'fill-slate-900'
                        : 'fill-slate-400'
                    }`}
                  />
                  <polygon
                    points="0,10 -3,7 3,7"
                    className={isSelected ? 'fill-indigo-900' : isAvailable ? 'fill-slate-900' : 'fill-slate-400'}
                  />
                  <text
                    textAnchor="middle"
                    y="2"
                    className="fill-white font-mono font-bold text-[9px]"
                  >
                    {spot.pricePerHour.toLocaleString()}원
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 border border-slate-100 rounded-xl flex gap-3 text-[10px] text-slate-500 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            <span>예약 가능</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white"></span>
            <span>사용 중</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white"></span>
            <span>선택됨</span>
          </div>
        </div>
      </div>

      {/* Spot Detail Peek Overlay Panel when Spot Selected */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-5 left-5 right-5 bg-white border border-slate-100/85 p-4 rounded-2xl flex flex-col gap-2.5 shadow-xl/100 z-10"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                    {selectedSpot.neighborhood}
                  </span>
                  <span className="text-[10px] text-slate-400">당하역 기준 5분</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mt-1 line-clamp-1">{selectedSpot.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{selectedSpot.address}</p>
              </div>
              <button
                onClick={() => onSelectSpot(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1.5 rounded-lg hover:bg-slate-50"
              >
                닫기
              </button>
            </div>

            <div className="h-[1px] bg-slate-100"></div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px]">시간당 금액</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5">
                  ₩{selectedSpot.pricePerHour.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px]">공유 시간</span>
                <span className="font-semibold text-slate-800 mt-0.5">{selectedSpot.availableHours}</span>
              </div>
              <div>
                <button
                  onClick={() => {
                    // We will dispatch event or execute click
                    const elem = document.getElementById(`spot-card-${selectedSpot.id}`);
                    if (elem) {
                      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="bg-slate-900 cursor-pointer text-white px-3.5 py-1.5 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" />
                  상세 보기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
