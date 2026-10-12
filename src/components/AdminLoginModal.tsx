/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
  correctPin: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onSuccess,
  onClose,
  correctPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPin.trim()) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">
              ورود به پنل مدیریت فرم‌ها
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            این بخش صرفاً متعلق به صاحب فرم است. جهت مشاهده اطلاعات و پاسخ‌های ارسال‌شده، رمز عبور مدیریت را وارد کنید:
          </p>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">رمز عبور مدیریت:</label>
            <input
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="رمز عبور..."
              className="w-full px-3 py-2 text-center text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-rose-600 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>رمز عبور وارد شده نادرست است.</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="w-2/3 py-2 font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors text-xs"
            >
              ورود به صندوق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
