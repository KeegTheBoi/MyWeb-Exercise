
from .generic_crud import ManagerCRUD

class QuizLogic(ManagerCRUD):
    def __init__(self, collection):
        super().__init__(collection)  # chiama il costruttore della base

    def ensure_availability_fields(self):
        self.collection.update_many(
            {"is_available": {"$exists": False}},
            {"$set": {"is_available": True}},
        )

    def create(self, entry):
        quiz = self._validate_quiz(entry)
        quiz.setdefault("is_available", True)
        return super().create(quiz)

    def update(self, item_id, updated_item):
        quiz = self._validate_quiz(updated_item, partial=True)
        return super().update(item_id, quiz)

    @staticmethod
    def _validate_quiz(quiz, partial=False):
        if not isinstance(quiz, dict) or not quiz:
            raise ValueError("Quiz data is required.")

        allowed_fields = {"title", "description", "is_available"}
        if set(quiz) - allowed_fields:
            raise ValueError("Only title, description, and availability can be changed.")

        validated = dict(quiz)
        for field, max_length in (("title", 120), ("description", 500)):
            if field not in validated and partial:
                continue
            value = validated.get(field)
            if not isinstance(value, str) or not value.strip():
                raise ValueError(f"A non-empty quiz {field} is required.")
            if len(value.strip()) > max_length:
                raise ValueError(f"Quiz {field} is too long.")
            validated[field] = value.strip()

        if "is_available" in validated and not isinstance(
            validated["is_available"],
            bool,
        ):
            raise ValueError("Quiz availability must be true or false.")
        return validated

    