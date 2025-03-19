

from src.api import GomokuAPI
from src.board import Board, Position
from src.ai_min_max import GomokuAI
import sys


class GomokuBot:
    def __init__(self, api: GomokuAPI, ai: GomokuAI):
        self.api = api
        self.ai = ai
        self.board = None
        self.player = 1
        self.opponent = 2

    def process_command(self, command: list):
        if not command or len(command) < 1:
            self.api.send_response("UNKNOWN command")
            return

        action = command[0]
        if action == "START":
            try:
                size = int(command[1]) if len(command) > 1 else 20
                if size != 20:
                    self.api.send_response("ERROR message - unsupported size or other error")
                    return
                
                self.board = Board(size)
                self.api.send_response("OK")
            except Exception as e:
                self.api.send_response(f"ERROR message - Error while executing command '{command}' : {e}")

        elif action == "TURN":
            try:
                
                x, y = map(int, command[1].split(","))
                
                
                if not (0 <= x < self.board.size and 0 <= y < self.board.size):
                    error_message = f"ERROR message - Error while executing command '{command}' : list index out of range"
                    self.api.send_response(error_message)
                    

                
                elif self.board.grid[y][x] != 0:
                    error_message = f"ERROR message - Error while executing command '{command}' : position already occupied"
                    self.api.send_response(error_message)
                    

                else:
                    self.board.place_piece(Position(x, y), self.opponent)

                    if self.ai.check_victory(self.board, Position(x, y), self.opponent):
                        
                        self.api.send_response("LOSS")
                        exit(0)

                    
                    self.play()

            except IndexError:
                error_message = f"ERROR message - Error while executing command '{command}' : list index out of range"
                self.api.send_response(error_message)
                
            except ValueError as e:
                error_message = f"ERROR message - Error while executing command '{command}' : {e}"
                self.api.send_response(error_message)
                
            except Exception as e:
                error_message = f"ERROR message - Unexpected error while executing command '{command}' : {e}"
                self.api.send_response(error_message)
                

        elif action == "BEGIN":
            try:
                center = self.board.size // 2
                move = Position(center, center)
                self.board.place_piece(move, self.player)
                self.api.send_response(f"{move.x},{move.y}")
                
                # self.board.display()
            except Exception as e:
                self.api.send_response(f"ERROR message - Error while executing command '{command}' : {e}")
                

        elif action == "BOARD":
            try:
                while True:
                    line = self.api.read_command()
                    if isinstance(line, list):
                        line = line[0]

                    if line.strip() == "DONE":
                        break

                    try:
                        x, y, player = map(int, line.split(","))
                    except ValueError:
                        print(f"ERROR message - Invalid format for line: {line}")
                        continue

                    if not (0 <= x < self.board.size and 0 <= y < self.board.size):
                        print(f"ERROR message - Error: Position ({x}, {y}) is out of grild.")
                        continue

                    if self.board.grid[y][x] != 0:
                        print(f"ERROR message - Error: The position ({x}, {y}) is already occupied.")
                        continue

                    self.board.place_piece(Position(x, y), player)

                    if self.ai.check_victory(self.board, Position(x, y), player):
                        if player == self.player:
                            self.api.send_response("WIN")
                        else:
                            self.api.send_response("LOSS")
                        exit(0)

                self.play()
            except Exception as e:
                self.api.send_response(f"ERROR message - Error while executing command 'BOARD': {e}")

                

        elif action == "END":
            exit(0)

        elif action == "ABOUT":
            self.api.send_response('name="GomokuBot", version="1.0", author="Christ HOUNKANRIN", country="Benin"')
        else:
            self.api.send_response("UNKNOWN command")

    def play(self):
        if self.board:
            move = self.ai.best_move(self.board, self.player, self.opponent)
            if move:
                if self.board.grid[move.y][move.x] != 0:
                    print(f"Error: The position ({move.x}, {move.y}) is already occupied. Choosing another move.")
                    return

                self.board.place_piece(move, self.player)
                self.api.send_response(f"{move.x},{move.y}")
                
                # self.board.display()

                if self.ai.check_victory(self.board, move, self.player):
                    
                    self.api.send_response("WIN")
                    exit(0)

                

    
    
    
    
    
    
    
