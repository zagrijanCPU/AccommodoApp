CREATE TABLE ULOGA
(
  idUloge SERIAL NOT NULL,
  nazUloge VARCHAR(20) NOT NULL,
  PRIMARY KEY (idUloge)
  UNIQUE(nazUloge)
);

CREATE TABLE TIP_SMJESTAJA
(
  idTipSmjestaja SERIAL NOT NULL,
  nazTipaSmjestaja VARCHAR(50) NOT NULL,
  PRIMARY KEY (idTipSmjestaja)
);

CREATE TABLE KORISNIK
(
  idKorisnik SERIAL NOT NULL,
  idUloge SERIAL NOT NULL,
  korisnickoIme VARCHAR(50) NOT NULL,
  ime VARCHAR(255),
  prezime VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  lozinka VARCHAR(255) NOT NULL,
  PRIMARY KEY (idKorisnik),
  FOREIGN KEY (idUloge) REFERENCES ULOGA(idUloge),
  UNIQUE (korisnickoIme),
  UNIQUE (email)
);

CREATE TABLE SMJESTAJ
(
  idSmjestaj SERIAL NOT NULL,
  idVlasnik SERIAL NOT NULL,
  idTipSmjestaja SERIAL NOT NULL,
  nazivSmjestaja VARCHAR(255) NOT NULL,
  grad VARCHAR(100) NOT NULL,
  cijena FLOAT NOT NULL,
  kapacitet INT NOT NULL,
  profilnaSlika BYTEA,
  adresa VARCHAR(255) NOT NULL,
  drzava VARCHAR(100) NOT NULL,
  postanskiBroj VARCHAR(20) NOT NULL,
  geogDuzina FLOAT NOT NULL,
  geogSirina FLOAT NOT NULL,
  PRIMARY KEY (idSmjestaj),
  FOREIGN KEY (idVlasnik) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idTipSmjestaja) REFERENCES TIP_SMJESTAJA(idTipSmjestaja),
  UNIQUE (postanskiBroj)
);

CREATE TABLE ZAHTJEV
(
  idZahtjev SERIAL NOT NULL,
  idVlasnik SERIAL NOT NULL,
  nazivSmjestaja VARCHAR(255) NOT NULL,
  kategorizacija BYTEA, -- inače obavezno
  vlasnickiList BYTEA, -- inače obavezno
  PRIMARY KEY (idZahtjev),
  FOREIGN KEY (idVlasnik) REFERENCES KORISNIK(idKorisnik)
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
  dolazakAutom BOOLEAN NOT NULL,
  placeno BOOLEAN NOT NULL,
  otkazano BOOLEAN NOT NULL,
  zavrseno BOOLEAN NOT NULL,
  PRIMARY KEY (idRezervacija),
  FOREIGN KEY (idGost) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idSmjestaj) REFERENCES SMJESTAJ(idSmjestaj),
  UNIQUE (idGost, idSmjestaj)
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