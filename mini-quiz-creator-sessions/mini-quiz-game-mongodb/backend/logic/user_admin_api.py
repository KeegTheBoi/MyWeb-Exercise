from flask import request, session

from .api_response import APIResponse


class UserAdminAPI(APIResponse):
    def __init__(self, app, user_manager, admin_authorizer):
        self.user_manager = user_manager
        self.admin_authorizer = admin_authorizer
        app.add_url_rule(
            "/api/admin/users",
            view_func=self.list_users,
            methods=["GET"],
            endpoint="admin_list_users",
        )
        app.add_url_rule(
            "/api/admin/users/<user_id>/role",
            view_func=self.update_role,
            methods=["PATCH"],
            endpoint="admin_update_user_role",
        )
        app.add_url_rule(
            "/api/admin/users/<user_id>",
            view_func=self.delete_user,
            methods=["DELETE"],
            endpoint="admin_delete_user",
        )

    def list_users(self):
        access_error = self.admin_authorizer()
        if access_error:
            return access_error
        return self.good_response(
            "Users retrieved.",
            users=self.user_manager.list_profiles_for_admin(),
        )

    def update_role(self, user_id):
        access_error = self.admin_authorizer()
        if access_error:
            return access_error

        data, error_response = self.parse_json_request(
            "A valid role setting is required.",
        )
        if error_response:
            return error_response
        if not isinstance(data.get("is_admin"), bool):
            return self.bad_response("is_admin must be true or false.")

        user = self.user_manager.get_admin_profile(user_id)
        if user is None:
            return self.bad_response("User not found.", 404)
        if user["email"] == session.get("user_email") and not data["is_admin"]:
            return self.bad_response("You cannot remove your own admin role.", 403)

        updated_user = self.user_manager.set_user_admin_role(
            user_id,
            data["is_admin"],
        )
        if updated_user is None:
            return self.bad_response("User not found.", 404)
        return self.good_response("User role updated.", user=updated_user)

    def delete_user(self, user_id):
        access_error = self.admin_authorizer()
        if access_error:
            return access_error

        user = self.user_manager.get_admin_profile(user_id)
        if user is None:
            return self.bad_response("User not found.", 404)
        if user["is_admin"]:
            return self.bad_response("Only regular user accounts can be deleted.", 403)
        if not self.user_manager.delete_regular_user(user_id):
            return self.bad_response("User could not be deleted.", 409)
        return self.good_response(
            "User account deleted.",
            user={"email": user["email"]},
        )
