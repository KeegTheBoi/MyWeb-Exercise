from flask import request
from pymongo.errors import DuplicateKeyError

from .api_response import APIResponse
from .user_registration import EmailAlreadyRegistered


class RegistrationAPI(APIResponse):
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
            return self.bad_response("Esiste già un account con questa email.", 409)
        except ValueError as error:
            return self.bad_response(str(error))

        return self.good_response(
            "Registrazione completata.",
            user=user,
            status_code=201,
        )
