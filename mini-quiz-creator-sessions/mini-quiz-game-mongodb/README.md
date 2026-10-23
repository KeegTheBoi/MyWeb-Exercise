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

Serve the registration page and API over HTTPS outside local development so the password is protected in transit.

## Example for Quotes

To adapt for quotes (like the original example):

- Set `ENTITY_NAME = "quote"` in `server.py`.
- In `app.js`, change `{ content }` to `{ quote }` and adjust display accordingly.
- Rename `items.json` to `quotes.json`.

The business logic is now separated: the GenericCrudManager handles the data operations, and you can extend it or create specific managers if needed.
