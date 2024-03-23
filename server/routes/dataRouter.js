const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
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
})

module.exports = router;