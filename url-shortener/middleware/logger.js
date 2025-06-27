const log = require('../utils/logger');

const logger = async (req, res, next) => {
    const msg = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
    await log("backend", "info", "middleware", msg);
    next();
};

module.exports = logger;