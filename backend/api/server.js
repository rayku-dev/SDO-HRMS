const handler = require('../dist/src/main').default;

module.exports = async (req, res) => {
  return await handler(req, res);
};
