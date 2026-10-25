from flask import jsonify, redirect, render_template, request, session


class AuthenticationAPI:
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
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return self._error("Please enter your email and password.")

        user = self.user_manager.authenticate(
            data.get("email"),
            data.get("password"),
        )
        if user is None:
            return self._error("Invalid email or password.", 401)

        session.clear()
        session["user_email"] = user["email"]
        return jsonify(success=True, user=user)

    def current_session(self):
        email = session.get("user_email")
        if not email:
            return AuthenticationAPI._error("You are not logged in.", 401)
        user = self.user_manager.get_profile(email)
        if user is None:
            session.clear()
            return AuthenticationAPI._error("You are not logged in.", 401)
        return jsonify(success=True, user=user)

    @staticmethod
    def logout():
        session.clear()
        return jsonify(success=True)

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

    @staticmethod
    def _error(message, status_code=400):
        return jsonify(success=False, message=message), status_code
