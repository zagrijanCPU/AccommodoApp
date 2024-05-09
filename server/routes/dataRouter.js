const express = require('express');
const pool = require('../config/db');
const verifyToken = require('./tokenVerification');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// uloge: returns all types of roles
router.get('/uloge', async (req, res) => {
   try {
      const query = `SELECT *
                     FROM ULOGA
                     WHERE nazuloga != $1`;

      const { rows } = await pool.query(query, ['admin']);

      res.status(200).json(rows);
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
})

// accommodationTypes: returns all types of accommodation
router.get('/accommodationTypes', async (req, res) => {
   try {
      const query = `SELECT *
                     FROM TIP_SMJESTAJA`;
      const { rows } = await pool.query(query);

      res.status(200).json(rows);
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
});

router.get('/getAccommodation', verifyToken, async (req, res) => {
   try {
      const query = `SELECT idsmjestaj, idtipsmjestaja, naztipasmjestaja, nazivsmjestaja, drzava, grad, adresa,
                           postanskibroj, cijena, kapacitet, brojparkirnihmjesta, profilnaslika
                        FROM SMJESTAJ JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                        WHERE idsmjestaj = $1`;
      const { rows } = await pool.query(query, [req.query.id]);
      res.status(200).json(rows[0]);
   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to get accommodation' });
   }
});

// getAccommodations: 
router.post('/getAccommodations', verifyToken, async (req, res) => {
   if (req.body.role === "admin") {
      try {
         const query = `SELECT idsmjestaj, ime || ' ' || prezime as nazkorisnik, naztipasmjestaja, nazivsmjestaja, drzava || ' (' || postanskibroj || ' ' || adresa || ', ' || grad || ')' as lokacija, profilnaslika
                           FROM SMJESTAJ JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           LIMIT $1
                           OFFSET $2`;
         const { rows } = await pool.query(query, [req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);
   
         const query2 = `SELECT *
                           FROM SMJESTAJ`;
         const { rowCount } = await pool.query(query2);
         res.status(200).json({ accommodations: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Greška prilikom izvršavanja upita:', error);
         res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
      }
   }
   else if (req.body.role === "vlasnik") {
      try {
         const userId = req.user.idkorisnik;
         const query = `SELECT idsmjestaj, ime || ' ' || prezime as nazkorisnik ,naztipasmjestaja, nazivsmjestaja, drzava || ' (' || postanskibroj || ' ' || adresa || ', ' || grad || ')' as lokacija, profilnaslika
                           FROM SMJESTAJ JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           WHERE idvlasnik = $1
                           LIMIT $2
                           OFFSET $3`;
         const { rows } = await pool.query(query, [userId, req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);
   
         const query2 = `SELECT *
                           FROM SMJESTAJ
                           WHERE idvlasnik = $1`;
         const { rowCount } = await pool.query(query2, [userId]);
         res.status(200).json({ accommodations: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Greška prilikom izvršavanja upita:', error);
         res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
      }
   }
});

// getRole: requires token as Authorization and returns role of user
router.get('/getRole', verifyToken, async (req, res) => {
   try {
      var query = `SELECT *
                     FROM KORISNIK
                     WHERE idkorisnik = $1`;

      var { rows } = await pool.query(query, [req.user.idkorisnik]);

      query = `SELECT nazuloga
               FROM ULOGA
               WHERE iduloga = $1`;

      var { rows } = await pool.query(query, [rows[0].iduloga]);

      res.status(200).send(rows[0].nazuloga);
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
});

// getUserId: requires token as Authorization and returns id of user
router.get('/getUserId', verifyToken, async (req, res) => {
   try {
      res.status(200).json(req.user.idkorisnik);
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
})

// checkUser: returns 200 if username exists or 404 if doesn't exist (for registration)
router.post('/checkUser', async (req, res) => {
   const { korisnickoIme, email } = req.body;
   try {
      const query = `SELECT *
                     FROM KORISNIK
                     WHERE korisnickoIme = $1 OR
                     email = $2`;

      const { rows } = await pool.query(query, [korisnickoIme, email]);
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

// addAccommodationRequest:
router.post('/addAccommodationRequest', upload.fields([
   { name: 'profilnaSlika', maxCount: 1 },
   { name: 'kategorizacija', maxCount: 1 },
   { name: 'vlasnickiList', maxCount: 1 }
]), async (req, res) => {
   try {
      const { idVrstaZahtjeva, idVlasnik, idTipSmjestaja, nazivSmjestaja, drzava, grad, adresa, postanskiBroj, cijena, kapacitet, brojParkirnihMjesta } = req.body;
      const profilnaSlika = req.files['profilnaSlika'] ? req.files['profilnaSlika'][0].buffer : null;
      const kategorizacija = req.files['kategorizacija'][0].buffer;
      const vlasnickiList = req.files['vlasnickiList'][0].buffer;

      const query = `INSERT INTO ZAHTJEV (idvrstazahtjeva, idvlasnik, idtipsmjestaja, nazivsmjestaja, drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta, profilnaslika, kategorizacija, vlasnickilist)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
      const { rows } = await pool.query(query, [idVrstaZahtjeva, idVlasnik, idTipSmjestaja, nazivSmjestaja, drzava, grad, adresa, postanskiBroj, cijena, kapacitet, brojParkirnihMjesta, profilnaSlika, kategorizacija, vlasnickiList]);
      res.status(200).json({ message: "ok" });
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
})

router.post('/changeDataRequest', upload.single('profilnaSlika'), async (req, res) => {
   try {
      const { idVrstaZahtjeva, idVlasnik, idSmjestaj, idTipSmjestaja, nazivSmjestaja, drzava, grad, adresa, postanskiBroj, cijena, kapacitet, brojParkirnihMjesta } = req.body;
      // const profilnaSlika = req.file.buffer;
      // console.log(req.file);
      var profilnaSlika = req.file.buffer;

      const query = `INSERT INTO ZAHTJEV (idvrstazahtjeva, idvlasnik, idsmjestaj, idtipsmjestaja, nazivsmjestaja, drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta, profilnaslika)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
      await pool.query(query, [idVrstaZahtjeva, idVlasnik, idSmjestaj, idTipSmjestaja, nazivSmjestaja, drzava, grad, adresa, postanskiBroj, cijena, kapacitet, brojParkirnihMjesta, profilnaSlika]);
      res.status(200).json({ message: "ok" });
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
});

// requestTypes: 
router.get('/requestTypes', verifyToken, async (req, res) => {
   try {
      const query = `SELECT *
                     FROM VRSTA_ZAHTJEVA`;

      const { rows } = await pool.query(query);

      res.status(200).json(rows);
   } catch (error) {
      console.error('Greška prilikom izvršavanja upita:', error);
      res.status(500).json({ error: 'Došlo je do greške prilikom izvršavanja upita.' });
   }
});

// 
router.post('/getPendingRequests', verifyToken, async (req, res) => {
   if (req.body.role === "admin") {
      try {
         const query = `SELECT idzahtjev, nazvrstezahtjeva, ime || ' ' || prezime as nazkorisnik, naztipasmjestaja, nazivsmjestaja
                        FROM ZAHTJEV
                           JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           JOIN VRSTA_ZAHTJEVA USING(idvrstazahtjeva)
                        WHERE nacekanju = true
                        ORDER BY datumslanjazahtjeva desc
                        LIMIT $1
                        OFFSET $2`;

         const { rows } = await pool.query(query, [req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);

         const query2 = `SELECT *
                        FROM ZAHTJEV
                        WHERE nacekanju = true`;
         const { rowCount } = await pool.query(query2);
         res.status(200).json({ requests: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to get requests' });
      }
   }
   else if (req.body.role === "vlasnik") {
      console.log("ovdje");
      try {
         const query = `SELECT idzahtjev, nazvrstezahtjeva, ime || ' ' || prezime as nazkorisnik, naztipasmjestaja, nazivsmjestaja
                        FROM ZAHTJEV
                           JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           JOIN VRSTA_ZAHTJEVA USING(idvrstazahtjeva)
                        WHERE nacekanju = true AND idvlasnik = $1
                        ORDER BY datumslanjazahtjeva desc
                        LIMIT $2
                        OFFSET $3`;

         const { rows } = await pool.query(query, [req.user.idkorisnik, req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);
         console.log(rows);
         const query2 = `SELECT *
                        FROM ZAHTJEV
                        WHERE nacekanju = true AND idvlasnik = $1`;
         const { rowCount } = await pool.query(query2, [req.user.idkorisnik]);
         res.status(200).json({ requests: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to get requests' });
      }
   }
   else {
      res.status(401).json({ message: "Unauthorized" });
   }
})

// /getRequests: requires token as Authorization, role in body, returns paginated requests depending on which role is running the query
router.post('/getApprovedRequests', verifyToken, async (req, res) => {
   // For admin
   if (req.body.role === "admin") {
      try {
         const query = `SELECT idzahtjev, nazvrstezahtjeva, ime || ' ' || prezime as nazkorisnik, naztipasmjestaja, nazivsmjestaja
                        FROM ZAHTJEV
                           JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           JOIN VRSTA_ZAHTJEVA USING(idvrstazahtjeva)
                        WHERE nacekanju = false AND odobreno = true
                        ORDER BY datumslanjazahtjeva desc
                        LIMIT $1
                        OFFSET $2`;

         const { rows } = await pool.query(query, [req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);

         const query2 = `SELECT *
                        FROM ZAHTJEV
                        WHERE nacekanju = false AND odobreno = true`;
         const { rowCount } = await pool.query(query2);
         res.status(200).json({ requests: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to get requests' });
      }
   }
   // For owner
   else if (req.body.role === "vlasnik") {
      try {
         const query = `SELECT idzahtjev, nazvrstezahtjeva, ime || ' ' || prezime as nazkorisnik, naztipasmjestaja, nazivsmjestaja
                        FROM ZAHTJEV
                           JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           JOIN VRSTA_ZAHTJEVA USING(idvrstazahtjeva)
                        WHERE nacekanju = false AND odobreno = true AND idvlasnik = $1
                        ORDER BY datumslanjazahtjeva desc
                        LIMIT $2
                        OFFSET $3`;

         const { rows } = await pool.query(query, [req.user.idkorisnik, req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);

         const query2 = `SELECT *
                        FROM ZAHTJEV
                        WHERE nacekanju = false AND odobreno = true AND idvlasnik = $1`;
         const { rowCount } = await pool.query(query2, [req.user.idkorisnik]);
         res.status(200).json({ requests: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to get requests' });
      }
   }
});

// 
router.post('/getDiscardedRequests', verifyToken, async (req, res) => {
   if (req.body.role === "admin") {
      try {
         const query = `SELECT idzahtjev, nazvrstezahtjeva, ime || ' ' || prezime as nazkorisnik, naztipasmjestaja, nazivsmjestaja
                        FROM ZAHTJEV
                           JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           JOIN VRSTA_ZAHTJEVA USING(idvrstazahtjeva)
                        WHERE nacekanju = false AND odobreno = false
                        ORDER BY datumslanjazahtjeva desc
                        LIMIT $1
                        OFFSET $2`;

         const { rows } = await pool.query(query, [req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);

         const query2 = `SELECT *
                        FROM ZAHTJEV
                        WHERE nacekanju = false AND odobreno = false`;
         const { rowCount } = await pool.query(query2);
         res.status(200).json({ requests: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to get requests' });
      }
   }
   else if (req.body.role === "vlasnik") {
      try {
         const query = `SELECT idzahtjev, nazvrstezahtjeva, ime || ' ' || prezime as nazkorisnik, naztipasmjestaja, nazivsmjestaja
                        FROM ZAHTJEV
                           JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                           JOIN KORISNIK ON idkorisnik = idvlasnik
                           JOIN VRSTA_ZAHTJEVA USING(idvrstazahtjeva)
                        WHERE nacekanju = false AND odobreno = false AND idvlasnik = $1
                        ORDER BY datumslanjazahtjeva desc
                        LIMIT $2
                        OFFSET $3`;

         const { rows } = await pool.query(query, [req.user.idkorisnik, req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);

         const query2 = `SELECT *
                      FROM ZAHTJEV`;
         const { rowCount } = await pool.query(query2);
         res.status(200).json({ requests: rows, totalCount: rowCount });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to get requests' });
      }
   }
   else {
      res.status(401).json({ message: "Unauthorized" });
   }
})

// /getRequest: requires token as Authorization, returns claim
router.post('/getRequest', verifyToken, async (req, res) => {
   try {
      const query = `SELECT idzahtjev, datumslanjazahtjeva, nazvrstezahtjeva, naztipasmjestaja, nazivsmjestaja, 
                           drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta,
                           kategorizacija, vlasnickilist, profilnaslika, nacekanju, odobreno, odgovor
                     FROM ZAHTJEV JOIN TIP_SMJESTAJA USING(idtipsmjestaja)
                     JOIN VRSTA_ZAHTJEVA USING(idvrstazahtjeva)
                     WHERE idzahtjev = $1`;

      const { rows } = await pool.query(query, [req.query.id]);
      console.log(rows[0]);
      res.status(200).json(rows[0]);
   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to get claim' });
   }
});

// approveClaim: requires token as Authorization, returns status 200
router.post('/approveRequest', verifyToken, async (req, res) => {
   if (req.body.nazivVrsteZahtjeva === "Add Accommodation") {
      try {
         const query = `UPDATE ZAHTJEV
                        SET nacekanju = false, odobreno = true, odgovor = $1
                        WHERE idzahtjev = $2
                        RETURNING idvlasnik, idtipsmjestaja, nazivsmjestaja, drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta, profilnaslika`;
         const { rows } = await pool.query(query, [req.body.odgovor, req.query.id]);
   
         const newAccommodation = rows[0];
         console.log(rows[0]);
   
         // Dodati zahtjev u smjestaj
         const query2 = `INSERT INTO SMJESTAJ (idvlasnik, idtipsmjestaja, nazivsmjestaja, drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta, profilnaslika)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
   
         await pool.query(query2, [
            newAccommodation.idvlasnik,
            newAccommodation.idtipsmjestaja,
            newAccommodation.nazivsmjestaja,
            newAccommodation.drzava,
            newAccommodation.grad,
            newAccommodation.adresa,
            newAccommodation.postanskibroj,
            newAccommodation.cijena,
            newAccommodation.kapacitet,
            newAccommodation.brojparkirnihmjesta,
            newAccommodation.profilnaslika
         ])
   
         res.status(200).json({ message: "ok" });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to approve claim' });
      }
   }
   else if (req.body.nazivVrsteZahtjeva === "Change data") {
      try {
         const query = `UPDATE ZAHTJEV
                        SET nacekanju = false, odobreno = true, odgovor = $1
                        WHERE idzahtjev = $2
                        RETURNING idvlasnik, idsmjestaj, idtipsmjestaja, nazivsmjestaja, drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta, profilnaslika`;
         const { rows } = await pool.query(query, [req.body.odgovor, req.query.id]);
   
         const updateAccommodation = rows[0];
         console.log(rows[0]);
         
         // Update smještaj
         var query2;
         if (updateAccommodation.profilnaslika) {
            console.log("promijeni i sliku");
            query2 = `UPDATE SMJESTAJ
                     SET nazivsmjestaja = $1,
                        adresa = $2,
                        cijena = $3,
                        kapacitet = $4,
                        brojparkirnihmjesta = $5,
                        profilnaslika = $6
                     WHERE idsmjestaj = $7`;
            await pool.query(query2, [
               updateAccommodation.nazivsmjestaja,
               updateAccommodation.adresa,
               updateAccommodation.cijena,
               updateAccommodation.kapacitet,
               updateAccommodation.brojparkirnihmjesta,
               updateAccommodation.profilnaslika,
               updateAccommodation.idsmjestaj
            ]);
         }
         else {
            console.log("ovdje");
            query2 = `UPDATE SMJESTAJ
                     SET nazivsmjestaja = $1,
                        adresa = $2,
                        cijena = $3,
                        kapacitet = $4,
                        brojparkirnihmjesta = $5
                     WHERE idsmjestaj = $6`;
            await pool.query(query2, [
               updateAccommodation.nazivsmjestaja,
               updateAccommodation.adresa,
               updateAccommodation.cijena,
               updateAccommodation.kapacitet,
               updateAccommodation.brojparkirnihmjesta,
               updateAccommodation.idsmjestaj
            ]);
         }
   
         res.status(200).json({ message: "ok" });
      } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Failed to approve claim' });
      }
   }
});

router.post('/discardRequest', verifyToken, async (req, res) => {
   try {
      const query = `UPDATE ZAHTJEV
                     SET nacekanju = false, odobreno = false, odgovor = $1
                     WHERE idzahtjev = $2`;
      await pool.query(query, [req.body.odgovor, req.query.id]);
      res.status(200).json({ message: "ok" });
   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to discard claim' });
   }
});


router.get('/setPending', verifyToken, async (req, res) => {
   try {
      const query = `UPDATE ZAHTJEV
                     SET nacekanju = true, odobreno = $1, odgovor = $2
                     WHERE idzahtjev = $3`;
      await pool.query(query, [null, null, req.query.id]);
      res.status(200).json({ message: "ok" });
   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to set pending' });
   }
});


// myReservations: requires token for Authorization, returns reservations for given userId
router.post('/getReservations', verifyToken, async (req, res) => {
   try {
      const userId = req.user.idkorisnik;
      const query = `SELECT idrezervacija, datrezervacije, nazivsmjestaja, brojgostiju, datdolaska, datodlaska, placeno, otkazano, zavrseno
                     FROM REZERVACIJA JOIN SMJESTAJ USING(idsmjestaj)
                     WHERE idgost = $1
                     LIMIT $2
                     OFFSET $3`;

      const { rows } = await pool.query(query, [userId, req.query.pageSize, (req.query.page - 1) * req.query.pageSize]);

      const query2 = `SELECT *
                        FROM REZERVACIJA
                        WHERE idgost = $1`;

      const { rowCount } = await pool.query(query2, [userId]);
      res.status(200).json({ reservations: rows, totalCount: rowCount });
   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to get reservations' });
   }
});


router.post('/findAccommodations', verifyToken, async (req, res) => {

});

module.exports = router;