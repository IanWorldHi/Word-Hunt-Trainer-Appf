import "dotenv/config";
import morgan from "morgan";
import express from "express";
import {query as db} from "./db/index.js";
//changed from import db from "./index.js";


const app = express();  

const PORT = process.env.PORT || 3002;

app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url} - Runs for all requests after previous middleware`);
    next(); 
});

//For score CRUD operations
//Changing to username
app.route('/scores/:username')
    .get( async (req, res, next) => {
        try{
            const username = req.params.username;
            //throw new Error("Throwing for testing");

            //This works as a fix
            const storeAll = await db("SELECT * FROM user_scores1 WHERE name = $1", [username]);
            //if no id it will just not return anything
            //hm prob add username for searching
            //const storeAll = await db.query("SELECT * FROM user_scores1");

            console.log(storeAll);
            res.status(200).json({
                username, 
                numRows: storeAll.rows.length,
                data: {
                    user: storeAll.rows
                }
            });
        } catch (err){
            next(err);
        };
    })
    .post(async (req, res) => {
        //Might take out of chaining
        const username = req.params.username;
        console.log(req.body);
        try{
            const storeAll = await db("INSERT INTO user_scores1 (name, topscore) VALUES ($1, $2)", [
                req.body.name,
                req.body.topscore
            ]);
            res.status(201).json({status: "success", username})
        } catch (err){
            next(err);
        };
    })
    .put(async (req, res) => {
        //not sure what I want to do with this
        try{
            const username = req.params.username;
            const storeAll = await db("UPDATE user_scores1 SET name = $1 WHERE name = $2", [req.body.name, username]);
            res.status(200).json({username, stats: "placeholder"});
        } catch (err){
            next(err);
        };
    })
    .delete(async (req, res) => {
        const username = req.params.username;
        try{
            const storeAll = await db("DELETE FROM user_scores1 WHERE name = $1", [username]);
            res.status(200).json({status: "success", username});
        } catch (err){
            next(err);
        };
    });

//For user CRUD operations
app.route('/users/:username')
    .get((req, res) => {
        const username = req.params.username;
    })
    .post((req, res) => {
        const username = req.params.username;
    })
    .put((req, res) => {
        const username = req.params.username;
    })
    .delete((req, res) => {
        const username = req.params.username;
    });

app.use((err, req, res, next) => {
    console.error("This is the error middleware, the following will be the error stack trace");
    console.error(err.stack);
    res.status(500).json({result: "Something went wrong."});
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});



