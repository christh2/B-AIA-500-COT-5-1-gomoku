Tutorials and How-To's
######################

How-To's
********
This section breaks down the project from cloning the repository to explaining the code.

#. Getting started:
===================
First, you need to install Conan. Then, let's clone the repository.

1. Open a terminal
====================

    .. code-block:: bash

        git clone git@github.com:EpitechPromo2027/B-AIA-500-COT-5-1-gomoku-christ.hounkanrin.git

2. Enter the repository
=======================

    .. code-block:: bash

        cd B-AIA-500-COT-5-1-gomoku-christ.hounkanr

3. Then you're good to go with the next steps
=============================================

=====
Steps
=====

1. Install Python if you don't already have it:
===============================================

    .. code-block:: bash

        sudo apt install python3 python3-pip  # (on Ubuntu)

2. Install Required Packages
============================

Make sure to install any required packages listed in the `requirements.txt` file. If the file exists, you can install the packages using pip:

    .. code-block:: bash

        pip install -r requirements.txt

3. Build the Project
====================

To build the project and create the binary, use the provided Makefile:

    .. code-block:: bash

        make

This command will compile the source code and produce the binary named `pbrain-gomoku-ai`.

4. Run the Game
===============

To run the Gomoku game, execute the binary:

    .. code-block:: bash

        ./pbrain-gomoku-ai

5. Interacting with the Game
=============================

Once the bot is running, you can interact with it through commands. Here are the main commands you can use:

- **START**: Initializes the game.
  
    Example command:
    
    .. code-block:: text

        START 20

  This command starts a new game with a board size of 20x20.

- **TURN**: Make a move.
  
    Example command:
    
    .. code-block:: text

        TURN 10,10

  This command places your piece at the coordinates (10, 10).

- **BEGIN**: Start the game by placing the first piece in the center.
  
    .. code-block:: text

        BEGIN

- **BOARD**: Updates the board state with the moves made by both players.
  
    You can send multiple moves until you are done:

    .. code-block:: text

        BOARD
        0,0,1
        1,1,2
        2,2,1
        DONE

- **END**: Ends the game.
  
    .. code-block:: text

        END

- **ABOUT**: Get information about the bot.
  
    .. code-block:: text

        ABOUT

6. How to Play
==============

Gomoku is played on a grid where two players take turns to place their pieces (usually black and white stones). The objective is to be the first to get five pieces in a row, either horizontally, vertically, or diagonally.

### Game Rules:

- Players alternate turns.
- A player wins by aligning five of their pieces in a row.
- Players can use the commands mentioned above to interact with the game bot.

### Example Gameplay:

1. Start the game:
   
   .. code-block:: text

        START 20

2. Player places a piece:
   
   .. code-block:: text

        TURN 10,10

3. The bot responds and makes its move automatically based on the AI logic.

4. Continue until one player wins or the game ends.

Conclusion
==========

Follow these steps to successfully set up and play the Gomoku game. If you have any questions or encounter issues, feel free to reach out for support!