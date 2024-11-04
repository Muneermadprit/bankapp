const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 180 }) // Set your TTL and check period as needed

module.exports = cache;
