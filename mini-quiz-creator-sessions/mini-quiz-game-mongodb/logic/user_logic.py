
from .generic_crud import ManagerCRUD
from werkzeug.security import generate_password_hash

class UserLogic(ManagerCRUD):
    def __init__(self, collection):
        super().__init__(collection)
        self.score = 0

    def create(self, entry):
        user = dict(entry)
        user["password"] = self._hash_password(user.get("password"))
        return super().create(user)

    def update(self, item_id, updated_item):
        user = dict(updated_item)
        if "password" in user:
            user["password"] = self._hash_password(user["password"])
        return super().update(item_id, user)

    def read_all(self):
        return [self._remove_password(user) for user in super().read_all()]

    def read_by_id(self, item_id):
        user = super().read_by_id(item_id)
        return self._remove_password(user) if user else None

    def read_without_id(self):
        return [self._remove_password(user) for user in super().read_without_id()]

    @staticmethod
    def _hash_password(password):
        if not isinstance(password, str) or not password:
            raise ValueError("A non-empty password is required")
        return generate_password_hash(password)

    @staticmethod
    def _remove_password(user):
        user.pop("password", None)
        return user

    def update_score(self, points):
        self.score += points
        return self.score
    
    def reset_score(self):
        self.score = 0
        return self.score
