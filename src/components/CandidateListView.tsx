/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Candidate, PipelineStage } from '../types/matchmaking';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Plus,
  Eye,
  Trash2,
  MapPin,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

interface CandidateListViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateStage: (candidateId: string, newStage: PipelineStage) => void;
  onDeleteCandidate: (candidateId: string) => void;
  onOpenAddModal: () => void;
}

export const CandidateListView: React.FC<CandidateListViewProps> = ({
  candidates,
  onSelectCandidate,
  onUpdateStage,
  onDeleteCandidate,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [onlyPassedDealBreakers, setOnlyPassedDealBreakers] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'age' | 'academic'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            c.fullName.toLowerCase().includes(q) ||
            c.education.toLowerCase().includes(q) ||
            (c.university && c.university.toLowerCase().includes(q)) ||
            c.occupation.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.referralSource.toLowerCase().includes(q) ||
            c.notes.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Stage filter
        if (selectedStage !== 'all' && c.pipelineStage !== selectedStage) {
          return false;
        }

        // Deal-breaker filter
        if (onlyPassedDealBreakers && !c.passedDealBreakers) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'score') {
          diff = a.overallScore - b.overallScore;
        } else if (sortBy === 'name') {
          diff = a.fullName.localeCompare(b.fullName, 'fa');
        } else if (sortBy === 'age') {
          diff = a.age - b.age;
        } else if (sortBy === 'academic') {
          diff = a.domainScores.academic - b.domainScores.academic;
        }
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [candidates, searchQuery, selectedStage, onlyPassedDealBreakers, sortBy, sortOrder]);

  const stageOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'همه مراحل' },
    { value: 'discovery', label: 'شناسایی اولیه' },
    { value: 'screening', label: 'بررسی معیارها' },
    { value: 'pre_contact', label: 'تحقیق از معرف' },
    { value: 'first_contact', label: 'ارتباط و پیام' },
    { value: 'in_dialogue', label: 'جلسات آشنایی' },
    { value: 'decision', label: 'تصمیم‌گیری' },
    { value: 'archived', label: 'بایگانی‌شده' },
  ];

  const getScoreBadgeColor = (score: number, passed: boolean) => {
    if (!passed) return 'text-rose-700 bg-rose-50 border-rose-200';
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">بانک اطلاعاتی گزینه‌ها (Dossiers)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              فیلتر، امتیازدهی تحلیلی و مدیریت پرونده متقاضیان بر اساس معیارهای علمی و فردی
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت گزینه جدید</span>
          </button>
        </div>

        {/* Search & Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس نام، دانشگاه، شغل، شهر، یادداشت..."
              className="w-full pr-10 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
            />
          </div>

          {/* Stage Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            >
              {stageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            >
              <option value="score">مرتب‌سازی: امتیاز کل</option>
              <option value="academic">مرتب‌سازی: همسویی دکتری</option>
              <option value="name">مرتب‌سازی: نام</option>
              <option value="age">مرتب‌سازی: سن</option>
            </select>
          </div>

          {/* Sort order toggle & dealbreaker filter */}
          <div className="md:col-span-2 flex items-center justify-between gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              title={sortOrder === 'desc' ? 'نزولی' : 'صعودی'}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 text-xs flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'نزولی' : 'صعودی'}</span>
            </button>

            <button
              onClick={() => setOnlyPassedDealBreakers(!onlyPassedDealBreakers)}
              className={`px-2.5 py-2 text-xs rounded-lg border transition-colors whitespace-nowrap ${
                onlyPassedDealBreakers
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              فقط بدون خط قرمز
            </button>
          </div>
        </div>
      </div>

      {/* Candidates List / Grid */}
      <div className="space-y-3">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Profile summary info */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3
                    onClick={() => onSelectCandidate(candidate)}
                    className="text-base font-bold text-slate-900 hover:text-blue-900 cursor-pointer"
                  >
                    {candidate.fullName}
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {candidate.age} ساله
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{candidate.city}</span>
                  </span>

                  {candidate.passedDealBreakers ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>تطابق با خطوط قرمز</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      <span>مغایرت با خط قرمز ({candidate.dealBreakerFlags[0] || 'بررسی شود'})</span>
                    </span>
                  )}
                </div>

                {/* Subtitle with education, occupation, referral */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate.education}</span>
                    {candidate.university && (
                      <span className="text-slate-400">({candidate.university})</span>
                    )}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate.occupation}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-500">معرف: {candidate.referralSource}</span>
                </div>

                {/* Domain percentage strip */}
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">ارزش‌ها:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {candidate.domainScores.values}%
                    </span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">همسویی دکتری:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {candidate.domainScores.academic}%
                    </span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">سبک زندگی:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {candidate.domainScores.lifestyle}%
                    </span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">بلوغ عاطفی:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {candidate.domainScores.emotional}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action controls & Score */}
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                {/* Score badge */}
                <div className="text-center px-4 py-2 rounded-xl border border-slate-200 bg-slate-50">
                  <div
                    className={`text-2xl font-black tabular-nums ${
                      candidate.passedDealBreakers ? 'text-blue-950' : 'text-rose-700'
                    }`}
                  >
                    {candidate.overallScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">ضریب کفویت</div>
                </div>

                {/* Pipeline stage selector */}
                <div className="text-right">
                  <label className="block text-[11px] text-slate-500 mb-1">مرحله جاری:</label>
                  <select
                    value={candidate.pipelineStage}
                    onChange={(e) =>
                      onUpdateStage(candidate.id, e.target.value as PipelineStage)
                    }
                    className="px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  >
                    <option value="discovery">شناسایی اولیه</option>
                    <option value="screening">بررسی معیارها</option>
                    <option value="pre_contact">تحقیق از معرف</option>
                    <option value="first_contact">ارتباط اولیه</option>
                    <option value="in_dialogue">جلسات آشنایی</option>
                    <option value="decision">تصمیم نهایی</option>
                    <option value="archived">بایگانی شده</option>
                  </select>
                </div>

                {/* Actions: View / Delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectCandidate(candidate)}
                    className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="مشاهده پرونده کامل و ویرایش امتیازات"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `آیا از حذف پرونده «${candidate.fullName}» از پایگاه داده اطمینان دارید؟`
                        )
                      ) {
                        onDeleteCandidate(candidate.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="حذف گزینه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Filter className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">هیچ گزینه‌ای با این فیلتر یافت نشد</h3>
            <p className="text-xs text-slate-500">
              می‌توانید عبارت جستجو را تغییر دهید یا فیلترهای مرحله و خط قرمز را پاک کنید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
