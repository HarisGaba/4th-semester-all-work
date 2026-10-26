# EventSphere developer and presentation guide

The frontend is a React application built with Vite. The backend is an Express application using Mongoose and MongoDB. Backend/index.js connects to the database, initializes indexes and starts the HTTP server and session reminder worker. Backend/src/app.js constructs routes and middleware and can be imported by tests without starting those services.

## Following one request

A form collects input and calls the shared Axios instance in Frontend/src/api/api.js. The request interceptor attaches the stored Bearer token. Express routes first authenticate the token and check the permitted role. Controllers validate fields and check record ownership before reading or writing MongoDB. The JSON response is used to update the screen or show an error.

The frontend role check improves navigation, but it is not the security boundary. Local storage can be edited by a browser user. The backend obtains the role from the database and must authorize every protected action independently.

## Authentication

Registration hashes the password with bcrypt. Login compares the password against that hash and returns a signed JWT. The JWT has a subject, issuer, audience, expiry and token version. It is signed, not encrypted. A password reset increments the database token version, making older JWTs invalid. Reset tokens are random; only their hash is stored in the database, and they expire after 15 minutes.

The frontend stores the token and account fields in local storage. The request interceptor sends the token. A 401 from an authenticated request clears the login state. This storage choice is vulnerable if untrusted script runs in the page, so avoid unsafe HTML rendering and complete a security review before production use.

## Data relationships

A User has a role. An Event belongs to an organizer. An Exhibitor application links its contact user to an event. An Attendee registration links a user to an event. Booths belong to events and can reference an approved exhibitor. A FloorPlan contains booth coordinates and a revision number. Sessions belong to events and store registration/bookmark user IDs. BoothVisit records drive traffic reporting. Notifications, feedback, service requests and messages support event communication.

## Transactions and conflicts

Booth reservation changes both Booth and Exhibitor. A database transaction keeps those updates consistent. Unique indexes and conditional updates prevent duplicate reservations. These transactions need MongoDB replica-set support, such as an appropriate Atlas deployment; a standalone local MongoDB server is insufficient.

Floor-plan writes include the revision that was loaded. A changed revision returns 409 instead of silently replacing another organizer's edit. Application review is conditional on Pending, preventing a second review from overwriting the first.

## Live updates

Successful event, schedule or booth mutations publish a data-free change signal to connected SSE clients at /updates. The frontend then reloads data through the normal APIs. This signal contains no tokens, users or private records. Reconnection refreshes the current screen, and a 30-second fallback refresh runs when the stream is unavailable. Floor-plan refresh is paused while unsaved changes exist.

The subscriber set is in memory. Multiple backend instances need a shared pub/sub service before this can be described as horizontally scalable live updates. Analytics and messaging have their own polling intervals.

## Reports

Analytics scopes events to the organizer unless the requester is an administrator. It combines attendee counts, exhibitor applications, booth reservations, self-reported visits and session registrations/bookmarks. Traffic is a count of confirmed visits, not a sensor-based footfall measurement. The frontend exports CSV and escapes spreadsheet formula prefixes.

## Running and testing

Install each project's locked dependencies with npm ci. Configure the backend environment privately: MONGODB_URL, JWT_SECRET, EMAIL_USER, EMAIL_PASS and FRONTEND_URL. JWT_SECRET must be a strong random value of at least 32 characters. PORT defaults to 3000. The frontend uses VITE_API_URL, defaulting to http://localhost:3000. Do not commit real credentials.

Frontend commands: npm run dev, npm run lint, npm run build.

Backend commands: npm start, npm run dev, npm run lint, npm test. Backend lint performs JavaScript syntax checks; frontend lint uses ESLint. Default backend tests do not require a database and explicitly skip the database workflow.

To run the isolated database test in PowerShell, set RUN_DATABASE_TESTS to 1 for that shell and run node --test test/database.test.js. The test creates only a randomly named esaudit_ database, asserts the exact name before cleanup and removes that database afterward. It never reuses the configured project's database name. If the process is forcibly killed, verify and remove only the printed temporary database through normal database administration.

The /health endpoint returns ready only while MongoDB is connected. Request logs contain method, route, status and duration, not credentials or request bodies. Configure durable log storage and alerts separately for deployment.

## Explaining the project in your presentation

Be able to trace login from the form to the database and back. Explain why frontend role checks are insufficient, why passwords are hashed, why booth reservation uses a transaction, and how revision checks prevent lost updates. Demonstrate attendee registration, exhibitor approval, reservation, session bookmarking, reports and support replies using your own prepared accounts.

Describe the limitations in REQUIREMENTS-AUDIT.md accurately. Reformatting and comment removal do not establish human authorship; explain which parts you built, adapted and understand, following your course's rules.
