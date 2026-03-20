
from .generic_crud import ManagerCRUD

class QuizLogic(ManagerCRUD):
    def __init__(self, collection):
        super().__init__(collection)  # chiama il costruttore della base
        

    