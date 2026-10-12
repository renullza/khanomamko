/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Candidate, CriteriaWeights, DealBreakerRule, PipelineStage } from './types/matchmaking';
import {
  DEFAULT_WEIGHTS,
  DEFAULT_DEAL_BREAKERS,
  INITIAL_CANDIDATES,
} from './data/initialData';
import { recomputeAllCandidates } from './utils/calculator';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CandidateListView } from './components/CandidateListView';
import { CriteriaMatrixView } from './components/CriteriaMatrixView';
import { RadarComparisonView } from './components/RadarComparisonView';
import { PipelineKanbanView } from './components/PipelineKanbanView';
import { OutreachToolkitView } from './components/OutreachToolkitView';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { AddCandidateModal } from './components/AddCandidateModal';
import { BackupModal } from './components/BackupModal';
import { PublicApplicationForm } from './components/PublicApplicationForm';
import { AdminLoginModal } from './components/AdminLoginModal';

const STORAGE_KEYS = {
  CANDIDATES: 'kafv_candidates_v1',
  WEIGHTS: 'kafv_weights_v1',
  DEAL_BREAKERS: 'kafv_deal_breakers_v1',
  ADMIN_PIN: 'kafv_admin_pin_v1',
  WEBHOOK_URL: 'kafv_webhook_url_v1',
  TELEGRAM_CONFIG: 'kafv_telegram_config_v1',
};

export default function App() {
  // Public vs Admin Mode
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kafv_admin_logged_in') === 'true';
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || '1374';
  });

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.WEBHOOK_URL) || '';
  });

  const [telegramConfig, setTelegramConfig] = useState<{ botToken: string; chatId: string }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TELEGRAM_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { botToken: '', chatId: '' };
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Initialize weights
  const [weights, setWeights] = useState<CriteriaWeights>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading weights', e);
    }
    return DEFAULT_WEIGHTS;
  });

  // Initialize dealbreakers
  const [dealBreakers, setDealBreakers] = useState<DealBreakerRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEAL_BREAKERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading dealbreakers', e);
    }
    return DEFAULT_DEAL_BREAKERS;
  });

  // Initialize candidates
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return recomputeAllCandidates(parsed, DEFAULT_WEIGHTS);
        }
      }
    } catch (e) {
      console.error('Error loading candidates', e);
    }
    return recomputeAllCandidates(INITIAL_CANDIDATES, DEFAULT_WEIGHTS);
  });

  // Modal states
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch (e) {
      console.error(e);
    }
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
    } catch (e) {
      console.error(e);
    }
  }, [weights]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEAL_BREAKERS, JSON.stringify(dealBreakers));
    } catch (e) {
      console.error(e);
    }
  }, [dealBreakers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, adminPin);
  }, [adminPin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_URL, webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(telegramConfig));
  }, [telegramConfig]);

  // Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('kafv_admin_logged_in', 'true');
    setIsAdminLoginModalOpen(false);
  };

  const handleAdminLock = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('kafv_admin_logged_in');
  };

  const handlePublicFormSubmit = (newCandidate: Candidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  const handleUpdateWeights = (newWeights: CriteriaWeights) => {
    setWeights(newWeights);
    setCandidates((prev) => recomputeAllCandidates(prev, newWeights));
    if (selectedCandidate) {
      const updated = recomputeAllCandidates([selectedCandidate], newWeights)[0];
      setSelectedCandidate(updated);
    }
  };

  const handleAddCandidate = (newCandidate: Candidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  const handleSaveCandidate = (updatedCandidate: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === updatedCandidate.id ? updatedCandidate : c))
    );
    setSelectedCandidate(updatedCandidate);
  };

  const handleDeleteCandidate = (candidateId: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate(null);
    }
  };

  const handleUpdateStage = (candidateId: string, newStage: PipelineStage) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          pipelineStage: newStage,
          interactions: [
            {
              id: `int-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              type: 'note',
              summary: `مرحله به «${newStage}» تغییر یافت.`,
              mood: 'neutral',
            },
            ...c.interactions,
          ],
        };
      })
    );
  };

  const handleToggleDealBreaker = (ruleId: string) => {
    setDealBreakers((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const handleAddDealBreaker = (label: string) => {
    const newRule: DealBreakerRule = {
      id: `db-${Date.now()}`,
      label,
      category: 'character',
      active: true,
    };
    setDealBreakers((prev) => [...prev, newRule]);
  };

  const handleResetToDefaults = () => {
    setWeights(DEFAULT_WEIGHTS);
    setDealBreakers(DEFAULT_DEAL_BREAKERS);
    setCandidates(recomputeAllCandidates(INITIAL_CANDIDATES, DEFAULT_WEIGHTS));
    setSelectedCandidate(null);
  };

  const handleImportData = (data: {
    candidates: Candidate[];
    weights: CriteriaWeights;
    dealBreakers: DealBreakerRule[];
  }) => {
    setWeights(data.weights);
    setDealBreakers(data.dealBreakers);
    setCandidates(recomputeAllCandidates(data.candidates, data.weights));
  };

  // If visitor is not authenticated as admin, render public questionnaire form
  if (!isAdminAuthenticated) {
    return (
      <>
        <PublicApplicationForm
          weights={weights}
          onSubmitApplication={handlePublicFormSubmit}
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          webhookUrl={webhookUrl}
          telegramConfig={telegramConfig}
        />

        {isAdminLoginModalOpen && (
          <AdminLoginModal
            correctPin={adminPin}
            onSuccess={handleAdminLoginSuccess}
            onClose={() => setIsAdminLoginModalOpen(false)}
            onUpdatePin={setAdminPin}
          />
        )}
      </>
    );
  }

  // Admin Evaluator View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        candidateCount={candidates.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onSwitchToPublicView={() => setIsAdminAuthenticated(false)}
        onLockAdmin={handleAdminLock}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            candidates={candidates}
            weights={weights}
            onSelectCandidate={(c) => setSelectedCandidate(c)}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'candidates' && (
          <CandidateListView
            candidates={candidates}
            onSelectCandidate={(c) => setSelectedCandidate(c)}
            onUpdateStage={handleUpdateStage}
            onDeleteCandidate={handleDeleteCandidate}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'matrix' && (
          <CriteriaMatrixView
            weights={weights}
            onUpdateWeights={handleUpdateWeights}
            dealBreakers={dealBreakers}
            onToggleDealBreaker={handleToggleDealBreaker}
            onAddDealBreaker={handleAddDealBreaker}
            candidates={candidates}
          />
        )}

        {activeTab === 'radar' && (
          <RadarComparisonView candidates={candidates} />
        )}

        {activeTab === 'pipeline' && (
          <PipelineKanbanView
            candidates={candidates}
            onSelectCandidate={(c) => setSelectedCandidate(c)}
            onUpdateStage={handleUpdateStage}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'toolkit' && <OutreachToolkitView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>کفو (Kafv) · سامانه تصمیم‌گیری تحلیلی همسرگزینی برای دوره دکتری و پژوهش</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="text-blue-700 hover:underline text-[11px]"
            >
              مشاهده فرم عمومی (تست ارسال متقاضی)
            </button>
            <span>·</span>
            <button
              onClick={handleAdminLock}
              className="text-slate-500 hover:text-rose-600 text-[11px]"
            >
              قفل پنل
            </button>
          </div>
        </div>
      </footer>

      {/* Candidate Dossier Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          weights={weights}
          onClose={() => setSelectedCandidate(null)}
          onSave={handleSaveCandidate}
        />
      )}

      {/* Add Candidate Modal */}
      {isAddModalOpen && (
        <AddCandidateModal
          weights={weights}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCandidate}
        />
      )}

      {/* Backup & Notification Settings Modal */}
      {isBackupModalOpen && (
        <BackupModal
          candidates={candidates}
          weights={weights}
          dealBreakers={dealBreakers}
          webhookUrl={webhookUrl}
          onUpdateWebhookUrl={setWebhookUrl}
          telegramConfig={telegramConfig}
          onUpdateTelegramConfig={setTelegramConfig}
          onImportData={handleImportData}
          onResetToDefaults={handleResetToDefaults}
          onClose={() => setIsBackupModalOpen(false)}
        />
      )}
    </div>
  );
}
