import re

from .user_logic import UserLogic


class UserRegistrationLogic(UserLogic):
    EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    MIN_PASSWORD_LENGTH = 8
    MAX_PASSWORD_LENGTH = 128

    def register(self, email, password):
        if not isinstance(email, str):
            raise ValueError("Inserisci un indirizzo email valido.")

        email = email.strip().lower()
        if len(email) > 254 or not self.EMAIL_PATTERN.fullmatch(email):
            raise ValueError("Inserisci un indirizzo email valido.")

        self._validate_password(password)

        if self.collection.find_one({"email": email}):
            raise EmailAlreadyRegistered("Esiste già un account con questa email.")

        self.create({"email": email, "password": password, "score": 0})
        return {"email": email}

    @classmethod
    def _validate_password(cls, password):
        if not isinstance(password, str) or len(password) < cls.MIN_PASSWORD_LENGTH:
            raise ValueError("La password deve contenere almeno 8 caratteri.")
        if len(password) > cls.MAX_PASSWORD_LENGTH:
            raise ValueError("La password non può superare 128 caratteri.")
        if not re.search(r"[a-z]", password):
            raise ValueError("La password deve contenere almeno una lettera minuscola.")
        if not re.search(r"[A-Z]", password):
            raise ValueError("La password deve contenere almeno una lettera maiuscola.")
        if not re.search(r"[0-9]", password):
            raise ValueError("La password deve contenere almeno un numero.")


class EmailAlreadyRegistered(ValueError):
    pass
