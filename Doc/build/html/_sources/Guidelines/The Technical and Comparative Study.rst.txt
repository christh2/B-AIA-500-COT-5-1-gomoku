Technical and Comparative Study
*******************************

This covers the relevance of using the various technologies we are employing
(programming language, graphics library, algorithms, networking techniques, etc. . . ).

The project is been asked to be coded in *C++ language* using the graphical library of 
*SFML* following the algorithm of the original *RTYPE* game logic and making it available
over the network as well.

To encompass this, let's cover up what is been done and why it's been done that way.

Used Algorithm
==============
Looking at the algorithm being used in our project, let's take a typical example
Talking about the RTYPE game the project request was that we make a replica of this game.
So what is been done on the connection algo is the following:
- We make 4 Player requests to join whule they wait in a room to get up to the number, the room is been calleda lobby.
- We get their names in our database to make sure we recognize each players.
We also folloewd the fact that the game is a shoot them up logic,
So we managed shooting and movement im the game according to what is been said.

Design patterns
================
Choosing this design patterns helps escape a lot of problems in developing our engine.
First thing is the flexibility. To solve this ECS get started with a
blank object that has only the default required to do its job.
Due to inheritance trees might get messed up. In a gameplay inheritance can cause problems.
Second thing is the misuse of the cache because in a game we interate over a set of object a 
number of time(in fact multiple times per second). And this causes a huge waste of the cache.
It's the result we get by restarting our systems or looking for alternative to cool the CPU.
To solve this our ECS would keep all the data that will be iterated upon a 
tightly packed by using the only space required for it in our cache.
To summarize it we set to design our game with these goals

#. Making our code simple and understandable for every developers
#. Avoid a lot of if conditions to help avoid misprediction
#. Have a minimal use of inheritance

Data structures for the project
===============================
We used several data structures to make this project relevant

Maps
++++
Maps are associative containers that store elements formed by a combination of a key value and a
mapped value, following a specific order.
- The key values in a map,  are generally used to sort and uniquely identify the elements, while the mapped values store the content associated to this key.

Example:
--------

    .. code-block:: cpp

        std::map<std::string, sf::Music> SongDico; 
        //typical example used to store the sounds name and its file.

Utility in our R-Type
---------------------
Maps in our context we used to facilitate the management of files and
their names through a configuration file. It will helps in the carriage
and management of many files.

Shared_ptr
++++++++++
Shared pointers have an associated control block that keeps track of the reference count for the managed object.
This reference count is shared among all the copies of the shared_ptr instances pointing to the same
object, ensuring proper memory management and deletion.

Utility in our R-Type
---------------------
The usage in our project was basically known for the attribution of an Id to each of the created composant 
For a better understanding see the example below;

Example:
--------

    .. code-block:: cpp

        std::map<std::type_index, std::shared_ptr<void>> componentArrays;


Vector of Pairs
+++++++++++++++
A vector of pairs is a std::vector container in which each element 
is of std::pair type. In C++, we can create a vector of pairs by 
passing std::pair of the desired type as the template parameter when
declaring std::vector

Example
-------
    .. code-block:: cpp

      std::vector<std::pair<std::string, void*>> _data; 
      //std::string: Type of the key of all the pair elements.
      //void*: Type of the value of all the pair elements.
      //_data: name given to the vector of pairs


Utility in our R-Type
---------------------
- Entity-Component Systems (ECS):
  Component Storage: Store components (e.g., position, velocity, health) as pairs, 
  where the key is the entity ID and the value is the component data.
  Efficient Component Access: Quickly retrieve components for a given entity by searching 
  the vector of pairs using the entity ID as the key.

Custom-Designed Algorithms
==========================

Asteroid generation
+++++++++++++++++++
To generate our asteroids, on the server they get generated 4-5seconds and once they're
been generated an alert is been sent to the client with the position x and y so that they can be displayed
on the graphical interface.
Looking at our protocol, It goes like this,
- Syntax: ASTL [x y]
  The command been called *ASTL* is been sent from the server to make awareness about the generation of new asteroids.
  and it sends its position to the client for a clear display.

Score Generation
++++++++++++++++
To make this happens, it is still the server that makes it happen.
How does it go? First of all the command name is *PLAYER* . The client makes 
a request to the server to know how many score he has in his store and based
on the number of collision been made from the shots he sends the data in number
to the client.
Its syntax falls this way *PLAYER* *[PLAYER_SCORE]*

Shooting Algorithm
++++++++++++++++++
The client shoot on the ennemies
Syntax: *SHOOT*
The client make a request when he clicks on a specific key on the keyboard.
with this a specific sprite is attached to it to let it display and give the
sensation of a shot been made.

Players Death
++++++++++++++
Syntax: *DEAD [PLAYER_NUM]*
The client requests for the player id from the server which stores each
player names and send to the when a request equal to the syntax above is been sent.

Storage
=======
To manage storage we used two methods such as: 

Assets management
+++++++++++++++++
Looking at the storage, we made storage regarding our assets.
To manage this we made sure we don't use overweighted assets in the projesct as well 
as the weight of our package manager files.
We chose lightweighted sprites, fonts and .ogg files to make sure it does'nt take too much space.

Data management
+++++++++++++++
We saved our datas in the project using c++ methods that are flexible and that manages multiplein-built functions
to manipulates the storage of data's such as player names, number of asteroids and etc.

Security
=========
security and data integrity must be managed and secured effectively.
In our comparative study, it might be relevant to consider the main vulnerabilities
of each technology. To make this more clear to you, we ensure the security of
our players identity by making their datas known to the server mainly. As well as the usage of configuration file
stored with confidential infos. 