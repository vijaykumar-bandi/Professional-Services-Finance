# Requirements brief — Professional Services Finance
## Profile
FirmLedger is an internal finance application for a professional services firm, covering invoicing, supplier payments, approvals, accounting, bank reconciliation, reporting and month-end close. · internal finance web app · professional services accounting and financial control · size: large · depth: thorough · money, personalData, regulated: finance, existingData, notifies
- **Has a user interface?** Yes (The specification requires a Vue application for desktop and mobile browsers with role-based finance screens.)
- **Runs locally?** Yes (FirmLedger is a web application whose Vue pages and Laravel API can be started on Windows for local development and acceptance testing with SQLite data kept on the machine.)
## The app
FirmLedger is an internal finance web application for one professional services firm, giving 25 staff controlled workflows for invoicing, supplier bills and recorded payments, approvals, accounting, bank reconciliation, reporting and month-end close. It uses Vue 3 with TypeScript, Laravel and SQLite, includes the repeatable Northline Advisory demo, and protects financial evidence through independent approvals, balanced immutable journals, audit history, restricted access, backups and tested recovery.
## Ruled out by the person
- OUT1 payroll: "Payroll" (documents) [no requirement, design, task or code for it]
- OUT2 inventory: "inventory" (documents) [no requirement, design, task or code for it]
- OUT3 multi-company consolidation: "multi-company consolidation" (documents) [no requirement, design, task or code for it]
- OUT4 foreign currency: "foreign currency" (documents) [no requirement, design, task or code for it]
- OUT5 bank payment initiation: "bank payment initiation" (documents) [no requirement, design, task or code for it]
- OUT6 statutory filing: "statutory filing" (documents) [no requirement, design, task or code for it]
## Goals and success
- G1 Give the finance team one set of books showing who owes the firm money, which suppliers must be paid and whether the accounts are ready to close. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- G2 Run client invoicing, supplier payments, approvals, bank reconciliation, financial reporting and month-end close end to end. (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- G3 Provide reproducible financial evidence through balanced journals, approvals, reports, audit history, backups and tested recovery. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- M1 On 30 April 2026, the Northline Advisory demo bank and completed reconciliation show ₹5,38,000.00 with two matches and zero difference. (₹5,38,000.00 on 30 April 2026) (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- M2 At the April 2026 reference date, receivables are ₹50,000.00, payables are ₹22,000.00, net profit is ₹60,000.00 and favourable budget variance is ₹10,000.00. (All stated April figures agree across summaries, exports and journals on 30 April 2026) (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- M3 With 10 active users and 100,000 journal lines, indexed lists achieve p95 below 2 seconds and approvals and postings achieve p95 below 3 seconds. (p95 under 2 seconds for indexed lists and under 3 seconds for approvals and postings during the capacity test) (doc:FirmLedger-Company-Finance-Production-Specification.docx)
## Roles
- R1 Maintains draft customers, suppliers, invoices, bills, settlements, journals, budgets and bank matches, then submits work for review. — Finance preparer (12) [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, Q13, assumption)
- R2 Reviews submitted work, approves within policy, reviews reconciliations and requests close or reopen. — Finance manager (6) [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, Q13, assumption)
- R3 Provides second approval for large supplier payments, approves close or reopen and reads firm-wide reports. — Finance director (2) [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, Q13, assumption)
- R4 Reads posted documents, approvals, journals, reconciliations and audit records, and exports permitted reports. — Auditor (3) [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, Q13, assumption)
- R5 Provisions and deactivates users, enforces MFA, deploys, backs up and recovers the service without financial approval or business-report access. — System administrator (2) [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, Q13, assumption)
- R6 Receives invoices and is affected by receipt allocation and account balances but never signs in. — Client [never signs in to the app] (Q14)
- R7 Provides bills and is affected by approval and payment recording but never signs in. — Supplier [never signs in to the app] (Q14)
## Permissions
- R1 Finance preparer may create and change draft financial documents, budgets, bank imports and reconciliations, submit financial documents and reconciliations for review; may not approve an item (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- R2 Finance manager may create and submit financial documents, approve or return submitted financial documents and budgets, finalize a bank reconciliation, request close or reopen of a fiscal period; may not approve an item prepared by the same person (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- R3 Finance director may give the required second approval for a large supplier payment or its reversal, approve close or reopen of a fiscal period, read firm-wide financial reports; may not approve an item prepared by the same person (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- R4 Auditor may read posted documents, journals, approvals, reconciliations and audit events, export permitted financial reports; may not create, change, approve or post financial records (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- R5 System administrator may provision and deactivate user accounts and manage role assignments, manage MFA recovery, backups, recovery, deployment and monitoring; may not approve financial records or read business reports (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
## Business events
- EV1 The firm needs to invoice a client for completed services. [assumed] (assumption)
- EV2 A client receipt appears in the bank and must be allocated to posted invoices. [assumed] (assumption)
- EV3 The firm receives a supplier bill with supporting evidence. [assumed] (assumption)
- EV4 Money paid through the bank must be recorded and allocated to approved supplier bills. [assumed] (assumption)
- EV5 An invoice, bill, payment, journal, budget or close request is submitted for review. [assumed] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- EV6 A bank statement becomes available for an account and statement period. [assumed] (assumption)
- EV7 Month end is reached and the open fiscal period must be checked and closed. [assumed, high impact] (assumption)
- EV8 An approved correction is required for a closed period, causing a reopen request. [assumed, high impact] (assumption)
- EV9 A backup fails, posting fails, database lock handling is exhausted or audit delivery has a gap. [assumed] (assumption)
- EV10 A business record reaches the end of its approved retention period and requires an administrator's deletion decision. [assumed, high impact] (assumption)
## Workflows
### W1 Issue and settle a client invoice (release 1) — actors: R1 Finance preparer, R2 Finance manager; trigger: The firm needs to bill a client for services.; outcome: The invoice and any receipt are posted, journal-linked and reflected in receivables and ageing.; how often: Assume 100 client invoices and 120 receipt allocations per month at initial use.; module: Client billing [assumed] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
1. The preparer creates a draft invoice with client, dates and coded lines.
2. The app validates dates, amounts, tax, departments and the positive total.
3. The preparer submits the invoice for review.
4. An independent manager approves or returns it with a reason.
5. On final approval, the app assigns the next fiscal-year invoice number and posts the balanced journal.
6. The preparer records a bank receipt and allocates it to posted invoices for the same client.
7. Approval posts the receipt and updates each invoice's settlement status.
- A failed post consumes no invoice number.
- An allocation exceeding the receipt or outstanding balance is rejected.
- Posted invoice lines cannot be edited.
### W2 Approve a supplier bill and record payment (release 1) — actors: R1 Finance preparer, R2 Finance manager, R3 Finance director; trigger: The firm receives a supplier bill or records money paid through its bank.; outcome: The approved bill and payment are posted and the payable balance is updated.; how often: Assume 150 supplier bills and 100 recorded supplier payments per month at initial use.; module: Supplier payments [assumed] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
1. The preparer enters the supplier bill, reference, dates, coded lines and supporting file.
2. The app checks for a duplicate supplier reference and verifies that the supporting file is clean.
3. The preparer submits the bill.
4. An independent manager reviews the bill, file, coding and validation results.
5. Approval posts the bill and its balanced journal.
6. The preparer records an externally executed bank payment and allocates it to approved bills for that supplier.
7. A manager approves the payment, with a different director also approving when it is at least ₹1,00,000.00.
8. The last required approval rechecks balances and posts the bank and payable entries.
- Duplicate supplier references are rejected.
- A quarantined or failed supporting file blocks submission.
- The app never sends the payment instruction to the bank.
- Self-approval is denied.
### W3 Reconcile a bank statement (release 1) — actors: R1 Finance preparer, R2 Finance manager; trigger: A UTF-8 bank statement is available for an account and statement period.; outcome: The bank account has a completed, signed reconciliation with a zero explained difference.; how often: Assume one statement and completed reconciliation per active bank account each month.; module: Bank reconciliation [assumed] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
1. The preparer imports the statement and previews row-specific errors.
2. The app checks that opening balance plus movements equals closing balance and prevents duplicate imports.
3. The app suggests one-to-one matches when amount and direction agree.
4. The preparer confirms each match and explains every outstanding book item.
5. The app calculates the adjusted statement balance and prevents reuse of either side of a match.
6. A manager finalizes the reconciliation when balances agree, all rows are resolved and prior statements are continuous.
7. The app stores the signed reconciliation and outstanding list.
- Duplicate statement rows are not created on reimport.
- A nonzero difference blocks finalization.
- Fees and interest require approved journals.
### W4 Close or reopen a fiscal period (release 1) — actors: R1 Finance preparer, R2 Finance manager, R3 Finance director; trigger: The firm reaches month end or needs to correct a closed period.; outcome: The period is locked with reproducible reports, or reopened and later reclosed with versioned history.; how often: Once per month for normal close, with reopening used only for an approved correction.; module: Month-end close [assumed, high impact] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
1. Finance staff run the trial balance and receivables and payables control checks.
2. They resolve or redate pending postings and finalize each active bank reconciliation.
3. The manager reviews exceptions, journals, budget variance and period reports.
4. The manager requests close.
5. The director confirms the request.
6. The app rechecks prerequisites, locks the period and stores report snapshots and both identities in one transaction.
7. For a reopen, the manager supplies a reason and a director independently approves it.
8. The app preserves prior snapshots and close history and creates a new close version after corrections.
- Writes into a closed date are rejected.
- Missing or incomplete reconciliations block close.
- Affected reconciliations are invalidated when necessary after reopen.
## Records
- E1 Financial document: Invoices, bills, receipts, payments, manual journals, reversals and budgets retain their revisions, approvals and source links.. fields: document type, party, document date, due date, currency, lines, tax breakdown, total in paise, revision, approval status, settlement status, source reference; states: Draft → Submitted → Returned → Approved and posted → Part paid → Paid → Reversed; owner: Finance team; how many: Assume about 5,000 financial documents in year 1 and 15,000 cumulative by year 3. [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
- E2 Journal: Every posted item has one immutable, exactly balanced journal recorded in integer paise.. fields: permanent journal ID, source document, business date, fiscal period, approvers, department, debit lines, credit lines, request ID; states: Posted → Reversed; owner: PHP posting service; how many: Capacity is 100,000 journal lines, with about 12,000 lines expected in year 1 and 40,000 cumulative by year 3. [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
- E3 Bank statement: A statement contains dated signed INR movements with references and descriptions and can be imported only once.. fields: bank account, statement period, opening balance, closing balance, statement rows, content identity; states: Previewed → Imported → Resolved → Reconciled; owner: Finance team; how many: Assume 12 statements per active bank account each year and no more than 500 rows in a normal statement. [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
- E4 Bank reconciliation: The reconciliation proves the adjusted statement balance agrees with the book closing balance.. fields: bank account, statement, book closing balance, adjusted statement balance, matches, outstanding explanations, preparer, manager, signed result; states: In progress → Ready for review → Finalized → Invalidated; owner: Finance team; how many: Assume one reconciliation per bank account per month, plus a new version when an approved reopen invalidates one. [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
- E5 Fiscal period: Closed periods retain reproducible snapshots and reject later writes into their dates.. fields: start date, end date, status, close version, close request, close approvals, report snapshots, reopen history; states: Open → Close requested → Closed → Reopen requested → Reopened → Reclosed; owner: Finance director; how many: Twelve regular fiscal periods are created each fiscal year, with additional close versions only after approved reopening. [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
- E6 Audit event: Audit events are append-only and cannot be updated or deleted through the application.. fields: actor, role, event, target, revision, request ID, UTC timestamp, redacted before values, redacted after values; states: Appended → Forwarded; owner: System; how many: Assume up to 250,000 audit events in year 1 and 750,000 cumulative by year 3. [assumed, high impact] (doc:FirmLedger-Company-Finance-Production-Specification.docx, assumption)
## Rules
- BR1 The person who prepared an item may never approve the same item.. Applies: A Finance manager reviewing an invoice prepared by another user may approve it.. Does not apply: A Finance manager who prepared the item may not approve it. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- BR2 A supplier payment or its reversal for ₹1,00,000.00 or more needs manager approval and a separate Finance director approval.. Applies: A ₹1,00,000.00 supplier payment requires both approvals.. Does not apply: A ₹99,999.99 supplier payment requires the manager approval but not the director approval. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- BR3 Every posted journal must balance exactly in integer paise before the transaction commits.. Applies: A journal with equal debit and credit totals may post.. Does not apply: A journal with a one-paisa difference must not post. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- BR4 Posted financial lines are immutable and corrections use an approved linked reversal in an open period.. Applies: An incorrect posted bill is corrected through an approved opposite journal with a reason.. Does not apply: A posted bill line cannot be edited or deleted in place. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- BR5 A repeated supplier plus trimmed, case-insensitive invoice reference is rejected.. Applies: References 'INV-10' and ' inv-10 ' for the same supplier are duplicates.. Does not apply: The same reference used by two different suppliers is not rejected by this rule. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- BR6 A bill can be submitted only with a clean PDF, JPEG or PNG supporting file no larger than 10 MB.. Applies: A verified clean 2 MB PDF allows bill submission.. Does not apply: A quarantined file or an 11 MB image blocks submission. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- BR7 Reimporting the same bank statement or loading the demo twice creates no duplicates and preserves existing work.. Applies: Repeating the same demo seed keeps user changes and the existing seeded records.. Does not apply: A genuinely different statement may create new statement rows. (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
## Quality targets
- N1 [scale] Support the initial deployment target of 25 named staff, ten concurrent users and 100,000 journal lines on the target host.: 25 named staff, 10 concurrent users and 100,000 journal lines (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- N2 [performance] Indexed lists must respond with p95 below 2 seconds under the declared capacity test.: less than 2 seconds p95 (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- N3 [performance] Approval and posting actions must respond with p95 below 3 seconds under the declared capacity test.: less than 3 seconds p95 (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- N4 [availability] Recovery must lose at most 15 minutes of data and restore service within 2 hours.: 15-minute maximum data loss and 2-hour restoration (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- N5 [availability] Create encrypted off-host recovery points at least every 10 minutes and retain daily copies for 35 days as the initial policy.: backup every 10 minutes and daily retention for 35 days (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- N6 [access_i18n] The production application must meet WCAG 2.2 AA.: WCAG 2.2 AA accessibility standard (Q5)
## Notifications
- NT1 Reviewers receive mandatory email and an in-app work-queue item when an invoice, bill, payment, journal, budget or close request is submitted; approval email cannot be turned off. [assumed] (Q4, Q12, assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- NT2 System administrators and the release owner receive email alerts when a backup fails, posting fails, database lock handling is exhausted or audit delivery has a gap; these operational alerts cannot be turned off. [assumed] (Q6, assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
## Reports
- RP1 Trial balance showing opening, movement and closing debit and credit by account, with journal drill-down and CSV export. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- RP2 Profit and loss for an inclusive date range, using posted income and expense and linking each summary figure to journals. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- RP3 Balance sheet as of a chosen date, with drill-down to source journals and reproducible closed-period snapshots. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- RP4 Receivables and payables ageing as of a chosen date, reconstructed from documents, settlements and reversals in current, 1–30, 31–60, 61–90 and over-90-day buckets. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- RP5 Budget variance by department, expense account and calendar month, showing approved budget minus posted net expense actuals. (doc:FirmLedger-Company-Finance-Production-Specification.docx)
## Scope and constraints
- S1 The first release includes internal accounting, client invoicing, supplier payments, approvals, bank reconciliation, reporting and month-end close. (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- S3 Use Vue 3 with TypeScript, Vue Router and Vite for the frontend, PHP 8.4 with Laravel 13 for the API, and SQLite on local disk for persistent storage. [constraint] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- S4 Production uses a dedicated Linux host with Nginx, PHP-FPM, TLS, local SSD storage and access restricted to the firm's network or VPN. [constraint] (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- S5 The application serves one legal entity, uses INR, follows an April–March fiscal year, uses Asia/Kolkata business dates and records audit timestamps in UTC. [constraint] (doc:FirmLedger-Company-Finance-Production-Specification.docx)
## Decisions
- **Stack:** Vue 3 with TypeScript, PHP with Laravel and SQLite (as the user's description or documents say, description: "Use Vue 3 with TypeScript for the frontend, PHP with Laravel for the backend, and SQLite for persistent storage.") (Q1)
- **Deploy target:** a dedicated Linux host (as the user's description or documents say, FirmLedger-Company-Finance-Production-Specification.docx: "Production uses a dedicated Linux host") (Q2)
## Assumptions
- A1 The 25 named staff are divided into 12 Finance preparers, 6 Finance managers, 2 Finance directors, 3 Auditors and 2 System administrators. — This gives enough independent reviewers and administrators while keeping most accounts with the staff who prepare daily finance work.; high impact [assumed] (assumption, Q13)
- A2 Finance staff who rely on spreadsheets or direct corrections could lose flexibility, while clients and suppliers could be delayed if stricter validation or approvals hold up invoices and recorded payments. — The main change is replacing flexible manual work with enforced validation, independent approval and locked posted records.; high impact [assumed] (assumption, Q15)
## Risks
- K1 Finance staff who currently rely on spreadsheets or direct corrections may lose flexibility when validation, independent approval and immutable posting are enforced. [assumed, high impact] (Q15, assumption)
- K2 Clients or suppliers may experience delays when incomplete information, validation failures or pending approvals hold up invoices or the recording of payments. [assumed, high impact] (Q15, assumption)
- K3 Incorrect opening balances, tax settings or invoice rules could make every later report unreliable, so launch depends on controller sign-off and reconciliation. [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- K4 Concurrent posting could exhaust SQLite write locks and interrupt approvals or month-end work unless transactions remain short and retryable failures are handled clearly. [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- K5 A posting, allocation or reconciliation defect could produce mismatched reports or an incorrect close while appearing complete. [assumed, high impact] (assumption)
- K6 Failed backups or an untested restore could exceed the allowed data loss or restoration time during an outage. [assumed, high impact] (assumption)
- K7 Incorrect permissions, weak account recovery or exposed supporting evidence could reveal confidential finance and personal data or allow an unauthorised approval. [assumed, high impact] (assumption)
- K8 Demo data could contaminate live company records unless production refuses demo seeding and demo resets remain isolated and explicit. [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
## Other facts
- F1 The initial deployment target is 25 named staff and ten concurrent users. [stakeholders] (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F2 Windows supports local development and acceptance testing, while the reference production deployment uses Linux. [hosting] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F3 Every production account uses an individual sign-in, server-managed session cookies and time-based one-time-code MFA. [security] (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F4 Supporting uploads are private PDF, JPEG or PNG files up to 10 MB, stored outside the web root and scanned before release. [files] (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F5 Acceptance tests A01–A08 must be run against the working application with actual passed, failed or blocked results and evidence. [release] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F6 Launch is blocked by financial mismatches, failed recovery, unresolved critical or high security defects, or failed mandatory tests. [release] (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F7 The Northline Advisory demo contains five posted April events, two unposted May documents, five role accounts, two statement lines and an approved ₹50,000.00 Consulting budget. [demo] (description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F8 Only opening balances and master data will be moved into FirmLedger. [migration] (Q3)
- F9 Business records and attachments are kept after their approved retention period until an administrator approves deletion. [privacy] (Q7)
- F10 No existing finance product is a useful reference for FirmLedger. [similar] (Q8)
- F11 For the most recent month-end close, the finance team collected invoices, bills, receipts and bank information; updated the current accounting tools; resolved pending approvals and missing information; compared bank activity with accounting records; ran trial balance and receivables and payables checks; corrected differences; prepared reports; obtained final review; and marked the month complete. [current] (Q9)
- F12 The current accounting system holds the ledger, spreadsheets track supporting checks, bank statements come from the bank portal, and supporting documents are kept in shared folders. [current] [assumed] (Q10)
- F13 The main month-end delay is finding missing information and checking that figures agree across the ledger, bank records and supporting documents. [current] [assumed] (Q11)
- F14 Administrators can provision or deactivate users, assign one role per user, enforce or recover MFA, maintain the legal entity, registered address, departments, fiscal calendar, bank accounts, tax configuration, invoice numbering and retention settings without a developer. [admin] [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F15 All administration settings apply to the one firm; departments may be maintained separately, but there are no customer-specific settings. [admin] [assumed] (assumption)
- F16 FirmLedger is an internal application and does not charge users, issue commercial refunds or collect payment-card details. [money] [assumed, high impact] (assumption, description)
- F17 Client invoices, supplier bills, receipts, payments, journals, budgets and reports use INR amounts stored in integer paise. [money] [assumed, high impact] (assumption)
- F18 Tax treatment, rates, invoice fields, numbering and local reporting obligations are configurable only after the firm's accountant approves them before real invoices are used. [money] [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F19 The application holds names, business contact details, postal addresses, tax identifiers, user account details, roles, MFA recovery information and the identities attached to approvals and audit events. [privacy] [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F20 Users and business operations are assumed to be in India, with privacy handling governed by applicable Indian data-protection and financial recordkeeping requirements. [privacy] [assumed, high impact] (assumption)
- F21 Financial records, approvals, supporting evidence and audit events are retained for eight financial years unless the firm's approved policy requires longer; backup copies expire under the documented 35-day policy. [privacy] [assumed, high impact] (assumption)
- F22 A deletion request is reviewed by an administrator, who removes eligible personal data while retaining required financial and audit evidence with access restricted to authorised roles. [privacy] [assumed, high impact] (assumption)
- F23 Employee account data is processed to operate and secure the finance service, while client and supplier contact data is processed to administer the firm's business records; no optional consent is assumed for these required uses. [privacy] [assumed, high impact] (assumption, description)
- F24 The application language is English, uses left-to-right text, formats business dates in Asia/Kolkata and displays INR amounts using Indian digit grouping. [access_i18n] [assumed] (assumption)
- F25 Staff use the centrally hosted application in desktop and mobile browsers, including while reviewing or resolving finance work away from their usual desk. [devices] [assumed] (assumption, description, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F26 A network connection is required; when the service cannot be reached, no finance records are created or changed and the user is told to retry after connectivity returns. [devices] [assumed, high impact] (assumption, description)
- F27 Support can inspect service health, release ID, application and HTTP errors, posting failures, database lock waits, backup status, disk capacity and audit-delivery status without reading unauthorised financial reports. [operations] [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F28 Support staff do not sign in as another user or approve work on a user's behalf; they diagnose faults from logs and audit evidence, while account recovery follows the documented identity check. [operations] [assumed, high impact] (assumption)
- F29 Opening balances and master data will be imported from controlled CSV extracts from the current accounting system, with supporting checks from the existing spreadsheets. [migration] [assumed, high impact] (Q3, assumption)
- F30 Plan for up to 5,000 client, supplier, account, department, bank-account and opening-balance rows in the initial migration. [migration] [assumed, high impact] (assumption, Q3)
- F31 The migration cutover occurs on the approved production go-live date after controller sign-off, a recovery point, paused writes, migration rehearsal and smoke checks. [migration] [assumed, high impact] (assumption, doc:FirmLedger-Company-Finance-Production-Specification.docx)
- F32 After cutover, FirmLedger is the system of record; the previous accounting system remains read-only for 30 days for comparison and is not used for new entries. [migration] [assumed, high impact] (assumption, Q3)
## Out of scope and later releases
- S2 Payroll, inventory, multi-company consolidation, foreign currency, bank payment initiation and statutory filing are separate projects. [out of scope] (doc:FirmLedger-Company-Finance-Production-Specification.docx)
- Scope and constraints: not relevant, the user's description or documents say so [out of scope]
## The interview
- Q3 [migration · owner] What existing customer, supplier, invoice, bill, journal and opening-balance data must be moved into FirmLedger? → Opening balances and master data only
- Q4 [notifications · owner] How should reviewers learn that an invoice, bill, payment, journal or close request is waiting? → Email plus an in-app work queue
- Q5 [access_i18n · owner] What accessibility target should the production application meet? → WCAG 2.2 AA
- Q6 [operations · owner] Who should receive alerts about failed backups, posting failures, lock exhaustion or audit-delivery gaps? → System administrators and the release owner
- Q7 [privacy · owner] What should happen to business records and attachments when their approved retention period ends? → Keep them until an administrator approves deletion
- Q8 [similar · owner] Which existing finance product is closest to the working practices FirmLedger should copy or avoid? → No existing product is a useful reference
- Q9 [current · role:R1] Walk me through how the finance team completed the most recent month-end close using today’s tools. → 1. Collect invoices, bills, receipts and bank information. 2. Enter or update the records in the current accounting tools. 3. Review pending approvals and resolve missing information. 4. Compare bank activity with the accounting records. 5. Run the trial balance and receivables and payables checks. 6. Correct differences and prepare the month-end reports. 7. Obtain final review and mark the month as complete.
- Q10 [current · role:R1] Where were the records used for that month-end close kept? → The accounting system held the ledger, spreadsheets tracked supporting checks, bank statements came from the bank portal, and supporting documents were kept in shared folders. (Greenfield's draft, sent unchanged)
- Q11 [current · role:R1] What caused the most delay or rework during that month-end close? → The main delay was finding missing information and checking that figures agreed across the ledger, bank records and supporting documents. (Greenfield's draft, sent unchanged)
- Q12 [notifications · role:R2] May a reviewer turn off approval emails while continuing to receive every item in the in-app work queue? → Email is mandatory
- Q13 [stakeholders · negative] How are the 25 named staff divided among the five application roles? → Decide for me (settled: The 25 named staff are divided into 12 Finance preparers, 6 Finance managers, 2 Finance directors, 3 Auditors and 2 System administrators.)
- Q14 [stakeholders · negative] Who is affected by FirmLedger’s finance work but will never sign in? → Clients and suppliers are affected by invoices and payments but do not sign in.
- Q15 [stakeholders · negative] Who could be worse off when FirmLedger replaces the current accounting tools, spreadsheets and shared folders? → Decide for me (settled: Finance staff who rely on spreadsheets or direct corrections could lose flexibility, while clients and suppliers could be delayed if stricter validation or approvals hold up invoices and recorded payments.)
