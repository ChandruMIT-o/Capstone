import React from 'react';
import {
  Globe,
  Server,
  Shield,
  Database,
  Cpu,
  Layers,
  Box,
  Key,
  Clock,
  GitBranch,
  Terminal,
  FileCode,
  ArrowRight,
  LayoutDashboard,
  Stethoscope,
  UserCheck,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export const ApplicationArchitectureView: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-4 bg-slate-50 text-slate-800 select-none">
      
      {/* Top Bar: Title & High-Level Architecture Meta */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 bg-white px-4 py-2.5 rounded-xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              System Architecture
            </span>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Care Coordination Referral Hub — Modular Monolith Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Production Model: Single Deployable Monolith (React 19 SPA + Spring Boot 4.1 / Java 25 + MySQL 8.0 with Flyway on Kubernetes)
          </p>
        </div>

        {/* Highlight Architecture Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Stateless JWT (JJWT)
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Dedicated History Tables
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            Flyway Versioned Schema
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            Maven Multi-Module Build
          </div>
        </div>
      </div>

      {/* Main Architecture Tiers (3 Columns: Presentation Tier -> Backend & Service Tier -> Persistence Tier) */}
      <div className="grid grid-cols-12 gap-3.5 my-3 flex-1 items-stretch">
        
        {/* Tier 1: Client & Presentation Tier (React 19 SPA) - 4 Cols */}
        <div className="col-span-12 lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  1. Client Presentation Tier
                </h3>
                <span className="text-xs text-slate-500 font-medium">React 19 • TypeScript • Tailwind CSS • Vite 8</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
              Port :5173 / Static
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between">
            {/* Central Orchestrator */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Central State Orchestrator (`App.tsx`)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold">
                  State Hub
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Manages session tokens, active role scope (<strong className="text-blue-900">ADM, CRD, AUD</strong>), cached entity arrays, global filter state, and modal workflow triggers.
              </p>
            </div>

            {/* Portal Views Grid */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Role-Scoped Portal Views
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" /> Global Dashboard
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Metrics, search, filters & detail</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> My Workflow (CRD)
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Assigned cases & SLA milestones</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> 360 Member Hub
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Demographics & care timeline</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-600" /> Overdue Risk Center
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Overdue trends & risk analytics</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 col-span-2 flex flex-col justify-between">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-600" /> Access Control Center (ADM)
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Auditor/Coordinator registrations & 2-step SLA extension reviews</span>
                </div>
              </div>
            </div>

            {/* Client Transport & Polling */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" /> Token Storage
                </span>
                <p className="text-slate-600 text-xs mt-0.5 font-medium">
                  <code className="font-mono bg-slate-100 px-1 py-0.2 rounded text-xs">localStorage</code> key <code className="font-mono">auth_token</code> injected as Bearer header.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> Polling Worker
                </span>
                <p className="text-slate-600 text-xs mt-0.5 font-medium">
                  Polls <code className="font-mono bg-slate-100 px-1 py-0.2 rounded text-xs">/api/notifications</code> every 30s for coordinator alerts.
                </p>
              </div>
            </div>

            {/* Dev Proxy vs Prod Indicator with Arrow */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900">
              <span className="flex items-center gap-1">
                <ArrowRight className="w-4 h-4 text-blue-700" /> Dev Mode: Vite Proxy
              </span>
              <span className="font-mono text-blue-700 font-bold">/api/* ➔ localhost:8080</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Backend Application & Services Tier (Spring Boot) - 5 Cols */}
        <div className="col-span-12 lg:col-span-5 flex flex-col bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  2. Backend & Application Services
                </h3>
                <span className="text-xs text-slate-500 font-medium">Spring Boot 4.1.0 • Java 25 • Spring Security • Spring MVC</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
              Port :8080
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between">
            {/* Security Filter Boundary */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-700" />
                  Stateless Security Filter Chain (JJWT + BCrypt)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-semibold">
                  RBAC Gate
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-900">Public Allowlist:</span>
                  <div className="text-slate-500 font-mono text-xs mt-0.5">/api/auth/**, /actuator/health</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-blue-800">ADM Exclusives:</span>
                  <div className="text-slate-500 font-mono text-xs mt-0.5">/api/admin/**, POST /members</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-emerald-800">CRD Operations:</span>
                  <div className="text-slate-500 font-mono text-xs mt-0.5">PUT /status, PUT /priority</div>
                </div>
              </div>
            </div>

            {/* REST Controllers */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
              <div className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-600" />
                REST Controllers & API Surface
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-blue-700 font-bold">AuthController</span>
                  <div className="text-xs text-slate-500 font-sans">/api/auth/login, register</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-blue-700 font-bold">ReferralCtrl</span>
                  <div className="text-xs text-slate-500 font-sans">/api/referrals/** (CRUD, SLA)</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-blue-700 font-bold">PersonCtrl</span>
                  <div className="text-xs text-slate-500 font-sans">/api/members, coordinators</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-blue-700 font-bold">AdminCtrl</span>
                  <div className="text-xs text-slate-500 font-sans">/api/admin/registration, sla</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-blue-700 font-bold">NotifCtrl</span>
                  <div className="text-xs text-slate-500 font-sans">/api/notifications?since=</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-blue-700 font-bold">Actuator</span>
                  <div className="text-xs text-slate-500 font-sans">/actuator/health, info</div>
                </div>
              </div>
            </div>

            {/* Application Business Services */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-orange-600" />
                  Core Business Logic & Workflow Engines
                </span>
                <span className="text-xs text-slate-500 font-medium">@Transactional Boundaries</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 p-2 rounded bg-white border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="font-bold text-slate-900">Referral State Engine:</span>
                  <span className="text-slate-600 font-medium">Enforces <code className="font-mono text-slate-800">CREATED ➔ IN_PROGRESS ➔ COMPLETED / CANCELLED</code></span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-white border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="font-bold text-slate-900">2-Step SLA Governance:</span>
                  <span className="text-slate-600 font-medium">Submission leaves date intact ➔ Admin approval applies new due date</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-white border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span className="font-bold text-slate-900">Audit Stream Aggregator:</span>
                  <span className="text-slate-600 font-medium">Aggregates history streams into user-specific notification feed</span>
                </div>
              </div>
            </div>

            {/* Production Integrated Packaging Notice */}
            <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center justify-between font-medium">
              <span className="font-bold text-slate-900">Production Package:</span>
              <span>Spring Boot serves API endpoints + compiled SPA from <code className="font-mono text-blue-700">/public</code> resources</span>
            </div>
          </div>
        </div>

        {/* Tier 3: Persistence & Data Tier (MySQL 8.0) - 3 Cols */}
        <div className="col-span-12 lg:col-span-3 flex flex-col bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3. Persistence Tier
                </h3>
                <span className="text-xs text-slate-500 font-medium">Spring Data JPA • MySQL 8.0 • Flyway</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
              Port :3306
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-between">
            {/* Flyway Versioned Migrations */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-orange-600" />
                  Flyway Versioned Schema
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-semibold">
                  Immutable
                </span>
              </div>
              <div className="text-xs text-slate-700 space-y-1 font-mono font-medium">
                <div>• V0.0.0__MYSQL_Baseline.sql</div>
                <div>• V1.0.0__Create_Schema.sql</div>
                <div>• V1.1.0__Seed_Data.sql (Synthetic)</div>
                <div>• V1.2.0__Add_Created_Timestamp.sql</div>
              </div>
            </div>

            {/* Primary Relational Entities */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-blue-600" />
                Primary Relational Entities
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 font-mono">person</span>
                  <div className="text-xs text-slate-500 font-medium">ADM, CRD, AUD, MBR</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 font-mono">referral</span>
                  <div className="text-xs text-slate-500 font-medium">REF-xxx (status, due date)</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 font-mono">registration_req</span>
                  <div className="text-xs text-slate-500 font-medium">PENDING, APPROVED</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 font-mono">sla_extension_req</span>
                  <div className="text-xs text-slate-500 font-medium">PENDING, APPROVED</div>
                </div>
              </div>
            </div>

            {/* Dedicated Audit History Tables */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
              <div className="text-xs font-bold text-slate-900 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Dedicated Audit Tables
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold font-mono">
                  Full Audit
                </span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1 font-mono font-medium">
                <li>• referral_status_history</li>
                <li>• referral_assignment_history</li>
                <li>• referral_priority_history</li>
                <li>• referral_due_date_history</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Tier: DevOps, Runtime & Infrastructure Pipeline */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-900 uppercase tracking-wide text-xs">
              4. Runtime, Infrastructure & CI/CD Ecosystem
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono font-semibold">
              Kubernetes Dev (Kustomize)
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono font-semibold">
              Docker Multi-Stage
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono font-semibold">
              GitHub Actions CI/CD
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Box 1: Local Dev */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Local Profile (`local`)
            </div>
            <p className="text-slate-600 font-medium">
              Spring Boot Docker Compose auto-starts local MySQL (<code className="text-slate-900 font-mono font-bold">3306</code>). Vite (<code className="text-slate-900 font-mono font-bold">5173</code>) proxies to backend (<code className="text-slate-900 font-mono font-bold">8080</code>).
            </p>
          </div>

          {/* Box 2: Build & Packaging */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Maven Monolith Package
            </div>
            <p className="text-slate-600 font-medium">
              Root Maven build compiles React to <code className="text-slate-900 font-mono font-bold">dist/</code>, copies into Spring Boot <code className="text-slate-900 font-mono font-bold">public/</code>, producing single <code className="text-slate-900 font-mono font-bold">app.jar</code>.
            </p>
          </div>

          {/* Box 3: Container & K8s Dev */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Container & Kubernetes Dev
            </div>
            <p className="text-slate-600 font-medium">
              Non-root <code className="text-slate-900 font-mono font-bold">java</code> user on OpenJDK 25. Manifests under <code className="text-slate-900 font-mono font-bold">infrastructure/dev</code>: Deployment, StatefulSet, PVC, Ingress.
            </p>
          </div>

          {/* Box 4: Quality & Testing */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Testing & Verification
            </div>
            <p className="text-slate-600 font-medium">
              Backend Spock/Groovy + Testcontainers MySQL. Frontend Vitest + Testing Library for Health. Automated GitHub Actions workflow.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
