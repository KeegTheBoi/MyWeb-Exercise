import json


def get_json_data(file_name):
    with open(file_name, "r") as f:
        return json.load(f)  # data is now a dict
    
def write_json_data(file_name,data):
    # Write the updated data back to the file
    with open(file_name, "w") as f:
        json.dump(data, f, indent=2)