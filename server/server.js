const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const dataRouter = require('./routes/dataRouter.js');
const registerRouter = require('./routes/registerRouter.js');
const loginRouter = require('./routes/loginRouter.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', (req, res, next) => {
   next();
});

app.use('/api/data', dataRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

const PORT = 8080;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
