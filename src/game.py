from board import Board, Position
class Game:
    
    def __init__(self):
        pass

    def check_win(self, board: Board, player: int) -> bool:
        
        win_condition = str(player) * 5
        for line in board.grid + board.get_diagonals() + [board.get_column(x) for x in range(board.size)]:
            if win_condition in ''.join(map(str, line)):
                
                return True
        return False


    def _check_sequence(self, sequence: list, player: int) -> bool:
        
        return ''.join(map(str, sequence)).find(str(player) * 5) != -1