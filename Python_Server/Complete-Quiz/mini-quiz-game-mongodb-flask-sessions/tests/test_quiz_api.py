import unittest

from bson import ObjectId
from flask import Flask

from backend.logic.common.generic_crud import ManagerCRUD
from backend.logic.quizzes.quiz_api import QuizAPI


class QuizManager(ManagerCRUD):
    def __init__(self):
        quiz = {
            "_id": ObjectId("507f1f77bcf86cd799439011"),
            "title": "Science",
            "description": "Basics",
            "is_available": True,
            "questions": [
                {
                    "question": "What color is the sky?",
                    "choices": ["Blue", "Green"],
                    "answer": "Blue",
                },
                {
                    "question": "How many legs does a spider have?",
                    "choices": ["Six", "Eight"],
                    "answer": "Eight",
                },
            ],
        }
        super().__init__(QuizCollection(quiz))
        self._quiz_id = str(quiz["_id"])


    @property
    def quiz_id(self):
        return self._quiz_id


class QuizCollection:
    def __init__(self, quiz):
        self.quiz = quiz

    def find(self, *args):
        return [{**self.quiz}]


class QuizUserManager:
    def __init__(self):
        self.attempts = {}
        self.admin = False

    def is_admin(self, email):
        return self.admin

    def get_profile(self, email):
        return {"email": email}

    def get_quiz_attempts(self, email):
        return self.attempts

    def record_quiz_attempt(self, email, quiz_id, attempt):
        if quiz_id in self.attempts:
            return False
        self.attempts[quiz_id] = attempt
        return True


class QuizAPITests(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.secret_key = "test"
        self.quiz_manager = QuizManager()
        self.user_manager = QuizUserManager()
        QuizAPI(self.app, self.quiz_manager, None, self.user_manager)
        self.client = self.app.test_client()
        with self.client.session_transaction() as browser_session:
            browser_session["user_email"] = "player@example.com"

    def test_completion_returns_score_and_correct_answers(self):
        response = self.client.post(
            f"/api/quiz/{self.quiz_manager.quiz_id}/complete",
            json={"answers": ["Blue", "Six"]},
        )

        self.assertEqual(response.status_code, 200)
        result = response.get_json()["result"]
        self.assertEqual(result["percentage"], 50)
        self.assertEqual(result["correct_count"], 1)
        self.assertTrue(result["completed"])
        self.assertEqual(result["results"][0]["correct_answer"], "Blue")
        self.assertEqual(result["results"][1]["correct_answer"], "Eight")
        self.assertIn(self.quiz_manager.quiz_id, self.user_manager.attempts)

    def test_completed_quiz_cannot_be_submitted_again(self):
        self.user_manager.attempts[self.quiz_manager.quiz_id] = {
            "result": {"completed": True}
        }

        response = self.client.post(
            f"/api/quiz/{self.quiz_manager.quiz_id}/complete",
            json={"answers": ["Blue", "Eight"]},
        )

        self.assertEqual(response.status_code, 409)

    def test_completion_requires_one_valid_choice_per_question(self):
        response = self.client.post(
            f"/api/quiz/{self.quiz_manager.quiz_id}/complete",
            json={"answers": ["Not a choice", "Eight"]},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.user_manager.attempts, {})

    def test_quiz_list_hides_answers_and_reports_completed_attempts(self):
        response = self.client.get("/api/all_quizs")
        quiz = response.get_json()["quizs"][0]

        self.assertFalse(quiz["completed"])
        self.assertNotIn("answer", quiz["questions"][0])

        saved_result = {
            "completed": True,
            "percentage": 100,
            "correct_count": 2,
            "total_questions": 2,
            "results": [],
        }
        self.user_manager.attempts[self.quiz_manager.quiz_id] = {
            "result": saved_result
        }
        response = self.client.get("/api/all_quizs")
        quiz = response.get_json()["quizs"][0]

        self.assertTrue(quiz["completed"])
        self.assertEqual(quiz["attempt_result"], saved_result)
        detail_response = self.client.get(
            f"/api/quiz/{self.quiz_manager.quiz_id}"
        )
        detail_quiz = detail_response.get_json()["quiz"]
        self.assertTrue(detail_quiz["completed"])
        self.assertEqual(detail_quiz["attempt_result"], saved_result)

    def test_admin_quiz_list_and_detail_include_saved_attempt_result(self):
        saved_result = {
            "completed": True,
            "percentage": 50,
            "correct_count": 1,
            "total_questions": 2,
            "results": [],
        }
        self.user_manager.admin = True
        self.user_manager.attempts[self.quiz_manager.quiz_id] = {
            "result": saved_result
        }

        list_response = self.client.get("/api/all_quizs")
        list_quiz = list_response.get_json()["quizs"][0]
        detail_response = self.client.get(
            f"/api/quiz/{self.quiz_manager.quiz_id}"
        )
        detail_quiz = detail_response.get_json()["quiz"]

        self.assertTrue(list_quiz["completed"])
        self.assertEqual(list_quiz["attempt_result"], saved_result)
        self.assertTrue(detail_quiz["completed"])
        self.assertEqual(detail_quiz["attempt_result"], saved_result)

    def test_start_quiz_serializes_mongodb_object_id(self):
        response = self.client.get(
            f"/api/quiz/{self.quiz_manager.quiz_id}"
        )

        self.assertEqual(response.status_code, 200)
        quiz = response.get_json()["quiz"]
        self.assertEqual(quiz["_id"], self.quiz_manager.quiz_id)
        self.assertNotIn("answer", quiz["questions"][0])


if __name__ == "__main__":
    unittest.main()
