import "dotenv/config";
import morgan from "morgan";
import express from "express";
import {query as db} from "./db/index.js";
import cors from "cors";
import bcrypt from "bcrypt"; //async lib 
import jwt from "jsonwebtoken";
import { createClient } from "redis";

const app = express();  
const PORT = process.env.PORT2 || 4002;

const client = createClient(); //redis
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

function authenticateTok(req, res, next){
    const authHeader = req.headers['authorization']; //passed as BEARER TOKEN ?
    const token = authHeader && authHeader.split(' ')[1]; //first check exist
    if(token == null){
        return res.status(401).send("No token provided");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).send("Invalid token - no access for you");
        }
        req.user = user;
        next();
    })
}

const example = []

//Logining in and authetnicating users
app.post('/login', async (req, res) => {
    const user = example.find(ex => ex.username === req.body.username);
    //require('crypto').randomBytes(64).toString('hex')
    if(user == null){
        return res.status(400).send("Cannot find user");
    }
    try{
        const accessTok = generateAccessToken(user);
        const refreshTok = jwt.sign(user, process.env.REFRESH_SECRET);
        await client.set(refreshTok, user.uesrname, {expire: 60*60*24*3}); //3 days
        if(bcrypt.compare(req.body.password, user.password)){
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
        const accessTok = generateAccessToken(user);
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
        example.push(hm); //changed to db
        res.status(201).json({status: "success", data: hm});
    }
    catch{
        res.status(500).send("ERROR registering user");
    }
});

app.delete('/logout', async (req, res) => {
    await client.del(req.body.refreshToken);
    res.status(204).send("Logged out");
});


function generateAccessToken(user){
    return jwt.sign({username: user.username}, process.env.JWT_SECRET, {expiresIn: '1800s'}); //30 mins
}





