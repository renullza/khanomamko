/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Candidate, CriteriaWeights, DealBreakerRule } from '../types/matchmaking';
import {
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Info,
  TrendingUp,
} from 'lucide-react';

interface CriteriaMatrixViewProps {
  weights: CriteriaWeights;
  onUpdateWeights: (weights: CriteriaWeights) => void;
  dealBreakers: DealBreakerRule[];
  onToggleDealBreaker: (ruleId: string) => void;
  onAddDealBreaker: (newLabel: string) => void;
  candidates: Candidate[];
}

export const CriteriaMatrixView: React.FC<CriteriaMatrixViewProps> = ({
  weights,
  onUpdateWeights,
  dealBreakers,
  onToggleDealBreaker,
  onAddDealBreaker,
  candidates,
}) => {
  const [newRuleText, setNewRuleText] = useState('');

  // Total raw weights
  const totalRaw =
    weights.valuesWeight +
    weights.academicWeight +
    weights.lifestyleWeight +
    weights.emotionalWeight;

  const pctValues = Math.round((weights.valuesWeight / totalRaw) * 100);
  const pctAcademic = Math.round((weights.academicWeight / totalRaw) * 100);
  const pctLifestyle = Math.round((weights.lifestyleWeight / totalRaw) * 100);
  const pctEmotional = Math.round((weights.emotionalWeight / totalRaw) * 100);

  const applyPreset = (preset: {
    values: number;
    academic: number;
    lifestyle: number;
    emotional: number;
  }) => {
    onUpdateWeights({
      valuesWeight: preset.values,
      academicWeight: preset.academic,
      lifestyleWeight: preset.lifestyle,
      emotionalWeight: preset.emotional,
    });
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    onAddDealBreaker(newRuleText.trim());
    setNewRuleText('');
  };

  // Preview ranking sensitivity
  const sortedPreview = [...candidates].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              ماتریس وزن‌دهی و تصمیم‌گیری چندمعیاره (MCDA Studio)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تنظیم ضرایب اهمیت ۴ بعد اصلی بر اساس اولویت‌های مرحله فعلی زندگی شما و شروط قطعی (Deal-breakers)
            </p>
          </div>

          <button
            onClick={() =>
              onUpdateWeights({
                valuesWeight: 30,
                academicWeight: 25,
                lifestyleWeight: 20,
                emotionalWeight: 25,
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی به حالت پیش‌فرض</span>
          </button>
        </div>
      </div>

      {/* Preset Profiles */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <span>پروفایل‌های وزن‌دهی پیشنهادی (انتخاب سریع):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() =>
              applyPreset({ values: 30, academic: 25, lifestyle: 20, emotional: 25 })
            }
            className="p-3 bg-white hover:border-blue-300 hover:bg-blue-50/50 border border-slate-200 rounded-lg text-right transition-colors"
          >
            <div className="text-xs font-bold text-slate-900">حالت متوازن (توصیه‌شده)</div>
            <div className="text-[11px] text-slate-500 mt-1">
              ترکیب متعادل ارزش‌ها (۳۰٪)، دکتری (۲۵٪)، عاطفی (۲۵٪)، سبک زندگی (۲۰٪)
            </div>
          </button>

          <button
            onClick={() =>
              applyPreset({ values: 25, academic: 40, lifestyle: 15, emotional: 20 })
            }
            className="p-3 bg-white hover:border-blue-300 hover:bg-blue-50/50 border border-slate-200 rounded-lg text-right transition-colors"
          >
            <div className="text-xs font-bold text-slate-900">تمرکز بر همسویی دکتری</div>
            <div className="text-[11px] text-slate-500 mt-1">
              اولویت حداکثری بر فهم سختی‌های رساله، فضای آکادمیک و هم‌فکری علمی (۴۰٪)
            </div>
          </button>

          <button
            onClick={() =>
              applyPreset({ values: 45, academic: 15, lifestyle: 15, emotional: 25 })
            }
            className="p-3 bg-white hover:border-blue-300 hover:bg-blue-50/50 border border-slate-200 rounded-lg text-right transition-colors"
          >
            <div className="text-xs font-bold text-slate-900">اصالت بنیادین و ارزش‌ها</div>
            <div className="text-[11px] text-slate-500 mt-1">
              وزن اول بر جهان‌بینی، اخلاق و اصالت فرهنگی خانواده (۴۵٪)
            </div>
          </button>

          <button
            onClick={() =>
              applyPreset({ values: 25, academic: 20, lifestyle: 20, emotional: 35 })
            }
            className="p-3 bg-white hover:border-blue-300 hover:bg-blue-50/50 border border-slate-200 rounded-lg text-right transition-colors"
          >
            <div className="text-xs font-bold text-slate-900">هوش هیجانی و آرامش روانی</div>
            <div className="text-[11px] text-slate-500 mt-1">
              تمرکز ویژه بر حل تعارض بدون تنش، شفافیت و بلوغ عاطفی (۳۵٪)
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Box (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">تنظیم دستی ضرایب ابعاد ۴ گانه</h3>
            <span className="text-xs text-slate-500">نرمال‌سازی در فرمول خودکار است</span>
          </div>

          {/* Slider 1: Values */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                ۱. ارزش‌ها و جهان‌بینی (عقاید، اخلاق، خانواده)
              </span>
              <span className="font-bold text-blue-900 tabular-nums">{pctValues}٪</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={weights.valuesWeight}
              onChange={(e) =>
                onUpdateWeights({
                  ...weights,
                  valuesWeight: Number(e.target.value),
                })
              }
              className="w-full accent-blue-900"
            />
            <p className="text-[11px] text-slate-500">
              ارزیابی همسویی باورهای بنیادی، صداقت و هماهنگی فرهنگی خانواده طرفین
            </p>
          </div>

          {/* Slider 2: Academic & PhD Synergy */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                ۲. هم‌راستایی تحصیلی و شرایط دکتری
              </span>
              <span className="font-bold text-blue-900 tabular-nums">{pctAcademic}٪</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={weights.academicWeight}
              onChange={(e) =>
                onUpdateWeights({
                  ...weights,
                  academicWeight: Number(e.target.value),
                })
              }
              className="w-full accent-blue-900"
            />
            <p className="text-[11px] text-slate-500">
              سنجش درک فشار ۲ سال پایانی دکتری، نگارش رساله، مقالات و انگیزه شغلی متقابل
            </p>
          </div>

          {/* Slider 3: Lifestyle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                ۳. سبک زندگی و انعطاف مکانی
              </span>
              <span className="font-bold text-blue-900 tabular-nums">{pctLifestyle}٪</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={weights.lifestyleWeight}
              onChange={(e) =>
                onUpdateWeights({
                  ...weights,
                  lifestyleWeight: Number(e.target.value),
                })
              }
              className="w-full accent-blue-900"
            />
            <p className="text-[11px] text-slate-500">
              تعادل کار-زندگی، علایق روزمره و توافق بر سر شهر یا کشور محل سکونت بعد از دفاع
            </p>
          </div>

          {/* Slider 4: Emotional Maturity */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                ۴. بلوغ عاطفی و مهارت‌های حل تعارض
              </span>
              <span className="font-bold text-blue-900 tabular-nums">{pctEmotional}٪</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={weights.emotionalWeight}
              onChange={(e) =>
                onUpdateWeights({
                  ...weights,
                  emotionalWeight: Number(e.target.value),
                })
              }
              className="w-full accent-blue-900"
            />
            <p className="text-[11px] text-slate-500">
              توانایی ارتباط کلامی صریح، کنترل هیجانات، و حل تعارض بدون مقصرانگاری
            </p>
          </div>
        </div>

        {/* Live Ranking Sensitivity Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-700" />
              <span>تحلیل حساسیت رتبه‌بندی (Sensitivity Preview)</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            تغییر اوزان فوراً امتیاز همسویی گزینه‌ها را در کل سامانه بازنگری می‌کند:
          </p>

          <div className="space-y-2.5">
            {sortedPreview.map((candidate, idx) => (
              <div
                key={candidate.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-white text-slate-700 font-bold flex items-center justify-center text-[11px] border border-slate-200">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{candidate.fullName}</span>
                    <span className="text-[11px] text-slate-500 mr-2">
                      ({candidate.education})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold tabular-nums ${
                      candidate.passedDealBreakers ? 'text-blue-900' : 'text-rose-700'
                    }`}
                  >
                    {candidate.overallScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-blue-900 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>فرمول ریاضی شفاف:</span>
            </div>
            <p className="leading-relaxed">
              MatchScore = ∑ (Weight_i × Score_i) — به عنوان دانشجوی کامپیوتر، این شفافیت قطعی از تعصبات شناختی و تصمیم‌گیری‌های شتاب‌زده جلوگیری می‌کند.
            </p>
          </div>
        </div>
      </div>

      {/* Non-Negotiables & Deal-Breaker Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>فهرست خطوط قرمز و شروط غیرقابل مذاکره (Deal-Breaker Rules)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              گزینه‌هایی که این شروط را نداشته باشند، بلافاصله علامت‌گذاری شده و امتیاز نهایی آن‌ها محدود می‌شود.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {dealBreakers.map((rule) => (
            <div
              key={rule.id}
              onClick={() => onToggleDealBreaker(rule.id)}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 cursor-pointer transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={rule.active}
                  onChange={() => {}} // handled by div
                  className="rounded text-blue-900 focus:ring-blue-600"
                />
                <span className={rule.active ? 'text-slate-900 font-medium' : 'text-slate-400 line-through'}>
                  {rule.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {rule.active ? 'فعال در غربالگری' : 'غیرفعال'}
              </span>
            </div>
          ))}
        </div>

        {/* Add custom dealbreaker */}
        <form onSubmit={handleAddRule} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newRuleText}
            onChange={(e) => setNewRuleText(e.target.value)}
            placeholder="افزودن شرط غیرقابل مذاکره جدید (مثلاً: عدم تعصبات افراطی یا اعتیاد به دخانیات)..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
          >
            افزودن خط قرمز
          </button>
        </form>
      </div>
    </div>
  );
};
