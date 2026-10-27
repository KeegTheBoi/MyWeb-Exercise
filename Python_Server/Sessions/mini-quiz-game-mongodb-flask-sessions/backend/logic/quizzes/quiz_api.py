from datetime import datetime, timezone

from flask import session

from ..common.generic_api import GenericAPI


class QuizAPI(GenericAPI):
    def __init__(self, app, manager, write_authorizer, user_manager):
        self.user_manager = user_manager
        super().__init__(
            app,
            manager,
            "quiz",
            write_authorizer=write_authorizer, #Lets only admins create quizzes
        )
        app.add_url_rule(
            "/api/quiz/<item_id>/complete",
            view_func=self.complete_quiz,
            methods=["POST"],
            endpoint="complete_quiz",
        )

    """Method for retrieving the quizzes available to the user. 
    Admins can see all quizzes, while regular users can only see available quizzes."""
    def get_all_entries(self):
        access_error = self._login_access_error()
        if access_error:
            return access_error

        quizzes = self.manager.read_all()
        is_admin = self.user_manager.is_admin(session["user_email"])
        attempts = self.user_manager.get_quiz_attempts(session["user_email"])
        quizzes = [
            {
                **(quiz if is_admin else self._hide_answers(quiz)),
                "completed": str(quiz["_id"]) in attempts,
                "attempt_result": attempts.get(str(quiz["_id"]), {}).get("result"),
            }
            for quiz in quizzes
            if is_admin or quiz.get("is_available") is True
        ]
        return self.good_response(
            "Available quizzes retrieved.",
            quizzes,
            data_key="quizs",
        )

    def get_item(self, item_id):
        access_error = self._login_access_error()
        if access_error:
            return access_error

        quiz = self.manager.read_by_id(item_id) #main retrieval of the quiz by id
        if not quiz:
            return self.bad_response("Quiz not found.", 404)
        if not self.user_manager.is_admin(session["user_email"]):
            if quiz.get("is_available") is not True:
                return self.bad_response("Quiz not available.", 404)
            quiz = self._hide_answers(quiz)
        attempts = self.user_manager.get_quiz_attempts(session["user_email"])
        quiz = {
            **quiz,
            "completed": item_id in attempts,
            "attempt_result": attempts.get(item_id, {}).get("result"),
        }
        return self.good_response("Quiz retrieved.", quiz, data_key="quiz")

    def complete_quiz(self, item_id):
        access_error = self._login_access_error()
        if access_error:
            return access_error

        quiz = self.manager.read_by_id(item_id)
        if not quiz:
            return self.bad_response("Quiz not found.", 404)
        if quiz.get("is_available") is not True:
            return self.bad_response("This quiz is not available.", 403)

        email = session["user_email"]
        if self.user_manager.get_quiz_attempts(email).get(item_id):
            return self.bad_response(
                "You have already completed this quiz.",
                status_code=409,
            )

        data, error_response = self.parse_json_request(
            "Submit one answer for every question.",
            require_non_empty=True,
        )
        if error_response:
            return error_response

        answers = data.get("answers")
        questions = quiz.get("questions")
        if (
            not isinstance(answers, list)
            or not isinstance(questions, list)
            or not questions
            or len(answers) != len(questions)
        ):
            return self.bad_response(
                "Submit one answer for every question.",
                status_code=400,
            )

        results = []
        correct_count = 0
        for question, answer in zip(questions, answers):
            choices = question.get("choices")
            correct_answer = question.get("answer")
            if (
                not isinstance(answer, str)
                or not isinstance(choices, list)
                or answer not in choices
            ):
                return self.bad_response(
                    "Each answer must be one of that question's choices.",
                    status_code=400,
                )

            is_correct = answer == correct_answer
            if is_correct:
                correct_count += 1
            results.append(
                {
                    "question": question["question"],
                    "selected_answer": answer,
                    "correct_answer": correct_answer,
                    "is_correct": is_correct,
                }
            )

        total_questions = len(questions)
        percentage = round(correct_count * 100 / total_questions, 1)
        attempt_result = {
            "completed": True,
            "percentage": percentage,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "results": results,
        }
        attempt = {
            "quiz_id": item_id,
            "completed_at": datetime.now(timezone.utc),
            "result": attempt_result,
        }
        if not self.user_manager.record_quiz_attempt(email, item_id, attempt):
            return self.bad_response(
                "You have already completed this quiz.",
                status_code=409,
            )

        return self.good_response(
            "Quiz completed. You cannot retake it.",
            attempt_result,
            data_key="result",
        )

    def _login_access_error(self):
        email = session.get("user_email")
        if not email:
            return self.bad_response("Log in to access quizzes.", 401)
        if self.user_manager.get_profile(email) is None:
            session.clear()
            return self.bad_response("Log in to access quizzes.", 401)
        return None

    @staticmethod
    def _hide_answers(quiz):
        return {
            **quiz,
            "questions": [
                {
                    key: value
                    for key, value in question.items()
                    if key != "answer"
                }
                for question in quiz.get("questions", [])
            ],
        }
