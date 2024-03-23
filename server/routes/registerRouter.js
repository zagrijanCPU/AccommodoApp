const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/db');

router.post('/addUser', async (req, res) => {
   const { idUloge, korisnickoIme, ime, prezime, email, lozinka } = req.body;
   console.log(req.body);

   try {

      const query = `SELECT * 
                     FROM KORISNIK
                     WHERE korisnickoIme = $1`;
      
      const { rows } = await pool.query(query, [korisnickoIme]);

      // console.log(rows);
      if (rows.length == 0) {
         bcrypt.hash(lozinka, 10, async (err, hashedPassword) => {
            if (err) {
               console.log("[ERROR] Error hashing password");
               throw new Error("Hashing error");
            }
            else {
               const query = `INSERT INTO KORISNIK (iduloge, korisnickoIme, ime, prezime, email, lozinka) 
                              VALUES ($1, $2, $3, $4, $5, $6)
                              RETURNING idUloge, korisnickoIme, ime, prezime, email`
               
               const { rows } = await pool.query(query, [idUloge, korisnickoIme, ime, prezime, email, hashedPassword]);
         
               res.status(201).json({message: "Korisnik je uspješno stvoren!", user: rows[0]});
            }
         });
      }
      else {
         res.status(409).json({ message: "Korisnik već postoji!" });
      }

   } catch (err) {
      console.error('Greška prilikom izvršavanja upita:', err);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
})

module.exports = router;