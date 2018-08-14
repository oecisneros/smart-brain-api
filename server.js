const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const parser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const redis = require("redis");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const predict = require("./controllers/predict");
const index = require("./controllers/index");
const { redisAuthorize, protect } = require("./core/common");

const db = knex({
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        //ssl: true
    }
});

const app = express();
const PORT = process.env.PORT || 3001;
const jsonParser = parser.json();

const redisClient = redis.createClient({ host: "redis" });
const authorize = redisAuthorize.bind(null, redisClient);

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get("/", authorize(index.handle(db)));

app.get("/profile/:id", authorize(profile.get(db)));

app.put("/profile/:id", authorize(profile.save(db)));

app.put("/image", jsonParser, authorize(image.handle(db)));

app.post("/predict", jsonParser, authorize(predict.handle()));

app.post("/signin", jsonParser, protect(signin.handle(db, redisClient, bcrypt)));

app.post("/register", jsonParser, authorize(register.handle(db, bcrypt)));

app.use(function (err, _, res, _) {
    console.error(err);
    res.status(500).json("An unexpected error has occurred");
});

app.listen(PORT, () => {
    console.log(`App is runing on port ${PORT}`);
});