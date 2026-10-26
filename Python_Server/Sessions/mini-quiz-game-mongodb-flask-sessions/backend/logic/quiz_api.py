from flask import session

from .generic_api import GenericAPI


class QuizAPI(GenericAPI):
    def __init__(self, app, manager, write_authorizer, user_manager):
        self.user_manager = user_manager
        super().__init__(
            app,
            manager,
            "quiz",
            write_authorizer=write_authorizer,
        )
        app.add_url_rule(
            "/api/quiz/<item_id>/complete",
            view_func=self.complete_quiz,
            methods=["POST"],
            endpoint="complete_quiz",
        )

    def get_all_entries(self):
        access_error = self._login_access_error()
        if access_error:
            return access_error

        quizzes = self.manager.read_all()
        if not self.user_manager.is_admin(session["user_email"]):
            quizzes = [
                quiz for quiz in quizzes
                if quiz.get("is_available") is True
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

        quiz = self.manager.read_by_id(item_id)
        if not quiz:
            return self.bad_response("Quiz not found.", 404)
        if (
            not self.user_manager.is_admin(session["user_email"])
            and quiz.get("is_available") is not True
        ):
            return self.bad_response("Quiz not found.", 404)
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

        # TODO(gameplay): accept answers, validate them, and calculate the score.
        # TODO(gameplay): persist the attempt and update the user's score/count.
        return self.bad_response(
            "Quiz gameplay has not been implemented yet.",
            status_code=501,
        )

    def _login_access_error(self):
        email = session.get("user_email")
        if not email:
            return self.bad_response("Log in to access quizzes.", 401)
        if self.user_manager.get_profile(email) is None:
            session.clear()
            return self.bad_response("Log in to access quizzes.", 401)
        return None
