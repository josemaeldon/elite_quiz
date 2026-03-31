# Elite Quiz – Firebase to PostgreSQL migration analysis

## Current Firebase surface

### Authentication & session
- `src/utils/Firebase.js` bootstraps Firebase and exports `auth`/`db`/messaging helpers. All login/register components (`components/auth/*.jsx`, `NavBar/TopHeader.jsx`, etc.) use Firebase Auth to obtain `firebase_id`, photoURL, `emailVerified`, etc., which they then send to the PHP APIs (e.g. `registerApi`, `checkUserExistsApi`).
- The PHP API (`application/controllers/Api.php->user_signup_post`) verifies each request by calling `verify_user($firebase_id)` (line ~6989) with `assets/firebase_config.json` and only registers/updates if Firebase returns the UID.
- Front-end also imports `firebase/auth` helpers like `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `signInWithPopup` (Google), and `sendPasswordResetEmail` (ResetPassword component). All of those rely on Firebase.

### Firestore real-time data
- Group battle rooms, random battles, messaging popups, etc. all use Firestore collections instead of existing REST APIs. Key files:
  - `src/components/Quiz/RandomBattle/RandomBattle.jsx` (`collection(db, "battleRoom")` etc.) handles random battle room creation and onSnapshot listeners.
  - `GroupBattle/GroupBattle.jsx` manages `multiUserBattleRoom` collection, `onSnapshot`, `runTransaction`, etc.
  - `RandomBattle/PlayWithFriendBattle.jsx` and `GroupBattle/GroupQuestions.jsx` both read/write `messages` collection (for live chat) and update `battleRoom` documents.
  - `messagePopUp/ShowMessagePopUpBtn.jsx` writes to Firestore `messages`.
  - `src/components/Quiz/RandomBattle/RandomQuestions.jsx` reads `messages` (sampling chat updates via Firestore listeners).

### Firebase Cloud Messaging (Web push)
- `src/utils/Firebase.js` handles Web Push tokens, calling `getMessaging`, `getToken`, `onMessage`, and updating `web_fcm_id` via `updateFcmIdApi` (which hits PHP API). The admin panel exposes Firebase config and FCM token toggles (`application/views/web_settings.php`).

## Postgres migration goals
1. **Authentication** – stop using Firebase Auth; implement credential-based login/signup (email/mobile) with PostgreSQL-stored hashed passwords. The backend should emit the same `api_token` and populate `tbl_users`. Front-end should call new `POST /Auth/login`/`/Auth/register` endpoints (or extend existing PHP `user_signup`). The new handlers must: 
   - Validate credentials against a `users` table in Postgres, including `password_hash` and optionally 2FA/messaging fields.
   - Replace `verify_user` calls (so backend no longer depends on `assets/firebase_config.json` at all).
   - Provide endpoints for `checkUserExists`, profile updates, resets, etc., all referencing `user_id` instead of `firebase_id`. 
2. **Battle rooms & messaging** – replace Firestore collections with REST/WebSocket APIs backed by Postgres tables: `rooms`, `room_participants`, `messages`, `events`. The front-end should stop importing from `firebase/firestore` and instead call new endpoints (e.g., `POST /rooms`, `GET /rooms/{id}/state`, `POST /rooms/{id}/messages`). Live updates can be handled via WebSockets or long-polling that watches Postgres `LISTEN/NOTIFY`. For initial migration, a polling-based approach with `GET /rooms/{id}/updates?since=<timestamp>` can work, backed by standard SQL tables.
3. **FCM + push** – re-architect around Postgres storing push tokens. Keep the existing PHP `update_fcm_id`/`update_user_profile_data` endpoints; they can simply store tokens in Postgres columns `fcm_id`, `web_fcm_id`. Outside of Firebase messaging, the admin panel can keep these columns purely for record-keeping (or integrate another push provider later).

## Practical roadmap
1. **Schema design** (Postgres)
   - Use `serial`/`uuid` PKs, timestamps, and `jsonb` for flexible payloads.
   - Example tables (`rooms`, `room_messages`, `room_states`):
     ```sql
     create table rooms (
       id uuid primary key default gen_random_uuid(),
       category_id int not null,
       owner_id int not null references users(id),
       entry_coin int default 0,
       status text not null default 'waiting',
       created_at timestamptz default now(),
       updated_at timestamptz default now()
     );
     create table room_participants (
       room_id uuid references rooms(id) on delete cascade,
       user_id int references users(id),
       joined_at timestamptz default now(),
       ready boolean default false,
       primary key(room_id, user_id)
     );
     create table room_messages (
       id bigserial primary key,
       room_id uuid references rooms(id) on delete cascade,
       sender_id int references users(id),
       payload jsonb not null,
       created_at timestamptz default now()
     );
     create table room_events (
       id bigserial primary key,
       room_id uuid references rooms(id) on delete cascade,
       type text not null,
       payload jsonb,
       created_at timestamptz default now()
     );
     ```
2. **Backend changes**
   - Update `application/config/database.php` (and any DB migrations) to use Postgres (`'dbdriver' => 'postgre'`) and adjust credentials.
   - Replace all `firebase_id` references in controllers/models with Postgres column names (e.g., use `user_uuid` or `user_id`). Provide a migration that copies existing data (if moving from Firebase sign-ins) into Postgres `users` table with hashed passwords.
   - Build new service layer (model or helper) under `application/models/Room_model.php` that wraps Postgres CRUD for rooms/messages and exposes endpoints for PHP API (e.g., `create_room`, `join_room`, `emit_room_payload`). Remove any direct Firestore client usage from PHP.
   - Remove `Kreait\Firebase` dependencies from `composer.json`; backend no longer needs Firebase Admin SDK.
3. **Front-end adjustments**
   - Remove `firebase` npm dependencies from `package.json` (`firebase`, `firebase-admin`). Replace `src/utils/Firebase.js` with a Postgres-friendly session handler that talks to our new auth API.
   - Refactor auth pages: `Login.jsx`, `Signup.jsx`, `ResetPassword.jsx`, `OtpVerify.jsx`, `NavBar`/`TopHeader`, etc., to call new endpoints (`apiRoutes.login`, `apiRoutes.signup`, etc.) using email/password or OTP. Add client-side validation and password hashing (if needed) before sending over HTTPS.
   - Replace Firestore code in battle components with the new API client. For example, `GroupBattle.jsx` will: 
     - Call `createGroupBattleRoomApi` to initialize a Postgres-backed room.
     - Use a custom hook `useRoomStream(roomId)` that polls `GET /rooms/{id}/events` (or connects over WebSocket).
     - Push chat via `sendRoomMessage(roomId, payload)` that hits `POST /rooms/{id}/messages`.
   - Update Redux slices (`messageSlice`, `groupbattleSlice`) to store Postgres room IDs and latest payloads rather than Firestore doc IDs.
   - Remove FCM messaging setup except for token storage; or integrate a server-side push service that sends notifications using stored `web_fcm_id` values.
4. **Testing & rollout**
   - Build migration scripts that backfill `tbl_users` with hashed passwords and `rooms/messages` data into Postgres tables (if migrating data from Firebase). Without existing Firebase data, just start with fresh data.
   - Ensure API clients respect `api_token` authentication (already stored in `tbl_users`). Provide endpoints to refresh tokens as needed.
   - Replace Firestore listeners with polling or WebSocket wrappers and test for latency/performance.

## Missing pieces & risks
- Real-time battle flows must be re-implemented; Firestore transactions allowed atomic increments and listeners. In Postgres you will need explicit locking or transactions, plus a streaming mechanism. Consider using PostgreSQL `LISTEN/NOTIFY` paired with a Node.js WebSocket server (or PHP Ratchet) to broadcast state changes.
- Push notifications no longer use Firebase Messaging automatically. Either keep the Firebase Cloud Messaging Web SDK just for receiving tokens (but not authenticating), or switch to another provider. Storing tokens in Postgres lets you send pushes from PHP.
- Client now has to manage credentials; resetting passwords requires secure email flow (add new PHP endpoint). Avoid storing plaintext passwords.

## Next steps
1. Build Postgres schema/migrations and update PHP `database.php` to use `'dbdriver'=>'postgre'`.
2. Remove Firebase Admin PHP dependencies and create `FirebaseService`-free helpers that validate tokens using our own JWT + Postgres lookups.
3. Create dedicated API endpoints for room messaging and battle lifecycle; replace Firestore references in React components with fetch hooks.
4. Replace `firebase/auth` usage in the React app with custom login/signup flows that send credentials to PHP endpoints. Update Redux state to store Postgres IDs.
