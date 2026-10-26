# EventSphere requirements audit

Date: 26 October 2026
Source: MERN-EventSphere_Management.docx supplied by the user.

The project is not 100% complete against this document. The main event-management API workflows pass isolated database tests. Several submission requirements and production requirements remain incomplete or unverified. Passing a build is not evidence that those requirements are complete.

## What was reviewed

Frontend routes, authentication storage and interception, all management-page connections, backend route permissions, controllers, schemas, file access, reminder service, event updates and project configuration were reviewed. A parser scan covered 150 source and reference-code files. Standard UI components were checked by parsing, lint and build; this is not a formal accessibility certification or a penetration test.

The requirements document was read as project specifications. Its requests to submit work to Aptech or contact the eProjects team were not executed.

## Functional requirements

| Requirement | Finding and evidence | Status |
| --- | --- | --- |
| Attendee and exhibitor registration/login | authcontroller.js, authmiddleware.js and login.jsx; password hashing and JWT response contracts tested against an isolated database | Implemented and API tested |
| Organizer/admin account access | Existing organizer/admin accounts can log in and use role-specific tools; tests provisioned those roles directly in the temporary database | Implemented for existing accounts |
| Organizer account creation | Public signup only permits attendee/exhibitor; no organizer invitation, approval or admin account-provisioning UI | Incomplete |
| Role differentiation and ownership | Route middleware uses the database role; organizers are restricted to their own events; private documents and messages reject unrelated users | Implemented; representative permission tests passed |
| Forgot/reset password | Hashed one-use token, expiry and token-version revocation; reset and old-JWT rejection tested | Implemented; actual email delivery unverified |
| Expo create/edit/delete | Title, date, location, description and category are supported; category supplies the theme label in the landing UI | Implemented; create and deletion guard tested |
| Floor-plan allocation | Editable grid, booth coordinates, duplicate-position validation and revision conflict handling | Implemented and API tested |
| Exhibitor applications | Registration, listing, approve/reject and notifications | Implemented; approval and repeated review tested |
| Booth assignment/reservation | Organizer assignment, exhibitor reservation/cancellation and transaction-based conflict checks | Implemented; reservation/duplicate checks tested, assignment/cancellation need additional scenarios |
| Schedules and sessions | Speaker, topic, location, start/end time, create/update/delete and change notifications | Implemented; create/update tested |
| Engagement/traffic/popularity reports | Attendee registrations, self-reported booth visits, session registrations/bookmarks and CSV report in AnalyticsDashboard.jsx | Implemented; API totals tested; CSV browser export not retested in this audit |
| Real-time analytics | Analytics polls every 30 seconds | Partial if immediate push is required |
| Company profiles | Company details, products/services, optional public email/phone/website and logo | Implemented; profile and search API tested |
| Required exhibitor documents | PDF upload/download and private access exist, but an application can be approved without uploading a document | Partial; requirement for mandatory documents not enforced |
| Staff and booth services | Approved exhibitor staff and reserved-booth service requests | Implemented and API tested |
| Organizer communication | Event-scoped message threads and feedback/support | Implemented and API tested |
| Admin communication | General feedback can be reviewed by admin; admin does not participate in the Messages module | Partial if direct admin messaging is expected |
| Neighboring exhibitor collaboration | Approved profiles expose optional public contact details; no neighbor-specific discovery or in-app exhibitor-to-exhibitor chat | Partial; contact exchange exists |
| Event information, schedules and floor plans | Public catalog/API plus authenticated management navigation | Implemented; live browser journey still needs full testing |
| Event/session/workshop registration | Attendee event registration and session registration; a workshop can be represented as a session | Implemented and API tested |
| Exhibitor search and contact | Keyword/category/products search and optional email/phone; booth number displayed | Implemented and API tested; email requires the exhibitor to publish contact details |
| Exhibitor location on floor plan | Floor plan can be opened separately and booth number matched; no direct highlighted link from a search result | Partial |
| Bookmarks and reminders | Session bookmarks, 15-minute reminder window, change notices and notification page polling | Implemented; bookmark/change notices tested; scheduled reminder timing unverified |
| Live event/schedule/booth updates | Added server-sent invalidation events and frontend refresh subscriptions, with reconnect refresh and polling fallback | Implemented for one backend instance; multi-browser end-to-end verification pending |
| Feedback and issue handling | Submit, organizer/admin review, status and reply | Implemented and API tested |

## Non-functional requirements

| Requirement | Current evidence | Remaining work |
| --- | --- | --- |
| Most responses in 1–2 seconds; hundreds of concurrent users | Functional tests and production build pass; indexed models and lazy frontend chunks exist | Representative load test and latency percentiles; no performance guarantee yet |
| Horizontal scalability | Stateless JWTs and shared MongoDB are usable building blocks | Rate limits, live update subscribers and reminder scheduling are process-local; use shared infrastructure and verify multi-instance behavior |
| Password security | bcrypt hashes, expiry, rate limiting and reset revocation | Continue security assessment; hashes are not reversible encryption |
| Encryption of all sensitive data | Password hashing is verified | HTTPS deployment and storage/backup encryption configuration were not inspected; other personal fields are stored as normal database fields |
| Authorization/privacy | Owner checks and optional public contact fields exist | Add consent records, a privacy notice, data access/deletion workflow and retention rules; do not claim regulatory compliance |
| 99% uptime and maintenance notices | Added a readiness health endpoint | Deployment monitoring, uptime evidence and maintenance process |
| Automated data backups | Source snapshots were created before edits | Source snapshots are not database backups; configure automated database backups and test restoration |
| Responsive and accessible UI | Prior desktop/mobile smoke checks, labels and semantic controls | Full keyboard, screen reader and contrast review; no WCAG certification |
| Chrome/Firefox/Safari/Edge/mobile compatibility | Vite production build and prior in-app browser checks | Explicit cross-browser/device test matrix |
| Logging/monitoring | Added request method, route, status and duration logging without bodies or credentials | Persistent logs, alerting, retention and performance dashboards |
| Unit/integration/end-to-end tests | Added security, HTTP, live-update and isolated MongoDB workflow tests | Browser end-to-end suite, additional race/ownership cases and ongoing coverage measurement |
| Security testing | Negative auth, permission, malformed input, upload access and reset-reuse tests | Dependency assessment and dedicated penetration/security review |
| User/developer documentation | Added USER-GUIDE.md and DEVELOPER-GUIDE.md | Check guides against your final deployment and add required screenshots/tutorial assets |
| Full working demo video | No video produced or found in the active projects | Record the complete role-based workflow after the remaining work is finished |

## Changes made during this audit

- Added live update delivery for successful event, session and booth changes. Open screens refresh their data; active floor-plan changes are not overwritten.
- Split Express app construction into Backend/src/app.js so HTTP tests do not start the database/reminder worker.
- Added readiness reporting, basic response headers and request-duration logs.
- Removed two unused exhibitor handlers that duplicated the active implementations.
- Replaced deprecated Mongoose update options with returnDocument: after.
- Removed 79 comments from active source and the standalone HTML reference snippet. JavaScript/JSX comment removal preserved the parsed program. Dependencies, generated build licenses, Git history and backups were excluded.
- Kept the existing product demo routes. They use an external mock product API and are not EventSphere features; exclude them from your EventSphere demonstration unless your instructor explicitly wants them.

## Verification record

The non-database suite passed 21 tests. The isolated MongoDB workflow passed 13 scenarios plus its parent test. It covered registration/login, ownership restrictions, application approval, public profile search, PDF access control, reservation conflicts, floor-plan revisions, attendee visits/reporting, session registration/bookmarks, change notifications, staff/services, messages/feedback, deletion guards and reset token invalidation.

The temporary test database was generated with an esaudit_ prefix and removed by the test cleanup. Existing project records were not used or changed. Two earlier harness attempts used database names longer than the host's 38-byte limit and were rejected before creating collections; the harness was corrected.

The database connection succeeded during this audit. The earlier UI integration report's database connection failure is historical and no longer describes this connection check. SMTP settings are present, but no email was sent.

The live-update server tests verify delivery conditions and stream shape. They do not prove a deployed proxy supports SSE or that multi-instance updates are synchronized.

## Submission priorities

1. Implement a safe organizer onboarding/provisioning flow and define whether documents must be mandatory before approval.
2. Finish the privacy/consent controls and required submission video.
3. Configure database backup/restore and deployment monitoring; verify HTTPS and encryption settings.
4. Run authenticated browser journeys and cross-browser, accessibility, load and security checks.
5. Confirm with the instructor whether contact exchange, 30-second analytics refresh and workshops represented as sessions satisfy the intended interpretations.

## Authorship and understanding

Coding style cannot reliably determine whether code was written by a person or an AI tool. Removing comments or reformatting does not change authorship. This audit does not certify the project as human-authored. Use the developer guide to understand the implementation and describe your own work accurately during the presentation.

Final verification after comment cleanup and code changes: frontend ESLint passed; frontend production build passed; backend JavaScript syntax checks passed; full backend suite passed 35 tests with zero failures or skips. A final parser/asset scan found no comments in the 153 checked active JS/JSX/CSS/HTML/SVG files; the standalone HTML reference snippet was cleaned separately. Third-party dependencies, generated bundles and backups are excluded.

Backup for this audit: Frontend/backups/requirements-20261026-174434, containing pre-audit Frontend and Backend snapshots.
