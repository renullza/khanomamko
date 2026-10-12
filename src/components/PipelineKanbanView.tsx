/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Candidate, PipelineStage } from '../types/matchmaking';
import {
  ChevronLeft,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';

interface PipelineKanbanViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateStage: (candidateId: string, newStage: PipelineStage) => void;
  onOpenAddModal: () => void;
}

const STAGES_ORDER: { stage: PipelineStage; title: string; subtitle: string }[] = [
  {
    stage: 'discovery',
    title: 'شناسایی اولیه',
    subtitle: 'گزینه‌های بالقوه در شبکه آکادمیک/شخصی',
  },
  {
    stage: 'screening',
    title: 'بررسی معیارها',
    subtitle: 'انطباق با شروط و اولویت‌های دکتری',
  },
  {
    stage: 'pre_contact',
    title: 'تحقیق از معرف',
    subtitle: 'پرس‌وجوی محترمانه از دوستان و خانواده',
  },
  {
    stage: 'first_contact',
    title: 'ارتباط اولیه و پیام',
    subtitle: 'ارسال پیام متین و دریافت پاسخ اولیه',
  },
  {
    stage: 'in_dialogue',
    title: 'جلسات آشنایی',
    subtitle: 'گفتگوهای حضوری و بررسی جهان‌بینی',
  },
  {
    stage: 'decision',
    title: 'تصمیم نهایی',
    subtitle: 'توافق خانواده‌ها و هدف‌گذاری ازدواج',
  },
];

export const PipelineKanbanView: React.FC<PipelineKanbanViewProps> = ({
  candidates,
  onSelectCandidate,
  onUpdateStage,
  onOpenAddModal,
}) => {
  const getNextStage = (current: PipelineStage): PipelineStage | null => {
    const idx = STAGES_ORDER.findIndex((s) => s.stage === current);
    if (idx >= 0 && idx < STAGES_ORDER.length - 1) {
      return STAGES_ORDER[idx + 1].stage;
    }
    return null;
  };

  const getPrevStage = (current: PipelineStage): PipelineStage | null => {
    const idx = STAGES_ORDER.findIndex((s) => s.stage === current);
    if (idx > 0) {
      return STAGES_ORDER[idx - 1].stage;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            بورد مراحل آشنایی (Courtship CRM Pipeline)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ردیابی گام‌به‌گام وضعیت ارتباط، انتقال پرونده‌ها بین ستون‌ها و مدیریت اولویت‌ها
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن گزینه جدید</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {STAGES_ORDER.map(({ stage, title, subtitle }) => {
          const stageCandidates = candidates.filter((c) => c.pipelineStage === stage);

          return (
            <div
              key={stage}
              className="bg-slate-50/80 rounded-xl border border-slate-200 p-3 min-w-[220px] flex flex-col"
            >
              {/* Column header */}
              <div className="pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200 tabular-nums">
                    {stageCandidates.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>
              </div>

              {/* Cards in column */}
              <div className="space-y-2.5 flex-1 min-h-[140px]">
                {stageCandidates.map((candidate) => {
                  const next = getNextStage(candidate.pipelineStage);
                  const prev = getPrevStage(candidate.pipelineStage);

                  return (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs hover:border-blue-300 transition-all text-xs space-y-2"
                    >
                      <div
                        onClick={() => onSelectCandidate(candidate)}
                        className="cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 group-hover:text-blue-900">
                            {candidate.fullName}
                          </span>
                          <span className="font-bold text-blue-900 tabular-nums text-xs">
                            {candidate.overallScore}%
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {candidate.education} · {candidate.city}
                        </div>
                      </div>

                      {/* Small metadata */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>{candidate.age} ساله</span>
                        {candidate.passedDealBreakers ? (
                          <span className="text-emerald-700 flex items-center gap-0.5 font-medium">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>تایید</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 flex items-center gap-0.5 font-medium">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>خط قرمز</span>
                          </span>
                        )}
                      </div>

                      {/* Move back / forth buttons */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        {prev ? (
                          <button
                            onClick={() => onUpdateStage(candidate.id, prev)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                            title="بازگشت به مرحله قبل"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span />
                        )}

                        <button
                          onClick={() => onSelectCandidate(candidate)}
                          className="text-[10px] text-blue-700 hover:underline font-medium"
                        >
                          مشاهده پرونده
                        </button>

                        {next ? (
                          <button
                            onClick={() => onUpdateStage(candidate.id, next)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                            title="انتقال به مرحله بعد"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span />
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageCandidates.length === 0 && (
                  <div className="h-full flex items-center justify-center p-4 border border-dashed border-slate-200 rounded-lg text-slate-400 text-[11px] text-center">
                    بدون مورد در این مرحله
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
