const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
   try {
      const query = 'SELECT * FROM korisnik';

      const { rows } = await pool.query(query);

      res.json(rows);
   } catch (err) {
      console.error('Greška prilikom izvršavanja upita:', err);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
})

router.get('/uloge', async (req, res) => {
   try {
      const query = `SELECT *
                     FROM ULOGA
                     WHERE nazuloge != $1`;
      
      const { rows } = await pool.query(query, ['admin']);
      res.status(200).json(rows);
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
})

router.post('/checkUser', async (req, res) => {
   const { korisnickoIme, email } = req.body;
   // console.log(req.body);
   try {
      const query = `SELECT *
                     FROM KORISNIK
                     WHERE korisnickoIme = $1 OR
                     email = $2`;
      
      const {rows} = await pool.query(query, [korisnickoIme, email]);
      if (rows.length > 0) {
         console.log("Pronađen");
         res.status(200).json({ message: "Korisnik već postoji" });
      }
      else {
         console.log("Nije pronađen")
         res.status(404).json({ message: "Korisnik ne postoji" });
      }
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
})

module.exports = router;