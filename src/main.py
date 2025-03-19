#!/usr/bin/env python3
from src.api import GomokuAPI
from src.gomoku_bot import GomokuBot
from src.ai_min_max import GomokuAI

def main():
    api = GomokuAPI()
    #ai = GomokuAI(depth=3)
    ai = GomokuAI()
    gomoku_bot = GomokuBot(api=api, ai=ai)

    while True:
        command = api.read_command()
        gomoku_bot.process_command(command)

if __name__ == "__main__":
    main()
