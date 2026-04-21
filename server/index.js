import "dotenv/config";
import morgan from "morgan";
import express from "express";

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
    .get((req, res) => {
        const id = req.params.id;
        res.status(200).json({id, stats: "placeholder"});
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
    console.error(err.stack);
    res.status(500).json({stats: "placeholder"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


