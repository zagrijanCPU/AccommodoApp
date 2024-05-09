select setval('korisnik_idkorisnik_seq', 1, false);
select setval('uloga_iduloga_seq', 1, false);
select setval('tip_smjestaja_idtipsmjestaja_seq', 1, false);
select setval('smjestaj_idsmjestaj_seq', 1, false);
select setval('zahtjev_idzahtjev_seq', 1, false);
select setval('rezervacija_idrezervacija_seq', 1, false);
select setval('recenzija_idrecenzija_seq', 1, false);

-- insert into korisnik (korisnickoIme, ime, prezime, email, lozinka, tipkorisnika)
-- values('admin', 'admin', 'admin', 'admin@accommodoapp.com', 'pass', 'admin')

-- insert into korisnik (korisnickoIme, ime, prezime, email, lozinka, tipkorisnika)
-- values('user1', 'Iva', 'Ivić', 'ivaivic@gmail.com', 'pass', 'gost')

-- insert into korisnik (korisnickoIme, ime, prezime, email, lozinka, tipkorisnika)
-- values('user2', 'Marko', 'Markić', 'markomarkic@gmail.com', 'pass', 'gost')

-- insert into korisnik (korisnickoIme, ime, prezime, email, lozinka, tipkorisnika)
-- values('user3', 'Mate', 'Matić', 'matematic@gmail.com', 'pass', 'gost')

-- insert into korisnik (korisnickoIme, ime, prezime, email, lozinka, tipkorisnika)
-- values('user4', 'Fran', 'Franić', 'franfranic@gmail.com', 'pass', 'gost')

insert into tip_smjestaja (nazTipaSmjestaja)
values('hotel');
insert into tip_smjestaja (nazTipaSmjestaja)
values('apartment');
insert into tip_smjestaja (nazTipaSmjestaja)
values('hostel');
insert into tip_smjestaja (nazTipaSmjestaja)
values('motel');
insert into tip_smjestaja (nazTipaSmjestaja)
values('villa');
insert into tip_smjestaja (nazTipaSmjestaja)
values('room');


insert into rezervacija (idgost, idsmjestaj, datdolaska, datodlaska, datrezervacije, brojgostiju, placeno, otkazano)
values(4, 1, '2024-05-25', '2024-05-31', '2024-05-01', 3, false, false);

insert into zahtjev (idvrstazahtjeva, idvlasnik, idtipsmjestaja, nazivsmjestaja, drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta)
values(1, 2, 1, 'Hotel Maris', 'Croatia', 'Split', 'Adresa 1a', '21000', 150, 2, 1)
insert into zahtjev (idvrstazahtjeva, idvlasnik, idtipsmjestaja, nazivsmjestaja, drzava, grad, adresa, postanskibroj, cijena, kapacitet, brojparkirnihmjesta)
values(1, 3, 2, 'Apartments ***', 'Croatia', 'Zagreb', 'Potok 4', '10000', 50, 3, 1)