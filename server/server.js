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
   console.log('Middleware za /api');
   next();
});

app.use('/api/data', dataRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

// primjer pisanja upita
app.get('/query', async (req, res) => {
   try {
      // Vaš SQL upit
      const query = 'SELECT * FROM korisnik';

      // Izvršavanje SQL upita
      const { rows } = await pool.query(query);

      res.json(rows);
   } catch (err) {
      console.error('Greška prilikom izvršavanja upita:', err);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
});



const PORT = 8080;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
