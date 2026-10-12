/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PipelineStage =
  | 'discovery'      // شناسایی اولیه
  | 'screening'      // بررسی معیارها و فیلتر اولیه
  | 'pre_contact'    // تحقیق و شناخت غیرمستقیم
  | 'first_contact'  // ارتباط اولیه و پیام
  | 'in_dialogue'    // جلسات آشنایی و گفتگو
  | 'decision'       // تصمیم‌گیری و جمع‌بندی
  | 'archived';      // بایگانی شده

export interface SubFactorScores {
  // Domain 1: Values & Worldview (ارزش‌ها و جهان‌بینی)
  worldviewMatch: number;        // باورهای کلیدی، جهان‌بینی و اصول اخلاقی (1-10)
  integrity: number;             // صداقت، تعهد و مسئولیت‌پذیری (1-10)
  familyCulture: number;         // هماهنگی فرهنگی و اصالت خانوادگی (1-10)

  // Domain 2: Academic & Intellectual Synergy (هم‌راستایی فکری و تحصیلی)
  phdUnderstanding: number;      // درک شرایط پژوهش و دوره دکتری و مشغله‌های علمی (1-10)
  intellectualSynergy: number;   // ظرفیت هم‌صحبتی فکری و تفکر تحلیلی (1-10)
  careerAmbition: number;        // انگیزه شغلی متقابل و برنامه‌ریزی برای آینده (1-10)

  // Domain 3: Lifestyle & Dynamics (سبک زندگی و تعادل)
  workLifeBalance: number;       // تعادل کار، مطالعه و زندگی شخصی (1-10)
  interestsAlignment: number;    // اشتراکات در تفریحات، هنر، ورزش و مطالعه (1-10)
  relocationFlexibility: number; // هماهنگی در خصوص محل سکونت و برنامه‌های مهاجرت/ماندن (1-10)

  // Domain 4: Emotional & Relational Maturity (بلوغ عاطفی و مهارت‌های ارتباطی)
  emotionalMaturity: number;     // هوش هیجانی، خودآگاهی و پذیرش تفاوت‌ها (1-10)
  communicationStyle: number;    // شفافیت در گفتگو و ابراز مستقیم نیازها (1-10)
  conflictResolution: number;    // توانایی حل تعارض با آرامش و بدون سرزنش (1-10)
}

export interface InteractionLog {
  id: string;
  date: string;
  type: 'message' | 'call' | 'meeting' | 'note' | 'inquiry';
  summary: string;
  mood?: 'positive' | 'neutral' | 'caution';
}

export interface Candidate {
  id: string;
  fullName: string;
  age: number;
  education: string;          // مثلا: کارشناسی ارشد بیوانفورماتیک
  university?: string;        // مثلا: دانشگاه تهران
  occupation: string;         // مثلا: پژوهشگر مرکز تحقیقات ژنتیک
  city: string;               // مثلا: تهران
  referralSource: string;     // مثلا: همکار آزمایشگاه، دوست مشترک، سمینار هوش مصنوعی
  contactInfo?: string;       // آیدی تلگرام، ایمیل، شماره یا لینکدین
  pipelineStage: PipelineStage;
  subFactors: SubFactorScores;
  passedDealBreakers: boolean;
  dealBreakerFlags: string[]; // مواردی که با خطوط قرمز کاربر مغایرت دارند
  greenFlags: string[];       // نقاط قوت برجسته
  redFlags: string[];         // نکات مبهم یا نیازمند بررسی بیشتر
  overallScore: number;       // نمره کل محاسبه شده ۰ تا ۱۰۰
  domainScores: {
    values: number;           // میانگین درصد ارزش‌ها
    academic: number;         // میانگین درصد تحصیلی و فکری
    lifestyle: number;        // میانگین درصد سبک زندگی
    emotional: number;        // میانگین درصد بلوغ عاطفی
  };
  notes: string;
  interactions: InteractionLog[];
  createdAt: string;
  updatedAt: string;
}

export interface CriteriaWeights {
  valuesWeight: number;       // پیش‌فرض: 30
  academicWeight: number;     // پیش‌فرض: 25
  lifestyleWeight: number;    // پیش‌فرض: 20
  emotionalWeight: number;    // پیش‌فرض: 25
}

export interface DealBreakerRule {
  id: string;
  label: string;
  category: 'values' | 'phd' | 'location' | 'character';
  active: boolean;
}

export interface OutreachTemplate {
  id: string;
  title: string;
  category: 'direct' | 'referral' | 'post_meeting' | 'polite_decline';
  description: string;
  template: string;
  variables: string[];
}
