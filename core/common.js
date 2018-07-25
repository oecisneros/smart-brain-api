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
    protect,
    sendJson,
    sendOrNotFound,
};