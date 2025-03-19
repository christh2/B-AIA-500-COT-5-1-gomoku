
from itertools import product
from typing import Optional
from src.board import Board, Position

class GomokuAI:
    def __init__(self):
        pass

    def best_move(self, board: Board, player_id: int, opponent_id: int) -> Optional[Position]:
        
        winning_move = self.find_winning_move(board, player_id)
        if winning_move:
            return winning_move

        
        blocking_move = self.find_winning_move(board, opponent_id)
        if blocking_move:
            return blocking_move

        
        weighted_board = self.calculate_weights(board, player_id)
        best_positions = weighted_board.get_max_positions()
        return best_positions[0] if best_positions else None

    def find_winning_move(self, board: Board, player_id: int) -> Optional[Position]:
        
        for y, x in product(range(board.size), range(board.size)):
            if board.grid[y][x] == 0:  
                board.grid[y][x] = player_id  
                if self.check_victory(board, Position(x, y), player_id):
                    board.grid[y][x] = 0  
                    return Position(x, y)  
                board.grid[y][x] = 0  
        return None

    def check_victory(self, board: Board, pos: Position, player_id: int) -> bool:
        
        return (
            self.count_in_direction(board, pos, player_id, (1, 0)) >= 5 or  
            self.count_in_direction(board, pos, player_id, (0, 1)) >= 5 or  
            self.count_in_direction(board, pos, player_id, (1, 1)) >= 5 or  
            self.count_in_direction(board, pos, player_id, (1, -1)) >= 5    
        )

    def count_in_direction(self, board: Board, pos: Position, player_id: int, direction: tuple) -> int:
        dx, dy = direction
        count = 1  

        
        x, y = pos.x + dx, pos.y + dy
        while 0 <= x < board.size and 0 <= y < board.size and board.grid[y][x] == player_id:
            count += 1
            x += dx
            y += dy

        
        x, y = pos.x - dx, pos.y - dy
        while 0 <= x < board.size and 0 <= y < board.size and board.grid[y][x] == player_id:
            count += 1
            x -= dx
            y -= dy

        return count

    def calculate_weights(self, board: Board, player_id: int) -> Board:
        weighted_board = Board(board.size)
        for y, x in product(range(board.size), range(board.size)):
            if board.grid[y][x] == 0 and self._has_adjacent_piece(board, Position(x, y)):
                weighted_board.grid[y][x] = self._evaluate_position(board, Position(x, y), player_id)
        return weighted_board

    def _has_adjacent_piece(self, board: Board, pos: Position) -> bool:
        y, x = pos.y, pos.x
        size = board.size
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < size and 0 <= nx < size and board.grid[ny][nx] != 0:
                return True
        return False

    def _evaluate_position(self, board: Board, pos: Position, player_id: int) -> int:
        score = 0
        score += self.count_in_direction(board, pos, player_id, (1, 0))  
        score += self.count_in_direction(board, pos, player_id, (0, 1))  
        score += self.count_in_direction(board, pos, player_id, (1, 1))  
        score += self.count_in_direction(board, pos, player_id, (1, -1)) 
        return score