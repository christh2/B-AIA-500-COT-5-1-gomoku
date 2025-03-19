
from typing import List, Tuple

class Position:
    
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

class Board:
    
    def __init__(self, size: int):
        self.size = size
        self.grid = [[0] * size for _ in range(size)]

    def reset(self):
        
        self.grid = [[0] * self.size for _ in range(self.size)]

    def place_piece(self, pos: Position, player: int):
        
        if 0 <= pos.x < self.size and 0 <= pos.y < self.size:
            self.grid[pos.y][pos.x] = player

    def get_size(self) -> int:
        
        return self.size

    def get_column(self, x: int) -> List[int]:
        
        return [self.grid[y][x] for y in range(self.size)]

    def get_diagonals(self) -> List[List[int]]:
        
        return [[self.grid[y][y] for y in range(self.size)], [self.grid[y][self.size - y - 1] for y in range(self.size)]]

    def get_max_positions(self) -> List[Position]:
        
        max_val = max(max(row) for row in self.grid)
        return [Position(x, y) for y, row in enumerate(self.grid) for x, val in enumerate(row) if val == max_val]
    
    def display(self):
        
        for row in self.grid:
            print(" ".join(str(cell) for cell in row))
        print()  
