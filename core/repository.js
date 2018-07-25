const unwrap = obj => ((obj.length || 0) > 0 ? obj[0] : null);

const getUserCredentialsBy = (db, params) =>
    db("login")
        .where(params)
        .then(unwrap);

const getUserBy = (db, params) =>
    db("users")
        .where(params)
        .then(unwrap);

const getUsers = db => db("users").select();

const registerUser = (db, name, email, hash) => {
    const user = {
        name: name,
        email: email,
        joined: new Date()
    };

    const login = {
        email: email,
        hash: hash
    };

    return db.transaction(transaction => {
        const insertLogin = () =>
            transaction("login")
                .insert(login);

        const insertUser = () =>
            transaction("users")
                .returning("*")
                .insert(user);

        return insertLogin()
            .then(insertUser)
            .then(unwrap);
    });
};

const updateUserEntriesBy = (db, params) =>
    db("users")
        .where(params)
        .increment("entries", 1)
        .returning("entries")
        .then(unwrap);

module.exports = {
    getUserCredentialsBy,
    getUserBy,
    getUsers,
    registerUser,
    updateUserEntriesBy
};