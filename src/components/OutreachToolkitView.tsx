/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  OUTREACH_TEMPLATES,
  PHD_COURTSHIP_ROADMAP,
  DISCUSSION_TOPICS,
} from '../data/initialData';
import {
  MessageSquareText,
  Copy,
  Check,
  GraduationCap,
  Sparkles,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

export const OutreachToolkitView: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(OUTREACH_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  // Form fields for message customization
  const [recipientName, setRecipientName] = useState('سرکار خانم دکتر مهدی‌زاده');
  const [mutualTopic, setMutualTopic] = useState('سمینار الگوریتم‌های هوش مصنوعی دانشکده');
  const [referralName, setReferralName] = useState('دکتر رفیعی');
  const [positiveTrait, setPositiveTrait] = useState('نگرش علمی و متانت در گفتار');
  const [yourName, setYourName] = useState('امیرحسین (دانشجوی دکتری کامپیوتر)');

  const currentTemplate =
    OUTREACH_TEMPLATES.find((t) => t.id === selectedTemplateId) || OUTREACH_TEMPLATES[0];

  // Generate populated text
  const generatedMessage = currentTemplate.template
    .replaceAll('[نام مخاطب]', recipientName || '[نام مخاطب]')
    .replaceAll('[زمینه مشترک یا پروژه]', mutualTopic || '[زمینه مشترک]')
    .replaceAll('[نام معرف]', referralName || '[نام معرف]')
    .replaceAll('[ویژگی مثبت مورد توجه]', positiveTrait || '[ویژگی مثبت]')
    .replaceAll('[موضوع الهام‌بخش جلسه]', mutualTopic || '[موضوع گفتگو]')
    .replaceAll('[نکته مثبت رفتاری ایشان]', positiveTrait || '[نکته مثبت]')
    .replaceAll('[اسم خودتان]', yourName || '[نام شما]')
    .replaceAll('[دانشگاه/پژوهشگاه]', 'دانشگاه تبریز');

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-blue-800" />
          <span>جعبه‌ابزار پیام‌های ارتباطی و استراتژی دوره دکتری</span>
        </h2>
        <p className="text-xs text-slate-500">
          قالب‌های متین و آکادمیک برای شروع، پیگیری و جمع‌بندی محترمانه فرآیند آشنایی، به همراه نقشه راه ۲ ساله
        </p>
      </div>

      {/* Message Generator Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column (Template selectors and fields - 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">۱. انتخاب سناریوی ارتباط</h3>
          </div>

          {/* Template Buttons */}
          <div className="space-y-2">
            {OUTREACH_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`w-full text-right p-3 rounded-lg border text-xs transition-colors ${
                  selectedTemplateId === tmpl.id
                    ? 'border-blue-300 bg-blue-50/70 font-bold text-blue-950 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>{tmpl.title}</div>
                <div className="text-[11px] text-slate-500 font-normal mt-1 line-clamp-2">
                  {tmpl.description}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">۲. متغیرهای شخصی‌سازی:</h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">نام مخاطب:</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">زمینه آشنایی یا موضوع مشترک:</label>
                <input
                  type="text"
                  value={mutualTopic}
                  onChange={(e) => setMutualTopic(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">نام معرف (در صورت وجود):</label>
                <input
                  type="text"
                  value={referralName}
                  onChange={(e) => setReferralName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">نام یا امضای شما:</label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column (Live message preview & Copy button - 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">پیش‌نمایش متن نهایی</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'متن کپی شد!' : 'کپی در کلیپ‌بورد'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {generatedMessage}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-slate-600 space-y-1 mt-4">
            <span className="font-bold text-blue-900 block">نکته اخلاقی و رفتاری:</span>
            <p className="leading-relaxed">
              این متن‌ها طوری نگاشته شده‌اند که هیچ‌گونه بار روانی تحمیلی یا معذوریت ناخواسته ایجاد نکنند. پاسخ منفی طرف مقابل نشان‌دهنده نقص شما یا ایشان نیست، بلکه صرفاً عدم همسویی در شرایط است و به شما کمک می‌کند زمان محدود دوره دکتری را ذخیره کنید.
            </p>
          </div>
        </div>
      </div>

      {/* Strategic 2-Year PhD Courtship Roadmap */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-700" />
          <h3 className="text-base font-bold text-slate-900">
            نقشه راه ۲ ساله: از دکتری علوم کامپیوتر تا ازدواج در سن ۳۲ سالگی
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          چگونه در دو سال باقی‌مانده بدون افت راندمان پژوهشی، فرآیند ازدواج را به سرانجام برسانید:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {PHD_COURTSHIP_ROADMAP.map((step) => (
            <div
              key={step.step}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                {step.step}
              </div>
              <h4 className="font-bold text-xs text-slate-900">{step.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Topics & Questions for In-Depth Meetings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-800" />
          <h3 className="text-base font-bold text-slate-900">
            پرسش‌نامه کلیدی برای جلسات آشنایی حضوری
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          مجموعه سوالات ساختاریافته برای جلسه دوم به بعد، متمرکز بر سنجش کفویت واقعی و شرایط رساله:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DISCUSSION_TOPICS.map((topic, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <h4 className="font-bold text-xs text-blue-950 border-b border-slate-200 pb-2">
                {topic.category}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {topic.questions.map((q, qIdx) => (
                  <li key={qIdx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-blue-700 font-bold shrink-0">·</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
