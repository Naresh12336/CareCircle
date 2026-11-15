import React, { useState, useEffect } from 'react'
import { HeartPulse, ShieldCheck, Activity, Pill, Users, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

export default function App() {
  const [healthStatus, setHealthStatus] = useState({
    loading: true,
    data: null,
    error: null,
  })

  const checkHealth = async () => {
    setHealthStatus({ loading: true, data: null, error: null })
    try {
      const response = await fetch('/api/v1/health')
      if (!response.ok) {
        throw new Error(`Health check returned status ${response.status}`)
      }
      const data = await response.json()
      setHealthStatus({ loading: false, data, error: null })
    } catch (err) {
      setHealthStatus({
        loading: false,
        data: null,
        error: err.message || 'Unable to connect to FastAPI backend',
      })
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 text-slate-800">
      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">CareCircle</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                Phase 1 Foundation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Hackathon Edition</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4">
            <Activity className="w-4 h-4" />
            <span>Elderly Care & Medication Management Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Compassionate Care, <br className="hidden sm:block" />
            <span className="text-teal-600">Simpler Living for Seniors</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            CareCircle bridges the gap between seniors, caregivers, and families with accessible medication schedules,
            secure passcode-based access, and smart non-clinical assistance.
          </p>
        </div>

        {/* Backend Connectivity Card */}
        <div className="max-w-2xl mx-auto mb-16 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <h2 className="font-semibold text-slate-800 text-base">Backend API Health Status</h2>
            </div>
            <button
              onClick={checkHealth}
              disabled={healthStatus.loading}
              className="text-xs font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {healthStatus.loading ? 'Checking...' : 'Refresh Status'}
            </button>
          </div>

          {healthStatus.loading && (
            <div className="py-6 text-center text-sm text-slate-500">
              Connecting to FastAPI health endpoint at <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/api/v1/health</code>...
            </div>
          )}

          {healthStatus.data && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Backend service is online & healthy</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-xs">Project</span>
                  <span className="font-semibold text-slate-800">{healthStatus.data.project}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-xs">Version</span>
                  <span className="font-semibold text-slate-800">v{healthStatus.data.version}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-xs">Environment</span>
                  <span className="font-semibold text-slate-800 capitalize">{healthStatus.data.environment}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-xs">PostgreSQL Status</span>
                  <span className={`font-semibold capitalize ${healthStatus.data.database === 'connected' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {healthStatus.data.database} (configured)
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                Checked: {new Date(healthStatus.data.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          {healthStatus.error && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Backend not connected yet</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  Start the FastAPI server on port 8000 (<code className="bg-amber-100/70 px-1 rounded">uvicorn app.main:app --reload</code>) to test live communication.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Platform Modules (Architecture Previews) */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Medication Management</h3>
            <p className="text-sm text-slate-600 mb-3">
              Schedules, dosage alerts, and prescription label OCR parsing via Tesseract.
            </p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Scheduled for Phase 2
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Secure Passcode Portal</h3>
            <p className="text-sm text-slate-600 mb-3">
              Frictionless, high-accessibility authentication tailored for seniors and caregivers with role-based access.
            </p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Scheduled for Phase 2
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Non-Clinical Assistant</h3>
            <p className="text-sm text-slate-600 mb-3">
              Powered by Gemini API for gentle routine reminders and everyday wellness support without clinical diagnosis.
            </p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Scheduled for Phase 2
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20 py-8 bg-white text-center text-sm text-slate-500">
        <p>CareCircle &copy; 2026 &bull; Elderly Care & Medication Management &bull; Built for Hackathon</p>
      </footer>
    </div>
  )
}
