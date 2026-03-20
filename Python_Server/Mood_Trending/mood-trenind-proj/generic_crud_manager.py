import json
import os

class MoodTracker:
    """
    A generic CRUD manager for handling a list of dictionaries stored in a JSON file.
    Each item in the list is expected to be a dictionary with a unique 'id' field.
    """

    def __init__(self, file_path):
        self.file_path = file_path
        # Ensure the file exists
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                json.dump([], f)

    def _load_data(self):
        """Load data from JSON file."""
        with open(self.file_path, 'r') as f:
            return json.load(f)

    def _save_data(self, data):
        """Save data to JSON file."""
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=2)

    def create(self, mood_entry):
        """
        Create a new item. The item should be a dict with an 'id'.
        In my case my item is a mood entry with date, mood and notes. If 'id' is not provided, auto-generate one.
        """
        data = self._load_data()
        if 'id' not in mood_entry:
            # Auto-generate id as max existing id + 1
            existing_ids = [d.get('id', 0) for d in data]
            mood_entry['id'] = max(existing_ids) + 1 if existing_ids else 1
        data.append(mood_entry)
        self._save_data(data)
        return mood_entry

    def read_all(self):
        """Read all items."""
        return self._load_data()

    def read_by_id(self, item_id):
        """Read a single item by id."""
        data = self._load_data()
        for item in data:
            if item.get('id') == item_id:
                return item
        return None

    def update(self, item_id, updated_item):
        """
        Update an item by id. The updated_item should be the full dict.
        """
        data = self._load_data()
        for i, item in enumerate(data):
            if item.get('id') == item_id:
                updated_item['id'] = item_id  # Ensure id remains
                data[i] = updated_item
                self._save_data(data)
                return updated_item
        return None

    def delete(self, item_id):
        """Delete an item by id."""
        data = self._load_data()
        data = [item for item in data if item.get('id') != item_id]
        self._save_data(data)
        return True