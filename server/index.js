//cleanup console.logs
import "dotenv/config";
import morgan from "morgan";
import express from "express";
import {query as db} from "./db/index.js";
import cors from "cors";
import jwt from "jsonwebtoken";
//changed from import db from "./index.js";

const app = express();  

const PORT = process.env.PORT || 3002;

app.use(morgan("dev"));
app.use(express.json());

/*
//Will have to fix this up for production security 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
*/
app.use(cors()); //not sure how this works security wise


app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url} - Runs for all requests after previous middleware`);
    next(); 
});


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

//would add the middleware to the below stuff - syntax should be as folows
app.get('/ex', authenticateTok, (req, res) => {
    res.json({user: req.user}); //this would work bc of middleware
});


//For score CRUD operations
//Changing to username
//pass username in req body alongside auth token
app.route('/scores/')
    .get( async (req, res, next) => {
        try{
            const username = req.body.username;
            const storeAll = await db("SELECT * FROM user_scores1 WHERE name = $1", [username]);//this typa format prevent sql injection
            console.log(storeAll);
            res.status(200).json({
                username, 
                topScore: storeAll.rows[0].topscore
            });
        } 
        catch(err){
            next(err);
        };
    })
    .put(async (req, res, next) => {
        try{
            const username = req.body.username;
            const storeAll = await db("UPDATE user_scores1 SET topscore = $1 WHERE name = $2", [req.body.topscore, username]);
            res.status(200).json({username, topscore: req.body.topscore});
        } 
        catch(err){
            next(err);
        };
    });

app.use((err, req, res, next) => {
    console.error("This is the error middleware, the following will be the error stack trace");
    console.error(err.stack);
    res.status(500).json({result: "Something went wrong."});
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});





