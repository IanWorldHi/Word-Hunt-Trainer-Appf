import express from "express";

const app = express();  

const PORT = 3001;

app.use(express.json());

//For score CRUD operations
app.route('/scores/:id')
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
    res.status(500).send("Somethign went wrong");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


