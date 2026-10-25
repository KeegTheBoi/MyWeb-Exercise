from flask import Flask, jsonify, render_template, request

class GenericAPI:
    def __init__(
        self,
        app: Flask,
        manager,
        entity_name: str,
        write_authorizer=None,
    ):
        """
        app: Flask instance
        manager: any object that implements create, read_all, read_by_id, update, delete
        entity_name: string, e.g., "quiz", "quote"
        """
        self.app = app
        self.manager = manager
        self.entity_name = entity_name
        self.write_authorizer = write_authorizer
        self.register_routes()

    def register_routes(self):
    # CRUD endpoints with UNIQUE endpoint names

        self.app.add_url_rule(
            f"/api/all_{self.entity_name}s",
            view_func=self.get_all_entries,
            endpoint=f"get_all_{self.entity_name}s"
        )

        self.app.add_url_rule(
            f"/api/{self.entity_name}/<item_id>",
            view_func=self.get_item,
            endpoint=f"get_{self.entity_name}"
        )

        self.app.add_url_rule(
            f"/api/{self.entity_name}",
            view_func=self.create_item,
            methods=["POST"],
            endpoint=f"create_{self.entity_name}"
        )

        self.app.add_url_rule(
            f"/api/{self.entity_name}/<item_id>",
            view_func=self.update_item,
            methods=["PUT"],
            endpoint=f"update_{self.entity_name}"
        )

        self.app.add_url_rule(
            f"/api/{self.entity_name}/<item_id>",
            view_func=self.delete_item,
            methods=["DELETE"],
            endpoint=f"delete_{self.entity_name}"
        )

    # --------- Endpoint methods ---------
    def get_all_entries(self):
        items = self.manager.read_all()
        return self.good_response(f"All {self.entity_name}s retrieved", items)

    def get_item(self, item_id):
        item = self.manager.read_by_id(item_id)
        if item:
            return self.good_response(f"{self.entity_name.capitalize()} retrieved", item)
        return self.bad_response(f"{self.entity_name.capitalize()} not found", status_code=404)

    def create_item(self):
        access_error = self._write_access_error()
        if access_error:
            return access_error

        data = request.get_json()
        if not data:
            return self.bad_response("No data provided")
        try:
            self.manager.create(data)
        except ValueError as error:
            return self.bad_response(str(error))
        return self.good_response(f"{self.entity_name.capitalize()} created successfully", self.manager.read_without_id())

    def update_item(self, item_id):
        access_error = self._write_access_error()
        if access_error:
            return access_error

        data = request.get_json()
        if not data:
            return self.bad_response("No data provided")
        try:
            updated_item = self.manager.update(item_id, data)
        except ValueError as error:
            return self.bad_response(str(error))
        if updated_item:
            return self.good_response(f"{self.entity_name.capitalize()} updated successfully", self.manager.read_without_id())
        return self.bad_response(f"{self.entity_name.capitalize()} not found", status_code=404)

    def delete_item(self, item_id):
        access_error = self._write_access_error()
        if access_error:
            return access_error

        deleted = self.manager.delete(item_id)
        if deleted:
            return self.good_response(f"{self.entity_name.capitalize()} deleted successfully", self.manager.read_without_id())
        return self.bad_response(f"{self.entity_name.capitalize()} not found", status_code=404)

    def _write_access_error(self):
        if self.write_authorizer is None:
            return None
        return self.write_authorizer()

    # --------- Custom response helpers ---------
    def good_response(self, message: str, data=None, status_code: int = 200):
        response = {"success": True, "message": message}
        if data is not None:
            response[self.entity_name + "s"] = data
        return jsonify(response), status_code

    def bad_response(self, message: str, data=None, status_code: int = 400):
        response = {"success": False, "message": message}
        if data is not None:
            response[self.entity_name + "s"] = data
        return jsonify(response), status_code

    # --------- Static file routes ---------
    def register_static_routes(self):
        @self.app.route("/")
        def index():
            return render_template("index.html")