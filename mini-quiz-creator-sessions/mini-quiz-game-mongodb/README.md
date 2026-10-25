# Generic CRUD Template

This is a generic template for CRUD (Create, Read, Update, Delete) operations that can be easily adapted to any business object.

## Structure

- `generic_crud_manager.py`: Generic Python class for CRUD operations on JSON data.
- `server.py`: Flask server with generic API endpoints.
- `crud_client.js`: Generic JavaScript class for API interactions.
- `app.js`: Example UI logic using the CrudClient.
- `index.html`: Basic HTML structure.
- `styles.css`: Basic styling.
- `items.json`: Sample data file (initially empty).

## How to Use

1. **Configure the Entity**:
   - In `server.py`, change `ENTITY_NAME` to your entity (e.g., "quote", "product").
   - In `app.js`, change `ENTITY_NAME` to match.
   - Adjust field names in `app.js` (e.g., `content` to `quote`).

2. **Customize the Data Structure**:
   - The manager expects each item to be a dict with an 'id' field.
   - Add other fields as needed (e.g., 'name', 'description').

3. **Adapt the UI**:
   - Modify `index.html` for your specific form fields.
   - Update `app.js` to handle your specific fields and validation.

4. **Run the Server**:
   - `python server.py`

## User Registration

Registration uses the dedicated `POST /api/register` endpoint instead of the generic user CRUD routes. The browser checks the email, requires a password with at least 8 characters including an uppercase letter, a lowercase letter, and a number, and asks the user to confirm it. The server repeats the validation, normalizes email addresses, enforces uniqueness in MongoDB, and stores only a Werkzeug password hash. Passwords and hashes are never included in API responses.

New user documents include numeric `score` and `quiz_completed` fields, both initialized to `0`, and an `is_admin` flag that defaults to `false`. On startup, the server backfills missing profile fields for existing users. Set `ADMIN_EMAILS` to a comma-separated list of account emails to grant admin access; matching existing users are promoted at startup, and matching new registrations are created as admins. The signed-in page reads these values from the authenticated session endpoint. The current project does not yet have a quiz-taking flow that updates the score or completion count.

Login uses `POST /api/login`; the server verifies the stored password hash and creates a session cookie on success. The browser then navigates to `/users.html`, which is only served to a logged-in session. `POST /api/logout` clears the session. Set `FLASK_SECRET_KEY` to a stable, private value in deployment and `SESSION_COOKIE_SECURE=true` when serving over HTTPS; the server generates an ephemeral key when the secret variable is unset.

The shared navigation loads the server's session state on every page, showing account and logout links when signed in and quiz creation only to admins. The `/quiz_creation.html` page and quiz create, update, and delete API operations also enforce admin access on the server. The admin quiz page uses the generic CRUD client/UI to create, list, edit, and delete quizzes with a title and description.

Serve the registration and login pages and APIs over HTTPS outside local development so passwords and session cookies are protected in transit.

## Example for Quotes

To adapt for quotes (like the original example):

- Set `ENTITY_NAME = "quote"` in `server.py`.
- In `app.js`, change `{ content }` to `{ quote }` and adjust display accordingly.
- Rename `items.json` to `quotes.json`.

The business logic is now separated: the GenericCrudManager handles the data operations, and you can extend it or create specific managers if needed.
