from flask import redirect, render_template, session

from ..common.api_response import APIResponse

"""
Authentication API for handling user login, logout, and session management.
defining the rules so every case (in this case login, logout, session) will be handled by the AuthenticationAPI class.
"""


class AuthenticationAPI(APIResponse):
    def __init__(self, app, user_manager):
        self.user_manager = user_manager
        #adding rule for user login route
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
        #autheniticate requiers mail as identification.
        user = self.user_manager.authenticate( #handle the authentication given data containg mail and password
            data.get("email"),
            data.get("password"),
        )
        if user is None:
            return self.bad_response("Invalid email or password.", 401)

        session.clear()#session is used to store the login info (only mail)
        session["user_email"] = user["email"]
        return self.good_response(
            "Login successful.",
            user=user,
        ) #to the client side user info is send back (for login info)

    """ALL SESSION data is retrieved from this cookie session (it should not be called if not logged in)"""
    def current_session(self):
        email = session.get("user_email")
        #cases if caller uses the session without being logged in.
        if not email: #no session found
            return self.bad_response("You are not logged in.", 401)
        user = self.user_manager.get_profile(email)
        if user is None:
            session.clear()
            return self.bad_response("You are not logged in.", 401)
        return self.good_response("Session retrieved.", user=user)

    def logout(self):
        session.clear() #removes current session cookie (static cookies)
        return self.good_response("Logged out.")

    def logged_in_page(self):
        if not session.get("user_email"):
            return redirect("/login.html")
        return render_template("users.html")

    """Checks if logged in user is admin, and renders the related page"""
    def quiz_creation_page(self):
        email = session.get("user_email")
        if not email:
            return redirect("/login.html")
        if not self.user_manager.is_admin(email):
            return redirect("/users.html")
        return render_template("quiz_creation.html")
