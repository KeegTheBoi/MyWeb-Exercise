import unittest

from backend.logic.quiz_api import QuizAPI
from backend.logic.quiz_logic import QuizLogic


class QuizLogicTests(unittest.TestCase):
    def setUp(self):
        self.quiz = {
            "title": "Science",
            "description": "Basics",
            "is_available": True,
            "questions": [
                {
                    "question": "What color is the sky?",
                    "choices": ["Blue", "Green"],
                    "answer": "Blue",
                }
            ],
        }

    def test_validate_quiz_normalizes_question_data(self):
        quiz = {
            **self.quiz,
            "questions": [
                {
                    "question": "  What color is the sky? ",
                    "choices": [" Blue ", "Green"],
                    "answer": " Blue ",
                }
            ],
        }

        validated = QuizLogic._validate_quiz(quiz)

        self.assertEqual(
            validated["questions"],
            [
                {
                    "question": "What color is the sky?",
                    "choices": ["Blue", "Green"],
                    "answer": "Blue",
                }
            ],
        )

    def test_create_requires_at_least_one_question(self):
        with self.assertRaisesRegex(ValueError, "at least one question"):
            QuizLogic._validate_quiz({**self.quiz, "questions": []})

    def test_question_requires_two_distinct_choices(self):
        invalid_questions = [
            {"question": "Q", "choices": ["A"], "answer": "A"},
            {"question": "Q", "choices": ["A", " A "], "answer": "A"},
        ]

        for question in invalid_questions:
            with self.subTest(question=question):
                with self.assertRaises(ValueError):
                    QuizLogic._validate_quiz(
                        {**self.quiz, "questions": [question]}
                    )

    def test_answer_must_match_one_of_the_choices(self):
        question = {
            "question": "Q",
            "choices": ["A", "B"],
            "answer": "C",
        }

        with self.assertRaisesRegex(ValueError, "must match one of its choices"):
            QuizLogic._validate_quiz({**self.quiz, "questions": [question]})

    def test_partial_update_can_change_title_without_questions(self):
        self.assertEqual(
            QuizLogic._validate_quiz({"title": "New title"}, partial=True),
            {"title": "New title"},
        )

    def test_public_quiz_does_not_include_correct_answers(self):
        public_quiz = QuizAPI._hide_answers(self.quiz)

        self.assertEqual(
            public_quiz["questions"],
            [
                {
                    "question": "What color is the sky?",
                    "choices": ["Blue", "Green"],
                }
            ],
        )
        self.assertEqual(self.quiz["questions"][0]["answer"], "Blue")


if __name__ == "__main__":
    unittest.main()
