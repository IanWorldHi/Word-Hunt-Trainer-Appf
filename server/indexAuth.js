import "dotenv/config";
import morgan from "morgan";
import express from "express";
import {query as db} from "./db/index.js";
import cors from "cors";
import bcrypt from "bcrypt"; //async lib 
import jwt from "jsonwebtoken";
import { createClient } from "redis";

const app = express();  
const PORT = process.env.PORT || 4002; //changed from port2 to port for redis

const client = createClient({url: process.env.REDIS_URL}); //redis, url bc of railway's configuration 
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());


//Logining in and authetnicating users
app.post('/login', async (req, res) => {
    try{
        const user1 = await db("SELECT username, password FROM users WHERE username = $1", [req.body.username]);
        const user = user1.rows[0];
        if(user == null){
            return res.status(400).send("Cannot find user");
        }
        const accessTok = generateAccessToken(user);
        const refreshTok = jwt.sign({username: user.username}, process.env.REFRESH_SECRET);
        await client.set(refreshTok, user.username, {EX: 60*60*24*3}); //3 days, syntax is EX
        if(await bcrypt.compare(req.body.password, user.password)){
            res.json({accessToken: accessTok, refreshToken: refreshTok});
        }
    }
    catch{
        res.status(500).send("Error logging in");
    }
});


//store refreshTok in a redis cache
app.post('/token', async (req, res) => {
    const refreshTok = req.body.refreshToken;
    if (refreshTok == null){    
        return res.status(401).send("No token provided");
    }
    const storedTok = await client.get(refreshTok);
    if(!storedTok){
        return res.status(403).send("Invalid token - no access for you");
    }
    jwt.verify(refreshTok, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid token");
        const accessTok = generateAccessToken(user.username);
        res.json({ accessToken: accessTok });
    });

});

//register email pswd hash and need to add db part
app.post('/register', async(req, res, next) => {
    try{
        const salt = await bcrypt.genSalt(10); //default is 10, there is synchrous verseion of genSaltSync
        const hashedPwd = await bcrypt.hash(req.body.password, salt);
        console.log(salt + " and " + hashedPwd);
        
        const hm = {username: req.body.username, password: hashedPwd};
        await db("INSERT INTO users (username, password) VALUES ($1, $2)", [hm.username, hm.password]);
        await db("INSERT INTO user_scores1 (name, topscore) VALUES ($1, $2)", [hm.username, 0]);
        res.status(201).json({status: "success", data: hm});
    }
    catch(err){
        console.error(err);
        res.status(500).send("ERROR registering user");
    }
});

app.delete('/logout', async (req, res) => {
    await client.del(req.body.refreshToken);
    res.status(204);
});


function generateAccessToken(user){
    return jwt.sign({username: user}, process.env.JWT_SECRET, {expiresIn: '1800s'}); //30 mins
}


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Auth server running on port: ${PORT}`);
});





