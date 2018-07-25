const { getUserBy } = require("../core/repository");
const { sendOrNotFound } = require("../core/common");

const handle = db => (req, res) => {
    const { id } = req.params;

    return getUserBy(db, { id })
        .then(sendOrNotFound(res));
};

module.exports = {
    handle
};