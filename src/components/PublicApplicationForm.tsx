/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Candidate, CriteriaWeights, SubFactorScores } from '../types/matchmaking';
import { calculateCandidateScores } from '../utils/calculator';
import {
  Heart,
  Send,
  CheckCircle2,
  Lock,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  User,
  MessageCircle,
} from 'lucide-react';

interface PublicApplicationFormProps {
  weights: CriteriaWeights;
  onSubmitApplication: (candidate: Candidate) => void;
  onOpenAdminLogin: () => void;
  webhookUrl?: string;
  telegramConfig?: { botToken: string; chatId: string };
}

export const PublicApplicationForm: React.FC<PublicApplicationFormProps> = ({
  weights,
  onSubmitApplication,
  onOpenAdminLogin,
  webhookUrl,
  telegramConfig,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(27);
  const [education, setEducation] = useState('');
  const [university, setUniversity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('تهران');
  const [contactInfo, setContactInfo] = useState('');

  // Perspectives & Values
  const [worldviewNotes, setWorldviewNotes] = useState('');
  const [phdUnderstandingNotes, setPhdUnderstandingNotes] = useState('');
  const [locationPreference, setLocationPreference] = useState('انعطاف دارم (بررسی گزینه‌های تهران، شهرستان یا خارج)');
  const [interestsAndHobbies, setInterestsAndHobbies] = useState('');
  const [conflictStyle, setConflictStyle] = useState('گفتگوی صریح، منطقی و با حفظ احترام متقابل');
  const [applicantQuestions, setApplicantQuestions] = useState('');

  // Self Ratings (1-10)
  const [selfRatings, setSelfRatings] = useState<SubFactorScores>({
    worldviewMatch: 8,
    integrity: 9,
    familyCulture: 8,
    phdUnderstanding: 8,
    intellectualSynergy: 8,
    careerAmbition: 8,
    workLifeBalance: 8,
    interestsAlignment: 8,
    relocationFlexibility: 8,
    emotionalMaturity: 9,
    communicationStyle: 9,
    conflictResolution: 8,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactInfo.trim()) return;

    setIsSubmitting(true);

    const scores = calculateCandidateScores(selfRatings, weights, true);

    const newCandidate: Candidate = {
      id: `app-${Date.now()}`,
      fullName: fullName.trim(),
      age: Number(age) || 27,
      education: education.trim() || 'کارشناسی ارشد',
      university: university.trim() || undefined,
      occupation: occupation.trim() || 'شاغل / پژوهشگر',
      city: city.trim() || 'تهران',
      referralSource: 'تکمیل فرم آنلاین عمومی (GitHub Page)',
      contactInfo: contactInfo.trim(),
      pipelineStage: 'discovery',
      subFactors: selfRatings,
      passedDealBreakers: true,
      dealBreakerFlags: [],
      greenFlags: ['ثبت مستقل اطلاعات در فرم عمومی'],
      redFlags: [],
      overallScore: scores.overallScore,
      domainScores: scores.domainScores,
      notes: `دیدگاه ارزشی: ${worldviewNotes}\nدرک شرایط دکتری: ${phdUnderstandingNotes}\nمحل سکونت: ${locationPreference}\nتفریحات: ${interestsAndHobbies}\nحل تعارض: ${conflictStyle}\nسوالات متقاضی: ${applicantQuestions}`,
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'message',
          summary: 'فرم پرسشنامه آنلاین توسط متقاضی تکمیل و ارسال شد.',
          mood: 'positive',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    // Forward to Webhook or Telegram if configured
    try {
      if (webhookUrl && webhookUrl.trim()) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCandidate),
        });
      }

      if (telegramConfig?.botToken && telegramConfig?.chatId) {
        const text = `💍 فرم درخواست آشنایی جدید ثبت شد!\n\n👤 نام: ${fullName} (${age} ساله)\n🎓 تحصیلات: ${education} (${university || 'نامشخص'})\n💼 شغل: ${occupation}\n📍 شهر: ${city}\n📞 تماس: ${contactInfo}\n🌟 امتیاز سازگاری اولیه: ${scores.overallScore}%\n\n📝 توضیحات:\n${worldviewNotes}`;
        await fetch(
          `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramConfig.chatId,
              text,
            }),
          }
        );
      }
    } catch (err) {
      console.warn('Webhook notification error (fallback to local save)', err);
    }

    // Save locally
    onSubmitApplication(newCandidate);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
              ک
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">کفو · پرسشنامه آشنایی</span>
              <span className="text-[11px] text-slate-500 block">ارزیابی سازگاری و کفویت فکری</span>
            </div>
          </div>

          <button
            onClick={onOpenAdminLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>ورود مدیر (پنل من)</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        {submitted ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm animate-fade-in">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              اطلاعات شما با موفقیت و احترام ثبت شد
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              از وقت، دقت و صداقتی که برای تکمیل این پرسشنامه اختصاص دادید صمیمانه سپاسگزارم. اطلاعات ارسالی شما کاملاً محرمانه نزد من محفوظ خواهد بود. در صورت ارزیابی همسویی در شرایط و اهداف دو طرف، از طریق راه ارتباطی درج‌شده با کمال احترام با شما در تماس خواهم بود.
            </p>
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-blue-700 hover:underline font-semibold"
              >
                ثبت مجدد یا ارسال توضیحات تکمیلی
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Introduction Card */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>معرفی و انگیزه ایجاد این صفحه</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black leading-tight">
                فرم آشنایی هدفمند، ارزیابی کفویت و بررسی ارزش‌های مشترک
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                سلام و احترام؛ من متولد ۱۳۷۴ (۳۰ ساله)، دانشجوی دکتری علوم کامپیوتر در دانشگاه تبریز هستم و حدود دو سال تا دفاع رساله و فارغ‌التحصیلی پیش‌رو دارم. هدف من از ایجاد این فرم، برداشتن گامی شفاف، آگاهانه و سنجیده برای تشکیل خانواده با همراهی فردی است که علاوه بر تعهد اخلاقی و اصالت فرهنگی، درک مشترکی از شرایط زندگی علمی و اهداف آینده داشته باشیم.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-blue-200/90 pt-2 border-t border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>تمامی پاسخ‌های شما محرمانه بوده و تنها توسط خود من بررسی خواهد شد.</span>
              </div>
            </div>

            {/* Section 1: Basic & Academic Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-4 h-4 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">۱. مشخصات فردی و تحصیلی</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    نام و نام خانوادگی (یا نام مستعار): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: سارا محمدی"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">سن:</label>
                  <input
                    type="number"
                    min={20}
                    max={42}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">مقطع و رشته تحصیلی:</label>
                  <input
                    type="text"
                    required
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="مثال: کارشناسی ارشد مهندسی صنایع / دکتری بیوتک"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">دانشگاه محل تحصیل:</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="مثال: دانشگاه تبریز / تهران / شریف..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">شغل / فعالیت جاری:</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="مثال: کارشناس ارشد تحلیل داده در شرکت خصوصی"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">شهر محل سکونت:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: تهران / اصفهان"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    راه ارتباطی ترجیحی و امن (تلگرام، ایمیل، لینکدین یا شماره تماس): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="مثال: تلگرام: @sara_username یا ایمیل: sara@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Values & Life Perspective */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Heart className="w-4 h-4 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">۲. ارزش‌ها و نگاه به زندگی مشترک</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    مهم‌ترین ارزش‌های اخلاقی و اولویت‌های شما در زندگی و تشکیل خانواده چیست؟
                  </label>
                  <textarea
                    rows={3}
                    value={worldviewNotes}
                    onChange={(e) => setWorldviewNotes(e.target.value)}
                    placeholder="توضیح دهید چه اصولی (مانند صداقت، تعهد، آرامش، استقلال فکری یا احترام خانوادگی) برایتان خط قرمز یا اولویت نخست هستند..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    نگاه شما به دوره ۲ ساله پیش‌رو تا فارغ‌التحصیلی دکتری (فشارهای علمی، پژوهش و صبوری اقتصادی):
                  </label>
                  <textarea
                    rows={2}
                    value={phdUnderstandingNotes}
                    onChange={(e) => setPhdUnderstandingNotes(e.target.value)}
                    placeholder="دیدگاه خود درباره شرایط زندگی در دوران دانشجویی دکتری و همراهی در این مرحله را بنویسید..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ترجیح و انعطاف مکانی برای سکونت بعد از فارغ‌التحصیلی:
                  </label>
                  <select
                    value={locationPreference}
                    onChange={(e) => setLocationPreference(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="انعطاف دارم (بررسی گزینه‌های تهران، شهرستان یا خارج)">
                      انعطاف دارم (بررسی گزینه‌های تهران، سایر شهرها یا خارج از کشور)
                    </option>
                    <option value="تاکید قطعی بر اقامت و کار در تهران">
                      تاکید قطعی بر اقامت و کار در تهران
                    </option>
                    <option value="علاقه‌مند به مهاجرت تحصیلی/کاری پس از دکتری">
                      علاقه‌مند به فرصت‌های مطالعاتی یا مهاجرت کاری پس از دکتری
                    </option>
                    <option value="ترجیح ماندن در شهر فعلی خودم">
                      ترجیح ماندن در شهر فعلی خودم
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    علاقه‌مندی‌ها، تفریحات و نحوه گذراندن اوقات فراغت:
                  </label>
                  <input
                    type="text"
                    value={interestsAndHobbies}
                    onChange={(e) => setInterestsAndHobbies(e.target.value)}
                    placeholder="مثال: مطالعه کتاب‌های روانشناسی و تاریخ، کوهنوردی، فیلم، موسیقی..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    شیوه مطلوب شما در مواجهه با تفاوت دیدگاه یا بروز سوءتفاهم:
                  </label>
                  <input
                    type="text"
                    value={conflictStyle}
                    onChange={(e) => setConflictStyle(e.target.value)}
                    placeholder="مثال: گفتگوی صریح و آرام، نیاز به فرصت تنفس کوتاه و سپس صحبت بدون سرزنش..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    پرسش‌ها یا انتظارات مشخصی که مایلید من به آن‌ها پاسخ دهم:
                  </label>
                  <textarea
                    rows={2}
                    value={applicantQuestions}
                    onChange={(e) => setApplicantQuestions(e.target.value)}
                    placeholder="هر پرسش، ابهام یا نکته‌ای که مد نظرتان است را آزادانه مطرح فرمایید..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'در حال ارسال اطلاعات...' : 'ارسال محرمانه فرم برای بررسی'}</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>کفو · بستر محرمانه ارزیابی کفویت و ازدواج آگاهانه</span>
          <button
            onClick={onOpenAdminLogin}
            className="text-slate-400 hover:text-slate-700 text-[11px] flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>ورود مدیر سامانه</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
