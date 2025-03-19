import sys

class GomokuAPI:
    def __init__(self):
        pass

    def send_response(self, response: str):
        print(response)
        sys.stdout.flush()

    def exit_with_error(self, error_message: str):
        self.send_response(f"ERROR: {error_message}")
        sys.exit(84)

    def read_command(self):
        res = sys.stdin.readline()
        res = res.replace("\r", "")
        res = res.replace("\n", "")
        return res.split()
