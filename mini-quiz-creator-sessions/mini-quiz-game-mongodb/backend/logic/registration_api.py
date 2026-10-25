from flask import jsonify, request
from pymongo.errors import DuplicateKeyError

from .user_registration import EmailAlreadyRegistered


class RegistrationAPI:
    def __init__(self, app, registration_manager):
        self.registration_manager = registration_manager
        app.add_url_rule(
            "/api/register",
            view_func=self.register,
            methods=["POST"],
            endpoint="register_user",
        )

    def register(self):
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return self._error("Dati di registrazione mancanti.")

        try:
            user = self.registration_manager.register(
                data.get("email"),
                data.get("password"),
            )
        except (EmailAlreadyRegistered, DuplicateKeyError):
            return self._error("Esiste già un account con questa email.", 409)
        except ValueError as error:
            return self._error(str(error))

        return jsonify(
            success=True,
            message="Registrazione completata.",
            user=user,
        ), 201

    @staticmethod
    def _error(message, status_code=400):
        return jsonify(success=False, message=message), status_code
