/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  SlidersHorizontal,
  Radar,
  GitBranch,
  MessageSquareText,
  UserPlus,
  DatabaseBackup,
  Eye,
  Lock,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'candidates' | 'matrix' | 'radar' | 'pipeline' | 'toolkit';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  candidateCount: number;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onSwitchToPublicView: () => void;
  onLockAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  candidateCount,
  onOpenAddModal,
  onOpenBackupModal,
  onSwitchToPublicView,
  onLockAdmin,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'داشبورد تحلیلی',
      icon: <LayoutDashboard className="w-4 h-4 ml-1.5" />,
    },
    {
      id: 'candidates',
      label: `بانک گزینه‌ها (${candidateCount})`,
      icon: <Users className="w-4 h-4 ml-1.5" />,
    },
    {
      id: 'matrix',
      label: 'ماتریس اوزان و معیارها',
      icon: <SlidersHorizontal className="w-4 h-4 ml-1.5" />,
    },
    {
      id: 'radar',
      label: 'مقایسه راداری',
      icon: <Radar className="w-4 h-4 ml-1.5" />,
    },
    {
      id: 'pipeline',
      label: 'مراحل آشنایی (CRM)',
      icon: <GitBranch className="w-4 h-4 ml-1.5" />,
    },
    {
      id: 'toolkit',
      label: 'پیام‌ها و راهنمای دکتری',
      icon: <MessageSquareText className="w-4 h-4 ml-1.5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single clean text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('dashboard')}
              className="text-right text-slate-900 group flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ک
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                  کفو <span className="text-xs text-blue-600 font-semibold font-mono tracking-normal">Kafv</span>
                </span>
                <span className="text-[11px] text-slate-500 whitespace-nowrap block">
                  سامانه تصمیم‌گیری و همسرگزینی
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSwitchToPublicView}
              title="مشاهده فرم عمومی (همان چیزی که فرد غریبه در آدرس گیت‌هاب می‌بیند)"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">فرم عمومی</span>
            </button>

            <button
              onClick={onOpenBackupModal}
              title="پشتیبان‌گیری، وب‌هوک و اعلان تلگرام"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <DatabaseBackup className="w-4 h-4" />
            </button>

            <button
              onClick={onLockAdmin}
              title="قفل و خروج از پنل مدیریت"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>ثبت پرونده</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center gap-1 py-2 overflow-x-auto border-t border-slate-100 text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
