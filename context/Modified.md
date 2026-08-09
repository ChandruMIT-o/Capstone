# Care Coordination & Referral Tracking - Features & Suggestions

This document lists the core features, UI views, and stretch goals for the Care Coordination & Referral Tracking Microservice as defined in the preview requirements, along with additional suggested features to enhance the application's capabilities.

---

## 1. Core Features

### Referral Lifecycle Management
*   **State Machine Transitions**: Implement and validate state transitions:
    *   `CREATED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED`
    *   `CREATED` $\rightarrow$ `CANCELLED`
    *   `IN_PROGRESS` $\rightarrow$ `COMPLETED`
*   **Status Validation**: Enforce lifecycle rules to prevent invalid state transitions.
*   **Derived Overdue State**: Automatically calculate the overdue status based on the business rule:
    $$\text{current date} > \text{due date} \quad\text{and}\quad \text{status} \neq \text{COMPLETED}$$
    *(Note: Overdue is a derived/virtual property and is not stored statically in the database).*

### Synthetic Data Layer
*   **Synthetic Member Profiles**: Fictional profiles including `memberId`, `firstName`, `lastName`, and `dateOfBirth`.
*   **Referral Entity**: Detailed records containing `referralId`, `memberId`, `referralType`, `priority`, `status`, `assignedTo` (Coordinator), `createdDate`, `dueDate`, `lastUpdated`, and `notes`.
*   **Care Coordinator Profiles**: Entities containing `coordinatorId` and `name`.
*   **Seeding & Generation**: A pre-seeded database containing 50–100 realistic, fully synthetic referrals, coordinators, and member records. The dataset includes a mix of:
    *   Completed, cancelled, in-progress, and overdue referrals.
    *   Various referral types (e.g., `SpecialistVisit`, `BehavioralHealth`, `HomeHealth`, `LabWork`, `PhysicalTherapy`, `SocialServices`, `Transportation`, `NutritionSupport`).
    *   A full spectrum of priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
    *   Multiple referrals linked to a single member.

### REST API Endpoints
*   `POST /referrals`: Create a new referral (initiating a member journey).
*   `PUT /referrals/{id}/status`: Update the lifecycle status of a referral.
*   `GET /referrals/{id}`: Retrieve detailed referral and associated member metadata.
*   `GET /referrals`: Retrieve all referrals with support for filtering by:
    *   `status`
    *   `assignedTo`
    *   `overdue=true`
*   `GET /actuator/health`: Backend service health check reflecting underlying component/database readiness.

---

## 2. UI Features

### Referral Directory View
*   **Referral Grid/List**: Displays critical tracking columns:
    *   Referral ID
    *   Member Name (Synthetic)
    *   Referral Type
    *   Priority Badge (color-coded)
    *   Current Status
    *   Due Date
    *   Assigned Coordinator
    *   Overdue Indicator (prominently styled alert)
*   **Interactive Filters**: Real-time filtering by status, assigned coordinator, and an "Overdue Only" toggle.

### Referral Detail & Action Panel
*   **Comprehensive Details View**: Displays full referral info and audit/timestamp metadata.
*   **Lifecycle Management Controls**: Actions/buttons to transition the referral status according to business validation rules.
*   **Coordination Log**: Free-text notes input area to log updates, interactions, and follow-up details.

---

## 3. Stretch Goals

*   **Role-Based Access Control (RBAC)**: Basic authorization layer separating Read-Only viewers (e.g., auditors, supervisors) from Read/Write update users (e.g., active Care Coordinators).
*   **System Metrics Endpoint**: Exposes performance and business metrics (e.g., number of active/completed referrals, API request latency).
*   **Event Generation (Audit/Lifecycle)**: Generates and publishes events internally or to a log/console stream on status changes to enable decoupled processing.
*   **SLA (Service Level Agreement) Tracking**: Enhanced tracking of processing time (e.g., time elapsed between creation and assignment, or time in `IN_PROGRESS`).
*   **Simulated Notifications**: Log-based simulation of real-time alerts (e.g., logging an alert when a critical referral goes overdue or is assigned to a coordinator).

---

## 4. Suggested Additional Features

To elevate the application toward a highly interactive, enterprise-grade care coordination system, the following features are suggested:

### Workload & Assignment Automation
*   **Intelligent Auto-Assignment**: A round-robin or workload-based assignment engine that automatically assigns new referrals to the coordinator with the fewest active cases.
*   **Reassignment Audit Log**: A historical timeline panel in the detail view showing a record of coordinator changes (e.g., "Assigned to Casey Patel by System on 2026-04-02", "Reassigned to Jordan Lee on 2026-04-05").

### Member-Centric Care Hub
*   **360-Degree Member View**: A dedicated dashboard page for a single member listing their complete care history, demographics, and all past and active referrals. This allows coordinators to understand context immediately.
*   **Contact Log Timeline**: Ability to log interactions with members (e.g., "Spoke with member's son, transportation confirmed") separate from general system-level notes.

### Lifecycle & Scheduling Enhancements
*   **Due Date Extension Requests**: A formal "Snooze" or extension feature requiring coordinators to select a reason code (e.g., `PROVIDER_DELAY`, `MEMBER_UNREACHABLE`, `INSURANCE_AUTH`) and write a brief justification before updating a due date.
*   **Appointment Scheduler Integration**: A mock scheduling tool within the referral details to record when the actual appointment is scheduled (e.g., Specialist appointment set for 2026-04-15), bridging the gap between referral created and referral completed.

### Directory of Community & Clinical Resources
*   **Provider / Organization Catalog (Mocked)**: A lookup directory of clinics, specialists, behavioral health facilities, and community resource centers (such as food banks or transit services) to directly associate a referral with a specific destination entity.

### Reporting & Productivity Tools
*   **Bulk Operations**: Checkbox-selection on the Referral Directory to let team leads assign or reassign 10+ referrals to a new coordinator simultaneously.
*   **Export Functions**: A one-click button to export filtered referral dashboards as CSV spreadsheets or PDF summary reports.
*   **Overdue Risk Scoring**: An algorithm that calculates a "Risk Score" based on priority, remaining time, and coordinator workload, highlighting referrals likely to go overdue *before* they actually do.
