
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

        allowed_fields = {"title", "description", "questions", "is_available"}
        if set(quiz) - allowed_fields:
            raise ValueError(
                "Only title, description, questions, and availability can be changed."
            )

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

        if "questions" in validated or not partial:
            validated["questions"] = QuizLogic._validate_questions(
                validated.get("questions")
            )

        if "is_available" in validated and not isinstance(
            validated["is_available"],
            bool,
        ):
            raise ValueError("Quiz availability must be true or false.")
        return validated

    @staticmethod
    def _validate_questions(questions):
        if not isinstance(questions, list) or not questions:
            raise ValueError("A quiz must contain at least one question.")

        validated_questions = []
        for question_number, question in enumerate(questions, start=1):
            if not isinstance(question, dict) or set(question) != {
                "question",
                "choices",
                "answer",
            }:
                raise ValueError(
                    f"Question {question_number} must include question, choices, and answer."
                )

            prompt = question["question"]
            if not isinstance(prompt, str) or not prompt.strip():
                raise ValueError(f"Question {question_number} needs question text.")
            prompt = prompt.strip()
            if len(prompt) > 500:
                raise ValueError(f"Question {question_number} is too long.")

            choices = question["choices"]
            if not isinstance(choices, list) or len(choices) < 2:
                raise ValueError(
                    f"Question {question_number} must have at least two choices."
                )

            normalized_choices = []
            for choice_number, choice in enumerate(choices, start=1):
                if not isinstance(choice, str) or not choice.strip():
                    raise ValueError(
                        f"Choice {choice_number} for question {question_number} cannot be empty."
                    )
                choice = choice.strip()
                if len(choice) > 200:
                    raise ValueError(
                        f"Choice {choice_number} for question {question_number} is too long."
                    )
                if choice in normalized_choices:
                    raise ValueError(
                        f"Question {question_number} cannot have duplicate choices."
                    )
                normalized_choices.append(choice)

            answer = question["answer"]
            if not isinstance(answer, str) or not answer.strip():
                raise ValueError(
                    f"The answer for question {question_number} must match one of its choices."
                )
            answer = answer.strip()
            if answer not in normalized_choices:
                raise ValueError(
                    f"The answer for question {question_number} must match one of its choices."
                )

            validated_questions.append(
                {
                    "question": prompt,
                    "choices": normalized_choices,
                    "answer": answer,
                }
            )

        return validated_questions

    