/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
  correctPin: string;
  onUpdatePin: (newPin: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onSuccess,
  onClose,
  correctPin,
  onUpdatePin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPin.trim()) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      onUpdatePin(newPin.trim());
      setIsChangingPin(false);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">
              {isChangingPin ? 'تغییر رمز عبور مدیریت' : 'ورود به پنل اختصاصی مدیریت'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isChangingPin ? (
          <form onSubmit={handleLogin} className="p-5 space-y-4 text-xs">
            <p className="text-slate-500 leading-relaxed">
              برای مشاهده پرونده‌های دریافتی، امتیازات کفویت و جعبه‌ابزار پیام‌ها، پین اختصاصی خود را وارد نمایید:
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">رمز عبور (PIN):</label>
              <input
                type="password"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="رمز عبور پیش‌فرض: 1374"
                className="w-full px-3 py-2 text-center text-sm tracking-widest font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                (پین پیش‌فرض جهت تست اولیه: <span className="font-mono font-bold text-slate-700">1374</span>)
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-rose-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>رمز عبور وارد شده نادرست است.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors text-xs"
            >
              ورود به داشبورد اختصاصی
            </button>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsChangingPin(true)}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 mx-auto"
              >
                <KeyRound className="w-3 h-3" />
                <span>تغییر پین ورود</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">پین جدید (حداقل ۴ رقم):</label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="رمز جدید..."
                className="w-full px-3 py-2 text-center text-sm tracking-widest font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsChangingPin(false)}
                className="w-1/2 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg text-xs"
              >
                ذخیره رمز جدید
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
