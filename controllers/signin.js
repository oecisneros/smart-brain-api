const { getUserBy, getUserCredentialsBy } = require("../core/repository");
const { sendOrNotFound } = require("../core/common");

const handle = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Incorrect form submission");
    }

    const validateUser = async login => {
        const isValid = login && bcrypt.compareSync(password, login.hash);

        if (isValid) {
            let user = await getUserBy(db, { email });
            sendOrNotFound(res)(user);
        } else {
            res.status(400).json("Invalid credentials");
        }
    };

    return getUserCredentialsBy(db, { email })
        .then(validateUser);
};

module.exports = {
    handle
};