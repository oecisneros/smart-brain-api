const { getUserCredentials } = require("../core/repository");
const jwt = require("jsonwebtoken");

const signToken = userInfo =>
    jwt.sign({ email: userInfo.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

const createSession = (redis, userInfo) => {
    const token = signToken(userInfo);
    redis.set(token, userInfo.id);
    return { success: true, id: userInfo.id, token };
}

const handle = (db, redis, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Incorrect form submission");
    }

    const validateUser = userInfo => {
        const isValid = userInfo && bcrypt.compareSync(password, userInfo.hash);
        if (isValid) {
            const session = createSession(redis, userInfo);
            return res.json(session);
        }
        return res.status(400).json("Invalid credentials");
    };

    return getUserCredentials(db, email)
        .then(validateUser);
};

module.exports = {
    handle
};