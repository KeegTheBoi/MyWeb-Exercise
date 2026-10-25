from flask import jsonify, request


class APIResponse:
    @staticmethod
    def parse_json_request(error_message, status_code=400, require_non_empty=False):
        data = request.get_json(silent=True)
        if isinstance(data, dict) and (data or not require_non_empty):
            return data, None
        return None, APIResponse.bad_response(error_message, status_code)

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
