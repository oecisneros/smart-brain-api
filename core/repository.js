const unwrap = obj => ((obj.length || 0) > 0 ? obj[0] : null);

const getUserCredentials = (db, email) =>
    db.from('login')
        .innerJoin('users', 'login.email', 'users.email')
        .select("users.id", "login.email", "login.hash")
        .where("login.email", email)
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

const updateUserEntries = (db, id) =>
    db("users")
        .where({ id })
        .increment("entries", 1)
        .returning("entries")
        .then(unwrap);

const updateProfile = (db, params) =>
    db("users")
        .where(params)
        .update({ name });

module.exports = {
    getUserCredentials,
    getUserBy,
    getUsers,
    registerUser,
    updateProfile,
    updateUserEntries
};