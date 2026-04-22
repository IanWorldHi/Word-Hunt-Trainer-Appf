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
app.route('/scores/:id')
    .get( async (req, res, next) => {
        try{
            const id = req.params.id;
            //throw new Error("Throwing for testing");

            //This works as a fix
            const storeAll = await db(`SELECT * FROM users WHERE id = ${id}`);
            //if no id it will just not return anything
            //hm prob add username for searching
            //const storeAll = await db.query("SELECT * FROM users");

            console.log(storeAll);
            res.status(200).json({
                id, 
                numRows: storeAll.rows.length,
                data: {
                    user: storeAll.rows
                }
            });
        } catch (err){
            next(err);
        };
    })
    .post((req, res) => {
        const id = req.params.id;
        res.status(201).json({id, stats: "placeholder"});
    })
    .put((req, res) => {
        const id = req.params.id;
        res.status(200).json({id, stats: "placeholder"});
    })
    .delete((req, res) => {
        const id = req.params.id;
        res.status(200).json({id, stats: "placeholder"});
    });

//For user CRUD operations
app.route('/users/:id')
    .get((req, res) => {
        const id = req.params.id;
    })
    .post((req, res) => {
        const id = req.params.id;
    })
    .put((req, res) => {
        const id = req.params.id;
    })
    .delete((req, res) => {
        const id = req.params.id;
    });

app.use((err, req, res, next) => {
    console.error("This is the error middleware, the following will be the error stack trace");
    console.error(err.stack);
    res.status(500).json({result: "Something went wrong."});
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});



