/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Candidate,
  CriteriaWeights,
  PipelineStage,
} from '../types/matchmaking';
import {
  Users,
  MessageCircle,
  Award,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  candidates: Candidate[];
  weights: CriteriaWeights;
  onSelectCandidate: (candidate: Candidate) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  candidates,
  weights,
  onSelectCandidate,
  onNavigate,
  onOpenAddModal,
}) => {
  const activeCandidates = candidates.filter(
    (c) => c.pipelineStage !== 'archived'
  );

  const inDialogueCount = candidates.filter(
    (c) => c.pipelineStage === 'in_dialogue' || c.pipelineStage === 'first_contact'
  ).length;

  const highestScoreCandidate = [...candidates].sort(
    (a, b) => b.overallScore - a.overallScore
  )[0];

  const highestScore = highestScoreCandidate?.overallScore || 0;

  // Pipeline distribution
  const stageCounts: Record<PipelineStage, number> = {
    discovery: candidates.filter((c) => c.pipelineStage === 'discovery').length,
    screening: candidates.filter((c) => c.pipelineStage === 'screening').length,
    pre_contact: candidates.filter((c) => c.pipelineStage === 'pre_contact').length,
    first_contact: candidates.filter((c) => c.pipelineStage === 'first_contact').length,
    in_dialogue: candidates.filter((c) => c.pipelineStage === 'in_dialogue').length,
    decision: candidates.filter((c) => c.pipelineStage === 'decision').length,
    archived: candidates.filter((c) => c.pipelineStage === 'archived').length,
  };

  const topCandidates = [...activeCandidates]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 4-Column KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">کل گزینه‌های ارزیابی‌شده</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {candidates.length}
            </span>
            <span className="text-xs text-slate-500">
              ({activeCandidates.length} فعال · {stageCounts.archived} بایگانی)
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">گفتگو و ارتباط فعال</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <MessageCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {inDialogueCount}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              در جریان آشنایی حضوری/تلفنی
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">بالاترین ضریب همسویی</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {highestScore}%
            </span>
            <span className="text-xs text-slate-500 truncate max-w-[120px]">
              {highestScoreCandidate ? highestScoreCandidate.fullName : '—'}
            </span>
          </div>
        </div>

        {/* KPI 4: Academic Horizon */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">افق فارغ‌التحصیلی دکتری</span>
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              ۲ سال
            </span>
            <span className="text-xs text-indigo-600 font-medium">
              تا دفاع و هدف ازدواج (سن ۳۱-۳۲)
            </span>
          </div>
        </div>
      </div>

      {/* Strategic Roadmap Banner for CS PhD Student */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-medium">
              <GraduationCap className="w-4 h-4" />
              <span>استراتژی دو ساله برای دانشجوی دکتری علوم کامپیوتر (سن ۳۰ به زودی ۳۱)</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
              رویکرد تحلیلی به انتخاب شریک زندگی؛ از غربالگری تا همراهی پایدار
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              شما در نقطه طلایی قرار دارید: زمان کافی برای آشنایی عمیق و غیرعجولانه پیش از دفاع، همراه با لزوم هدف‌گذاری مشخص. رویکرد داده‌محور به شما کمک می‌کند بدون سردرگمی ذهنی و اتلاف انرژی پژوهشی، با اطمینان کامل به سمت تشکیل خانواده حرکت کنید.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('toolkit')}
              className="px-4 py-2 text-xs font-medium bg-white text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            >
              مشاهده نقشه راه ۲ ساله
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              افزودن گزینه جدید
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Matches & Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Top Matches Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">برترین گزینه‌های همسو (سازگاری بالا)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                رتبه‌بندی شده بر اساس ماتریس ۴ گانه اوزان فعلی شما
              </p>
            </div>
            <button
              onClick={() => onNavigate('candidates')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topCandidates.map((c, idx) => (
              <div
                key={c.id}
                onClick={() => onSelectCandidate(c)}
                className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/70 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-800 group-hover:text-blue-900 font-bold flex items-center justify-center shrink-0 text-sm transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{c.fullName}</span>
                      <span className="text-xs text-slate-500">({c.age} سال)</span>
                      {c.passedDealBreakers ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>تایید خطوط قرمز</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-700">
                          <AlertTriangle className="w-3 h-3" />
                          <span>عدم تطابق شرط کلیدی</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                      <span>{c.education}</span>
                      <span>·</span>
                      <span>{c.occupation}</span>
                      <span>·</span>
                      <span className="text-slate-500">{c.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left">
                    <div className="text-lg font-bold text-blue-900 tabular-nums">
                      {c.overallScore}%
                    </div>
                    <div className="text-[11px] text-slate-500">امتیاز کل</div>
                  </div>
                  <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                  <div className="text-xs text-slate-600">
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-medium">
                      {c.pipelineStage === 'in_dialogue' && 'جلسات آشنایی'}
                      {c.pipelineStage === 'pre_contact' && 'تحقیق اولیه'}
                      {c.pipelineStage === 'screening' && 'بررسی معیارها'}
                      {c.pipelineStage === 'discovery' && 'شناسایی اولیه'}
                      {c.pipelineStage === 'first_contact' && 'ارتباط اولیه'}
                      {c.pipelineStage === 'decision' && 'تصمیم نهایی'}
                      {c.pipelineStage === 'archived' && 'بایگانی'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {topCandidates.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                هنوز گزینه‌ای ثبت نشده است. با دکمه زیر پرونده جدید ایجاد کنید.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pipeline Stages Distribution & Weight Summary */}
        <div className="space-y-6">
          {/* Pipeline Funnel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">وضعیت در قیف آشنایی</h3>
              <button
                onClick={() => onNavigate('pipeline')}
                className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
              >
                بورد کامل (CRM)
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { stage: 'discovery', label: 'شناسایی اولیه', count: stageCounts.discovery },
                { stage: 'screening', label: 'بررسی معیارها', count: stageCounts.screening },
                { stage: 'pre_contact', label: 'تحقیق از معرف/شبکه', count: stageCounts.pre_contact },
                { stage: 'first_contact', label: 'ارتباط اولیه و پیام', count: stageCounts.first_contact },
                { stage: 'in_dialogue', label: 'جلسات آشنایی و گفتگو', count: stageCounts.in_dialogue },
                { stage: 'decision', label: 'تصمیم‌گیری نهایی', count: stageCounts.decision },
              ].map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-900 tabular-nums">{item.count} نفر</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-800 h-1.5 rounded-full"
                      style={{
                        width: `${candidates.length > 0 ? (item.count / candidates.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Weight Matrix Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">توزیع اوزان ارزیابی</h3>
              <button
                onClick={() => onNavigate('matrix')}
                className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>تنظیم اوزان</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>ارزش‌ها و جهان‌بینی</span>
                <span className="font-bold text-slate-900 tabular-nums">{weights.valuesWeight}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>هم‌راستایی تحصیلی و دکتری</span>
                <span className="font-bold text-slate-900 tabular-nums">{weights.academicWeight}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>سبک زندگی و انعطاف مکانی</span>
                <span className="font-bold text-slate-900 tabular-nums">{weights.lifestyleWeight}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>بلوغ عاطفی و حل تعارض</span>
                <span className="font-bold text-slate-900 tabular-nums">{weights.emotionalWeight}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
