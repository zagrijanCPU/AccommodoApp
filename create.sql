CREATE TABLE ULOGA
(
  idUloga SERIAL NOT NULL,
  nazUloga VARCHAR(20) NOT NULL,
  PRIMARY KEY (idUloga),
  UNIQUE(nazUloga)
);

CREATE TABLE TIP_SMJESTAJA
(
  idTipSmjestaja SERIAL NOT NULL,
  nazTipaSmjestaja VARCHAR(50) NOT NULL,
  PRIMARY KEY (idTipSmjestaja),
  UNIQUE(nazTipaSmjestaja)
);

CREATE TABLE KORISNIK
(
  idKorisnik SERIAL NOT NULL,
  idUloga SERIAL NOT NULL,
  korisnickoIme VARCHAR(50) NOT NULL,
  ime VARCHAR(255),
  prezime VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  lozinka VARCHAR(255) NOT NULL,
  PRIMARY KEY (idKorisnik),
  FOREIGN KEY (idUloga) REFERENCES ULOGA(idUloga),
  UNIQUE (korisnickoIme),
  UNIQUE (email)
);

CREATE TABLE SMJESTAJ
(
  idSmjestaj SERIAL NOT NULL,
  idVlasnik SERIAL NOT NULL,
  idTipSmjestaja SERIAL NOT NULL,
  nazivSmjestaja VARCHAR(255) NOT NULL,
  drzava VARCHAR(100) NOT NULL,
  grad VARCHAR(100) NOT NULL,
  adresa VARCHAR(255) NOT NULL,
  postanskiBroj VARCHAR(20) NOT NULL,
  cijena FLOAT NOT NULL,
  -- geogDuzina FLOAT,
  -- geogSirina FLOAT,
  kapacitet INT NOT NULL,
  brojParkirnihMjesta INT NOT NULL,
  profilnaSlika BYTEA,
  PRIMARY KEY (idSmjestaj),
  FOREIGN KEY (idVlasnik) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idTipSmjestaja) REFERENCES TIP_SMJESTAJA(idTipSmjestaja)
);

CREATE TABLE ZAHTJEV
(
  idZahtjev SERIAL NOT NULL,
  idVrstaZahtjeva SERIAL NOT NULL,
  idVlasnik SERIAL NOT NULL,
  datumSlanjaZahtjeva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  idSmjestaj INT,
  idTipSmjestaja INT,
  nazivSmjestaja VARCHAR(255),
  drzava VARCHAR(100),
  grad VARCHAR(100),
  adresa VARCHAR(255),
  postanskiBroj VARCHAR(20),
  cijena FLOAT,
  kapacitet INT,
  brojParkirnihMjesta INT,
  kategorizacija BYTEA,
  vlasnickiList BYTEA,
  profilnaSlika BYTEA,
  naCekanju BOOLEAN DEFAULT true,
  odobreno BOOLEAN,
  odgovor TEXT,
  PRIMARY KEY (idZahtjev),
  FOREIGN KEY (idVrstaZahtjeva) REFERENCES VRSTA_ZAHTJEVA(idVrstaZahtjeva),
  FOREIGN KEY (idVlasnik) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idTipSmjestaja) REFERENCES TIP_SMJESTAJA(idTipSmjestaja),
  CONSTRAINT kategorizacija_constraint CHECK (
      (idvrstazahtjeva = 1 AND kategorizacija IS NOT NULL) OR
      (idvrstazahtjeva = 2 AND kategorizacija IS NULL)
  ),
  CONSTRAINT vlasnickilist_constraint CHECK (
      (idvrstazahtjeva = 1 AND vlasnickiList IS NOT NULL) OR
      (idvrstazahtjeva = 2 AND vlasnickiList IS NULL)
  )
);

CREATE TABLE VRSTA_ZAHTJEVA
(
  idVrstaZahtjeva SERIAL NOT NULL,
  nazVrsteZahtjeva VARCHAR(50) NOT NULL,
  PRIMARY KEY (idVrstaZahtjeva),
  UNIQUE (nazVrsteZahtjeva)
);

CREATE TABLE REZERVACIJA
(
  idRezervacija SERIAL NOT NULL,
  idGost SERIAL NOT NULL,
  idSmjestaj SERIAL NOT NULL,
  datDolaska DATE NOT NULL,
  datOdlaska DATE NOT NULL,
  datRezervacije DATE NOT NULL,
  brojGostiju INT NOT NULL,
  placeno BOOLEAN NOT NULL,
  otkazano BOOLEAN NOT NULL,
  PRIMARY KEY (idRezervacija),
  FOREIGN KEY (idGost) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idSmjestaj) REFERENCES SMJESTAJ(idSmjestaj),
  UNIQUE (idGost, idSmjestaj, datDolaska, datOdlaska)
  -- CONSTRAINT datumi_check CHECK (datdolaska >= CURRENT_DATE AND datdolaska < datodlaska)
);

CREATE TABLE RECENZIJA
(
  idRecenzija SERIAL NOT NULL,
  idGost SERIAL NOT NULL,
  idSmjestaj SERIAL NOT NULL,
  tekst TEXT,
  ocjena INT NOT NULL,
  PRIMARY KEY (idRecenzija),
  FOREIGN KEY (idGost) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idSmjestaj) REFERENCES SMJESTAJ(idSmjestaj),
  UNIQUE (idGost, idSmjestaj)
);