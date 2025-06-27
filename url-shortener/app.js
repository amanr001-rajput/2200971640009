const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const shortUrls = require('./routes/shortUrls');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(logger);
app.use('/', shortUrls);

app.listen(PORT, () => {
    require('./utils/logger')("backend", "info", "config", `Server running at http://localhost:${PORT}`);
});