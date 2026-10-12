/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Candidate, PipelineStage } from './types/matchmaking';
import { DEFAULT_WEIGHTS, INITIAL_CANDIDATES } from './data/initialData';
import { APP_CONFIG } from './config';
import { PublicApplicationForm } from './components/PublicApplicationForm';
import { SubmissionsListView } from './components/SubmissionsListView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { BackupModal } from './components/BackupModal';

const STORAGE_KEYS = {
  CANDIDATES: 'khanomamko_submissions_v2',
  WEBHOOK_URL: 'khanomamko_webhook_url_v2',
  TELEGRAM_CONFIG: 'khanomamko_telegram_config_v2',
};

export default function App() {
  // Public Form vs Admin Submissions View
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('khanomamko_admin_session') === 'true';
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Webhook & Telegram Config
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.WEBHOOK_URL) || APP_CONFIG.WEBHOOK_URL;
  });

  const [telegramConfig, setTelegramConfig] = useState<{ botToken: string; chatId: string }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TELEGRAM_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      botToken: APP_CONFIG.TELEGRAM_BOT_TOKEN,
      chatId: APP_CONFIG.TELEGRAM_CHAT_ID,
    };
  });

  // Submissions state
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading submissions', e);
    }
    return INITIAL_CANDIDATES;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch (e) {
      console.error(e);
    }
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_URL, webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(telegramConfig));
  }, [telegramConfig]);

  // Auth handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('khanomamko_admin_session', 'true');
    setIsAdminLoginModalOpen(false);
  };

  const handleAdminLock = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('khanomamko_admin_session');
  };

  // Form submission by applicant
  const handlePublicFormSubmit = (newCandidate: Candidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  // Submissions management
  const handleUpdateStage = (id: string, stage: PipelineStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pipelineStage: stage } : c))
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetToDefaults = () => {
    setCandidates(INITIAL_CANDIDATES);
  };

  const handleImportData = (data: { candidates: Candidate[] }) => {
    if (Array.isArray(data.candidates)) {
      setCandidates(data.candidates);
    }
  };

  // If visitor is not authenticated, render public application questionnaire form
  if (!isAdminAuthenticated) {
    return (
      <>
        <PublicApplicationForm
          weights={DEFAULT_WEIGHTS}
          onSubmitApplication={handlePublicFormSubmit}
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          webhookUrl={webhookUrl}
          telegramConfig={telegramConfig}
        />

        {isAdminLoginModalOpen && (
          <AdminLoginModal
            correctPin={APP_CONFIG.ADMIN_PASSWORD}
            onSuccess={handleAdminLoginSuccess}
            onClose={() => setIsAdminLoginModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Admin View: Clean, high-density Submissions List
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        <SubmissionsListView
          candidates={candidates}
          onUpdateStage={handleUpdateStage}
          onUpdateNotes={handleUpdateNotes}
          onDeleteCandidate={handleDeleteCandidate}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onSwitchToPublic={() => setIsAdminAuthenticated(false)}
          onLock={handleAdminLock}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>پنل مدیریت اطلاعات متقاضیان · دانشگاه تبریز</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="text-blue-700 hover:underline text-[11px]"
            >
              مشاهده فرم عمومی
            </button>
            <span>·</span>
            <button
              onClick={handleAdminLock}
              className="text-slate-500 hover:text-rose-600 text-[11px]"
            >
              قفل و خروج از پنل
            </button>
          </div>
        </div>
      </footer>

      {/* Settings & Backup Modal */}
      {isSettingsModalOpen && (
        <BackupModal
          candidates={candidates}
          weights={DEFAULT_WEIGHTS}
          dealBreakers={[]}
          webhookUrl={webhookUrl}
          onUpdateWebhookUrl={setWebhookUrl}
          telegramConfig={telegramConfig}
          onUpdateTelegramConfig={setTelegramConfig}
          onImportData={handleImportData as any}
          onResetToDefaults={handleResetToDefaults}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
}
