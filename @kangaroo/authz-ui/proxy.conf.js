
module.exports = {
  "/oauth2/*": {
    "target": 'https://localhost:8080',
    "secure": false
  },
  "/v1/*": {
    "target": 'https://localhost:8080',
    "secure": false
  }
};
