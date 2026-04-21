import express from "express";

const app = express();  

const PORT = 3001;

app.use(express.json());


app.get('/scores:id', (req, res) => {
    const id = req.params.id;
    
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Somethign went wrong");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


