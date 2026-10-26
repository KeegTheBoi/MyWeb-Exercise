from flask import jsonify, request

"""Super class to handle the the request and response for the API endpoints. 
It provides methods to parse JSON requests and generate standardized good and bad responses."""
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
        return APIResponse.response(
            message, status_code, data, data_key, **fields
        )

    @staticmethod
    def bad_response(
        message,
        status_code=400,
        data=None,
        data_key="data",
        **fields,
    ):
        return APIResponse.response(
            message, status_code, data, data_key, **fields
        )

    def response(
            message,
            status_code,
            data,
            data_key="data",
            **fields,
    ):
        response = {"success": status_code < 400, "message": message, **fields}
        if data is not None:
            response[data_key] = data
        return jsonify(response), status_code
    
