from .json_helper import get_json_data, write_json_data
import random

class QuoteManager:
    def __init__(self, json_file):
        self.json_file = json_file

    def get_dict_quotes(self):        
        return get_json_data(self.json_file)

    def get_quotes(self):
        return [items["quote"] for items in self.get_dict_quotes()]

    def add_quote(self, new_quote):
        data = self.get_dict_quotes()
        data.append({"index": len(data) + 1, "quote": new_quote})
        write_json_data(self.json_file, data)

    def get_random_quote(self):
        return random.choice(self.get_dict_quotes())
    
    def delete_quote(self, quote_id):
        data = self.get_dict_quotes()
        data = [quote for quote in data if quote["index"] != quote_id]
        write_json_data(self.json_file, data)