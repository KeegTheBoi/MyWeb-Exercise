# Mini Quiz Game

## Project structure

- `backend/server.py`: Flask application and MongoDB configuration.
- `backend/logic/`: quiz, user, authentication, and API logic.
- `frontend/templates/`: Jinja-rendered HTML pages.
- `frontend/static/css/`: shared stylesheets.
- `frontend/static/js/crud/`: reusable CRUD client and UI.
- `frontend/static/js/pages/`: JavaScript for individual pages.
- `frontend/static/js/shared/`: shared site navigation and login-state UI.
- `frontend/static/js/app.js`: home-page application logic.
- `README.md`: setup and application notes.

## How to Use

1. **Configure the Entity**:
   - In `backend/server.py`, change `ENTITY_NAME` to your entity (e.g., "quote", "product").
   - Update the matching entity name and fields in `frontend/static/js/app.js`.

2. **Customize the Data Structure**:
   - Add entity-specific behavior in `backend/logic/`.
   - Update page markup in `frontend/templates/` and page scripts in `frontend/static/js/pages/`.

3. **Adapt the UI**:
   - Shared assets belong under `frontend/static/`; templates use Flask's `url_for('static', filename=...)` to reference them.

4. **Run the Server**:
   - From the project root, run `python -m backend.server` (or `python backend/server.py`).
   - The application serves templates and static assets through Flask, so do not open the HTML files directly from disk.

## User Registration

Registration uses the dedicated `POST /api/register` endpoint instead of the generic user CRUD routes. The browser checks the email, requires a password with at least 8 characters including an uppercase letter, a lowercase letter, and a number, and asks the user to confirm it. The server repeats the validation, normalizes email addresses, enforces uniqueness in MongoDB, and stores only a Werkzeug password hash. Passwords and hashes are never included in API responses.

New user documents include numeric `score` and `quiz_completed` fields, both initialized to `0`, and an `is_admin` flag that defaults to `false`. On startup, the server backfills missing profile fields for existing users. Set `ADMIN_EMAILS` to a comma-separated list of account emails to grant admin access; matching existing users are promoted at startup, and matching new registrations are created as admins. The signed-in page reads these values from the authenticated session endpoint. The current project does not yet have a quiz-taking flow that updates the score or completion count.

Login uses `POST /api/login`; the server verifies the stored password hash and creates a session cookie on success. The browser then navigates to `/users.html`, which is only served to a logged-in session. `POST /api/logout` clears the session. Set `FLASK_SECRET_KEY` to a stable, private value in deployment and `SESSION_COOKIE_SECURE=true` when serving over HTTPS; the server generates an ephemeral key when the secret variable is unset.

The shared navigation loads the server's session state on every page, showing account and logout links when signed in and quiz creation only to admins. The `/quiz_creation.html` page and quiz create, update, and delete API operations also enforce admin access on the server. The admin quiz page uses the generic CRUD client/UI to create, list, edit, and delete quizzes with a title and description.

Serve the registration and login pages and APIs over HTTPS outside local development so passwords and session cookies are protected in transit.

## Example for Quotes

To adapt for quotes (like the original example):

- Set `ENTITY_NAME = "quote"` in `backend/server.py`.
- In `frontend/static/js/app.js`, change `{ content }` to `{ quote }` and adjust display accordingly.
- Rename `items.json` to `quotes.json`.

The business logic is now separated: the GenericCrudManager handles the data operations, and you can extend it or create specific managers if needed.
