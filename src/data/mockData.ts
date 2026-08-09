export interface Member {
  memberId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
}

export interface CareCoordinator {
  coordinatorId: string;
  name: string;
  avatar: string;
  activeCases: number;
  email: string;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
}

export interface Referral {
  referralId: string;
  memberId: string;
  memberName: string; // denormalized for easy rendering
  memberDob: string;   // denormalized for easy rendering
  referralType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo: string; // coordinatorId
  createdDate: string;
  dueDate: string;
  lastUpdated: string;
  notes: string;
  auditHistory: AuditLog[];
}

export const initialMembers: Member[] = [
  { memberId: 'MBR-102938', firstName: 'Alex', lastName: 'Taylor', dateOfBirth: '1982-06-15', gender: 'Non-binary', phone: '(555) 019-2834', email: 'alex.taylor@synthetic.com' },
  { memberId: 'MBR-203847', firstName: 'Eleanor', lastName: 'Vance', dateOfBirth: '1995-11-23', gender: 'Female', phone: '(555) 023-8471', email: 'eleanor.v@synthetic.com' },
  { memberId: 'MBR-304756', firstName: 'Marcus', lastName: 'Aurelius', dateOfBirth: '1961-04-26', gender: 'Male', phone: '(555) 034-7562', email: 'marcus.a@synthetic.com' },
  { memberId: 'MBR-405665', firstName: 'Sienna', lastName: 'Brooks', dateOfBirth: '1989-08-09', gender: 'Female', phone: '(555) 045-6653', email: 'sienna.b@synthetic.com' },
  { memberId: 'MBR-506574', firstName: 'Devon', lastName: 'Conner', dateOfBirth: '1974-12-02', gender: 'Male', phone: '(555) 056-5744', email: 'devon.c@synthetic.com' },
  { memberId: 'MBR-607483', firstName: 'Priya', lastName: 'Sharma', dateOfBirth: '1991-03-14', gender: 'Female', phone: '(555) 067-4835', email: 'priya.s@synthetic.com' },
  { memberId: 'MBR-708392', firstName: 'Mateo', lastName: 'Hernandez', dateOfBirth: '2003-07-28', gender: 'Male', phone: '(555) 078-3926', email: 'mateo.h@synthetic.com' },
  { memberId: 'MBR-809201', firstName: 'Zoe', lastName: 'Kravitz', dateOfBirth: '1988-12-01', gender: 'Female', phone: '(555) 089-2017', email: 'zoe.k@synthetic.com' }
];

export const initialCoordinators: CareCoordinator[] = [
  { coordinatorId: 'CC-101', name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', activeCases: 14, email: 'jordan.lee@optum-style.com' },
  { coordinatorId: 'CC-102', name: 'Taylor Morgan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', activeCases: 19, email: 'taylor.morgan@optum-style.com' },
  { coordinatorId: 'CC-103', name: 'Casey Patel', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100', activeCases: 8, email: 'casey.patel@optum-style.com' },
  { coordinatorId: 'CC-104', name: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100', activeCases: 12, email: 'sam.rivera@optum-style.com' }
];

export const referralTypesList = [
  'SpecialistVisit',
  'BehavioralHealth',
  'HomeHealth',
  'LabWork',
  'PhysicalTherapy',
  'SocialServices',
  'Transportation',
  'NutritionSupport'
];

export const initialReferrals: Referral[] = [
  {
    referralId: 'REF-784512',
    memberId: 'MBR-102938',
    memberName: 'Alex Taylor',
    memberDob: '1982-06-15',
    referralType: 'SpecialistVisit',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTo: 'CC-104',
    createdDate: '2026-08-01',
    dueDate: '2026-08-10',
    lastUpdated: '2026-08-06',
    notes: 'Member needs appointment with Cardiology. Referral authorized, waiting on scheduler confirmation.',
    auditHistory: [
      { timestamp: '2026-08-01T09:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Initial referral creation.' },
      { timestamp: '2026-08-02T10:30:00Z', action: 'ASSIGNED', performedBy: 'CC-104', details: 'Assigned to Sam Rivera.' },
      { timestamp: '2026-08-06T14:22:00Z', action: 'STATUS_UPDATE', performedBy: 'CC-104', details: 'Status updated from CREATED to IN_PROGRESS.' }
    ]
  },
  {
    referralId: 'REF-102938',
    memberId: 'MBR-102938',
    memberName: 'Alex Taylor',
    memberDob: '1982-06-15',
    referralType: 'Transportation',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedTo: 'CC-102',
    createdDate: '2026-08-05',
    dueDate: '2026-08-15',
    lastUpdated: '2026-08-05',
    notes: 'Coordination for specialized shuttle for medical checkup next Thursday.',
    auditHistory: [
      { timestamp: '2026-08-05T11:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Referral initialized.' },
      { timestamp: '2026-08-05T11:05:00Z', action: 'ASSIGNED', performedBy: 'System', details: 'Assigned to Taylor Morgan.' }
    ]
  },
  {
    referralId: 'REF-304958',
    memberId: 'MBR-102938',
    memberName: 'Alex Taylor',
    memberDob: '1982-06-15',
    referralType: 'SocialServices',
    priority: 'HIGH',
    status: 'CREATED',
    assignedTo: 'CC-101',
    createdDate: '2026-08-01',
    dueDate: '2026-08-07', // Overdue
    lastUpdated: '2026-08-01',
    notes: 'SDOH intervention: Food security housing support needed. High priority due to recent discharge.',
    auditHistory: [
      { timestamp: '2026-08-01T08:30:00Z', action: 'CREATED', performedBy: 'System', details: 'Created by care coordinator' }
    ]
  },
  {
    referralId: 'REF-928374',
    memberId: 'MBR-203847',
    memberName: 'Eleanor Vance',
    memberDob: '1995-11-23',
    referralType: 'BehavioralHealth',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    assignedTo: 'CC-101',
    createdDate: '2026-08-08',
    dueDate: '2026-08-11',
    lastUpdated: '2026-08-09',
    notes: 'Member requesting urgent counseling session follow-up after clinic visit. Intake completed.',
    auditHistory: [
      { timestamp: '2026-08-08T15:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Created. Flagged URGENT.' },
      { timestamp: '2026-08-09T09:15:00Z', action: 'STATUS_UPDATE', performedBy: 'CC-101', details: 'Transitioned to IN_PROGRESS.' }
    ]
  },
  {
    referralId: 'REF-546372',
    memberId: 'MBR-304756',
    memberName: 'Marcus Aurelius',
    memberDob: '1961-04-26',
    referralType: 'HomeHealth',
    priority: 'LOW',
    status: 'COMPLETED',
    assignedTo: 'CC-103',
    createdDate: '2026-07-20',
    dueDate: '2026-08-01',
    lastUpdated: '2026-07-28',
    notes: 'In-home nurse visit scheduled and completed. Member reports highly satisfied with care coordination.',
    auditHistory: [
      { timestamp: '2026-07-20T10:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Referral created.' },
      { timestamp: '2026-07-21T11:00:00Z', action: 'ASSIGNED', performedBy: 'System', details: 'Assigned to Casey Patel.' },
      { timestamp: '2026-07-28T16:00:00Z', action: 'STATUS_UPDATE', performedBy: 'CC-103', details: 'Referral marked COMPLETED.' }
    ]
  },
  {
    referralId: 'REF-382910',
    memberId: 'MBR-405665',
    memberName: 'Sienna Brooks',
    memberDob: '1989-08-09',
    referralType: 'NutritionSupport',
    priority: 'MEDIUM',
    status: 'CANCELLED',
    assignedTo: 'CC-104',
    createdDate: '2026-08-02',
    dueDate: '2026-08-12',
    lastUpdated: '2026-08-04',
    notes: 'Cancelled. Member relocated out of service area and registered with a local care unit.',
    auditHistory: [
      { timestamp: '2026-08-02T13:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Created.' },
      { timestamp: '2026-08-04T10:15:00Z', action: 'STATUS_UPDATE', performedBy: 'CC-104', details: 'Referral CANCELLED due to member relocation.' }
    ]
  },
  {
    referralId: 'REF-839201',
    memberId: 'MBR-506574',
    memberName: 'Devon Conner',
    memberDob: '1974-12-02',
    referralType: 'PhysicalTherapy',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTo: 'CC-102',
    createdDate: '2026-08-04',
    dueDate: '2026-08-08', // Overdue
    lastUpdated: '2026-08-04',
    notes: 'Outpatient PT program setup. Pending clinical authorization letter from provider office.',
    auditHistory: [
      { timestamp: '2026-08-04T09:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Referral created.' },
      { timestamp: '2026-08-04T09:30:00Z', action: 'STATUS_UPDATE', performedBy: 'CC-102', details: 'Status updated to IN_PROGRESS.' }
    ]
  },
  {
    referralId: 'REF-720192',
    memberId: 'MBR-607483',
    memberName: 'Priya Sharma',
    memberDob: '1991-03-14',
    referralType: 'LabWork',
    priority: 'MEDIUM',
    status: 'CREATED',
    assignedTo: 'CC-103',
    createdDate: '2026-08-09',
    dueDate: '2026-08-16',
    lastUpdated: '2026-08-09',
    notes: 'Blood draw panel for diabetes management tracking. Standard referral issued.',
    auditHistory: [
      { timestamp: '2026-08-09T14:45:00Z', action: 'CREATED', performedBy: 'System', details: 'Referral created.' }
    ]
  },
  {
    referralId: 'REF-492018',
    memberId: 'MBR-708392',
    memberName: 'Mateo Hernandez',
    memberDob: '2003-07-28',
    referralType: 'SpecialistVisit',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    assignedTo: 'CC-104',
    createdDate: '2026-08-03',
    dueDate: '2026-08-07', // Overdue
    lastUpdated: '2026-08-03',
    notes: 'Urgent endocrinologist referral. Coordinator has reached out to member but received no response yet.',
    auditHistory: [
      { timestamp: '2026-08-03T10:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Referral initialized.' },
      { timestamp: '2026-08-03T10:30:00Z', action: 'STATUS_UPDATE', performedBy: 'CC-104', details: 'Status updated to IN_PROGRESS.' }
    ]
  },
  {
    referralId: 'REF-110293',
    memberId: 'MBR-809201',
    memberName: 'Zoe Kravitz',
    memberDob: '1988-12-01',
    referralType: 'LabWork',
    priority: 'LOW',
    status: 'COMPLETED',
    assignedTo: 'CC-102',
    createdDate: '2026-07-25',
    dueDate: '2026-08-05',
    lastUpdated: '2026-08-04',
    notes: 'Completed. Diagnostic reports uploaded to EHR system.',
    auditHistory: [
      { timestamp: '2026-07-25T11:00:00Z', action: 'CREATED', performedBy: 'System', details: 'Referral created.' },
      { timestamp: '2026-08-04T12:00:00Z', action: 'STATUS_UPDATE', performedBy: 'CC-102', details: 'Status updated to COMPLETED.' }
    ]
  }
];

// Add extra synthetic referrals dynamically to hit ~30-40 sample records for demonstration filtering.
const referralTypes = [
  'SpecialistVisit',
  'BehavioralHealth',
  'HomeHealth',
  'LabWork',
  'PhysicalTherapy',
  'SocialServices',
  'Transportation',
  'NutritionSupport'
];
const priorities: ('LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const coordinators = ['CC-101', 'CC-102', 'CC-103', 'CC-104'];

export const generateMockReferrals = (): Referral[] => {
  const list = [...initialReferrals];
  const members = initialMembers;
  
  // Generating 30 additional entries
  for (let i = 1; i <= 32; i++) {
    const member = members[i % members.length];
    const type = referralTypes[i % referralTypes.length];
    const priority = priorities[i % priorities.length];
    const coordinator = coordinators[i % coordinators.length];
    
    // Status distribution
    let status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' = 'CREATED';
    if (i % 3 === 0) status = 'IN_PROGRESS';
    else if (i % 5 === 0) status = 'COMPLETED';
    else if (i % 7 === 0) status = 'CANCELLED';

    // Due dates relative to current (2026-08-10)
    // We want some overdue (due in past) and some active (due in future)
    let createdOffset = i % 2 === 0 ? 10 : 3;
    let dueOffset = i % 3 === 0 ? -2 : (i % 4 === 0 ? 0 : 5); // negative offset creates overdue
    
    const createdDate = new Date('2026-08-10');
    createdDate.setDate(createdDate.getDate() - createdOffset);
    
    const dueDate = new Date('2026-08-10');
    dueDate.setDate(dueDate.getDate() + dueOffset);
    
    const lastUpdated = new Date(createdDate);
    lastUpdated.setDate(lastUpdated.getDate() + Math.floor(createdOffset / 2));

    const referralId = `REF-${200000 + i * 1184}`;
    
    list.push({
      referralId,
      memberId: member.memberId,
      memberName: `${member.firstName} ${member.lastName}`,
      memberDob: member.dateOfBirth,
      referralType: type,
      priority,
      status,
      assignedTo: coordinator,
      createdDate: createdDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      lastUpdated: lastUpdated.toISOString().split('T')[0],
      notes: `Synthetic follow-up notes for ${type}. Member details checked and verified.`,
      auditHistory: [
        { timestamp: createdDate.toISOString(), action: 'CREATED', performedBy: 'System', details: 'Synthetic data creation.' },
        { timestamp: lastUpdated.toISOString(), action: 'ASSIGNED', performedBy: 'System', details: `Assigned to coordinator ${coordinator}.` }
      ]
    });
  }
  return list;
};
