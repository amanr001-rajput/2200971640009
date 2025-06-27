const log = require('./utils/logger');

log("backend", "info", "test", "This is a test log from Aman.")
  .then(() => console.log("Log successfully sent!"))
  .catch(() => console.log("Log failed!"));