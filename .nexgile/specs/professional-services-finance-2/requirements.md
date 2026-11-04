# Requirements: FirmLedger

## Requirement 1: Sign in and role-based access

**User Story:** As a staff member, I want to sign in securely and see only the work allowed for my role, so that FirmLedger protects financial records and separates duties.

_Source: BR1, N6_

### Acceptance Criteria

1. WHEN a signed-out user opens `/` THE SYSTEM SHALL show the sign-in screen.
2. WHEN a Finance preparer signs in with a password and time-based one-time code THE SYSTEM SHALL open the Finance preparer work queue.
3. WHEN a Finance manager signs in with a password and time-based one-time code THE SYSTEM SHALL open the Finance manager approval work queue.
4. WHEN a Finance director signs in with a password and time-based one-time code THE SYSTEM SHALL open the Finance director approval and firm-wide reporting screen.
5. WHEN an Auditor signs in with a password and time-based one-time code THE SYSTEM SHALL open the read-only posted records and audit search screen.
6. WHEN a System administrator signs in with a password and time-based one-time code THE SYSTEM SHALL open the user and service administration screen without business reports or financial approval actions.
7. IF a user requests an API action, export or attachment outside the permissions of the user's role THEN THE SYSTEM SHALL return a forbidden response without disclosing the protected content.
8. IF the person who prepared an item attempts to approve that item THEN THE SYSTEM SHALL deny the decision.
9. WHEN a user signs out or is deactivated THE SYSTEM SHALL revoke that user's active sessions.
10. THE SYSTEM SHALL present every production screen and keyboard-operated workflow in conformance with WCAG 2.2 AA.

## Requirement 2: Manage finance configuration and master data

**User Story:** As a Finance preparer, I want controlled finance configuration and master data, so that documents and reports use consistent accounts, departments, parties and dates.

_Source: W1, W2_

### Acceptance Criteria

1. WHEN an authorised user maintains the legal entity, registered address, departments, April–March fiscal calendar, operating bank accounts, tax codes or invoice numbering THE SYSTEM SHALL record the change in the audit history.
2. WHEN a Finance preparer maintains a client or Supplier THE SYSTEM SHALL require its legal name, address, reference ID and payment terms and allow a tax ID where applicable.
3. WHEN an authorised user archives master data referenced by a posted document THE SYSTEM SHALL preserve the values captured on that posted document.
4. WHEN an authorised user maintains an account or department THE SYSTEM SHALL enforce a unique normalised code.
5. THE SYSTEM SHALL display business dates in Asia/Kolkata and INR amounts with Indian digit grouping while recording audit timestamps in UTC.

## Requirement 3: Issue and settle a client invoice

**User Story:** As a Finance preparer, I want to issue a client invoice and allocate a receipt, so that receivables and settlement status remain traceable to the journals.

_Source: W1, BR1, BR3, BR4_

### Acceptance Criteria

1. WHEN a Finance preparer creates a draft invoice THE SYSTEM SHALL require a Client, document date, due date on or after the document date and at least one line containing description, quantity to three decimals, unit rate, account, department and tax code.
2. WHEN the invoice total is calculated THE SYSTEM SHALL round each line's net and tax half-up to integer paise and reject a total that is zero or negative.
3. WHEN a Finance preparer submits an invoice THE SYSTEM SHALL make that revision read-only and add it to an independent Finance manager's in-app work queue and mandatory approval email.
4. WHEN an independent Finance manager returns an invoice with a reason THE SYSTEM SHALL allow the Finance preparer to create a new revision without carrying forward the earlier approval.
5. WHEN an independent Finance manager approves an invoice THE SYSTEM SHALL atomically assign the next sequential fiscal-year invoice number and post one exactly balanced journal linked to the invoice, business date, fiscal period and approver.
6. IF invoice posting fails THEN THE SYSTEM SHALL preserve the next sequential fiscal-year invoice number for the next successful post.
7. WHEN a user opens a posted invoice THE SYSTEM SHALL show a print-ready invoice with the original firm, Client, issue date, due date, lines, tax breakdown, total, reference and invoice number.
8. WHEN a Finance preparer records a receipt THE SYSTEM SHALL require a bank account, date and reference and allocations whose total equals the receipt amount across posted invoices for the same Client without exceeding any outstanding balance.
9. WHEN an independent Finance manager approves a valid receipt THE SYSTEM SHALL post the bank and receivables journal and show each affected invoice as Open, Part paid or Paid separately from its approval status.
10. IF a user attempts to edit or delete a posted invoice line THEN THE SYSTEM SHALL reject the change and direct the user to an approved linked reversal in an open period.

## Requirement 4: Approve a supplier bill and record payment

**User Story:** As a Finance preparer, I want to capture a Supplier bill and record money paid through the bank, so that the payable balance is independently approved and accurately posted.

_Source: W2, BR1, BR2, BR3, BR4, BR5, BR6_

### Acceptance Criteria

1. WHEN a Finance preparer creates a draft bill THE SYSTEM SHALL require a Supplier, Supplier document reference, document date, due date on or after the document date and at least one coded line with a positive total.
2. IF the same Supplier already has the trimmed case-insensitive Supplier document reference THEN THE SYSTEM SHALL reject the duplicate bill.
3. WHEN a Finance preparer attaches evidence to a bill THE SYSTEM SHALL accept only a signature-verified PDF, JPEG or PNG file no larger than 10 MB and keep it private while scanning is pending.
4. IF a bill's supporting file is missing, quarantined or fails its scan THEN THE SYSTEM SHALL block submission.
5. WHEN a Finance preparer submits a valid bill THE SYSTEM SHALL make that revision read-only and add the bill, supporting file, coding and validation results to an independent Finance manager's work queue and mandatory approval email.
6. WHEN an independent Finance manager approves a bill THE SYSTEM SHALL atomically post one exactly balanced expense, tax and payables journal linked to the bill and approval.
7. WHEN a Finance preparer records a payment THE SYSTEM SHALL require a bank reference, bank account, payment date and allocations to approved bills for the same Supplier without exceeding the payment or unpaid balances.
8. WHEN an independent Finance manager approves a payment below ₹1,00,000.00 THE SYSTEM SHALL recheck unpaid balances and atomically post the bank and payables journal.
9. WHEN an independent Finance manager approves a payment of at least ₹1,00,000.00 THE SYSTEM SHALL keep it pending until a different Finance director approves and the last approval atomically posts the bank and payables journal.
10. WHEN a payment or bill is reversed THE SYSTEM SHALL require an approved linked opposite journal with a reason and open-period date and restore any settlement allocation no more than once.

## Requirement 5: Prepare journals and budgets

**User Story:** As a Finance preparer, I want to submit manual journals, reversals and monthly budgets for independent approval, so that financial controls apply consistently to adjustments and plans.

_Source: BR1, BR2, BR3, BR4_

### Acceptance Criteria

1. WHEN a Finance preparer submits a manual journal THE SYSTEM SHALL require an open-period business date and debit and credit lines whose integer-paise totals are exactly equal.
2. IF a journal has a debit and credit difference of one paisa or more THEN THE SYSTEM SHALL reject posting.
3. WHEN an independent Finance manager approves a valid manual journal THE SYSTEM SHALL post it with a permanent journal ID, source, business date, fiscal period, department and approver.
4. WHEN a Finance preparer submits a reversal THE SYSTEM SHALL require a mandatory reason and a link to the original posted journal.
5. WHEN the last required independent approver approves a reversal THE SYSTEM SHALL post an opposite journal in an open period without changing the original journal.
6. WHEN a Finance preparer submits a monthly budget THE SYSTEM SHALL require one amount for a department, expense account and calendar month.
7. WHEN an independent Finance manager approves a budget THE SYSTEM SHALL make it the active budget for that department, expense account and calendar month without creating a journal.

## Requirement 6: Reconcile a bank statement

**User Story:** As a Finance preparer, I want to import and match a bank statement for Finance manager review, so that the signed reconciliation proves the bank and books agree.

_Source: W3, BR3, BR7_

### Acceptance Criteria

1. WHEN a Finance preparer selects a UTF-8 statement THE SYSTEM SHALL preview row-numbered errors for its bank account, statement period, opening balance, closing balance and rows containing date, signed INR amount, reference and description before import.
2. IF the opening balance plus signed movements does not equal the closing balance THEN THE SYSTEM SHALL reject the statement import.
3. WHEN the same statement is imported again THE SYSTEM SHALL preserve existing matches and create no duplicate statement rows.
4. WHEN an imported row and a book movement have the same amount and direction THE SYSTEM SHALL suggest a one-to-one match identifying both sides and using reference and the configured date window as hints.
5. IF either side of a confirmed match is already used in another match THEN THE SYSTEM SHALL reject the duplicate match.
6. WHEN a Finance preparer reviews the reconciliation THE SYSTEM SHALL distinguish matched and outstanding items and require an explanation for every outstanding book item.
7. WHEN the reconciliation is calculated THE SYSTEM SHALL show adjusted statement balance as statement closing plus deposits in transit minus outstanding payments and show the difference from book closing.
8. IF the difference is nonzero, an imported row is unresolved or a prior statement is discontinuous THEN THE SYSTEM SHALL block finalization.
9. WHEN a Finance manager finalizes a zero-difference reconciliation THE SYSTEM SHALL store the signed reconciliation, preparer, manager, confirmed matches and outstanding list.
10. WHEN a statement row represents a fee or interest THE SYSTEM SHALL require its book movement to come from an approved journal before matching.

## Requirement 7: Run financial reports and exports

**User Story:** As a Finance director, I want reproducible financial reports with journal drill-down, so that I can verify the firm's position and performance.

_Source: W4, N1, N2_

### Acceptance Criteria

1. WHEN a user runs the trial balance THE SYSTEM SHALL show opening, movement and closing debit and credit by account with drill-down to source journals.
2. WHEN a user runs profit and loss for an inclusive date range THE SYSTEM SHALL show posted income less posted expense with each summary figure linked to source journals.
3. WHEN a user runs the balance sheet as of a chosen date THE SYSTEM SHALL show assets, liabilities and equity with each summary figure linked to source journals.
4. WHEN a user runs receivables or payables ageing as of a chosen date THE SYSTEM SHALL reconstruct documents, settlements and reversals into current, 1–30, 31–60, 61–90 and over-90-day past-due buckets.
5. WHEN a user runs budget variance THE SYSTEM SHALL show approved budget minus posted net expense actual by department, expense account and calendar month.
6. WHEN an authorised user exports a filtered report THE SYSTEM SHALL export every filtered row across all pages as correctly quoted CSV with formula-leading user text neutralised.
7. WHEN a user opens a report THE SYSTEM SHALL show its date basis and any closed-period close version.
8. WHILE operating with 10 active users and 100,000 journal lines, WHEN an indexed list is requested THE SYSTEM SHALL return the response with p95 below 2 seconds during the declared capacity test.
9. THE SYSTEM SHALL support 25 named staff, 10 concurrent users and 100,000 journal lines on the target host.

## Requirement 8: Close and reopen a fiscal period

**User Story:** As a Finance manager, I want to request close and reopen with Finance director approval, so that each completed period is locked and reproducible while authorised corrections retain history.

_Source: W4, BR1, BR3, BR4, N3_

### Acceptance Criteria

1. WHEN finance staff prepare a period for close THE SYSTEM SHALL show trial balance, receivables and payables control checks, pending postings, active bank reconciliations, exceptions, supporting journals, budget variance and period reports.
2. IF a pending posting is unresolved or not redated or an active bank account lacks a finalized continuous reconciliation THEN THE SYSTEM SHALL block a close request.
3. WHEN a Finance manager requests close THE SYSTEM SHALL record the request and add it to a different Finance director's work queue and mandatory approval email.
4. WHEN a Finance director approves close THE SYSTEM SHALL atomically recheck prerequisites, lock the period, store report snapshots and record the Finance manager and Finance director identities.
5. IF a user attempts a write with a business date in a closed period THEN THE SYSTEM SHALL reject the write.
6. WHEN a Finance manager requests reopen THE SYSTEM SHALL require a reason and add the request to a different Finance director's work queue and mandatory approval email.
7. WHEN a different Finance director approves reopen THE SYSTEM SHALL preserve prior snapshots and close history and invalidate affected reconciliations where necessary.
8. WHEN a reopened period is closed again THE SYSTEM SHALL create a new close version while keeping each earlier closed snapshot reproducible.
9. WHILE operating with 10 active users and 100,000 journal lines, WHEN an approval or posting action is performed THE SYSTEM SHALL return the response with p95 below 3 seconds during the declared capacity test.

## Requirement 9: Search audit and financial evidence

**User Story:** As an Auditor, I want searchable, append-only evidence for financial decisions, so that I can trace a reported amount to its source and approvals.

_Source: BR3, BR4_

### Acceptance Criteria

1. WHEN master data, a role, an approval, a posting, a reversal, a period lock, a sensitive export or a restore changes state THE SYSTEM SHALL append an audit event containing actor, role, event, target, revision, request ID and UTC timestamp.
2. WHEN an audited value changes THE SYSTEM SHALL store redacted before and after values without passwords, MFA secrets, full bank details or file contents.
3. IF a user attempts to update or delete an audit event through the application THEN THE SYSTEM SHALL deny the operation.
4. WHEN an Auditor searches by invoice number THE SYSTEM SHALL show the linked journal, approval decisions, reversals and report evidence permitted to the Auditor.
5. WHEN an authorised user opens a posted financial record THE SYSTEM SHALL show its immutable source link, permanent journal ID, business date, fiscal period and approvers.
6. WHEN audit forwarding has a delivery gap THE SYSTEM SHALL send a mandatory email alert to System administrators and the release owner.

## Requirement 10: Administer users, privacy and service status

**User Story:** As a System administrator, I want to administer accounts and inspect service status without finance authority, so that the service remains secure and supportable.

_Source: N6_

### Acceptance Criteria

1. WHEN a System administrator provisions a user THE SYSTEM SHALL assign one of the five application roles and require an individual sign-in.
2. WHEN five failed sign-in attempts occur for one account within 15 minutes THE SYSTEM SHALL throttle that account for 15 minutes while retaining source-based rate limiting and a generic error.
3. WHEN a signed-in session is idle for 30 minutes or reaches eight hours total THE SYSTEM SHALL expire the session.
4. WHEN a System administrator completes documented identity checks for MFA recovery THE SYSTEM SHALL issue hashed one-use recovery codes and audit the recovery.
5. WHEN a System administrator views service status THE SYSTEM SHALL show service health, release ID, application and HTTP errors, posting failures, database lock waits, backup status, disk capacity and audit-delivery status without showing business reports.
6. WHEN a backup fails, posting fails, database lock handling is exhausted or audit delivery has a gap THE SYSTEM SHALL email System administrators and the release owner.
7. WHEN an administrator reviews data past its approved retention period THE SYSTEM SHALL keep the business record and attachment until the administrator approves deletion while retaining required financial and audit evidence for eight financial years or longer under the approved policy.

## Requirement 11: Preserve posting integrity and safe retries

**User Story:** As a Finance manager, I want posting commands to be atomic and safely retryable, so that concurrency or a temporary write failure cannot duplicate or unbalance financial records.

_Source: BR2, BR3, BR7, N3_

### Acceptance Criteria

1. WHEN a posting, approval decision, statement import or reversal is retried with the same idempotency key and identical payload THE SYSTEM SHALL return the stored response without creating another financial effect.
2. IF an idempotency key is reused with a changed payload THEN THE SYSTEM SHALL reject the request with conflict status.
3. IF any policy check, period check, available allocation check, number assignment, source update, journal write, audit event or request-key write fails THEN THE SYSTEM SHALL roll back the entire financial transaction.
4. IF concurrent payments compete for the same unpaid bill balance THEN THE SYSTEM SHALL allow at most the unpaid amount to post.
5. IF database lock handling is exhausted THEN THE SYSTEM SHALL return a retryable service-unavailable response without a partial post.
6. WHEN a posted item commits THE SYSTEM SHALL contain exactly one source-linked journal whose debit and credit totals are equal in integer paise.

## Requirement 12: Load and use the Northline Advisory demo company

**User Story:** As a Greenfield tester, I want a repeatable Northline Advisory demo company with realistic work, so that I can exercise every role and verify the April figures without damaging prior work.

_Source: W1, W2, W3, W4, BR7_

### Acceptance Criteria

1. WHEN Demo mode is opened for the first time THE SYSTEM SHALL show “Demo company” throughout the session and provide one demo account for each of Finance preparer, Finance manager, Finance director, Auditor and System administrator with documented local sign-in and MFA enrolment.
2. WHEN the Northline Advisory demo is loaded THE SYSTEM SHALL create the Consulting and Operations departments, Cedar Analytics, Elm Studio and Harbor Research as Clients and Meridian Systems, Finch Office Supply and Juniper Hosting as Suppliers using fictional contact details and `.example` email addresses.
3. WHEN the Northline Advisory demo is loaded THE SYSTEM SHALL contain exactly five posted April events: the ₹5,00,000.00 opening journal, Cedar Analytics invoice of ₹1,00,000.00 net plus ₹10,000.00 tax, Meridian Systems bill of ₹40,000.00 net plus ₹4,000.00 tax, Cedar Analytics receipt of ₹60,000.00 and Meridian Systems payment of ₹22,000.00.
4. WHEN the Northline Advisory demo is loaded THE SYSTEM SHALL contain an approved ₹50,000.00 Consulting expense budget, two statement lines ready to match, a May draft invoice of ₹12,000.00 net for Elm Studio and a submitted May bill of ₹8,000.00 net from Finch Office Supply with a harmless sample PDF.
5. WHEN the 30 April 2026 bank reconciliation is completed THE SYSTEM SHALL show opening bank ₹5,00,000.00, movements of +₹60,000.00 and −₹22,000.00, closing bank ₹5,38,000.00, two matches and zero difference.
6. WHEN reports are run as of 30 April 2026 THE SYSTEM SHALL show ₹50,000.00 receivable and ₹22,000.00 payable in the 1–30 days overdue buckets, ₹60,000.00 net profit and ₹10,000.00 favourable budget variance.
7. WHEN the 30 April 2026 trial balance and balance sheet are run THE SYSTEM SHALL show closing debits and credits of ₹6,32,000.00 each and assets of ₹5,92,000.00 equal to liabilities of ₹32,000.00 plus equity including profit of ₹5,60,000.00.
8. WHEN the demo loader runs a second time THE SYSTEM SHALL preserve user changes and create no duplicate records, journals, statement rows or files.
9. IF the demo loader is requested in production THEN THE SYSTEM SHALL refuse the request.

## Requirement 13: Recover the finance service

**User Story:** As a System administrator, I want verified backups and recovery evidence, so that an outage does not exceed the firm's data-loss or restoration limits.

_Source: N4, N5_

### Acceptance Criteria

1. THE SYSTEM SHALL create an encrypted off-host recovery point containing a consistent database snapshot and referenced immutable attachments at least every 10 minutes.
2. THE SYSTEM SHALL retain daily recovery copies for 35 days under the initial operating policy.
3. WHEN a restore drill is performed THE SYSTEM SHALL verify database integrity, attachment hashes, latest audit sequence, trial balance and receivables and payables control totals.
4. WHEN a restore drill is completed THE SYSTEM SHALL record the last recoverable write and elapsed recovery time.
5. THE SYSTEM SHALL demonstrate no more than 15 minutes of data loss and restoration within 2 hours during the recovery acceptance test.

## Requirement 14: Set up and verify the release

**User Story:** As a release owner, I want repeatable Windows setup and recorded acceptance results, so that I can verify the exact application before launch.

_Source: N1, N2, N3, N4, N5, N6_

### Acceptance Criteria

1. WHEN the Windows doctor command runs THE SYSTEM SHALL resolve Node, PHP and Composer, honour `PHP_BIN`, verify required PHP extensions including `pdo_sqlite`, check the data directory and report each missing prerequisite once.
2. WHEN local setup completes THE SYSTEM SHALL install pinned dependencies, migrate and seed only the selected demo database and print the actual local URL after its health check succeeds.
3. IF the preferred local port is occupied THEN THE SYSTEM SHALL choose an available port and leave the existing application running.
4. WHEN acceptance tests A01–A08 run against the working Vue frontend, Laravel API and file-backed SQLite THE SYSTEM SHALL record each test ID, release version, actual Passed, Failed or Blocked result and evidence.
5. WHEN acceptance test A06 runs THE SYSTEM SHALL verify all April figures, CSV rows, consistent terminology, dates, INR formatting, desktop and mobile feedback, keyboard approval and the absence of serious or critical automated accessibility findings.
6. WHEN acceptance test A07 runs THE SYSTEM SHALL record p95 response times, errors and lock waits at the declared capacity and record backup restore, attachment, balance, rollback and recovery-objective evidence.
7. WHEN acceptance test A08 runs THE SYSTEM SHALL verify two demo loads, five posted events, two unposted May documents, five roles, two statement lines, unchanged April balances, Finance preparer and Finance manager sign-ins and refusal of production demo loading.
8. IF any financial mismatch, failed recovery, unresolved critical or high security defect or failed mandatory acceptance test remains THEN THE SYSTEM SHALL mark the release as blocked.

## Assumptions

- Release acceptance uses separate individual demo accounts for destructive, concurrent and independent-approval journeys.
- The Finance manager is the reviewer role used to review the pending May Supplier bill in the requested demo journey.
