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

const client = redis.createClient({ host: "redis" });

const db = knex({
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        //ssl: true
    }
});

const PORT = process.env.PORT || 3001;
const jsonParser = parser.json();
const authorize = redisAuthorize(client, "sighin", "register");

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(authorize);

app.get("/", protect(index.handle(db)));

app.get("/profile/:id", protect(profile.get(db)));

app.put("/profile/:id", protect(profile.save(db)));

app.put("/image", jsonParser, protect(image.handle(db)));

app.post("/predict", jsonParser, protect(predict.handle()));

app.post("/signin", jsonParser, protect(signin.handle(db, client, bcrypt)));

app.post("/register", jsonParser, protect(register.handle(db, bcrypt)));

app.use(function (err, _, res, _) {
    console.error(err);
    res.status(500).json("An unexpected error has occurred");
});

app.listen(PORT, () => console.log(`App is runing on port ${PORT}`));