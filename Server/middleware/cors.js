const cors = require('cors');

const corsMiddleware = cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = corsMiddleware;