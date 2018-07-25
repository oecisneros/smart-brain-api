const { getUsers } = require("../core/repository");
const { sendJson } = require("../core/common");

const handle = db => (_, res) =>
    getUsers(db)
        .then(sendJson(res));

module.exports = {
    handle
};