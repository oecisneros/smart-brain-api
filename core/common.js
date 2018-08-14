const redisAuthorize = (redis, ...excludes) => (req, res, next) => {
    if (excludes.some(x => req.path.includes(x))) {
        return next();
    }

    redis.get(req.headers.authorization, function (err, reply) {
        if (err || !reply) {
            return res.status(401).json("Unauthorized");
        }
        return next();
    });
};

const protect = fn => (...args) => {
    const result = fn(...args);
    if (result && result.catch) {
        result.catch(args[2]);
    }
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