
from .generic_crud import ManagerCRUD

class UserLogic(ManagerCRUD):
    def __init__(self, collection):
        super().__init__(collection)
        self.score = 0

    def update_score(self, points):
        self.score += points
        return self.score
    
    def reset_score(self):
        self.score = 0
        return self.score

