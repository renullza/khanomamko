/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Candidate } from '../types/matchmaking';
import {
  Radar as RadarIcon,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

interface RadarComparisonViewProps {
  candidates: Candidate[];
}

export const RadarComparisonView: React.FC<RadarComparisonViewProps> = ({ candidates }) => {
  const activeCandidates = candidates.filter((c) => c.pipelineStage !== 'archived');

  // Select candidates to compare (default first 2 or 3)
  const [selectedIds, setSelectedIds] = useState<string[]>(
    activeCandidates.slice(0, 3).map((c) => c.id)
  );

  const selectedCandidates = activeCandidates.filter((c) =>
    selectedIds.includes(c.id)
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Dimensions for Radar chart (6 axes for detailed spider web)
  const axes = [
    {
      key: 'values',
      label: 'ارزش‌ها و اخلاق',
      getValue: (c: Candidate) => c.domainScores.values,
    },
    {
      key: 'phd',
      label: 'درک شرایط دکتری',
      getValue: (c: Candidate) => c.subFactors.phdUnderstanding * 10,
    },
    {
      key: 'intellect',
      label: 'همفکری تحلیلی',
      getValue: (c: Candidate) => c.subFactors.intellectualSynergy * 10,
    },
    {
      key: 'lifestyle',
      label: 'سبک زندگی و تعادل',
      getValue: (c: Candidate) => c.domainScores.lifestyle,
    },
    {
      key: 'flexibility',
      label: 'انعطاف مکانی/آینده',
      getValue: (c: Candidate) => c.subFactors.relocationFlexibility * 10,
    },
    {
      key: 'emotional',
      label: 'بلوغ عاطفی و حل تعارض',
      getValue: (c: Candidate) => c.domainScores.emotional,
    },
  ];

  // SVG Radar Chart Math
  const size = 380;
  const center = size / 2;
  const radius = center - 50;
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Colors for up to 4 selected candidates
  const candidateColors = [
    { stroke: '#1d4ed8', fill: 'rgba(29, 78, 216, 0.18)', label: 'آبی پررنگ' },
    { stroke: '#059669', fill: 'rgba(5, 150, 105, 0.18)', label: 'سبز زمردی' },
    { stroke: '#d97706', fill: 'rgba(217, 119, 6, 0.18)', label: 'کهربایی' },
    { stroke: '#7c3aed', fill: 'rgba(124, 58, 237, 0.18)', label: 'بنفش' },
  ];

  // Calculate polygon points for each candidate
  const getCoordinates = (value: number, axisIndex: number) => {
    const angle = axisIndex * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <RadarIcon className="w-5 h-5 text-blue-800" />
          <span>مقایسه چندوجهی راداری (Multi-Candidate Radar Analysis)</span>
        </h2>
        <p className="text-xs text-slate-500">
          نمودار تار عنکبوتی شش‌بعدی برای مقایسه همزمان گزینه‌های برتر و سنجش نقاط قوت و ضعف نسبی
        </p>

        {/* Candidate Selector Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-xs font-semibold text-slate-700 ml-2">انتخاب گزینه‌ها برای مقایسه:</span>
          {activeCandidates.map((candidate, idx) => {
            const isSelected = selectedIds.includes(candidate.id);
            const colorIndex = selectedIds.indexOf(candidate.id);
            const styleColor = isSelected ? candidateColors[colorIndex] : null;

            return (
              <button
                key={candidate.id}
                onClick={() => toggleSelect(candidate.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'border-blue-300 font-bold bg-blue-50/80 text-blue-950 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: styleColor?.stroke }}
                  />
                )}
                <span>{candidate.fullName}</span>
                <span className="tabular-nums text-slate-500">({candidate.overallScore}%)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Radar SVG + Side by Side Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar SVG Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800">نقشه فضایی شش‌بعدی</h3>
            <span className="text-[11px] text-slate-400">حداکثر ۱۰۰٪ در هر بعد</span>
          </div>

          <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full overflow-visible font-sans"
            >
              {/* Concentric rings */}
              {rings.map((ringFactor, rIdx) => {
                const ringPoints = axes.map((_, aIdx) => {
                  const angle = aIdx * angleStep - Math.PI / 2;
                  const x = center + radius * ringFactor * Math.cos(angle);
                  const y = center + radius * ringFactor * Math.sin(angle);
                  return `${x},${y}`;
                });

                return (
                  <polygon
                    key={rIdx}
                    points={ringPoints.join(' ')}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray={rIdx === rings.length - 1 ? 'none' : '2,2'}
                  />
                );
              })}

              {/* Axis lines and labels */}
              {axes.map((axis, aIdx) => {
                const angle = aIdx * angleStep - Math.PI / 2;
                const endX = center + radius * Math.cos(angle);
                const endY = center + radius * Math.sin(angle);

                // Label offset
                const labelX = center + (radius + 24) * Math.cos(angle);
                const labelY = center + (radius + 20) * Math.sin(angle);

                return (
                  <g key={axis.key}>
                    <line
                      x1={center}
                      y1={center}
                      x2={endX}
                      y2={endY}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-semibold fill-slate-700"
                    >
                      {axis.label}
                    </text>
                  </g>
                );
              })}

              {/* Candidate Polygons */}
              {selectedCandidates.map((candidate, cIdx) => {
                const color = candidateColors[cIdx % candidateColors.length];
                const points = axes.map((axis, aIdx) => {
                  const val = axis.getValue(candidate);
                  const coords = getCoordinates(val, aIdx);
                  return `${coords.x},${coords.y}`;
                });

                return (
                  <g key={candidate.id}>
                    <polygon
                      points={points.join(' ')}
                      fill={color.fill}
                      stroke={color.stroke}
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    {axes.map((axis, aIdx) => {
                      const val = axis.getValue(candidate);
                      const coords = getCoordinates(val, aIdx);
                      return (
                        <circle
                          key={aIdx}
                          cx={coords.x}
                          cy={coords.y}
                          r="3.5"
                          fill={color.stroke}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 w-full text-xs">
            {selectedCandidates.map((c, idx) => (
              <div key={c.id} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: candidateColors[idx]?.stroke }}
                />
                <span className="font-semibold text-slate-800">{c.fullName}</span>
                <span className="text-slate-500 tabular-nums">({c.overallScore}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-4 overflow-x-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">جدول مقایسه تطبیقی مؤلفه‌ها</h3>
            <span className="text-xs text-slate-500">تحلیل عینی فاکتورهای کلیدی</span>
          </div>

          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 pr-2 font-medium">مؤلفه ارزیابی</th>
                {selectedCandidates.map((c, idx) => (
                  <th key={c.id} className="py-2.5 px-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: candidateColors[idx]?.stroke }}
                      />
                      <span>{c.fullName}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 pr-2 text-slate-500 font-medium">سن و شهر</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 text-slate-800 tabular-nums">
                    {c.age} سال · {c.city}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-500 font-medium">تحصیلات و دانشگاه</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 text-slate-800">
                    {c.education} {c.university ? `(${c.university})` : ''}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-500 font-medium">شغل و فعالیت</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 text-slate-800">
                    {c.occupation}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-50/60 font-semibold">
                <td className="py-2.5 pr-2 text-slate-800">نمره کل همسویی</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 text-blue-900 font-bold tabular-nums">
                    {c.overallScore}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-600">ارزش‌ها و جهان‌بینی</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 tabular-nums font-medium text-slate-800">
                    {c.domainScores.values}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-600">درک شرایط دکتری و پژوهش</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 tabular-nums font-medium text-slate-800">
                    {c.subFactors.phdUnderstanding * 10}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-600">هم‌صحبتی فکری و تحلیلی</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 tabular-nums font-medium text-slate-800">
                    {c.subFactors.intellectualSynergy * 10}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-600">سبک زندگی و تعادل کار</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 tabular-nums font-medium text-slate-800">
                    {c.domainScores.lifestyle}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-600">بلوغ عاطفی و حل تعارض</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 tabular-nums font-medium text-slate-800">
                    {c.domainScores.emotional}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 pr-2 text-slate-600">تطابق با خطوط قرمز</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-2.5 px-3">
                    {c.passedDealBreakers ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>کاملاً تایید</span>
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>دارای مغایرت</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Qualitative Advantage Note */}
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-slate-700 space-y-1.5">
            <div className="font-bold text-blue-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-800" />
              <span>نتیجه‌گیری تحلیلی الگوریتم:</span>
            </div>
            <p className="leading-relaxed">
              گزینه‌هایی که نمره بالای ۸۰٪ در درک شرایط دکتری و بلوغ عاطفی دارند، بالاترین ضریب پایداری را در دوران استرس دفاع و سال‌های ابتدایی زندگی مشترک به همراه خواهند داشت.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
