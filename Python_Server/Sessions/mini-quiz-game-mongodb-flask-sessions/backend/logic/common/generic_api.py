from flask import Flask, render_template

from .api_response import APIResponse


class GenericAPI(APIResponse):
    def __init__( self, app: Flask, manager, entity_name: str, write_authorizer=None):
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

    """ --------- Endpoint methods --------------------------------------------
    Without knowing the database methods, these methods handle the API requests
    and responses for CRUD operations on the entity. They use the manager to
    perform the actual database operations and return standardized responses using
    the APIResponse methods.
    """
    def get_all_entries(self): #collecting all elements from the database
        items = self.manager.read_all() #items us a collections of dict elements.
        return self.good_response(
            f"All {self.entity_name}s retrieved",
            items,
            data_key=f"{self.entity_name}s",
        )

    def get_item(self, item_id): #retrieving a single element from the database given its id ()
        item = self.manager.read_by_id(item_id)
        if item: 
            return self.good_response(
                f"{self.entity_name.capitalize()} retrieved",
                item,
                data_key=self.entity_name,
            )
        return self.bad_response(f"{self.entity_name.capitalize()} not found", status_code=404)

    def create_item(self):
        access_error = self._write_access_error()
        if access_error:
            return access_error

        data, error_response = self.parse_json_request(
            "No data provided",
            require_non_empty=True,
        )
        if error_response:
            return error_response
        try:
            self.manager.create(data) #handles database related errors as a value error.
        except ValueError as error:
            return self.bad_response(str(error))
        return self.good_response(
            f"{self.entity_name.capitalize()} created successfully",
            self.manager.read_without_id(),
            data_key=f"{self.entity_name}s",
        )

    def update_item(self, item_id):
        access_error = self._write_access_error()
        if access_error:
            return access_error

        data, error_response = self.parse_json_request(
            "No data provided",
            require_non_empty=True,
        )
        if error_response:
            return error_response
        try:
            updated_item = self.manager.update(item_id, data)
        except ValueError as error:
            return self.bad_response(str(error))
        if updated_item:
            return self.good_response(
                f"{self.entity_name.capitalize()} updated successfully",
                self.manager.read_without_id(),
                data_key=f"{self.entity_name}s",
            )
        return self.bad_response(f"{self.entity_name.capitalize()} not found", status_code=404)

    def delete_item(self, item_id):
        access_error = self._write_access_error()
        if access_error:
            return access_error

        deleted = self.manager.delete(item_id)
        if deleted:
            return self.good_response(
                f"{self.entity_name.capitalize()} deleted successfully",
                self.manager.read_without_id(),
                data_key=f"{self.entity_name}s",
            )
        return self.bad_response(f"{self.entity_name.capitalize()} not found", status_code=404)

    def _write_access_error(self):
        if self.write_authorizer is None:
            return None
        return self.write_authorizer()

    # --------- Static file routes ---------
    def register_static_routes(self):
        @self.app.route("/")
        def index():
            return render_template("index.html")