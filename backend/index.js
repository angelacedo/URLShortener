const express = require('express')
const cors = require('cors');
const app = express();
const port = 3000;

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};


app.use(cors(corsOptions))
app.use(express.json());
app.use('/api', require('./src/routes/router'));

app.listen(port, () => {
  console.log(`URL Shortener listening at http://localhost:${port}`);
});