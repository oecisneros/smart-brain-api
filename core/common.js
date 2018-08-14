const protect = fn => (...args) => {
    const result = fn(...args);
    if (result && result.catch) {
        result.catch(args[2]);
    }
};

const redisAuthorize = (redis, fn) => (...args) => {
    const [req, res] = [args[0], args[1]];    
    const { authorization } = req.headers;

    redis.get(authorization, function (err, reply) {
        if (err || !reply) {
            return res.status(400).json("Unauthorized");
        }
        return protect(fn(...args));
    });
};

const sendJson = res => data => res.json(data);

const sendOrNotFound = res => response => {
    if (response) {
        res.json(response);
    } else {
        res.status(404).json("Not found");
    }
};

module.exports = {
    redisAuthorize,
    protect,
    sendJson,
    sendOrNotFound,
};