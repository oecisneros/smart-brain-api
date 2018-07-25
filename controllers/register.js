const { registerUser } = require("../core/repository");
const { sendOrNotFound } = require("../core/common");

const handle = (db, bcrypt) => (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json("Incorrect form submission");
    }

    const hash = bcrypt.hashSync(password);

    return registerUser(db, name, email, hash)
        .then(sendOrNotFound(res));
};

module.exports = {
    handle
};