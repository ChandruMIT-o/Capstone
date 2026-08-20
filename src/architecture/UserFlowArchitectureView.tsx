import React, { useState } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Eye,
  Users,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  UserPlus,
  Send,
  Workflow,
  FileText
} from 'lucide-react';

export const UserFlowArchitectureView: React.FC = () => {
  const [activeRoleFilter, setActiveRoleFilter] = useState<'ALL' | 'ADM' | 'CRD' | 'AUD'>('ALL');

  return (
    <div className="h-full w-full flex flex-col justify-between p-4 bg-slate-50 text-slate-800 select-none">
      
      {/* Top Header: Title, Scope & Role Filter Badges */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 bg-white px-4 py-2.5 rounded-xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              Workflow Architecture
            </span>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Closed-Loop Care Coordination Lifecycle & Persona Flow
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            End-to-End Orchestration across Administrator (<strong className="text-blue-900">ADM</strong>), Care Coordinator (<strong className="text-emerald-900">CRD</strong>), and Auditor (<strong className="text-amber-900">AUD</strong>)
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveRoleFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
              activeRoleFilter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            All Roles
          </button>

          <button
            onClick={() => setActiveRoleFilter('ADM')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border ${
              activeRoleFilter === 'ADM'
                ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
                : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Administrator (ADM)</span>
          </button>

          <button
            onClick={() => setActiveRoleFilter('CRD')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border ${
              activeRoleFilter === 'CRD'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Care Coordinator (CRD)</span>
          </button>

          <button
            onClick={() => setActiveRoleFilter('AUD')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border ${
              activeRoleFilter === 'AUD'
                ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>Auditor (AUD)</span>
          </button>
        </div>
      </div>

      {/* Main 5-Stage Closed-Loop Process Flow (5 Horizontal Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 my-3 flex-1 items-stretch">
        
        {/* Phase 1: Onboarding & Access Control */}
        <div className={`flex flex-col bg-white rounded-xl border p-3.5 shadow-xs transition-all ${
          activeRoleFilter === 'ALL' || activeRoleFilter === 'ADM' || activeRoleFilter === 'CRD' || activeRoleFilter === 'AUD'
            ? 'border-slate-300 opacity-100'
            : 'opacity-40 border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Access & Auth
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
              Onboarding
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between text-xs">
            {/* Step 1.1 */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-blue-600" /> 1.1 Request Account
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold font-mono">CRD / AUD</span>
              </div>
              <p className="text-slate-600 font-medium">
                Prospective user fills role request (<code className="font-mono text-slate-800">POST /api/auth/register/request</code>). Status is set to <strong className="text-amber-700">PENDING</strong>.
              </p>
            </div>

            {/* Step 1.2 */}
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> 1.2 Admin Review
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-blue-200 text-blue-900 font-semibold font-mono">ADM</span>
              </div>
              <p className="text-slate-700 font-medium">
                Admin opens <em>Access Control Center</em> ➔ Evaluates candidate ➔ Clicks <strong>Approve</strong> (<code className="font-mono">/approve</code>) or <strong>Reject</strong> (with 24h cooldown).
              </p>
            </div>

            {/* Step 1.3 */}
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> 1.3 Password & JWT
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-semibold font-mono">JWT 24h</span>
              </div>
              <p className="text-slate-700 font-medium">
                Approved user completes registration (<code className="font-mono">/register/complete</code>) ➔ Authenticates via <code className="font-mono">/login</code> ➔ Receives Bearer JWT token.
              </p>
            </div>

            {/* State Badge */}
            <div className="p-2 rounded-lg bg-slate-100 text-center font-mono text-xs font-semibold text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" /> Identity Verified ➔ Token Saved
            </div>
          </div>
        </div>

        {/* Phase 2: Intake & Referral Creation */}
        <div className={`flex flex-col bg-white rounded-xl border p-3.5 shadow-xs transition-all ${
          activeRoleFilter === 'ALL' || activeRoleFilter === 'ADM'
            ? 'border-blue-300 opacity-100'
            : 'opacity-40 border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-800 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Intake & Create
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-semibold">
              ADM Exclusive
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between text-xs">
            {/* Step 2.1 */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> 2.1 Member Need
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-mono font-semibold">MBR-xxx</span>
              </div>
              <p className="text-slate-600 font-medium">
                Synthetic member clinical/social care need identified (Specialist, Behavioral Health, Home Health, Transport, Lab).
              </p>
            </div>

            {/* Step 2.2 */}
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-700" /> 2.2 Create & Assign
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-blue-200 text-blue-900 font-semibold font-mono">ADM</span>
              </div>
              <p className="text-slate-700 font-medium">
                Admin creates referral (<code className="font-mono">POST /api/referrals</code>) with member, type, priority, SLA due date, and assigned Coordinator (<code className="font-mono">CC-xxx</code>).
              </p>
            </div>

            {/* Step 2.3 */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" /> 2.3 Initial State
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 font-mono font-semibold">CREATED</span>
              </div>
              <p className="text-slate-600 font-medium">
                Referral status initialized to <strong className="text-blue-700">CREATED</strong>. Baseline records written to dedicated audit history tables.
              </p>
            </div>

            {/* State Badge */}
            <div className="p-2 rounded-lg bg-blue-50 text-center font-mono text-xs font-semibold text-blue-900 border border-blue-200 flex items-center justify-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-blue-700" /> Status: CREATED ➔ Assigned to CC
            </div>
          </div>
        </div>

        {/* Phase 3: Active Caseload & Coordination */}
        <div className={`flex flex-col bg-white rounded-xl border p-3.5 shadow-xs transition-all ${
          activeRoleFilter === 'ALL' || activeRoleFilter === 'CRD'
            ? 'border-emerald-300 opacity-100'
            : 'opacity-40 border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Triage & Action
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-semibold">
              CRD Caseload
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between text-xs">
            {/* Step 3.1 */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-emerald-600" /> 3.1 Caseload Poller
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-semibold font-mono">Poll 30s</span>
              </div>
              <p className="text-slate-600 font-medium">
                Coordinator header polls <code className="font-mono">/api/notifications</code> every 30s ➔ Notification triggers in <em>My Workflow</em>.
              </p>
            </div>

            {/* Step 3.2 */}
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" /> 3.2 Member 360 Review
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-semibold font-mono">CRD</span>
              </div>
              <p className="text-slate-700 font-medium">
                Coordinator reviews patient clinical background, previous referrals, and coordinator notes in <em>360 Member Profile</em>.
              </p>
            </div>

            {/* Step 3.3 */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" /> 3.3 Progress Transition
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-teal-100 text-teal-900 font-mono font-semibold">IN_PROGRESS</span>
              </div>
              <p className="text-slate-600 font-medium">
                Coordinator updates status to <strong className="text-teal-700">IN_PROGRESS</strong> (<code className="font-mono">PUT /status</code>) and contacts provider/member.
              </p>
            </div>

            {/* State Badge */}
            <div className="p-2 rounded-lg bg-emerald-50 text-center font-mono text-xs font-semibold text-emerald-900 border border-emerald-200 flex items-center justify-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700" /> Status: IN_PROGRESS ➔ Outreach Active
            </div>
          </div>
        </div>

        {/* Phase 4: Risk Mitigation & SLA Governance */}
        <div className={`flex flex-col bg-white rounded-xl border p-3.5 shadow-xs transition-all ${
          activeRoleFilter === 'ALL' || activeRoleFilter === 'ADM' || activeRoleFilter === 'CRD'
            ? 'border-orange-300 opacity-100'
            : 'opacity-40 border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-orange-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-700 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                SLA & Priority
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-mono font-semibold">
              2-Step Flow
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between text-xs">
            {/* Step 4.1 */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" /> 4.1 Priority Escalation
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-red-100 text-red-900 font-mono font-semibold">URGENT</span>
              </div>
              <p className="text-slate-600 font-medium">
                Coordinator changes priority (<code className="font-mono">PUT /priority</code>) with mandatory business reason. Logged in history table.
              </p>
            </div>

            {/* Step 4.2 */}
            <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-orange-950 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-orange-700" /> 4.2 SLA Extension Req
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-orange-200 text-orange-900 font-semibold font-mono">CRD Req</span>
              </div>
              <p className="text-slate-700 font-medium">
                Impending deadline ➔ Coordinator submits request (<code className="font-mono">POST /sla-extension-requests</code>). Referral date remains unchanged.
              </p>
            </div>

            {/* Step 4.3 */}
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> 4.3 Admin Decision
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-blue-200 text-blue-900 font-semibold font-mono">ADM Review</span>
              </div>
              <p className="text-slate-700 font-medium">
                Admin evaluates in <em>Access Control Center</em>: <strong>Approve</strong> (applies new due date) or <strong>Reject</strong> (preserves original date).
              </p>
            </div>

            {/* State Badge */}
            <div className="p-2 rounded-lg bg-orange-50 text-center font-mono text-xs font-semibold text-orange-900 border border-orange-200 flex items-center justify-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-orange-700" /> SLA Decided ➔ Alert Dispatched
            </div>
          </div>
        </div>

        {/* Phase 5: Resolution & Audit Traceability */}
        <div className={`flex flex-col bg-white rounded-xl border p-3.5 shadow-xs transition-all ${
          activeRoleFilter === 'ALL' || activeRoleFilter === 'AUD' || activeRoleFilter === 'ADM' || activeRoleFilter === 'CRD'
            ? 'border-purple-300 opacity-100'
            : 'opacity-40 border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-purple-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-800 text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Resolution & Audit
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-semibold">
              Terminal
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between text-xs">
            {/* Step 5.1 */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 5.1 Case Resolution
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-mono font-semibold">COMPLETED</span>
              </div>
              <p className="text-slate-600 font-medium">
                Care delivered or declined ➔ Coordinator / Admin sets status to <strong className="text-purple-700">COMPLETED</strong> or <strong className="text-slate-700">CANCELLED</strong>.
              </p>
            </div>

            {/* Step 5.2 */}
            <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-purple-700" /> 5.2 Immutable Ledger
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-purple-200 text-purple-900 font-semibold font-mono">MySQL DB</span>
              </div>
              <p className="text-slate-700 font-medium">
                Status, assignment, priority, and due-date histories saved with exact timestamp and <code className="font-mono">performedBy</code> ID.
              </p>
            </div>

            {/* Step 5.3 */}
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-700" /> 5.3 Auditor Inspection
                </span>
                <span className="text-xs px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-semibold font-mono">AUD Only</span>
              </div>
              <p className="text-slate-700 font-medium">
                Auditor inspects <em>Dashboard</em>, filters overdue/closed cases, and inspects full chronological audit history (Read-Only).
              </p>
            </div>

            {/* State Badge */}
            <div className="p-2 rounded-lg bg-purple-50 text-center font-mono text-xs font-semibold text-purple-900 border border-purple-200 flex items-center justify-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-purple-700" /> Closed-Loop Complete & Verified
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Summary Bar: State Machine & Role Privilege Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs text-xs">
        
        {/* Left: Referral Finite State Machine - 6 Cols */}
        <div className="md:col-span-6 border-b md:border-b-0 md:border-r border-slate-200 pb-2 md:pb-0 md:pr-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-900 uppercase text-xs flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-700" />
              Referral Lifecycle State Constraints (State Machine)
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500">Strict DB Constraint</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono my-1">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-bold">
              1. CREATED
              <div className="text-xs text-slate-500 font-normal font-sans mt-0.5">Initial Intake</div>
            </div>
            <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-bold">
              2. IN_PROGRESS
              <div className="text-xs text-slate-500 font-normal font-sans mt-0.5">Active Casework</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
              3. COMPLETED
              <div className="text-xs text-slate-500 font-normal font-sans mt-0.5">Resolved Terminal</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-bold">
              4. CANCELLED
              <div className="text-xs text-slate-500 font-normal font-sans mt-0.5">Discontinued</div>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-medium flex items-center justify-between mt-1">
            <span>Allowed Transitions: <code className="font-mono text-slate-900 font-bold">CREATED ➔ IN_PROGRESS ➔ COMPLETED / CANCELLED</code></span>
            <span className="text-slate-500">Terminal states are immutable</span>
          </div>
        </div>

        {/* Right: Role Privilege Boundary Matrix - 6 Cols */}
        <div className="md:col-span-6 md:pl-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-900 uppercase text-xs flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              Role Privilege & Governance Boundary Matrix
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500">Spring Security RBAC</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-blue-900 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Administrator (ADM)
              </div>
              <ul className="text-slate-700 space-y-0.5 font-medium text-xs">
                <li>• Create & Reassign referrals</li>
                <li>• Direct due-date overrides</li>
                <li>• Review registrations & SLAs</li>
                <li>• Overdue Risk Center analytics</li>
              </ul>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-700" /> Coordinator (CRD)
              </div>
              <ul className="text-slate-700 space-y-0.5 font-medium text-xs">
                <li>• Update status on assigned cases</li>
                <li>• Update priority (reason required)</li>
                <li>• Submit SLA extension requests</li>
                <li>• 30s Polled alert notifications</li>
              </ul>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-amber-700" /> Auditor (AUD)
              </div>
              <ul className="text-slate-700 space-y-0.5 font-medium text-xs">
                <li>• Read-only Global Dashboard</li>
                <li>• Inspect 360 Member Profiles</li>
                <li>• Full audit trail inspection</li>
                <li>• Zero edit/mutation privileges</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
