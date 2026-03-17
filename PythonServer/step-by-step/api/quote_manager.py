from json_helper import get_json_data, write_json_data

class QuoteManager:
    def __init__(self, json_file):
        self.json_file = json_file


    def get_quotes(self):
        return get_json_data(self.json_file)["quotes"]

    def add_quote(self, new_quote):
        data = get_json_data(self.json_file)
        data["quotes"].append(new_quote)
        write_json_data(self.json_file, data)

    def get_random_quote(self):
        import random
        return random.choice(self.get_quotes())