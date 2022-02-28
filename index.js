const isReservedIP = require('./dist/index').isReservedIP;

module.exports = isReservedIP;

// Allow use of default import syntax in TypeScript
module.exports.default = isReservedIP;