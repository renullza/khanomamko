/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Candidate, PipelineStage } from '../types/matchmaking';
import {
  Search,
  Copy,
  Check,
  Trash2,
  Eye,
  FileSpreadsheet,
  Download,
  Settings,
  Lock,
  ExternalLink,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  X,
  MessageCircle,
} from 'lucide-react';

interface SubmissionsListViewProps {
  candidates: Candidate[];
  onUpdateStage: (id: string, stage: PipelineStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteCandidate: (id: string) => void;
  onOpenSettings: () => void;
  onSwitchToPublic: () => void;
  onLock: () => void;
}

export const SubmissionsListView: React.FC<SubmissionsListViewProps> = ({
  candidates,
  onUpdateStage,
  onUpdateNotes,
  onDeleteCandidate,
  onOpenSettings,
  onSwitchToPublic,
  onLock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  const filteredCandidates = candidates.filter((c) => {
    if (statusFilter !== 'all' && c.pipelineStage !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.fullName.toLowerCase().includes(q) ||
        c.education.toLowerCase().includes(q) ||
        (c.university && c.university.toLowerCase().includes(q)) ||
        c.city.toLowerCase().includes(q) ||
        c.occupation.toLowerCase().includes(q) ||
        c.contactInfo?.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCopyContact = (id: string, contactText?: string) => {
    if (!contactText) return;
    navigator.clipboard.writeText(contactText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (candidates.length === 0) return;
    const headers = [
      'نام و نام خانوادگی',
      'سن',
      'مقطع و رشته',
      'دانشگاه',
      'شغل',
      'شهر',
      'اطلاعات تماس',
      'وضعیت',
      'تاریخ ثبت',
      'پاسخ‌ها و توضیحات',
    ];

    const rows = candidates.map((c) => [
      `"${c.fullName.replaceAll('"', '""')}"`,
      c.age,
      `"${c.education.replaceAll('"', '""')}"`,
      `"${(c.university || '').replaceAll('"', '""')}"`,
      `"${c.occupation.replaceAll('"', '""')}"`,
      `"${c.city.replaceAll('"', '""')}"`,
      `"${(c.contactInfo || '').replaceAll('"', '""')}"`,
      `"${c.pipelineStage}"`,
      `"${c.createdAt}"`,
      `"${c.notes.replaceAll('"', '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khanomamko-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openCandidateDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setEditingNotes(candidate.notes);
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Navigation & Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                صندوق متقاضیان و فرم‌های تکمیل‌شده
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 tabular-nums">
                {candidates.length} مورد
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مشاهده اطلاعات، راه‌های ارتباطی و پاسخ‌های متقاضیان تکمیل‌کننده فرم
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              title="خروجی فایل اکسل (CSV)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>خروجی اکسل (CSV)</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="تنظیمات تلگرام و وب‌هوک"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>تنظیمات دریافت پیام</span>
            </button>

            <button
              onClick={onSwitchToPublic}
              title="مشاهده ظاهر فرم عمومی برای کاربران"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>مشاهده فرم عمومی</span>
            </button>

            <button
              onClick={onLock}
              title="قفل و خروج از پنل مدیریت"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس نام، دانشگاه، شغل، شهر یا آیدی تماس..."
              className="w-full pr-9 pl-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-1 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'همه' },
              { id: 'discovery', label: 'جدید' },
              { id: 'in_dialogue', label: 'در حال ارتباط' },
              { id: 'archived', label: 'بایگانی' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === f.id
                    ? 'bg-blue-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredCandidates.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-2xs space-y-3"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Profile Main Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    onClick={() => openCandidateDetails(c)}
                    className="font-bold text-base text-slate-900 hover:text-blue-900 cursor-pointer"
                  >
                    {c.fullName}
                  </span>
                  <span className="text-xs text-slate-500 tabular-nums">({c.age} ساله)</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{c.city}</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-400 tabular-nums flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>ثبت‌شده: {c.createdAt}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{c.education}</span>
                    {c.university && (
                      <span className="text-slate-500">({c.university})</span>
                    )}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.occupation}</span>
                  </span>
                </div>

                {/* Contact Info Pill with Copy Action */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500">راه ارتباطی:</span>
                  <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 text-[11px] dir-ltr select-all">
                    {c.contactInfo || 'ثبت نشده'}
                  </span>
                  {c.contactInfo && (
                    <button
                      onClick={() => handleCopyContact(c.id, c.contactInfo)}
                      className="text-blue-700 hover:text-blue-900 flex items-center gap-0.5 text-[11px] font-semibold"
                    >
                      {copiedId === c.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>کپی</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                {/* Status selector */}
                <div>
                  <select
                    value={c.pipelineStage}
                    onChange={(e) => onUpdateStage(c.id, e.target.value as PipelineStage)}
                    className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="discovery">جدید (بررسی‌نشده)</option>
                    <option value="screening">بررسی اولیه</option>
                    <option value="in_dialogue">در حال گفتگو</option>
                    <option value="decision">مرحله نهایی</option>
                    <option value="archived">بایگانی / رد شده</option>
                  </select>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => openCandidateDetails(c)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>مشاهده پاسخ‌ها</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => {
                    if (window.confirm(`آیا از حذف اطلاعات «${c.fullName}» اطمینان دارید؟`)) {
                      onDeleteCandidate(c.id);
                    }
                  }}
                  title="حذف این مورد"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs space-y-2">
            <p className="font-bold text-slate-700 text-sm">هیچ موردی یافت نشد</p>
            <p>
              هنوز فرم جدیدی با این فیلتر ثبت نشده است. می‌توانید با اشتراک‌گذاری آدرس سایت با افراد، منتظر پاسخ‌ها بمانید.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal / Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  پاسخ‌های کامل {selectedCandidate.fullName} ({selectedCandidate.age} ساله)
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedCandidate.education} · {selectedCandidate.city}
                </span>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
              {/* Contact Card */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-blue-900 block font-semibold">
                    راه ارتباطی جهت تماس و ارسال پیام:
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900 dir-ltr select-all">
                    {selectedCandidate.contactInfo || 'ثبت نشده'}
                  </span>
                </div>
                {selectedCandidate.contactInfo && (
                  <button
                    onClick={() => handleCopyContact(selectedCandidate.id, selectedCandidate.contactInfo)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white font-semibold rounded-lg text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی آیدی</span>
                  </button>
                )}
              </div>

              {/* Full Responses Content */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  متن پاسخ‌های متقاضی در فرم پرسشنامه:
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-800">
                  {selectedCandidate.notes || 'توضیحات تکمیلی ثبت نشده است.'}
                </div>
              </div>

              {/* Personal Notes by you */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block font-bold text-slate-800">
                  یادداشت شخصی شما روی این پرونده:
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="نکات خود پیرامون تماس، نتیجه مکالمه، یا دلایل تصمیم‌گیری..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNotes(selectedCandidate.id, editingNotes);
                    setSelectedCandidate({
                      ...selectedCandidate,
                      notes: editingNotes,
                    });
                    alert('یادداشت ذخیره شد.');
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  ذخیره یادداشت
                </button>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
