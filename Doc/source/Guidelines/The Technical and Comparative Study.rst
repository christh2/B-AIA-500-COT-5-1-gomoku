The Technical and Comparative Study
===================================

Introduction
------------

This project contains an artificial intelligence (AI) designed to play the game of Gomoku, a strategy game where two players alternate placing their pieces on a board. The AI uses the Minimax algorithm to determine the best possible move by evaluating different game situations.

Why Use Minimax?
----------------

The Minimax algorithm is a classic method used in zero-sum games to minimize the maximum potential loss. Here are some reasons for its use in this project:

- **Move Evaluation**: Minimax allows the AI to evaluate the consequences of each possible move, considering not only its own gains but also the potential losses caused by the opponent's moves.
- **Anticipating Opponent Moves**: By simulating the opponent's moves, the AI can block winning strategies while pursuing its own victory.
- **Optimal Decision Making**: Minimax ensures that the AI selects the move that maximizes its chances of winning while minimizing those of the opponent.

Examples
--------

1. **Winning Move**: If the AI has a move that allows it to win immediately, Minimax will select that move without evaluating other options.
   
2. **Blocking an Opponent Move**: If the opponent has an opportunity to win on the next turn, the AI will choose to block that move before considering its own victory.

Key Components
--------------

gomoku_ai.py
------------

This file contains the `GomokuAI` class, which implements methods to determine the best move. Key methods include:

- **best_move**:
  
  .. code-block:: python

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
  
  - **Description**: Finds the best move by first checking for winning moves, then blocking moves, and finally using a weighted evaluation of positions.
  - **Utility**: Maximizes the chances of victory by taking into account the opponent's moves.

- **find_winning_move**:
  
  .. code-block:: python

      def find_winning_move(self, board: Board, player_id: int) -> Optional[Position]:
          for y, x in product(range(board.size), range(board.size)):
              if board.grid[y][x] == 0:  
                  board.grid[y][x] = player_id  
                  if self.check_victory(board, Position(x, y), player_id):
                      board.grid[y][x] = 0  
                      return Position(x, y)  
                  board.grid[y][x] = 0  
          return None
  
  - **Description**: Checks if a move can lead to an immediate victory.
  - **Utility**: Prioritizes direct victories, which is crucial in a game like Gomoku.

gomoku_bot.py
-------------

This file manages the interaction between the AI and the game API. Key methods include:

- **process_command**:
  
  .. code-block:: python

      def process_command(self, command: list):
          if not command or len(command) < 1:
              self.api.send_response("UNKNOWN command")
              return

          action = command[0]
          if action == "START":
              ...
          elif action == "TURN":
              ...
          elif action == "BEGIN":
              ...
          elif action == "BOARD":
              ...
          elif action == "END":
              exit(0)
          elif action == "ABOUT":
              self.api.send_response('name="GomokuBot", version="1.0", author="Christ HOUNKANRIN", country="Benin"')
          else:
              self.api.send_response("UNKNOWN command")
  
  - **Description**: Processes game commands such as "START", "TURN", "BEGIN", etc.
  - **Utility**: Ensures the AI responds correctly to various game actions.

- **play**:
  
  .. code-block:: python

      def play(self):
          if self.board:
              move = self.ai.best_move(self.board, self.player, self.opponent)
              if move:
                  self.board.place_piece(move, self.player)
                  self.api.send_response(f"{move.x},{move.y}")
                  if self.ai.check_victory(self.board, move, self.player):
                      self.api.send_response("WIN")
                      exit(0)
  
  - **Description**: Executes a turn by asking the AI to choose the best move.
  - **Utility**: Implements the AI's logic to play against an opponent.

Strategies and Evaluations
--------------------------

The AI employs several strategies to evaluate moves:

- **Position Evaluation**: The `calculate_weights` method evaluates each position on the board and assigns scores based on the opportunity to win.
  
  .. code-block:: python

      def calculate_weights(self, board: Board, player_id: int) -> Board:
          weighted_board = Board(board.size)
          for y, x in product(range(board.size), range(board.size)):
              if board.grid[y][x] == 0 and self._has_adjacent_piece(board, Position(x, y)):
                  weighted_board.grid[y][x] = self._evaluate_position(board, Position(x, y), player_id)
          return weighted_board

- **Piece Adjacency**: The `_has_adjacent_piece` method checks for the proximity of pieces to determine if a potential move deserves evaluation.

  .. code-block:: python

      def _has_adjacent_piece(self, board: Board, pos: Position) -> bool:
          y, x = pos.y, pos.x
          size = board.size
          for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]:
              ny, nx = y + dy, x + dx
              if 0 <= ny < size and 0 <= nx < size and board.grid[ny][nx] != 0:
                  return True
          return False

Conclusion
----------

This Gomoku AI is designed to be competitive using proven techniques like the Minimax algorithm. Each component of the code contributes to strategic decision-making, ensuring that the AI can anticipate opponent moves while seeking to win.

For any questions or contributions, feel free to contact the lead developer.