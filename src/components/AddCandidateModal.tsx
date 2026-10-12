/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Candidate, CriteriaWeights, PipelineStage } from '../types/matchmaking';
import { calculateCandidateScores } from '../utils/calculator';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';

interface AddCandidateModalProps {
  weights: CriteriaWeights;
  onClose: () => void;
  onAdd: (newCandidate: Candidate) => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  weights,
  onClose,
  onAdd,
}) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [education, setEducation] = useState('');
  const [university, setUniversity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('تهران');
  const [referralSource, setReferralSource] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('discovery');
  const [passedDealBreakers, setPassedDealBreakers] = useState(true);
  const [dealBreakerNotes, setDealBreakerNotes] = useState('');
  const [notes, setNotes] = useState('');

  // Default ratings (7 across all factors)
  const [ratings, setRatings] = useState({
    worldviewMatch: 8,
    integrity: 8,
    familyCulture: 8,
    phdUnderstanding: 8,
    intellectualSynergy: 8,
    careerAmbition: 8,
    workLifeBalance: 7,
    interestsAlignment: 7,
    relocationFlexibility: 8,
    emotionalMaturity: 8,
    communicationStyle: 8,
    conflictResolution: 8,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const scores = calculateCandidateScores(
      ratings,
      weights,
      passedDealBreakers
    );

    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      fullName: fullName.trim(),
      age: Number(age) || 28,
      education: education.trim() || 'کارشناسی ارشد',
      university: university.trim() || undefined,
      occupation: occupation.trim() || 'پژوهشگر / متخصص',
      city: city.trim() || 'تهران',
      referralSource: referralSource.trim() || 'شبکه دوستان و همکاران',
      contactInfo: contactInfo.trim() || undefined,
      pipelineStage,
      subFactors: ratings,
      passedDealBreakers,
      dealBreakerFlags: passedDealBreakers ? [] : [dealBreakerNotes.trim() || 'دارای مغایرت اولیه'],
      greenFlags: [],
      redFlags: [],
      overallScore: scores.overallScore,
      domainScores: scores.domainScores,
      notes: notes.trim(),
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'note',
          summary: 'پرونده گزینه با اطلاعات اولیه ایجاد شد.',
          mood: 'positive',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onAdd(newCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">ثبت گزینه جدید در پایگاه داده</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ورود اطلاعات اولیه هویتی، آکادمیک و امتیازات مقدماتی
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          {/* Identity & Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                نام و نام خانوادگی / عنوان گزینه: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: دکتر سمیرا ر. یا مهندس فاطمه م."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">سن:</label>
              <input
                type="number"
                min={20}
                max={45}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">مقطع و رشته تحصیلی:</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="مثال: دکتری بیوتکنولوژی / ارشد نرم‌افزار"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">دانشگاه محل تحصیل:</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="مثال: دانشگاه تبریز / تهران / شریف"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">شغل / سمت فعلی:</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="مثال: پژوهشگر پژوهشگاه / برنامه‌نویس ارشد"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">شهر محل سکونت:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: تهران / اصفهان"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">معرف / نحوه آشنایی:</label>
              <input
                type="text"
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                placeholder="مثال: همکار آزمایشگاه، دوست مشترک، خانواده"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">مرحله شروع در فرآیند:</label>
              <select
                value={pipelineStage}
                onChange={(e) => setPipelineStage(e.target.value as PipelineStage)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="discovery">شناسایی اولیه (Discovery)</option>
                <option value="screening">بررسی معیارها (Screening)</option>
                <option value="pre_contact">تحقیق از معرف (Pre-Contact)</option>
                <option value="first_contact">ارتباط اولیه و پیام (First Outreach)</option>
                <option value="in_dialogue">جلسات آشنایی (In Dialogue)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">اطلاعات تماس یا شناسه:</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="آیدی تلگرام، ایمیل، شماره یا لینک پروفایل آکادمیک/لینکدین"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>

          {/* Deal Breaker Toggle */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                وضعیت خطوط قرمز اساسی (اخلاق، همراهی با دکتری، محل زندگی):
              </span>
              <button
                type="button"
                onClick={() => setPassedDealBreakers(!passedDealBreakers)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  passedDealBreakers
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {passedDealBreakers ? 'بدون خط قرمز (تایید)' : 'دارای مغایرت اساسی'}
              </button>
            </div>
            {!passedDealBreakers && (
              <input
                type="text"
                value={dealBreakerNotes}
                onChange={(e) => setDealBreakerNotes(e.target.value)}
                placeholder="علت مغایرت با شروط غیرقابل مذاکره..."
                className="w-full px-3 py-1.5 border border-rose-300 rounded bg-white text-xs text-rose-900"
              />
            )}
          </div>

          {/* Initial Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">یادداشت‌های اولیه:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="نکات اولیه شنیده‌شده یا دلایل اولویت‌بندی این گزینه..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-xs"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 text-[11px] leading-relaxed">
            امتیازات تفکیکی ۱۲ گانه به طور پیش‌فرض بر روی مقادیر متوازن تنظیم می‌شوند و می‌توانید پس از ثبت، در صفحه پرونده هر گزینه آن‌ها را بر اساس مکالمات و ارزیابی دقیق‌تر ویرایش فرمایید.
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>ثبت پرونده</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
