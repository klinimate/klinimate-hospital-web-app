Authentication & Roles
Version: 1.0
Status: Active
Philosophy
Klinimate should provide the simplest possible authentication experience.
Users should never need to choose between multiple login portals.
One Login
↓
Role-Based Access
↓
Appropriate Dashboard
The platform automatically identifies the user's role and displays the correct workspace.
Login Flow
User enters:
Email / Mobile Number
Password
↓
Klinimate authenticates the user.
↓
Role and organization are identified.
↓
The appropriate dashboard is opened automatically.
User Workspaces
Klinimate provides six role-based workspaces.
1. Healthcare Organization Workspace
One login per healthcare organization.
Applicable to:
Hospitals
Health Systems
Rural Hospitals
Clinics
Polyclinics
Nursing Homes
Rehabilitation Centres
Home Care Providers
Day Care Centres
Advanced Elder Care Facilities
Used by:
Consultants
RMOs
Medical Officers
Nurses
Hospital Administrators (where permitted)
Responsibilities
Register Patients
Update Patient Information
Clinical Notes
Nursing Notes
Update Vitals
Add Diagnosis
Order Investigations
Prescribe Medications
Add General Advice
Attach Clinical Documents
Request Klinimate Consultation
View Specialist Advice
Transfer Patient
Discharge Patient
2. Klinimate Care Coordinator
Individual login.
Can access only assigned healthcare organizations.
Responsibilities
Review consultation requests
Verify clinical information
Coordinate communication
Assign specialists
Schedule consultations
Monitor response times
Track follow-up
Complete consultation workflow
3. Klinimate Intensivist
Individual login.
Can access only assigned organizations and assigned critical patients.
Responsibilities
Review Yellow, Red, and Black patients
Conduct virtual ICU consultations
Add clinical recommendations
Recommend escalation
Monitor patient progress
Schedule follow-up reviews
4. Klinimate Specialist
Individual login.
Can access only assigned consultations.
Examples:
Physician
Cardiologist
Neurologist
Pulmonologist
Nephrologist
Endocrinologist
Psychiatrist
Infectious Disease Specialist
Other Specialists
Responsibilities
Review patient information
Review Klinimate Intelligence
Conduct virtual consultations
Add clinical recommendations
Issue digital prescriptions (where applicable)
Plan follow-up
5. Klinimate Command Centre
Individual login.
Used by:
Command Centre Team
Senior Care Coordinators
Clinical Operations Team
Responsibilities
Monitor connected healthcare organizations
Monitor consultations
Track critical patients
View regional dashboards
Monitor specialist availability
Coordinate escalations
Operational oversight
6. Klinimate Administrator
Individual login.
Responsibilities
Organization Management
User Management
Subscription Management
Payment Management
Specialist Management
Care Coordinator Management
Platform Configuration
Analytics
Audit Logs
System Monitoring
Permission Model
Every user sees only the information required for their role.
Examples:
Healthcare Organization
Own patients only
Care Coordinator
Assigned organizations only
Intensivist
Assigned organizations
Assigned Yellow, Red and Black patients
Specialist
Assigned consultations only
Command Centre
Operational dashboards
Monitoring
No unnecessary clinical editing
Administrator
Platform administration
No routine clinical documentation
Clinical Documentation Permissions
Clinical documentation follows role-based access.
Healthcare Organization users can:
Create patient records
Update clinical notes
Update vitals
Add medications
Upload documents
Klinimate specialists can:
Add consultation notes
Add recommendations
Issue digital prescriptions (where applicable)
All notes:
Editable for 10 minutes
Permanently locked afterwards
Future changes recorded as Clinical Updates
Fully auditable
Security Principles
One secure account per authorized user or organization.
Role-based access control.
Multi-organization isolation.
End-to-end encryption of sensitive data.
Complete audit trail.
Every clinical action records:
User
Role
Date & Time
Device
Patient privacy by design.
Compliance with applicable healthcare regulations.
Future Enhancements
Two-Factor Authentication (2FA)
Biometric Login
Single Sign-On (SSO)
Organization Identity Provider Integration
Passkeys
Device Management
Session Management
Emergency Access ("Break Glass") with full audit logging
Fine-grained role customization for enterprise organizations
Guiding Principle
Authentication should never become a barrier to patient care.
Klinimate should provide simple, secure, role-based access, ensuring that every user sees the right information, at the right time, while maintaining the highest standards of security, privacy, and clinical accountability.
