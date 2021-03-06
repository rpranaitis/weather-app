# weather-app
HTML / CSS / SCSS / JavaScript / NodeJS

# Orų blokas:

* Oro temperatūra atvaizduojama nuo dabartinio laiko kas valandą 11 valandų į priekį. Galima keisti laipsnius iš celsijų į farenheitus.
* Temperatūros bloko ikonos yra dviejų tipų: dieninės ir naktinės (naktinės veikia nuo 20:00 iki 07:00). Užvedus ant ikonos ir ilgiau palaukus matoma jos antraštė.
* Parametrų bloke vėjo greitis rodomas raudona spalva jeigu yra didesnis nei 10 m/s.
* Parametrų bloke vėjo krypties ikona keičiasi pagal vėjo kryptį, o kadangi meteo.lt API grąžina laipsnius, tai laipsniai konvertuojami į raides.

# Paieškos blokas:

* Paspaudus ant paieškos laukelio yra išmetamas prieš tai ieškotų miestų sąrašas.
* Pradėjus rašyti atsiranda ikona, kurią paspaudus galima ištrinti visą parašytą tekstą.
* Į paieškos laukelį galima vesti pavadinimus be lietuviškų raidžių ir su tarpais (pavyzdys: 'vilnius fabijoniskes').
* Paspaudus ant bet kurios puslapio vietos yra uždaromi miestų pasiūlymai arba istorija.
* Ieškoti galima dviem būdais: paspaudžiant „Enter“ klavišą arba spaudžiant „Ieškoti“ mygtuką.
* Jeigu bandome ieškoti neįvesto miesto gauname klaidą „Neįvestas miestas“.
* Jeigu rankiniu būdu įvedame miestą ir toks miestas neegzistuoja gauname klaidą „Tokio miesto duomenų bazėje nėra“.
* Klaidos langą galima išjungti 3 būdais: X paspaudimu, mygtuku „Uždaryti“ arba tiesiog paspausdami „Enter“ klavišą.
* Mobilioje versijoje pateikus užklausą įvyksta automatinis „scrollinimas“ į apačią, paėjus dar žemiau atsiranda mygtukas, kurį paspaudus grįžtame į viršų.

Puslapis turi skirtingas versijas pritaikytas mobiliesiems telefonams, planšetėms ir kompiuteriams.
