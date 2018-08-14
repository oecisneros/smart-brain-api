const { getUserBy, updateProfile } = require("../core/repository");
const { sendOrNotFound } = require("../core/common");

const get = db => (req, res) => {
    const { id } = req.params;

    return getUserBy(db, { id })
        .then(sendOrNotFound(res));
};

const save = db => (req, res) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;

    return updateProfile(db, id, name, age, pet)
        .then(sendJson(res)("Ok"));
};

module.exports = {
    get,
    save
};