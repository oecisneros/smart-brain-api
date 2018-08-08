const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const parser = require("body-parser");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const predict = require("./controllers/predict");
const index = require("./controllers/index");
const { protect } = require("./core/common");

const db = knex({
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();
const PORT = process.env.PORT || 3001;
const jsonParser = parser.json();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get("/", protect(index.handle(db)));

app.get("/profile/:id", protect(profile.handle(db)));

app.put("/image", jsonParser, protect(image.handle(db)));

app.post("/predict", jsonParser, protect(predict.handle()));

app.post("/signin", jsonParser, protect(signin.handle(db, bcrypt)));

app.post("/register", jsonParser, protect(register.handle(db, bcrypt)));

app.use(function (err, _, res, _) {
    console.error(err.stack);
    res.status(500).json("An unexpected error has occurred");
});

app.listen(PORT, () => {
    console.log(`App is runing on port ${PORT}`);
});