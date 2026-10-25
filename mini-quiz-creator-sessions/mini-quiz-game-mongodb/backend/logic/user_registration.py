import re

from werkzeug.security import check_password_hash

from .user_logic import UserLogic


class UserRegistrationLogic(UserLogic):
    EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    MIN_PASSWORD_LENGTH = 8
    MAX_PASSWORD_LENGTH = 128

    def __init__(self, collection, admin_emails=()):
        super().__init__(collection)
        self.admin_emails = {
            email.strip().lower()
            for email in admin_emails
            if isinstance(email, str) and email.strip()
        }

    def register(self, email, password):
        if not isinstance(email, str):
            raise ValueError("Inserisci un indirizzo email valido.")

        email = email.strip().lower()
        if len(email) > 254 or not self.EMAIL_PATTERN.fullmatch(email):
            raise ValueError("Inserisci un indirizzo email valido.")

        self._validate_password(password)

        if self.collection.find_one({"email": email}):
            raise EmailAlreadyRegistered("Esiste già un account con questa email.")

        profile = {
            "email": email,
            "score": 0,
            "quiz_completed": 0,
            "is_admin": email in self.admin_emails,
        }
        self.create({
            **profile,
            "password": password,
        })
        return profile

    def ensure_profile_fields(self):
        self.collection.update_many(
            {"score": {"$exists": False}},
            {"$set": {"score": 0}},
        )
        self.collection.update_many(
            {"quiz_completed": {"$exists": False}},
            {"$set": {"quiz_completed": 0}},
        )
        self.collection.update_many(
            {"is_admin": {"$exists": False}},
            {"$set": {"is_admin": False}},
        )
        if self.admin_emails:
            self.collection.update_many(
                {"email": {"$in": sorted(self.admin_emails)}},
                {"$set": {"is_admin": True}},
            )

    def get_profile(self, email):
        user = self.collection.find_one({"email": email})
        if not user:
            return None

        score = user.get("score", 0)
        if isinstance(score, bool) or not isinstance(score, (int, float)):
            score = 0

        quiz_completed = user.get("quiz_completed", 0)
        if (
            isinstance(quiz_completed, bool)
            or not isinstance(quiz_completed, int)
            or quiz_completed < 0
        ):
            quiz_completed = 0
        is_admin = user.get("is_admin") is True

        return {
            "email": user["email"],
            "score": score,
            "quiz_completed": quiz_completed,
            "is_admin": is_admin,
        }

    def is_admin(self, email):
        user = self.collection.find_one({"email": email}, {"is_admin": 1})
        return bool(user and user.get("is_admin") is True)

    def authenticate(self, email, password):
        if not isinstance(email, str) or not isinstance(password, str):
            return None

        email = email.strip().lower()
        if (
            not email
            or len(email) > 254
            or not password
            or len(password) > self.MAX_PASSWORD_LENGTH
        ):
            return None

        user = self.collection.find_one({"email": email})
        if not user:
            return None

        password_hash = user.get("password")
        if not isinstance(password_hash, str):
            return None
        try:
            password_is_valid = check_password_hash(password_hash, password)
        except ValueError:
            return None
        if not password_is_valid:
            return None

        return self.get_profile(email)

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
