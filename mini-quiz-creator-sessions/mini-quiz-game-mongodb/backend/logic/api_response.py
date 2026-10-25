from flask import jsonify


class APIResponse:
    @staticmethod
    def good_response(
        message,
        data=None,
        status_code=200,
        data_key="data",
        **fields,
    ):
        response = {"success": True, "message": message, **fields}
        if data is not None:
            response[data_key] = data
        return jsonify(response), status_code

    @staticmethod
    def bad_response(
        message,
        status_code=400,
        data=None,
        data_key="data",
        **fields,
    ):
        response = {"success": False, "message": message, **fields}
        if data is not None:
            response[data_key] = data
        return jsonify(response), status_code
