SRC 	=	src/ai_min_max.py	\
			src/api.py	\
			src/board.py	\
			src/game.py	\
			src/gomoku_bot.py	  \
			src/main.py


NAME	=	 pbrain-gomoku-ai

all :
		cp src/main.py $(NAME)
		chmod +x $(NAME)

clean :
	rm -rf src/*.pyc
	rm -rf src/__pycache__/
	rm $(NAME)

fclean : clean
	rm -f *~

re : fclean all