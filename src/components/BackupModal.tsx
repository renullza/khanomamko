/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Candidate, CriteriaWeights, DealBreakerRule } from '../types/matchmaking';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface BackupModalProps {
  candidates: Candidate[];
  weights: CriteriaWeights;
  dealBreakers: DealBreakerRule[];
  webhookUrl: string;
  onUpdateWebhookUrl: (url: string) => void;
  telegramConfig: { botToken: string; chatId: string };
  onUpdateTelegramConfig: (config: { botToken: string; chatId: string }) => void;
  onImportData: (data: {
    candidates: Candidate[];
    weights: CriteriaWeights;
    dealBreakers: DealBreakerRule[];
  }) => void;
  onResetToDefaults: () => void;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  candidates,
  weights,
  dealBreakers,
  webhookUrl,
  onUpdateWebhookUrl,
  telegramConfig,
  onUpdateTelegramConfig,
  onImportData,
  onResetToDefaults,
  onClose,
}) => {
  const [importText, setImportText] = useState('');
  const [tempWebhook, setTempWebhook] = useState(webhookUrl);
  const [tempBotToken, setTempBotToken] = useState(telegramConfig.botToken);
  const [tempChatId, setTempChatId] = useState(telegramConfig.chatId);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  const handleExportJSON = () => {
    const dataToExport = {
      app: 'Kafv-Matchmaking-Decision-System',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      weights,
      dealBreakers,
      candidates,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kafv-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'فایل پشتیبان JSON با موفقیت دانلود شد.' });
  };

  const handleImportJSON = () => {
    try {
      if (!importText.trim()) {
        setStatusMessage({ text: 'لطفاً متن JSON را در کادر وارد کنید.', error: true });
        return;
      }
      const parsed = JSON.parse(importText);
      if (!parsed.candidates || !Array.isArray(parsed.candidates)) {
        throw new Error('فرمت فایل پشتیبان معتبر نیست.');
      }

      onImportData({
        candidates: parsed.candidates,
        weights: parsed.weights || weights,
        dealBreakers: parsed.dealBreakers || dealBreakers,
      });

      setStatusMessage({ text: 'داده‌ها با موفقیت بازیابی شدند!' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMessage({
        text: `خطا در بازیابی: ${err.message || 'ساختار JSON معتبر نیست'}`,
        error: true,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              پشتیبان‌گیری، حریم خصوصی و خروجی داده‌ها
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              مدیریت داده‌های محلی و امنیت اطلاعات شخصی
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-800">
          {/* Privacy Guarantee Banner */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">تضمین ۱۰۰٪ حریم خصوصی:</span>
              <p className="text-[11px] leading-relaxed text-emerald-900">
                تمام مشخصات، نام‌ها و یادداشت‌های شخصی صرفاً در حافظه محلی مرورگر شما (Local Storage) ذخیره می‌شوند و هیچ اطلاعاتی به سرورهای خارجی ارسال نخواهد شد.
              </p>
            </div>
          </div>

          {/* Webhook & Telegram Notification Settings */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
            <div>
              <span className="font-bold text-slate-900 block">
                دریافت اعلان زنده در تلگرام / وب‌هوک (ویژه فرم عمومی گیت‌هاب)
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                از آنجا که گیت‌هاب پیجز هاست استاتیک است، برای اینکه وقتی فردی فرم عمومی را پر کرد مستقیماً به تلگرام یا ایمیل شما پیام بیاید، می‌توانید اطلاعات زیر را تنظیم کنید:
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  توکن ربات تلگرام (Telegram Bot Token):
                </label>
                <input
                  type="text"
                  value={tempBotToken}
                  onChange={(e) => setTempBotToken(e.target.value)}
                  placeholder="مثال: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ (از BotFather@)"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-[11px] dir-ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  شناسه چت یا کاربر تلگرام (Telegram Chat ID):
                </label>
                <input
                  type="text"
                  value={tempChatId}
                  onChange={(e) => setTempChatId(e.target.value)}
                  placeholder="مثال: 987654321 (از userinfobot@)"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-[11px] dir-ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  یا آدرس وب‌هوک اختیاری (مانند Formspree یا Zapier):
                </label>
                <input
                  type="text"
                  value={tempWebhook}
                  onChange={(e) => setTempWebhook(e.target.value)}
                  placeholder="https://formspree.io/f/your_form_id"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-[11px] dir-ltr"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateTelegramConfig({
                    botToken: tempBotToken.trim(),
                    chatId: tempChatId.trim(),
                  });
                  onUpdateWebhookUrl(tempWebhook.trim());
                  setStatusMessage({ text: 'تنظیمات اعلان تلگرام با موفقیت ذخیره شد.' });
                }}
                className="w-full py-1.5 font-bold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors text-xs"
              >
                ذخیره تنظیمات اعلان
              </button>
            </div>
          </div>

          {/* Export button */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">دریافت فایل پشتیبان (JSON Export)</span>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود پشتیبان</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              شامل تمام {candidates.length} پرونده ثبت‌شده، اوزان ماتریس و خطوط قرمز.
            </p>
          </div>

          {/* Import section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <span className="font-bold text-slate-900 block">
              بازیابی از فایل پشتیبان (JSON Import)
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100"
            />
            <textarea
              rows={3}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="یا متن JSON را مستقیماً در این کادر قرار دهید..."
              className="w-full p-2 border border-slate-300 rounded bg-white text-[11px] font-mono"
            />
            <button
              onClick={handleImportJSON}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>اعمال و بازگردانی اطلاعات</span>
            </button>
          </div>

          {/* Reset to defaults */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-slate-500">بازنشانی به داده‌های اولیه آزمایشی:</span>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'آیا مطمئن هستید که می‌خواهید تمام داده‌ها به گزینه‌های اولیه نمونه بازگردند؟'
                  )
                ) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="text-rose-700 hover:text-rose-800 flex items-center gap-1 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی کل پایگاه داده</span>
            </button>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                statusMessage.error
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {statusMessage.error ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <Check className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
