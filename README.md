# Word Hunt Trainer App

- Frontend: React Native, Expo, TypeScript, Expo Router, Context API
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Cache: Redis
- Auth: JWT, bcrypt, expo-secure-store
- Deployment: Railway

Replica of the popular game WordHunt from iphone's GamePigeon using a trie. Additionaly contains a board solver displaying the highest possible scoring words updated in real time and haptic feedback. Designed as a training app to both play the game and improve pattern recognition in the game. 

<!--Context, fetch api, panGesture, 2 servers, we using railway now -->

<p align="center">
  <img src="client/assets/Animation.gif" width="700" alt="Demo">
</p>


<!--Got to add creating postgres db, redis, and running server and authserver -->
## Running the app for yourself!


   ```bash
   git clone https://github.com/IanWorldHi/Word-Hunt-Trainer-Appf.git
   cd Word-Hunt-Trainer-Appf/client
   npm install
   npx expo start
   ```


<!-- 
https://railway.com/project/477e86cb-ffdd-4783-9f7a-0fb3a69051cb?environmentId=7aac1379-c50f-4f01-939d-755d83a0bb12

//figure out best way to write readme and on resume

Will be PERN mobile setup/stack 

Future Improvement: animation, remove stacking screens, maybe add customization for if web or app ie diff spacing and diff board randomization (ore vowels, easy consnants and s,r,d) 

Adding backend now

While have to run backend and frontend seperately in 2 terminals

New expo updates? breaking things? app worksk diff - plus figure out how the tunnel connects and how the server works
apparently with mingw the terminal breaks https://claude.ai/chat/ab246056-cc93-4126-91f3-c3a61b203813 for when i use --tunnel
Fix bubble around exit button

Server (--tunnel) fix: change permissions for Node.js JavaScript to get access to whatever network
https://claude.ai/chat/b86bc036-1f12-432b-85e2-e4dba5a85c55


.env file defined in server

Other notes (react):
react-router is for web, just use expo-router

Worry about security when deploying

Organization of client side files might not be the standard - ie) app files not in routes
Really have to reorganize components and etc

Using axios - mention that in finalized README - switched from fetch to axios - still using fetch rn
-  ooo use axios if we are doing like call refresh when error to get new authtoken depends on how i am handeling the refreshing part

Using context api

JWT authentication - installed jsonwebtoken, bcrypt - sotre in expo-secure-store (npx expo install expo-secure-store)
- salt and hashing, hashing the passwords will produce the same hash for the same passwords, adding a different unique salt at the begining makes each hash unique
- refresh token

Seperate authentication server and data server for postgres

need to add db for pswd username

Using redis from docker
docker run -d --name redis -p 6379:6379 redis:<version>
docker stop redis
docker start redis
docker rm redis


Postgres commands:
db = wordapp
/d for all tables
CREATE TABLE users (
    id       SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE user_scores1 (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    topscore INTEGER NOT NULL,
    dated    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
