# Mini Quiz Game

A Flask and MongoDB quiz application with account registration, quiz management,
player progress, and per-user quiz results.

## Project structure

- `backend/server.py`: Flask application, MongoDB configuration, and API setup.
- `backend/logic/common/`: shared API response and MongoDB CRUD infrastructure.
- `backend/logic/auth/`: authentication and registration endpoints.
- `backend/logic/quizzes/`: quiz API routes and quiz validation.
- `backend/logic/users/`: profiles, registration data, and user administration.
- `frontend/templates/`: home, auth, account, and admin pages.
- `frontend/static/css/base.css`: shared styles and design tokens.
- `frontend/static/css/pages/`: page-specific stylesheets loaded alongside `base.css`.
- `frontend/static/js/pages/`: page behavior, including quiz play and admin workspace.
- `frontend/static/js/shared/`: API request handling and site navigation.
- `frontend/static/js/crud/`: shared CRUD and registration-form UI.
- `docs/`: backend guide in Markdown and DOCX formats.

## Run locally

1. Start MongoDB at `mongodb://localhost:27017` or configure the connection in
   `backend/server.py`.
2. From the repository root, run:

   ```sh
   python -m backend.server
   ```

3. Open `http://localhost:5000`.

The application serves its templates and static files through Flask; do not open
the HTML files directly from disk. Set `FLASK_SECRET_KEY` to a stable private
value outside local development. Set `SESSION_COOKIE_SECURE=true` when serving
over HTTPS.

## Accounts and roles

Register at `/register.html` with an email and a password of 8 to 128 characters
containing an uppercase letter, a lowercase letter, and a number. The form also
requires password confirmation and displays validation and server feedback in
the same auth card style as login. The server repeats validation, normalizes
email addresses, enforces uniqueness, and stores a Werkzeug password hash.
Passwords and hashes are never returned by API responses.

New users start with score and completed-quiz counts of zero. Set `ADMIN_EMAILS`
to a comma-separated list of email addresses to grant admin access. Matching
existing accounts are promoted at startup, and matching registrations receive
the admin role.

## Quiz play and administration

Players sign in at `/login.html`. Their profile is available at `/users.html`;
admins also have access to `/quiz_creation.html`. Admins can create, edit, hide,
publish, and delete quizzes and manage user roles. Quiz questions support at
least two choices and one correct answer. Correct answers are excluded from
player-facing quiz data.

Each user can complete an available quiz once. The result is saved with the
user's quiz attempts, and completion increments the profile's quiz count and
score. Quiz lists and detail responses include saved completion status and
results so players can review a previous attempt in a later session.

## Frontend and backend organization

Each page template loads the shared stylesheet and its own stylesheet from
`frontend/static/css/pages/`. Keep styles used across pages in `base.css` and
page-specific rules in the matching file under `pages/`. Backend modules are
organized into domain packages under `backend/logic/`; update imports when
adding or moving modules.

The Python backend guide documents package responsibilities, routes, data
validation, and class relationships:

- [Backend guide (Markdown)](docs/python-backend.md)
- [Backend guide (DOCX)](docs/python-backend.docx)

Run the focused backend tests with:

```sh
python -m unittest tests.test_quiz_api tests.test_quiz_logic
```
