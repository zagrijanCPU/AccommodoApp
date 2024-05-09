const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
   const { idUloga, korisnickoIme, ime, prezime, email, lozinka } = req.body;
   // console.log(req.body);
   try {

      const query = `SELECT * 
                     FROM KORISNIK
                     WHERE korisnickoIme = $1 OR
                     email = $2`;

      const { rows } = await pool.query(query, [korisnickoIme, email]);

      // console.log(rows);
      if (rows.length == 0) {
         bcrypt.hash(lozinka, 10, async (err, hashedPassword) => {
            if (err) {
               console.log("[ERROR] Error hashing password");
               throw new Error("Hashing error");
            }
            else {
               const query = `INSERT INTO KORISNIK (iduloga, korisnickoIme, ime, prezime, email, lozinka) 
                              VALUES ($1, $2, $3, $4, $5, $6)
                              RETURNING idUloga, korisnickoIme, ime, prezime, email`

               const { rows } = await pool.query(query, [idUloga, korisnickoIme, ime, prezime, email, hashedPassword]);

               res.status(201).json({ message: "User successfully created!", user: rows[0] });
            }
         });
      }
      else {
         res.status(409).json({ message: "User already exists!" });
      }

   } catch (err) {
      console.error('Error while running query:', err);
      res.status(500).json({ error: 'Error while running query.' });
   }
})



module.exports = router;