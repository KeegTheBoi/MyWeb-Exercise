from flask import redirect, render_template, session

from .api_response import APIResponse


class AuthenticationAPI(APIResponse):
    def __init__(self, app, user_manager):
        self.user_manager = user_manager

        app.add_url_rule(
            "/api/login",
            view_func=self.login,
            methods=["POST"],
            endpoint="login_user",
        )
        app.add_url_rule(
            "/api/session",
            view_func=self.current_session,
            methods=["GET"],
            endpoint="current_user_session",
        )
        app.add_url_rule(
            "/api/logout",
            view_func=self.logout,
            methods=["POST"],
            endpoint="logout_user",
        )
        app.add_url_rule(
            "/users.html",
            view_func=self.logged_in_page,
            endpoint="logged_in_page",
        )
        app.add_url_rule(
            "/quiz_creation.html",
            view_func=self.quiz_creation_page,
            endpoint="quiz_creation_page",
        )

    def login(self):
        data, error_response = self.parse_json_request(
            "Please enter your email and password."
        )
        if error_response:
            return error_response

        user = self.user_manager.authenticate(
            data.get("email"),
            data.get("password"),
        )
        if user is None:
            return self.bad_response("Invalid email or password.", 401)

        session.clear()
        session["user_email"] = user["email"]
        return self.good_response("Login successful.", user=user)

    def current_session(self):
        email = session.get("user_email")
        if not email:
            return self.bad_response("You are not logged in.", 401)
        user = self.user_manager.get_profile(email)
        if user is None:
            session.clear()
            return self.bad_response("You are not logged in.", 401)
        return self.good_response("Session retrieved.", user=user)

    def logout(self):
        session.clear()
        return self.good_response("Logged out.")

    def logged_in_page(self):
        if not session.get("user_email"):
            return redirect("/login.html")
        return render_template("users.html")

    def quiz_creation_page(self):
        email = session.get("user_email")
        if not email:
            return redirect("/login.html")
        if not self.user_manager.is_admin(email):
            return redirect("/users.html")
        return render_template("quiz_creation.html")

