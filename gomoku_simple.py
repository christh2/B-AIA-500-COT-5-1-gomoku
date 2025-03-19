#!/usr/bin/env python3
import sys
import threading


BOARD_SIZE = 0
board = []
lock = threading.Lock()

def log(message):
    sys.stderr.write(f"{message}\n")
    sys.stderr.flush()

def initialize_board(size):
    global BOARD_SIZE, board
    BOARD_SIZE = size
    board = [[0 for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]

def is_valid_move(x, y):
    return 0 <= x < BOARD_SIZE and 0 <= y < BOARD_SIZE and board[x][y] == 0

def find_first_available_move():
    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if is_valid_move(x, y):
                return x, y
    log("No valid move found")
    return None

def handle_start(args):
    try:
        if len(args) == 0:
            initialize_board(20)
            log("START with size 20")
            return "OK"

        size = int(args[0])
        if size == 20:
            initialize_board(size)
            log("START with size 20")
            return "OK"
        else:
            log(f"Invalid START size: {size}")
            return "ERROR invalid size, only size 20 is allowed"

    except ValueError:
        log("START with non-integer size")
        return "ERROR invalid size, must be an integer"
    except Exception as e:
        log(f"Error in START: {e}")
        return "ERROR unexpected"

def check_alignment(x, y, dx, dy, player):
    count = 0

    for step in range(1, 5):
        nx, ny = x + step * dx, y + step * dy
        if 0 <= nx < BOARD_SIZE and 0 <= ny < BOARD_SIZE and board[nx][ny] == player:
            count += 1
        else:
            break

    for step in range(1, 5):
        nx, ny = x - step * dx, y - step * dy
        if 0 <= nx < BOARD_SIZE and 0 <= ny < BOARD_SIZE and board[nx][ny] == player:
            count += 1
        else:
            break
    return count

def check_alignment_with_open_ends(x, y, dx, dy, player):
    count = 0
    open_ends = 0

    for step in range(1, 5):
        nx, ny = x + step * dx, y + step * dy
        if 0 <= nx < BOARD_SIZE and 0 <= ny < BOARD_SIZE:
            if board[nx][ny] == player:
                count += 1
            elif board[nx][ny] == 0:
                open_ends += 1
                break
            else:
                break

    for step in range(1, 5):
        nx, ny = x - step * dx, y - step * dy
        if 0 <= nx < BOARD_SIZE and 0 <= ny < BOARD_SIZE:
            if board[nx][ny] == player:
                count += 1
            elif board[nx][ny] == 0:
                open_ends += 1
                break
            else:
                break

    return count, open_ends


def find_best_move():

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]

    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if board[x][y] == 2:
                for dx, dy in directions:
                    count, open_ends = check_alignment_with_open_ends(x, y, dx, dy, 2)
                    if count == 4 and open_ends > 0:
                        nx, ny = x + dx, y + dy
                        if is_valid_move(nx, ny):

                            return nx, ny

    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if board[x][y] == 1:
                for dx, dy in directions:
                    count, open_ends = check_alignment_with_open_ends(x, y, dx, dy, 1)
                    if count == 4 and open_ends > 0:
                        nx, ny = x + dx, y + dy
                        if is_valid_move(nx, ny):

                            return nx, ny


    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if board[x][y] == 2:
                for dx, dy in directions:
                    count, open_ends = check_alignment_with_open_ends(x, y, dx, dy, 2)
                    if count == 3 and open_ends > 0:
                        nx, ny = x + dx, y + dy
                        if is_valid_move(nx, ny):

                            return nx, ny


    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if board[x][y] == 1:
                for dx, dy in directions:
                    count, open_ends = check_alignment_with_open_ends(x, y, dx, dy, 1)
                    if count >= 2 and open_ends > 0:
                        nx, ny = x + dx, y + dy
                        if is_valid_move(nx, ny):

                            return nx, ny


    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if board[x][y] != 0:
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy
                    if is_valid_move(nx, ny):

                        return nx, ny


    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if is_valid_move(x, y):
                return x, y
    return None

def check_victory(player):
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]

    for x in range(BOARD_SIZE):
        for y in range(BOARD_SIZE):
            if board[x][y] == player:
                for dx, dy in directions:
                    if check_alignment(x, y, dx, dy, player) >= 4:
                        return True
    return False


def handle_turn(args):
    try:
        if len(args) != 1:
            return "ERROR invalid TURN format"
        x, y = map(int, args[0].split(","))

        if is_valid_move(x, y):
            with lock:
                board[x][y] = 2

            if check_victory(2):
                print("PLAYER WIN")
                sys.stdout.flush()
                sys.exit(0)

            best_move = find_best_move()
            if best_move:
                bx, by = best_move
                with lock:
                    board[bx][by] = 1

                if check_victory(1):
                    print("IA WIN")
                    sys.stdout.flush()
                    sys.exit(0)

                return f"{bx},{by}"
        else:
            log(f"TURN: Invalid move {x},{y}")
            return "ERROR invalid move"
    except Exception as e:
        log(f"Error in TURN: {e}")
        return "ERROR unexpected"


def handle_begin():
    try:
        center = BOARD_SIZE // 2
        best_move = center, center
        if best_move:
            bx, by = best_move
            with lock:
                board[bx][by] = 1
            log(f"BEGIN: Playing at {bx},{by}")
            return f"{bx},{by}"
        else:
            return "ERROR no valid move"
    except Exception as e:
        log(f"Error in BEGIN: {e}")
        return "ERROR unexpected"

def handle_board():
    global board
    try:
        log("Processing BOARD command")
        with lock:
            while True:
                line = sys.stdin.readline().strip()
                log(f"Reading line: {line}")
                if line == "DONE":
                    log("Received DONE")
                    break
                try:
                    x, y, player = map(int, line.split(","))
                    board[x][y] = player
                    log(f"Applied move: {x},{y} by player {player}")
                except ValueError:
                    log(f"Invalid line format in BOARD: {line}")
                    continue

        if check_victory(2):
            print("PLAYER WIN")
            sys.stdout.flush()
            sys.exit(0)

        best_move = find_best_move()
        if best_move:
            bx, by = best_move
            board[bx][by] = 1

            if check_victory(1):
                print("IA WIN")
                sys.stdout.flush()
                sys.exit(0)

            print(f"{bx},{by}")
            sys.stdout.flush()
        else:
            print("ERROR no valid move")
            sys.stdout.flush()
    except Exception as e:
        log(f"Error in BOARD: {e}")
        print("ERROR unexpected")
        sys.stdout.flush()

def handle_command(command):
    try:
        parts = command.split()
        cmd = parts[0]
        args = parts[1:]
        if cmd == "START":
            return handle_start(args)
        elif cmd == "TURN":
            return handle_turn(args)
        elif cmd == "BEGIN":
            return handle_begin()
        elif cmd == "BOARD":
            handle_board()
            return None
        elif cmd == "END":
            sys.exit(0)
        elif cmd == "ABOUT":
            return 'name="pbrain-gomoku-ai", version="1.0", author="Christ, Abiola and Katia", country="Benin"'
        else:
            return "UNKNOWN"
    except Exception as e:
        log(f"Error in command handler: {e}")
        return "UNKNOWN"

def main():
    while True:
        try:
            command = sys.stdin.readline().strip()
            if not command:
                continue
            response = handle_command(command)
            if response:
                print(response)
                sys.stdout.flush()
        except Exception as e:
            log(f"Error in main loop: {e}")
            print("UNKNOWN error")
            sys.stdout.flush()

if __name__ == "__main__":
    main()
