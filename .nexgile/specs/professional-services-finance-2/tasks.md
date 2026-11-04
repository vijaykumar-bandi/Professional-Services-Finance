# Tasks: FirmLedger

- [x] 1. Project setup for Laravel, Vue and Windows
  - Create Laravel 13/PHP 8.4 and Vue 3/TypeScript/Vite with pinned lockfiles, temporary-SQLite tests, modular route discovery, shared accessible shell and design tokens, Mailpit, `/api/health`, `@playwright/test` as a dev dependency in `package.json`, an `e2e/` folder containing `.gitkeep` that the unit test runner excludes, `.env.example`, `.gitignore` and one passing PHP and Vue test. Add the Windows doctor, setup guide and `npm run dev` launcher that honours `PHP_BIN`, binds to `127.0.0.1`, prepares only the selected database, selects a free page port without stopping another process, checks health and prints the actual URL.
  - _Requirements: 14.1, 14.2, 14.3_
  - _Files: composer.json, composer.lock, package.json, package-lock.json, artisan, bootstrap/**, config/**, public/**, resources/js/app.ts, resources/js/App.vue, resources/js/components/shared/**, resources/js/router/**, resources/css/tokens.css, resources/css/app.css, routes/api.php, routes/web.php, scripts/dev/**, scripts/windows/**, tests/Unit/SetupTest.php, resources/js/__tests__/setup.test.ts, e2e/.gitkeep, .env.example, .gitignore, README.md, docs/windows-setup.md, phpunit.xml, vite.config.ts, vitest.config.ts, playwright.config.ts, tsconfig.json_
  - _Verify: composer test -- --filter SetupTest_
  - _Verify: npm test -- setup.test.ts_
  - _Area: setup_
  - _Issue: #1_

- [ ] 2. Sign in, MFA and role work queues
  - Build sessions, password and TOTP sign-in, one-use recovery, throttling, expiry, deactivation, policy foundations and role-filtered work queues. Build the responsive Sign in and Work queue screens with Demo company banner, keyboard flow and the specified destination for every role.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_
  - _Depends: 1_
  - _Files: app/Domain/Identity/**, app/Http/Controllers/Api/Identity/**, app/Http/Middleware/**, app/Policies/**, database/migrations/*_identity_*, routes/api/identity.php, resources/js/api/identity.ts, resources/js/stores/session.ts, resources/js/screens/auth/**, resources/js/screens/work-queue/**, resources/js/router/routes/identity.ts, tests/Feature/Identity/**, resources/js/__tests__/identity/**_
  - _Verify: php artisan test tests/Feature/Identity_
  - _Verify: npm test -- identity_
  - _Area: ui_
  - _Issue: #2_

- [ ] 3. Finance configuration and master data
  - Build audited company, fiscal calendar, department, account, bank account, tax code, numbering, Client and Supplier APIs with normalised uniqueness, archival and posted snapshots. Build responsive searchable list-detail editors with Asia/Kolkata dates and Indian-grouped INR.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Depends: 1, 2_
  - _Files: app/Domain/Configuration/**, app/Http/Controllers/Api/Configuration/**, database/migrations/*_configuration_*, routes/api/configuration.php, resources/js/api/configuration.ts, resources/js/screens/configuration/**, resources/js/router/routes/configuration.ts, tests/Feature/Configuration/**, resources/js/__tests__/configuration/**_
  - _Verify: php artisan test tests/Feature/Configuration_
  - _Verify: npm test -- configuration_
  - _Area: ui_
  - _Issue: #3_

- [ ] 4. Atomic posting, approvals and safe retries
  - Implement the sole ledger writer, approval engine, immutable balanced journals, request-key replay and conflict handling, short SQLite transactions, bounded lock retries, rollback hooks, allocation locking and mandatory notification outbox as shared services for all financial workflows.
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  - _Depends: 1, 2_
  - _Files: app/Domain/Approvals/**, app/Domain/Posting/**, app/Domain/Notifications/**, app/Http/Controllers/Api/Approvals/**, app/Jobs/**, database/migrations/*_ledger_*, database/migrations/*_approval_*, database/migrations/*_outbox_*, routes/api/approvals.php, tests/Feature/Posting/**, tests/Unit/Posting/**_
  - _Verify: php artisan test tests/Feature/Posting tests/Unit/Posting_
  - _Area: api_
  - _Issue: #4_

- [ ] 5. Client invoices and receipts
  - Build invoice revisions, half-up paise totals, submission, independent approval, gap-free numbering, print, receipt allocation, settlement status and linked reversals. Build the finished responsive workspace with line editor, totals rail, print view, allocations, timeline and journal links.
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_
  - _Depends: 2, 3, 4_
  - _Files: app/Domain/Documents/Invoices/**, app/Domain/Documents/Receipts/**, app/Http/Controllers/Api/Invoices/**, app/Http/Controllers/Api/Receipts/**, database/migrations/*_invoice_*, database/migrations/*_receipt_*, routes/api/client-billing.php, resources/js/api/client-billing.ts, resources/js/screens/client-billing/**, resources/js/router/routes/client-billing.ts, tests/Feature/ClientBilling/**, resources/js/__tests__/client-billing/**_
  - _Verify: php artisan test tests/Feature/ClientBilling_
  - _Verify: npm test -- client-billing_
  - _Area: ui_
  - _Issue: #5_

- [ ] 6. Supplier bills and recorded payments
  - Build bill revisions, duplicate detection, private signature-verified attachment quarantine and scanning, payment allocation, approval threshold and linked reversals. Build the finished responsive workspace with evidence preview, scan feedback, unpaid-bill allocation and visible manager and Finance director stages.
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_
  - _Depends: 2, 3, 4_
  - _Files: app/Domain/Documents/Bills/**, app/Domain/Documents/Payments/**, app/Domain/Files/**, app/Http/Controllers/Api/Bills/**, app/Http/Controllers/Api/Payments/**, app/Http/Controllers/Api/Attachments/**, database/migrations/*_bill_*, database/migrations/*_payment_*, database/migrations/*_attachment_*, routes/api/supplier-payments.php, resources/js/api/supplier-payments.ts, resources/js/screens/supplier-payments/**, resources/js/router/routes/supplier-payments.ts, tests/Feature/SupplierPayments/**, resources/js/__tests__/supplier-payments/**, tests/Fixtures/attachments/**_
  - _Verify: php artisan test tests/Feature/SupplierPayments_
  - _Verify: npm test -- supplier-payments_
  - _Area: ui_
  - _Issue: #6_

- [ ] 7. Manual journals, reversals and budgets
  - Build balanced manual journal, linked reversal and active monthly budget APIs through shared approval and posting. Build the responsive screen with running debit, credit and difference totals, original-journal context, mandatory reversal reason and budget editor.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  - _Depends: 2, 3, 4_
  - _Files: app/Domain/Documents/ManualJournals/**, app/Domain/Documents/Reversals/**, app/Domain/Documents/Budgets/**, app/Http/Controllers/Api/ManualJournals/**, app/Http/Controllers/Api/Reversals/**, app/Http/Controllers/Api/Budgets/**, database/migrations/*_manual_journal_*, database/migrations/*_reversal_*, database/migrations/*_budget_*, routes/api/journals-budgets.php, resources/js/api/journals-budgets.ts, resources/js/screens/journals-budgets/**, resources/js/router/routes/journals-budgets.ts, tests/Feature/JournalsBudgets/**, resources/js/__tests__/journals-budgets/**_
  - _Verify: php artisan test tests/Feature/JournalsBudgets_
  - _Verify: npm test -- journals-budgets_
  - _Area: ui_
  - _Issue: #7_

- [ ] 8. Bank statement reconciliation
  - Build UTF-8 preview and import, repeat-safe statement rows, one-to-one suggestions and matches, outstanding explanations, continuity and finalization. Build the guided screen with desktop three-pane matching, phone tabs, row errors, sticky adjusted balance and guarded finalization.
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_
  - _Depends: 2, 3, 4_
  - _Files: app/Domain/Banking/**, app/Http/Controllers/Api/Banking/**, database/migrations/*_statement_*, database/migrations/*_reconciliation_*, routes/api/banking.php, resources/js/api/banking.ts, resources/js/screens/bank-reconciliation/**, resources/js/router/routes/bank-reconciliation.ts, tests/Feature/Banking/**, resources/js/__tests__/bank-reconciliation/**, tests/Fixtures/statements/**_
  - _Verify: php artisan test tests/Feature/Banking_
  - _Verify: npm test -- bank-reconciliation_
  - _Area: ui_
  - _Issue: #8_

- [ ] 9. Financial reports and CSV exports
  - Build all six reports, journal drill-down, hardened all-row CSV export and capacity indexes. Build responsive report tabs, filters, summaries, date and close-version basis and desktop and phone detail views.
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_
  - _Depends: 2, 3, 4, 5, 6, 7_
  - _Files: app/Domain/Reporting/**, app/Http/Controllers/Api/Reporting/**, database/migrations/*_reporting_index_*, routes/api/reporting.php, resources/js/api/reporting.ts, resources/js/screens/financial-reports/**, resources/js/router/routes/financial-reports.ts, tests/Feature/Reporting/**, resources/js/__tests__/financial-reports/**_
  - _Verify: php artisan test tests/Feature/Reporting_
  - _Verify: npm test -- financial-reports_
  - _Area: ui_
  - _Issue: #9_

- [ ] 10. Month-end close and reopen
  - Build close-readiness controls, independent close and reopen, atomic prerequisite recheck, period locking, report snapshots, reconciliation invalidation and version history. Build the responsive checklist and evidence screen with blocking items and actor and version timelines.
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_
  - _Depends: 3, 4, 8, 9_
  - _Files: app/Domain/Close/**, app/Http/Controllers/Api/Close/**, database/migrations/*_close_*, routes/api/close.php, resources/js/api/close.ts, resources/js/screens/month-end-close/**, resources/js/router/routes/month-end-close.ts, tests/Feature/Close/**, resources/js/__tests__/month-end-close/**_
  - _Verify: php artisan test tests/Feature/Close_
  - _Verify: npm test -- month-end-close_
  - _Area: ui_
  - _Issue: #10_

- [ ] 11. Audit search and evidence
  - Build append-only redacted audit capture, protected forwarding and linked evidence queries. Build the read-only Audit search screen with event, actor, date, target and invoice filters and accessible document, decision, journal, reversal and report evidence.
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  - _Depends: 2, 4, 5, 6, 7, 9, 10_
  - _Files: app/Domain/Audit/**, app/Http/Controllers/Api/Audit/**, database/migrations/*_audit_*, routes/api/audit.php, resources/js/api/audit.ts, resources/js/screens/audit-search/**, resources/js/router/routes/audit-search.ts, tests/Feature/Audit/**, resources/js/__tests__/audit-search/**_
  - _Verify: php artisan test tests/Feature/Audit_
  - _Verify: npm test -- audit-search_
  - _Area: ui_
  - _Issue: #12_

- [ ] 12. User, privacy and service administration
  - Build account provisioning, one-role assignment, deactivation, audited MFA recovery, retention decisions, operational status and mandatory alerts without report access. Build the User and service administration screen with no financial approval or business-figure controls.
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  - _Depends: 2, 4, 11_
  - _Files: app/Domain/Administration/**, app/Domain/Operations/ServiceStatus/**, app/Http/Controllers/Api/Administration/**, app/Http/Controllers/Api/ServiceStatus/**, database/migrations/*_retention_*, routes/api/administration.php, resources/js/api/administration.ts, resources/js/screens/administration/**, resources/js/router/routes/administration.ts, tests/Feature/Administration/**, resources/js/__tests__/administration/**_
  - _Verify: php artisan test tests/Feature/Administration_
  - _Verify: npm test -- administration_
  - _Area: ui_
  - _Issue: #13_

- [ ] 13. Northline Advisory demo company
  - Implement production-refusing, additive transactional demo seed and confirmed reset with stable fixture keys, dedicated SQLite and attachments, generated ignored credentials, exact five-role and April data, budget, two statement lines and two May documents. Verify the documented April balances and that a second load preserves changed work without duplicates.
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9_
  - _Depends: 5, 6, 7, 8, 9_
  - _Files: app/Domain/Demo/**, app/Console/Commands/FirmLedgerDemoSeed.php, app/Console/Commands/FirmLedgerDemoReset.php, database/migrations/*_demo_seed_*, database/seeders/NorthlineAdvisorySeeder.php, resources/demo/**, tests/Feature/Demo/**, docs/demo-sign-in.md_
  - _Verify: php artisan test tests/Feature/Demo_
  - _Area: database_
  - _Issue: #11_

- [ ] 14. Backup and recovery controls
  - Build consistent SQLite and attachment backup, encryption, off-host transfer interface, ten-minute scheduling, 35-day retention, status and alerts. Build isolated restore-drill checks for integrity, hashes, audit sequence and financial controls, recording last recoverable write and elapsed recovery time.
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  - _Depends: 4, 9, 11, 12_
  - _Files: app/Domain/Operations/Backup/**, app/Domain/Operations/Recovery/**, app/Console/Commands/FirmLedgerBackup.php, app/Console/Commands/FirmLedgerRestoreDrill.php, app/Console/Kernel.php, database/migrations/*_recovery_*, tests/Feature/Recovery/**, docs/recovery-runbook.md_
  - _Verify: php artisan test tests/Feature/Recovery_
  - _Area: database_
  - _Issue: #14_

- [ ] 15. Capacity and concurrency evidence
  - Add isolated fixtures for 25 named staff and 100,000 journal lines and a 10-active-user workload that records indexed-list, approval and posting p95, errors and lock waits and asserts the two-second and three-second targets.
  - _Requirements: 7.8, 7.9, 8.9, 14.6_
  - _Depends: 4, 5, 6, 9, 10, 14_
  - _Files: tests/Capacity/**, scripts/capacity/**, storage/testing/.gitignore, docs/capacity-runbook.md_
  - _Verify: php artisan test tests/Capacity_
  - _Mode: tester_
  - _Area: api_
  - _Issue: #15_

- [ ] 16. Release acceptance and actual A01–A08 results
  - Build the Release acceptance screen and evidence API, then add and run A01–A08 Playwright and operations journeys against the working Vue application, Laravel API and file-backed SQLite on desktop and phone. Record actual Passed, Failed or Blocked results, release version, evidence, accessibility findings, verified local URL and blocking release decision; never convert an unchecked item into Passed.
  - _Requirements: 14.4, 14.5, 14.6, 14.7, 14.8_
  - _Depends: 2, 5, 6, 8, 10, 12, 13, 14, 15_
  - _Files: app/Domain/Acceptance/**, app/Http/Controllers/Api/Acceptance/**, database/migrations/*_acceptance_*, routes/api/acceptance.php, resources/js/api/acceptance.ts, resources/js/screens/release-acceptance/**, resources/js/router/routes/release-acceptance.ts, tests/Feature/Acceptance/**, resources/js/__tests__/release-acceptance/**, e2e/**, scripts/acceptance/**, docs/acceptance-results.md_
  - _Verify: php artisan test tests/Feature/Acceptance_
  - _Verify: npm test -- release-acceptance_
  - _Mode: tester_
  - _Area: ui_
  - _Issue: #16_

- [ ] 17. Deployment setup for the dedicated Linux host
  - Add reproducible production build and host configuration for Nginx, PHP-FPM, restricted service accounts, queue and scheduler, TLS and network or VPN admission, local-SSD SQLite and private storage, migrations, production administrator bootstrap, monitoring, ten-minute backup schedule and rollback. Disable debug and demo loading, read secrets from environment variables and document deployment without performing it.
  - _Requirements: 13.1, 13.2, 13.5, 14.8_
  - _Depends: 12, 13, 14, 16_
  - _Files: deploy/**, docs/deployment-runbook.md, scripts/production/**_
  - _Verify: php artisan test tests/Feature/Recovery tests/Feature/Demo_
  - _Mode: devops_
  - _Area: deploy_
  - _Issue: #17_

## Assumptions

- The release acceptance task records the verified local URL and actual A01–A08 evidence only after all required application workflows are available.
- Production host provisioning is represented as checked-in configuration and runbooks because the dedicated host details and credentials are supplied at deployment time.
