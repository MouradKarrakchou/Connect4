# PS8 - Puissance4Quarts

## Authors

[Weel Ben Aissa](https://github.com/weelBenAissa)

[Mourad Karrakchou](https://github.com/Mouradkarrakchou)

[Ayoub Imami](https://github.com/AyoubIMAMI)

---

The code of this repo is split in 2 folders:
* api/ manages the server. It contains a server which differentiate REST requests from HTTP file requests, and so
return either files or REST responses accordingly.
* front/ contains static files that should be returned by the HTTP server mentioned earlier.

Both folders contain a README with more details.

---

## Requirements to run the project

* [Node.js](https://nodejs.org/) should be installed.
* The repo should have been cloned.

---

## First launch

Not much in there, just launch `npm install` to install the dependencies for the server.

Note that this command should be run again every time you install / delete a package.

---

## On localhost

1 - Clone the project

2 - Start Docker Desktop

3 - Run the file start.sh which is at the project root

4 - You can enjoy the application at the following address [http://localhost:80/](http://localhost:80/)

## Online

Here is the link to the application online: [http://4quarts.connect4.academy/](http://4quarts.connect4.academy/)

## How to play

1 - Make sure to register, you have to fill all the credentials

2 - Then you can log in

3 - On the Home page you can:

    - Play on local: play with your friend on the same interface
    
    - Play against the AI: ok the easy one is very easy to beat, but can you defeat the medium one?
    
    - Play online: challenge people all around the world and grind the ladder!
    
    - Access your profile to see your statistics and success
    
    - Manage your friends, chat with them and challenge them! All those features are accessible from the scrolling menu

## Profile

You can see your profile by clicking on the top left button. There you will find your statistics and your success! You can also see your friends profile by clicking on the user button in the little bottom right drop-down menu.

## Little bottom right drop-down Menu

There you can add your friends, chat with them, challenge them, see their profile or remove them :( . You can also access to your notifications to see the friend requests or the challenge requests you received! This menu is available from any pages of the aplication! So you can manage your friends and chat with them even if you are in game!

## Local game

Local game is nice if you are with a friend. You can both play on the same device. You can save the state of the game and retrieve it from the Home page to finish it later.

## Play against AI

If there is no friend available to play with or if you want to train, you can challenge our AI. You can also save the state of the game.

The Easy one is very easy, basically it plays randomly.

But the medium one use the Monte Carlo algorithm to find the best move to play. Will you be able to beat it? ;)

## Play online

Here is the best part! You can challenge random people from all over the world! Beat them to grind the ladder, increasing your elo, reaching new ranks, and prove that your are the best!

You have 30 seconds to play and, we know that as a warrior you will never surrender but still, we have put this option!

## Saved games

As written above, you can save you local and AI games. You can retrieve those games from the Home page and keep playing from where you stopped. You can also clear the saved games.

## Features

- If you left the page without logging out, no need to reconnect, the application will suggest you to continue with the previous session

- The user can save the state of the game and chose the name of the save to make it easier to retrieve

- Non intrusives notifications:
    - Messages received
    - Challenged received
    - Friend requests
    There are slighty glowing icons which notify the user and attract his attention. Also, if you move from pages to pages, the notifications are still glowing to remind the user that he has pending notifications.
    
- Many information pop out when you challenge your friends:
    - Friend not connected
    - Not your friend (for the tricksters ;) )
    - Waiting for answer
    - Has declined

- Messages:
    - Sent by socket
    - Stored in database with the already read/unread information
    - Retrieve history when connected
    - If the user is disconnected: he will receive the message and will have a glowing icon notification when he connects, to show him that he did not read the new message
    
- Online:
    - Many people can play at the same time
    - They will be matched by pair
    - A timer let them 30 seconds to play (monitored in the backend for the tricksters ;) )
    - They can surrender
    - They earn or lose elo points, and have a rank
    - They can unlock successes
    
- Security:
    - Passwords encryption from the front to the back, with a Caesar code
    - Passwords encryption from the back the the database, with a SHA-256 function
    - For the user comfort, he is automatically redirected to the login page if he has no token or a wrong one
    - At each login, the user token change to avoid the following case: if the user forgot to disconnect from a device, then his account will not be kept forever
    
