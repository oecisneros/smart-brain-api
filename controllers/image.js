const { updateUserEntriesBy } = require("../core/repository");
const { sendOrNotFound } = require("../core/common");

const handle = db => (req, res) => {
    const { id } = req.body;

    return updateUserEntriesBy(db, { id })
        .then(sendOrNotFound(res));
};

module.exports = {
    handle
};