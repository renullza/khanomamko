/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Candidate,
  CriteriaWeights,
  InteractionLog,
  PipelineStage,
  SubFactorScores,
} from '../types/matchmaking';
import { calculateCandidateScores } from '../utils/calculator';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Calendar,
  MessageCircle,
  Phone,
  FileText,
  UserCheck,
  MapPin,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: Candidate;
  weights: CriteriaWeights;
  onClose: () => void;
  onSave: (updatedCandidate: Candidate) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  weights,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Candidate>({ ...candidate });
  const [newGreenFlag, setNewGreenFlag] = useState('');
  const [newRedFlag, setNewRedFlag] = useState('');
  const [newInteractionSummary, setNewInteractionSummary] = useState('');
  const [newInteractionType, setNewInteractionType] = useState<InteractionLog['type']>('meeting');
  const [newInteractionDate, setNewInteractionDate] = useState('۱۴۰۵/۰۶/۱۵');

  // Recalculate score live when subfactors or dealbreakers change
  const handleSubFactorChange = (key: keyof SubFactorScores, value: number) => {
    const updatedSubFactors = {
      ...formData.subFactors,
      [key]: Math.max(1, Math.min(10, value)),
    };

    const recalculated = calculateCandidateScores(
      updatedSubFactors,
      weights,
      formData.passedDealBreakers
    );

    setFormData({
      ...formData,
      subFactors: updatedSubFactors,
      overallScore: recalculated.overallScore,
      domainScores: recalculated.domainScores,
    });
  };

  const handleToggleDealBreaker = (passed: boolean) => {
    const recalculated = calculateCandidateScores(
      formData.subFactors,
      weights,
      passed
    );

    setFormData({
      ...formData,
      passedDealBreakers: passed,
      overallScore: recalculated.overallScore,
      domainScores: recalculated.domainScores,
    });
  };

  const handleAddGreenFlag = () => {
    if (!newGreenFlag.trim()) return;
    setFormData({
      ...formData,
      greenFlags: [...formData.greenFlags, newGreenFlag.trim()],
    });
    setNewGreenFlag('');
  };

  const handleRemoveGreenFlag = (index: number) => {
    setFormData({
      ...formData,
      greenFlags: formData.greenFlags.filter((_, i) => i !== index),
    });
  };

  const handleAddRedFlag = () => {
    if (!newRedFlag.trim()) return;
    setFormData({
      ...formData,
      redFlags: [...formData.redFlags, newRedFlag.trim()],
    });
    setNewRedFlag('');
  };

  const handleRemoveRedFlag = (index: number) => {
    setFormData({
      ...formData,
      redFlags: formData.redFlags.filter((_, i) => i !== index),
    });
  };

  const handleAddInteraction = () => {
    if (!newInteractionSummary.trim()) return;
    const newLog: InteractionLog = {
      id: `int-${Date.now()}`,
      date: newInteractionDate.trim() || new Date().toISOString().split('T')[0],
      type: newInteractionType,
      summary: newInteractionSummary.trim(),
      mood: 'positive',
    };
    setFormData({
      ...formData,
      interactions: [newLog, ...formData.interactions],
    });
    setNewInteractionSummary('');
  };

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">{formData.fullName}</h2>
              <span className="text-xs text-slate-500 tabular-nums">{formData.age} ساله</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-600">{formData.city}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              پرونده تحلیلی کفویت، ارزیابی چندبعدی و ثبت تاریخچه گفتگوها
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xl font-bold text-blue-900 tabular-nums">
                {formData.overallScore}%
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">امتیاز کفویت</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* General Information Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">تحصیلات و دانشگاه:</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{formData.education}</span>
                {formData.university && <span>({formData.university})</span>}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">شغل و جایگاه فعلی:</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{formData.occupation}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">نحوه آشنایی و معرف:</span>
              <span className="font-semibold text-slate-900">{formData.referralSource}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-slate-500 block mb-1">اطلاعات تماس / دسترسی:</span>
              <span className="text-slate-700 font-mono text-[11px] dir-ltr inline-block">
                {formData.contactInfo || 'ثبت نشده'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">مرحله جاری در فرآیند:</span>
              <select
                value={formData.pipelineStage}
                onChange={(e) =>
                  setFormData({ ...formData, pipelineStage: e.target.value as PipelineStage })
                }
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-medium"
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
          </div>

          {/* Deal-breaker validation section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>بررسی خطوط قرمز و شروط غیرقابل مذاکره (Deal-breakers)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleDealBreaker(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    formData.passedDealBreakers
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  تایید تمام خطوط قرمز
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDealBreaker(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    !formData.passedDealBreakers
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  دارای مغایرت با شروط کلیدی
                </button>
              </div>
            </div>

            {!formData.passedDealBreakers && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>هشدار عدم تطابق شرط اساسی:</span>
                </div>
                <input
                  type="text"
                  value={formData.dealBreakerFlags.join('، ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dealBreakerFlags: [e.target.value],
                    })
                  }
                  placeholder="علت مغایرت (مثلاً: اصرار بر مهاجرت زودهنگام قبل از پایان دکتری)"
                  className="w-full px-2.5 py-1.5 border border-rose-300 rounded bg-white text-rose-900 text-xs"
                />
              </div>
            )}
          </div>

          {/* Sub-factor Scoring Sliders (4 Core Dimensions) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              امتیازدهی به زیرفاکتورها (۱ تا ۱۰)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dimension 1: Values & Worldview */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800">
                    ۱. ارزش‌ها و جهان‌بینی (وزن: {weights.valuesWeight}%)
                  </span>
                  <span className="text-xs font-bold text-blue-900 tabular-nums">
                    {formData.domainScores.values}%
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>جهان‌بینی و باورهای اخلاقی</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.worldviewMatch}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.worldviewMatch}
                      onChange={(e) =>
                        handleSubFactorChange('worldviewMatch', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>صداقت، تعهد و مسئولیت‌پذیری</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.integrity}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.integrity}
                      onChange={(e) =>
                        handleSubFactorChange('integrity', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>هماهنگی فرهنگی و اصالت خانوادگی</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.familyCulture}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.familyCulture}
                      onChange={(e) =>
                        handleSubFactorChange('familyCulture', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Dimension 2: Academic & Intellectual Synergy */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800">
                    ۲. هم‌راستایی تحصیلی و دکتری (وزن: {weights.academicWeight}%)
                  </span>
                  <span className="text-xs font-bold text-blue-900 tabular-nums">
                    {formData.domainScores.academic}%
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>درک شرایط پژوهش و دوره دکتری</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.phdUnderstanding}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.phdUnderstanding}
                      onChange={(e) =>
                        handleSubFactorChange('phdUnderstanding', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>ظرفیت هم‌صحبتی فکری و تحلیلی</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.intellectualSynergy}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.intellectualSynergy}
                      onChange={(e) =>
                        handleSubFactorChange('intellectualSynergy', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>انگیزه شغلی متقابل و برنامه‌ریزی آینده</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.careerAmbition}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.careerAmbition}
                      onChange={(e) =>
                        handleSubFactorChange('careerAmbition', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Dimension 3: Lifestyle */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800">
                    ۳. سبک زندگی و تعادل (وزن: {weights.lifestyleWeight}%)
                  </span>
                  <span className="text-xs font-bold text-blue-900 tabular-nums">
                    {formData.domainScores.lifestyle}%
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>تعادل کار، پژوهش و زندگی شخصی</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.workLifeBalance}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.workLifeBalance}
                      onChange={(e) =>
                        handleSubFactorChange('workLifeBalance', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>اشتراک در تفریحات، هنر و ورزش</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.interestsAlignment}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.interestsAlignment}
                      onChange={(e) =>
                        handleSubFactorChange('interestsAlignment', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>انعطاف در محل سکونت و مهاجرت/ماندن</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.relocationFlexibility}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.relocationFlexibility}
                      onChange={(e) =>
                        handleSubFactorChange('relocationFlexibility', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Dimension 4: Emotional & Relational Maturity */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800">
                    ۴. بلوغ عاطفی و حل تعارض (وزن: {weights.emotionalWeight}%)
                  </span>
                  <span className="text-xs font-bold text-blue-900 tabular-nums">
                    {formData.domainScores.emotional}%
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>هوش هیجانی و پذیرش تفاوت‌ها</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.emotionalMaturity}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.emotionalMaturity}
                      onChange={(e) =>
                        handleSubFactorChange('emotionalMaturity', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>شفافیت در گفتگو و ابراز مستقیم نیازها</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.communicationStyle}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.communicationStyle}
                      onChange={(e) =>
                        handleSubFactorChange('communicationStyle', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>توانایی حل تعارض با آرامش</span>
                      <span className="font-bold tabular-nums">
                        {formData.subFactors.conflictResolution}/۱۰
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.subFactors.conflictResolution}
                      onChange={(e) =>
                        handleSubFactorChange('conflictResolution', Number(e.target.value))
                      }
                      className="w-full accent-blue-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Green Flags & Red Flags Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Green Flags */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>نقاط قوت و نشانه‌های امیدبخش (Green Flags)</span>
              </h4>
              <div className="space-y-1.5">
                {formData.greenFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-white p-2 rounded border border-emerald-100"
                  >
                    <span className="text-emerald-950">{flag}</span>
                    <button
                      onClick={() => handleRemoveGreenFlag(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGreenFlag}
                  onChange={(e) => setNewGreenFlag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGreenFlag()}
                  placeholder="افزودن نقطه قوت جدید..."
                  className="flex-1 px-2.5 py-1 text-xs border border-emerald-300 rounded bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddGreenFlag}
                  className="px-2.5 py-1 text-xs font-medium bg-emerald-700 text-white rounded hover:bg-emerald-800"
                >
                  افزودن
                </button>
              </div>
            </div>

            {/* Red Flags / Caution Notes */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>نکات مبهم یا نقاط تأمل (Red Flags)</span>
              </h4>
              <div className="space-y-1.5">
                {formData.redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-white p-2 rounded border border-amber-100"
                  >
                    <span className="text-amber-950">{flag}</span>
                    <button
                      onClick={() => handleRemoveRedFlag(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRedFlag}
                  onChange={(e) => setNewRedFlag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRedFlag()}
                  placeholder="افزودن مورد قابل تأمل..."
                  className="flex-1 px-2.5 py-1 text-xs border border-amber-300 rounded bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddRedFlag}
                  className="px-2.5 py-1 text-xs font-medium bg-amber-700 text-white rounded hover:bg-amber-800"
                >
                  افزودن
                </button>
              </div>
            </div>
          </div>

          {/* Qualitative Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">یادداشت‌های تحلیلی و جمع‌بندی ذهنی:</h4>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="ارزیابی کلی شما از جلسات، لحن صحبت، احساس درونی و میزان هماهنگی فکری..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>

          {/* Timeline of interactions */}
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold text-slate-900">تاریخچه تماس‌ها و جلسات آشنایی</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newInteractionType}
                onChange={(e) => setNewInteractionType(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="meeting">جلسه حضوری</option>
                <option value="call">تماس تلفنی</option>
                <option value="message">پیام متنی</option>
                <option value="inquiry">تحقیق از معرف</option>
                <option value="note">یادداشت شخصی</option>
              </select>
              <input
                type="text"
                value={newInteractionDate}
                onChange={(e) => setNewInteractionDate(e.target.value)}
                placeholder="تاریخ (مثلاً ۱۴۰۵/۰۶/۱۵)"
                className="w-28 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={newInteractionSummary}
                onChange={(e) => setNewInteractionSummary(e.target.value)}
                placeholder="خلاصه آنچه مطرح شد یا حس کلی جلسه..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <button
                type="button"
                onClick={handleAddInteraction}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap"
              >
                ثبت جلسه
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {formData.interactions.map((int) => (
                <div
                  key={int.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="p-1.5 rounded bg-white text-slate-600 border border-slate-200 shrink-0">
                    {int.type === 'meeting' && <UserCheck className="w-3.5 h-3.5" />}
                    {int.type === 'call' && <Phone className="w-3.5 h-3.5" />}
                    {int.type === 'message' && <MessageCircle className="w-3.5 h-3.5" />}
                    {int.type === 'inquiry' && <Calendar className="w-3.5 h-3.5" />}
                    {int.type === 'note' && <FileText className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {int.type === 'meeting' && 'جلسه حضوری'}
                        {int.type === 'call' && 'تماس تلفنی'}
                        {int.type === 'message' && 'ارتباط متنی'}
                        {int.type === 'inquiry' && 'تحقیق از معرف'}
                        {int.type === 'note' && 'یادداشت'}
                      </span>
                      <span className="text-[11px] text-slate-500 tabular-nums">· {int.date}</span>
                    </div>
                    <p className="text-slate-700 mt-1">{int.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات پرونده</span>
          </button>
        </div>
      </div>
    </div>
  );
};
