const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
   const { korisnickoIme, lozinka } = req.body;
   console.log(korisnickoIme, lozinka);
   try {
      const query = `SELECT idkorisnik, korisnickoime, lozinka, nazuloga
                     FROM KORISNIK JOIN ULOGA USING(iduloga)
                     WHERE korisnickoIme = $1`;
      
      const { rows } = await pool.query(query, [korisnickoIme]);

      const user = rows[0];

      if (user) {
         bcrypt.compare(lozinka, user.lozinka, (err, result) => {
            if (err) {
               console.log("[ERROR] Error hashing password");
               throw new Error("Hashing error");
            } else {
               if (result) {
                  const token = jwt.sign({
                     idkorisnik: user.idkorisnik,
                     korisnickoime: user.korisnickoime,
                     nazuloga: user.nazuloga
                  },
                     'tajna_lozinka')
                  // { expiresIn: '1h' }};
                  res.status(200).json({token: token, role: user.nazuloga});
               } else {
                  res.status(401).json({ message: "Incorrect username or password!" });
               }
            }
         })
      }
      else {
         res.status(401).json({ message: "Incorrect username or password!" });
      }
   } catch (error) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

module.exports = router;