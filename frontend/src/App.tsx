import { useEffect, useState } from "react";
import "./App.css";

interface Firma {
  idFirma: number;
  naziv: string;
  pib: string;
  maticniBroj: string;
  datumOsnivanja: string;
  tipFirme: string;
  pdvObveznik: boolean;
  pausalac: boolean;
  imaLogo?: boolean;
  zaduzeniKorisnik?: {
    idUser: number;
    username: string;
  } | null;
}

interface Obaveza {
  idObaveza: number;
  tip: string;
  iznos: number;
  datumDospeca: string;
  placeno: boolean;
  firma: {
    idFirma: number;
    naziv: string;
  };
}

interface Zaposleni {
  idZaposleni: number;
  ime: string;
  prezime: string;
  firma: {
    idFirma: number;
    naziv: string;
  };
  datumZaposlenja: string;
  uloga?: string | null;
  imaSliku?: boolean;
}

interface Dokument {
  idDokumenta: number;
  naziv: string;
  tip: string;
  datum: string;
  firma: {
    idFirma: number;
    naziv: string;
  };
}

interface Napomena {
  idNapomene: number;
  tekst: string;
  datum: string;
  firma: {
    idFirma: number;
    naziv: string;
  };
}

interface RadniStatus {
  idStatus: number;
  zaposleni: {
    idZaposleni: number;
    ime: string;
    prezime: string;
  };
  tip: string;
  datumOd: string;
  datumDo: string | null;
}

interface Korisnik {
  idUser: number;
  username: string;
  role: string;
}

interface PrijavljeniKorisnik {
  username: string;
  role: string;
}

interface Aktivnost {
  idLog: number;
  akcija: string;
  datum: string;
  korisnik: string;
}

const TIP_DOKUMENTA: { [key: string]: string } = {
  FAKTURA: "Faktura",
  UGOVOR: "Ugovor",
  OBRAZAC: "Obrazac",
  PREDRACUN: "Predračun",
  BANKARSKI_IZVOD: "Bankarski izvod",
  OTPREMNICA: "Otpremnica",
  POPISNA_LISTA: "Popisna lista",
  REVERS: "Revers",
  RESENJE: "Rešenje",
  PUTNI_NALOG: "Putni nalog",
  PORESKO_RESENJE: "Poresko rešenje"
};

const TIP_OBAVE: { [key: string]: string } = {
  PDV: "PDV",
  POREZ: "Porez",
  DOPRINOSI: "Doprinosi",
  OBRACUN_ZARADE: "Obračun zarade",
  ZAVRSNI_RACUN: "Završni račun",
  TAKSA: "Taksa"
};

const TIP_RADNOG_STATUSA: { [key: string]: string } = {
  RAD: "Rad",
  BOLOVANJE: "Bolovanje",
  PORODILJSKO: "Porodiljsko odsustvo"
};

const ULOGA_ZAPOSLENOG: { [key: string]: string } = {
  RADNIK: "Radnik",
  MENADZER: "Menadžer"
};

function App() {

  const [firme, setFirme] = useState<Firma[]>([]);
  const [obaveze, setObaveze] = useState<Obaveza[]>([]);
  const [zaposleni, setZaposleni] = useState<Zaposleni[]>([]);
  const [dokumenti, setDokumenti] = useState<Dokument[]>([]);
  const [napomene, setNapomene] = useState<Napomena[]>([]);

  const [naziv, setNaziv] = useState("");
  const [pib, setPib] = useState("");
  const [maticniBroj, setMaticniBroj] = useState("");
  const [datumOsnivanja, setDatumOsnivanja] = useState("");
  const [tipFirme, setTipFirme] = useState("");
  const [pdvObveznik, setPdvObveznik] = useState(false);
  const [pausalac, setPausalac] = useState(false);
  const [prikaziFormuFirme, setPrikaziFormuFirme] = useState(false);

  // Logo firme
  const [logoFajl, setLogoFajl] = useState<File | null>(null);
  const [logoPregled, setLogoPregled] = useState<string | null>(null);
  const [logoVerzija, setLogoVerzija] = useState(0);

  const [pretraga, setPretraga] = useState("");
  const [profilOtvoren, setProfilOtvoren] = useState(false);

  const [aktivnaStranica, setAktivnaStranica] = useState("pocetna");

  // Dodavanje obaveze
  const [obavezaTip, setObavezaTip] = useState("PDV");
  const [obavezaIznos, setObavezaIznos] = useState("");
  const [obavezaDatum, setObavezaDatum] = useState("");
  const [obavezaPlaceno, setObavezaPlaceno] = useState(false);
  const [obavezaFirma, setObavezaFirma] = useState("");
  const [prikaziFormuObaveze, setPrikaziFormuObaveze] = useState(false);

  // Izmena obaveze
  const [obavezaZaIzmenu, setObavezaZaIzmenu] =
    useState<Obaveza | null>(null);

  // Izmena firme
  const [firmaZaIzmenu, setFirmaZaIzmenu] = useState<Firma | null>(null);
  const [korisniciZaDodelu, setKorisniciZaDodelu] = useState<
    { idUser: number; username: string }[]
  >([]);

  // Dodavanje zaposlenog
  const [zaposleniIme, setZaposleniIme] = useState("");
  const [zaposleniPrezime, setZaposleniPrezime] = useState("");
  const [zaposleniFirma, setZaposleniFirma] = useState("");
  const [zaposleniDatum, setZaposleniDatum] = useState("");
  const [zaposleniUloga, setZaposleniUloga] = useState("RADNIK");
  const [prikaziFormuZaposlenog, setPrikaziFormuZaposlenog] = useState(false);

  // Izmena zaposlenog
  const [zaposleniZaIzmenu, setZaposleniZaIzmenu] =
    useState<Zaposleni | null>(null);

  // Slika zaposlenog
  const [slikaFajl, setSlikaFajl] = useState<File | null>(null);
  const [slikaPregled, setSlikaPregled] = useState<string | null>(null);
  const [slikaVerzija, setSlikaVerzija] = useState(0);

  // Dodavanje dokumenta
  const [dokumentNaziv, setDokumentNaziv] = useState("");
  const [dokumentTip, setDokumentTip] = useState("FAKTURA");
  const [dokumentDatum, setDokumentDatum] = useState("");
  const [dokumentFirma, setDokumentFirma] = useState("");
  const [prikaziFormuDokumenta, setPrikaziFormuDokumenta] = useState(false);

  // Izmena dokumenta
  const [dokumentZaIzmenu, setDokumentZaIzmenu] =
    useState<Dokument | null>(null);

  // Dodavanje napomene
  const [napomenaTekst, setNapomenaTekst] = useState("");
  const [napomenaDatum, setNapomenaDatum] = useState("");
  const [napomenaFirma, setNapomenaFirma] = useState("");
  const [prikaziFormuNapomene, setPrikaziFormuNapomene] = useState(false);

  // Izmena napomene
  const [napomenaZaIzmenu, setNapomenaZaIzmenu] =
    useState<Napomena | null>(null);

  // Filter napomena po firmi
  const [napomeneFirmaFilter, setNapomeneFirmaFilter] = useState("");

  // Filter obaveza po firmi
  const [obavezeFirmaFilter, setObavezeFirmaFilter] = useState("");

  // Filter dokumenata po firmi
  const [pretragaDokumenti, setPretragaDokumenti] = useState("");

  // Pretraga firmi po datumu osnivanja
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");

  // Detalji firme
  const [firmaDetalji, setFirmaDetalji] = useState<Firma | null>(null);

  // Filter zaposlenih po firmi
  const [zaposleniFirmaFilter, setZaposleniFirmaFilter] = useState("");

  // Radni statusi zaposlenih
  const [radniStatusi, setRadniStatusi] = useState<RadniStatus[]>([]);
  const [statusiZaZaposlenog, setStatusiZaZaposlenog] = useState<Zaposleni | null>(null);

  // Validacija forma: crvena zvezdica na poljima koja fale
  const [greske, setGreske] = useState<{[polje: string]: boolean}>({});
  const [prikaziFormuStatusa, setPrikaziFormuStatusa] = useState(false);
  const [statusTip, setStatusTip] = useState("RAD");
  const [statusDatumOd, setStatusDatumOd] = useState("");
  const [statusDatumDo, setStatusDatumDo] = useState("");
  const [statusZaIzmenu, setStatusZaIzmenu] = useState<RadniStatus | null>(null);

  // Prijava i registracija
  const [prijavljeniKorisnik, setPrijavljeniKorisnik] =
    useState<PrijavljeniKorisnik | null>(null);
  const [proveraPrijave, setProveraPrijave] = useState(true);
  const [prijavaMod, setPrijavaMod] = useState<"prijava" | "registracija">(
    "prijava"
  );
  const [prijavaUsername, setPrijavaUsername] = useState("");
  const [prijavaPassword, setPrijavaPassword] = useState("");
  const [prijavaGreska, setPrijavaGreska] = useState("");

  // Korisnici (samo ADMIN)
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [prikaziFormuKorisnika, setPrikaziFormuKorisnika] = useState(false);
  const [korisnikUsername, setKorisnikUsername] = useState("");
  const [korisnikLozinka, setKorisnikLozinka] = useState("");
  const [korisnikUloga, setKorisnikUloga] = useState("EMPLOYEE");
  const [korisnikZaIzmenu, setKorisnikZaIzmenu] =
    useState<Korisnik | null>(null);

  // Promena lične lozinke (svaki korisnik menja samo svoju)
  const [promenaLozinkeOtvoreno, setPromenaLozinkeOtvoreno] = useState(false);
  const [trenutnaLozinka, setTrenutnaLozinka] = useState("");
  const [novaLicnaLozinka, setNovaLicnaLozinka] = useState("");
  const [potvrdaLozinke, setPotvrdaLozinke] = useState("");
  const [lozinkaGreska, setLozinkaGreska] = useState("");
  const [lozinkaGreskaPolja, setLozinkaGreskaPolja] = useState<string[]>([]);

  // Aktivnosti
  const [aktivnosti, setAktivnosti] = useState<Aktivnost[]>([]);
  const [pretragaAktivnosti, setPretragaAktivnosti] = useState("");

  const apiFetch = (url: string, options?: RequestInit) => {
    return fetch(url, options).then(response => {
      if (response.status === 401) {
        setPrijavljeniKorisnik(null);
      }
      return response;
    });
  };


  /// PRIJAVA REGISTRACIJA I ODJAVA

  const prijaviSe = async (event: React.FormEvent) => {
    event.preventDefault();
    setPrijavaGreska("");

    try {

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: prijavaUsername,
          password: prijavaPassword
        })
      });

      if (!response.ok) {
        setPrijavaGreska("Pogrešno korisničko ime ili lozinka.");
        return;
      }

      const korisnik = await response.json();

      setPrijavljeniKorisnik(korisnik);
      setPrijavaUsername("");
      setPrijavaPassword("");

    } catch (error) {

      console.error(error);
      setPrijavaGreska("Greška prilikom prijave.");

    }
  };


  const registrujSe = async (event: React.FormEvent) => {
    event.preventDefault();
    setPrijavaGreska("");

    try {

      const response = await fetch("/api/auth/registracija", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: prijavaUsername,
          password: prijavaPassword
        })
      });

      if (response.status === 409) {
        setPrijavaGreska("Korisničko ime već postoji.");
        return;
      }

      if (!response.ok) {
        setPrijavaGreska("Registracija nije uspešna.");
        return;
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: prijavaUsername,
          password: prijavaPassword
        })
      });

      if (loginResponse.ok) {
        const korisnik = await loginResponse.json();
        setPrijavljeniKorisnik(korisnik);
        setPrijavaUsername("");
        setPrijavaPassword("");
      }

    } catch (error) {

      console.error(error);
      setPrijavaGreska("Greška prilikom registracije.");

    }
  };


  const izlogujSe = async () => {

    setProfilOtvoren(false);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
    } catch (error) {
      console.error(error);
    }

    setPrijavljeniKorisnik(null);
    setAktivnaStranica("pocetna");
  };


  ///KORISNICI - ADMIN

  const ucitajKorisnike = () => {
    apiFetch("/api/korisnici")
      .then(response => response.json())
      .then(data => setKorisnici(data))
      .catch(error => console.error("Greška:", error));
  };


  const dodajKorisnika = async () => {

    const noveGreske = {
      "korisnik.username": !korisnikUsername,
      "korisnik.lozinka": !korisnikLozinka
    };

    if (Object.values(noveGreske).some(greska => greska)) {
      setGreske(noveGreske);
      return;
    }

    setGreske({});

    try {

      const response = await apiFetch("/api/korisnici", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: korisnikUsername,
          password: korisnikLozinka,
          role: korisnikUloga
        })
      });

      if (response.status === 409) {
        alert("Korisničko ime već postoji.");
        return;
      }

      if (!response.ok) {
        throw new Error("Greška prilikom dodavanja korisnika.");
      }

      await ucitajKorisnike();

      setKorisnikUsername("");
      setKorisnikLozinka("");
      setKorisnikUloga("EMPLOYEE");
      setPrikaziFormuKorisnika(false);

    } catch (error) {

      console.error(error);

      alert("Korisnik nije uspešno dodat.");
    }
  };


  const izmeniKorisnika = async () => {

    if (!korisnikZaIzmenu) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/korisnici/${korisnikZaIzmenu.idUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: korisnikZaIzmenu.username,
            role: korisnikZaIzmenu.role
          })
        }
      );

      if (response.status === 409) {
        alert("Korisničko ime već postoji.");
        return;
      }

      if (!response.ok) {
        throw new Error("Greška prilikom izmene korisnika.");
      }

      await ucitajKorisnike();

      setKorisnikZaIzmenu(null);

    } catch (error) {

      console.error(error);

      alert("Korisnik nije uspešno izmenjen.");
    }
  };


  const promeniLozinku = async () => {

    setLozinkaGreska("");
    setLozinkaGreskaPolja([]);

    const praznaPolja: string[] = [];

    if (!trenutnaLozinka) {
      praznaPolja.push("trenutna");
    }

    if (!novaLicnaLozinka) {
      praznaPolja.push("nova");
    }

    if (!potvrdaLozinke) {
      praznaPolja.push("potvrda");
    }

    if (praznaPolja.length > 0) {
      setLozinkaGreskaPolja(praznaPolja);
      return;
    }

    if (novaLicnaLozinka !== potvrdaLozinke) {
      setLozinkaGreskaPolja(["nova", "potvrda"]);
      setLozinkaGreska("Nova lozinka i potvrda se ne poklapaju.");
      return;
    }

    try {

      const response = await apiFetch("/api/auth/promeni-lozinku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trenutnaLozinka: trenutnaLozinka,
          novaLozinka: novaLicnaLozinka
        })
      });

      if (!response.ok) {
        const poruka = await response.text();
        setLozinkaGreska(poruka || "Lozinka nije uspešno promenjena.");
        return;
      }

      setPromenaLozinkeOtvoreno(false);
      setTrenutnaLozinka("");
      setNovaLicnaLozinka("");
      setPotvrdaLozinke("");

      alert("Lozinka je uspešno promenjena.");

    } catch (error) {

      console.error(error);

      setLozinkaGreska("Lozinka nije uspešno promenjena.");
    }
  };


  const obrisiKorisnika = async (id: number) => {

    const potvrda = window.confirm(
      "Da li ste sigurni da želite da obrišete ovog korisnika?"
    );

    if (!potvrda) {
      return;
    }

    try {

      const response = await apiFetch(`/api/korisnici/${id}`, {
        method: "DELETE"
      });

      if (response.status === 400) {
        alert("Ne možete obrisati svoj nalog.");
        return;
      }

      if (!response.ok) {
        throw new Error("Greška prilikom brisanja korisnika.");
      }

      await ucitajKorisnike();

    } catch (error) {

      console.error(error);

      alert("Korisnik nije uspešno obrisan.");
    }
  };


  const ucitajFirme = () => {
    apiFetch("/api/firme")
      .then(response => response.json())
      .then(data => setFirme(data))
      .catch(error => console.error("Greška:", error));
  };


  const ucitajObaveze = () => {
    apiFetch("/api/obaveze")
      .then(response => response.json())
      .then(data => setObaveze(data))
      .catch(error => console.error("Greška:", error));
  };


  const ucitajZaposlene = () => {
    apiFetch("/api/zaposleni")
      .then(response => response.json())
      .then(data => setZaposleni(data))
      .catch(error => console.error("Greška:", error));
  };


  const ucitajDokumente = () => {
    apiFetch("/api/dokumenti")
      .then(response => response.json())
      .then(data => setDokumenti(data))
      .catch(error => console.error("Greška:", error));
  };


  const ucitajNapomene = () => {
    apiFetch("/api/napomene")
      .then(response => response.json())
      .then(data => setNapomene(data))
      .catch(error => console.error("Greška:", error));
  };


  const ucitajRadneStatuse = () => {
    apiFetch("/api/radni-statusi")
      .then(response => response.json())
      .then(data => setRadniStatusi(data))
      .catch(error => console.error("Greška:", error));
  };


  const ucitajAktivnosti = () => {
    apiFetch("/api/aktivnosti")
      .then(response => response.json())
      .then(data => setAktivnosti(data))
      .catch(error => console.error("Greška:", error));
  };



  useEffect(() => {
    fetch("/api/auth/me")
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (data) {
          setPrijavljeniKorisnik(data);
        }
      })
      .catch(() => {})
      .finally(() => setProveraPrijave(false));
  }, []);


  useEffect(() => {

    if (!firmaZaIzmenu) {
      return;
    }

    apiFetch("/api/firme/zaduzeni-korisnici")
      .then(response => response.json())
      .then((data: { idUser: number; username: string }[]) =>
        setKorisniciZaDodelu(data))
      .catch(error => console.error("Greška:", error));
  }, [firmaZaIzmenu?.idFirma]);


  useEffect(() => {

    if (!prijavljeniKorisnik) {
      return;
    }

    ucitajFirme();
    ucitajObaveze();
    ucitajZaposlene();
    ucitajDokumente();
    ucitajNapomene();
    ucitajRadneStatuse();

    if (prijavljeniKorisnik.role === "ADMIN") {
      ucitajKorisnike();
    }

    ucitajAktivnosti();
  }, [prijavljeniKorisnik]);


  useEffect(() => {

    if (!prijavljeniKorisnik) {
      return;
    }

    if (aktivnaStranica === "pocetna" || aktivnaStranica === "aktivnosti") {
      ucitajAktivnosti();
    }
  }, [aktivnaStranica, prijavljeniKorisnik]);


  const otvoriStranicu = (stranica: string) => {
    setAktivnaStranica(stranica);
    window.scrollTo({ top: 0 });
  };

  ///FIRME

  const izaberiLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fajl = event.target.files?.[0] || null;

    if (!fajl) {
      return;
    }

    if (!["image/png", "image/jpeg", "image/gif"].includes(fajl.type)) {
      alert("Logo mora biti slika u PNG, JPG ili GIF formatu.");
      event.target.value = "";
      return;
    }

    if (fajl.size > 2 * 1024 * 1024) {
      alert("Logo ne sme biti veći od 2MB.");
      event.target.value = "";
      return;
    }

    if (logoPregled) {
      URL.revokeObjectURL(logoPregled);
    }

    setLogoFajl(fajl);
    setLogoPregled(URL.createObjectURL(fajl));
  };


  const ukloniIzborLoga = () => {
    if (logoPregled) {
      URL.revokeObjectURL(logoPregled);
    }
    setLogoFajl(null);
    setLogoPregled(null);
  };


  const posaljiLogoFirme = async (idFirme: number, fajl: File) => {
    const podaci = new FormData();
    podaci.append("file", fajl);

    const response = await apiFetch(`/api/firme/${idFirme}/logo`, {
      method: "POST",
      body: podaci
    });

    if (!response.ok) {
      const poruka = await response.text();
      alert(poruka || "Logo nije uspešno sačuvan.");
      return;
    }

    setLogoVerzija(v => v + 1);
  };


  const ukloniLogoFirme = async (firma: Firma) => {
    try {

      const response = await apiFetch(
        `/api/firme/${firma.idFirma}/logo`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Greška prilikom uklanjanja loga.");
      }

      setLogoVerzija(v => v + 1);

      if (firmaZaIzmenu?.idFirma === firma.idFirma) {
        setFirmaZaIzmenu({ ...firmaZaIzmenu, imaLogo: false });
      }

      if (firmaDetalji?.idFirma === firma.idFirma) {
        setFirmaDetalji({ ...firmaDetalji, imaLogo: false });
      }

      ucitajFirme();

    } catch (error) {

      console.error(error);

      alert("Logo nije uspešno uklonjen.");

    }
  };


  const dodajFirmu = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^\d{9}$/.test(pib)) {
      alert("PIB mora imati tačno 9 brojeva.");
      return;
    }

    if (!/^\d{6}$/.test(maticniBroj)) {
      alert("Matični broj mora imati tačno 6 brojeva.");
      return;
    }

    const novaFirma = {
      naziv,
      pib,
      maticniBroj,
      datumOsnivanja,
      tipFirme,
      pdvObveznik,
      pausalac
    };

    try {

      const response = await apiFetch("/api/firme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novaFirma)
      });

      if (!response.ok) {
        const poruka = await response.text();
        alert(poruka || "Firma nije uspešno dodata.");
        return;
      }

      const sacuvana: Firma = await response.json();

      if (logoFajl && sacuvana?.idFirma) {
        await posaljiLogoFirme(sacuvana.idFirma, logoFajl);
      }

      ucitajFirme();

      setNaziv("");
      setPib("");
      setMaticniBroj("");
      setDatumOsnivanja("");
      setTipFirme("");
      setPdvObveznik(false);
      setPausalac(false);
      ukloniIzborLoga();
      setPrikaziFormuFirme(false);

    } catch (error) {

      console.error("Greška:", error);

      alert("Firma nije uspešno dodata.");

    }
  };


  const izmeniFirmu = async () => {

    if (!firmaZaIzmenu) {
      return;
    }

    if (!/^\d{9}$/.test(firmaZaIzmenu.pib)) {
      alert("PIB mora imati tačno 9 brojeva.");
      return;
    }

    if (!/^\d{6}$/.test(firmaZaIzmenu.maticniBroj)) {
      alert("Matični broj mora imati tačno 6 brojeva.");
      return;
    }

    try {

      const response = await apiFetch(
        `/api/firme/${firmaZaIzmenu.idFirma}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(firmaZaIzmenu)
        }
      );

      if (!response.ok) {
        throw new Error("Greška prilikom izmene firme.");
      }

      if (logoFajl) {
        await posaljiLogoFirme(firmaZaIzmenu.idFirma, logoFajl);
      }

      await ucitajFirme();

      ukloniIzborLoga();

      setFirmaZaIzmenu(null);

    } catch (error) {

      console.error(error);

      alert("Firma nije uspešno izmenjena.");
    }
  };


  const obrisiFirmu = async (id: number) => {

    const potvrda = window.confirm(
      "Da li ste sigurni da želite da obrišete ovu firmu?"
    );

    if (!potvrda) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/firme/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          const poruka = await response.text();
          alert(poruka || "Firma se ne može obrisati.");
        } else {
          throw new Error("Greška prilikom brisanja firme.");
        }
        return;
      }

      ucitajFirme();
      ucitajObaveze();
      ucitajZaposlene();
      ucitajDokumente();
      ucitajNapomene();
      ucitajRadneStatuse();

    } catch (error) {

      console.error(error);

      alert(
        "Firma nije uspešno obrisana. Proverite da li firma ima povezane obaveze, radnike ili dokumente."
      );
    }
  };


  ///OBAVEZE

  const dodajObavezu = async () => {

    const firmaId = obavezaFirma ||
      (izabranaFirmaObaveza
        ? String(izabranaFirmaObaveza.idFirma)
        : "");

    const noveGreske = {
      "obaveza.firma": !firmaId,
      "obaveza.iznos": !obavezaIznos,
      "obaveza.datum": !obavezaDatum
    };

    if (Object.values(noveGreske).some(greska => greska)) {
      setGreske(noveGreske);
      return;
    }

    setGreske({});

    const novaObaveza = {
      tip: obavezaTip,
      iznos: Number(obavezaIznos),
      datumDospeca: obavezaDatum,
      placeno: obavezaPlaceno,
      firma: {
        idFirma: Number(firmaId)
      }
    };

    try {

      const response = await apiFetch(
        "/api/obaveze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(novaObaveza)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom dodavanja obaveze."
        );
      }

      await ucitajObaveze();

      setObavezaTip("PDV");
      setObavezaIznos("");
      setObavezaDatum("");
      setObavezaPlaceno(false);
      setObavezaFirma("");
      setPrikaziFormuObaveze(false);

    } catch (error) {

      console.error(error);

      alert(
        "Obaveza nije uspešno dodata."
      );
    }
  };


  const obrisiObavezu = async (id: number) => {

    const potvrda = window.confirm(
      "Da li ste sigurni da želite da obrišete ovu obavezu?"
    );

    if (!potvrda) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/obaveze/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom brisanja obaveze."
        );
      }

      await ucitajObaveze();

    } catch (error) {

      console.error(error);

      alert(
        "Obaveza nije uspešno obrisana."
      );
    }
  };


  const izmeniObavezu = async () => {

    if (!obavezaZaIzmenu) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/obaveze/${obavezaZaIzmenu.idObaveza}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tip: obavezaZaIzmenu.tip,
            iznos: Number(obavezaZaIzmenu.iznos),
            datumDospeca: obavezaZaIzmenu.datumDospeca,
            placeno: obavezaZaIzmenu.placeno,
            firma: {
              idFirma: obavezaZaIzmenu.firma.idFirma
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom izmene obaveze."
        );
      }

      await ucitajObaveze();

      setObavezaZaIzmenu(null);

    } catch (error) {

      console.error(error);

      alert(
        "Obaveza nije uspešno izmenjena."
      );
    }
  };


  ///ZAPOSLENI

  const izaberiSliku = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fajl = event.target.files?.[0] || null;

    if (!fajl) {
      return;
    }

    if (!["image/png", "image/jpeg", "image/gif"].includes(fajl.type)) {
      alert("Slika mora biti u PNG, JPG ili GIF formatu.");
      event.target.value = "";
      return;
    }

    if (fajl.size > 2 * 1024 * 1024) {
      alert("Slika ne sme biti veća od 2MB.");
      event.target.value = "";
      return;
    }

    if (slikaPregled) {
      URL.revokeObjectURL(slikaPregled);
    }

    setSlikaFajl(fajl);
    setSlikaPregled(URL.createObjectURL(fajl));
  };


  const ukloniIzborSlike = () => {
    if (slikaPregled) {
      URL.revokeObjectURL(slikaPregled);
    }
    setSlikaFajl(null);
    setSlikaPregled(null);
  };


  const posaljiSlikuZaposlenog = async (idZaposlenog: number, fajl: File) => {
    const podaci = new FormData();
    podaci.append("file", fajl);

    const response = await apiFetch(
      `/api/zaposleni/${idZaposlenog}/slika`,
      { method: "POST", body: podaci }
    );

    if (!response.ok) {
      const poruka = await response.text();
      alert(poruka || "Slika nije uspešno sačuvana.");
      return;
    }

    setSlikaVerzija(v => v + 1);
  };


  const ukloniSlikuZaposlenog = async (zaposlen: Zaposleni) => {
    try {

      const response = await apiFetch(
        `/api/zaposleni/${zaposlen.idZaposleni}/slika`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Greška prilikom uklanjanja slike.");
      }

      setSlikaVerzija(v => v + 1);

      if (zaposleniZaIzmenu?.idZaposleni === zaposlen.idZaposleni) {
        setZaposleniZaIzmenu({ ...zaposleniZaIzmenu, imaSliku: false });
      }

      ucitajZaposlene();

    } catch (error) {

      console.error(error);

      alert("Slika nije uspešno uklonjena.");

    }
  };


  const dodajZaposlenog = async () => {

    const firmaId = zaposleniFirma ||
      (izabranaFirmaZaposleni
        ? String(izabranaFirmaZaposleni.idFirma)
        : "");

    const noveGreske = {
      "zaposleni.ime": !zaposleniIme,
      "zaposleni.prezime": !zaposleniPrezime,
      "zaposleni.firma": !firmaId,
      "zaposleni.datum": !zaposleniDatum
    };

    if (Object.values(noveGreske).some(greska => greska)) {
      setGreske(noveGreske);
      return;
    }

    setGreske({});

    const noviZaposleni = {
      ime: zaposleniIme,
      prezime: zaposleniPrezime,
      datumZaposlenja: zaposleniDatum,
      uloga: zaposleniUloga,
      firma: {
        idFirma: Number(firmaId)
      }
    };

    try {

      const response = await apiFetch(
        "/api/zaposleni",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(noviZaposleni)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom dodavanja radnika."
        );
      }

      const sacuvani: Zaposleni = await response.json();

      if (slikaFajl && sacuvani?.idZaposleni) {
        await posaljiSlikuZaposlenog(sacuvani.idZaposleni, slikaFajl);
      }

      await ucitajZaposlene();

      setZaposleniIme("");
      setZaposleniPrezime("");
      setZaposleniDatum("");
      setZaposleniUloga("RADNIK");
      setZaposleniFirma("");
      ukloniIzborSlike();
      setPrikaziFormuZaposlenog(false);

    } catch (error) {

      console.error(error);

      alert(
        "Radnik nije uspešno dodat."
      );
    }
  };


  const izmeniZaposlenog = async () => {

    if (!zaposleniZaIzmenu) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/zaposleni/${zaposleniZaIzmenu.idZaposleni}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ime: zaposleniZaIzmenu.ime,
            prezime: zaposleniZaIzmenu.prezime,
            datumZaposlenja: zaposleniZaIzmenu.datumZaposlenja,
            uloga: zaposleniZaIzmenu.uloga ?? "RADNIK",
            firma: {
              idFirma: zaposleniZaIzmenu.firma.idFirma
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom izmene radnika."
        );
      }

      if (slikaFajl) {
        await posaljiSlikuZaposlenog(
          zaposleniZaIzmenu.idZaposleni,
          slikaFajl
        );
      }

      await ucitajZaposlene();

      ukloniIzborSlike();

      setZaposleniZaIzmenu(null);

    } catch (error) {

      console.error(error);

      alert(
        "Radnik nije uspešno izmenjen."
      );
    }
  };


  const obrisiZaposlenog = async (id: number) => {

    const potvrda = window.confirm(
      "Da li ste sigurni da želite da obrišete ovog radnika?"
    );

    if (!potvrda) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/zaposleni/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom brisanja radnika."
        );
      }

      await ucitajZaposlene();

    } catch (error) {

      console.error(error);

      alert(
        "Radnik nije uspešno obrisan."
      );
    }
  };


  ///DOKUMENTI

  const dodajDokument = async () => {

    const noveGreske = {
      "dokument.naziv": !dokumentNaziv,
      "dokument.datum": !dokumentDatum,
      "dokument.firma": !dokumentFirma
    };

    if (Object.values(noveGreske).some(greska => greska)) {
      setGreske(noveGreske);
      return;
    }

    setGreske({});

    const noviDokument = {
      naziv: dokumentNaziv,
      tip: dokumentTip,
      datum: dokumentDatum,
      firma: {
        idFirma: Number(dokumentFirma)
      }
    };

    try {

      const response = await apiFetch(
        "/api/dokumenti",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(noviDokument)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom dodavanja dokumenta."
        );
      }

      await ucitajDokumente();

      setDokumentNaziv("");
      setDokumentDatum("");
      setDokumentTip("FAKTURA");
      setDokumentFirma("");
      setPrikaziFormuDokumenta(false);

    } catch (error) {

      console.error(error);

      alert(
        "Dokument nije uspešno dodat."
      );
    }
  };


  const izmeniDokument = async () => {

    if (!dokumentZaIzmenu) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/dokumenti/${dokumentZaIzmenu.idDokumenta}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            naziv: dokumentZaIzmenu.naziv,
            tip: dokumentZaIzmenu.tip,
            datum: dokumentZaIzmenu.datum,
            firma: {
              idFirma: dokumentZaIzmenu.firma.idFirma
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom izmene dokumenta."
        );
      }

      await ucitajDokumente();

      setDokumentZaIzmenu(null);

    } catch (error) {

      console.error(error);

      alert(
        "Dokument nije uspešno izmenjen."
      );
    }
  };


  const obrisiDokument = async (id: number) => {

    const potvrda = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj dokument?"
    );

    if (!potvrda) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/dokumenti/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom brisanja dokumenta."
        );
      }

      await ucitajDokumente();

    } catch (error) {

      console.error(error);

      alert(
        "Dokument nije uspešno obrisan."
      );
    }
  };

  ///NAPOMENE

  const dodajNapomenu = async () => {

    const noveGreske = {
      "napomena.tekst": !napomenaTekst,
      "napomena.datum": !napomenaDatum,
      "napomena.firma": !napomenaFirma
    };

    if (Object.values(noveGreske).some(greska => greska)) {
      setGreske(noveGreske);
      return;
    }

    setGreske({});

    const novaNapomena = {
      tekst: napomenaTekst,
      datum: napomenaDatum,
      firma: {
        idFirma: Number(napomenaFirma)
      }
    };

    try {

      const response = await apiFetch(
        "/api/napomene",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(novaNapomena)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom dodavanja napomene."
        );
      }

      await ucitajNapomene();

      setNapomenaTekst("");
      setNapomenaDatum("");
      setNapomenaFirma("");
      setPrikaziFormuNapomene(false);

    } catch (error) {

      console.error(error);

      alert(
        "Napomena nije uspešno dodata."
      );
    }
  };


  const izmeniNapomenu = async () => {

    if (!napomenaZaIzmenu) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/napomene/${napomenaZaIzmenu.idNapomene}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tekst: napomenaZaIzmenu.tekst,
            datum: napomenaZaIzmenu.datum,
            firma: {
              idFirma: napomenaZaIzmenu.firma.idFirma
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom izmene napomene."
        );
      }

      await ucitajNapomene();

      setNapomenaZaIzmenu(null);

    } catch (error) {

      console.error(error);

      alert(
        "Napomena nije uspešno izmenjena."
      );
    }
  };


  const obrisiNapomenu = async (id: number) => {

    const potvrda = window.confirm(
      "Da li ste sigurni da želite da obrišete ovu napomenu?"
    );

    if (!potvrda) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/napomene/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom brisanja napomene."
        );
      }

      await ucitajNapomene();

    } catch (error) {

      console.error(error);

      alert(
        "Napomena nije uspešno obrisana."
      );
    }
  };


  ///RADNI STATUS ZAPOSLENIH

  const dodajStatus = async () => {

    if (!statusiZaZaposlenog) {
      return;
    }

    const noveGreske = {
      "status.tip": !statusTip,
      "status.datumOd": !statusDatumOd
    };

    if (Object.values(noveGreske).some(greska => greska)) {
      setGreske(noveGreske);
      return;
    }

    setGreske({});

    try {

      const response = await apiFetch(
        "/api/radni-statusi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tip: statusTip,
            datumOd: statusDatumOd,
            datumDo: statusDatumDo || null,
            zaposleni: {
              idZaposleni: statusiZaZaposlenog.idZaposleni
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom dodavanja radnog statusa."
        );
      }

      await ucitajRadneStatuse();

      setStatusTip("RAD");
      setStatusDatumOd("");
      setStatusDatumDo("");
      setPrikaziFormuStatusa(false);

    } catch (error) {

      console.error(error);

      alert(
        "Radni status nije uspešno dodat."
      );
    }
  };


  const izmeniStatus = async () => {

    if (!statusZaIzmenu) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/radni-statusi/${statusZaIzmenu.idStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tip: statusZaIzmenu.tip,
            datumOd: statusZaIzmenu.datumOd,
            datumDo: statusZaIzmenu.datumDo || null,
            zaposleni: {
              idZaposleni: statusZaIzmenu.zaposleni.idZaposleni
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom izmene radnog statusa."
        );
      }

      await ucitajRadneStatuse();

      setStatusZaIzmenu(null);

    } catch (error) {

      console.error(error);

      alert(
        "Radni status nije uspešno izmenjen."
      );
    }
  };


  const obrisiStatus = async (id: number) => {

    const potvrda = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj radni status?"
    );

    if (!potvrda) {
      return;
    }

    try {

      const response = await apiFetch(
        `/api/radni-statusi/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Greška prilikom brisanja radnog statusa."
        );
      }

      await ucitajRadneStatuse();

    } catch (error) {

      console.error(error);

      alert(
        "Radni status nije uspešno obrisan."
      );
    }
  };


  const danas = new Date().toISOString().slice(0, 10);


  const formatirajVreme = (datum: string) => {
    const d = new Date(datum);
    return (
      d.toLocaleDateString("sr-RS") +
      " u " +
      d.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })
    );
  };


  const trenutniStatus = (idZaposleni: number) => {
    return radniStatusi
      .filter(status =>
        status.zaposleni?.idZaposleni === idZaposleni &&
        status.datumOd <= danas &&
        (!status.datumDo || status.datumDo >= danas)
      )
      .sort((a, b) => (a.datumOd < b.datumOd ? 1 : -1))[0] ?? null;
  };


  const filtriraneFirme = firme.filter(firma => {

    const tekst = pretraga.toLowerCase().trim();

    const poTekstu =
      (firma.naziv ?? "")
        .toLowerCase()
        .includes(tekst) ||
      (firma.pib ?? "").includes(tekst) ||
      (firma.maticniBroj ?? "").includes(tekst);

    const poDatumu =
      (!datumOd || firma.datumOsnivanja >= datumOd) &&
      (!datumDo || firma.datumOsnivanja <= datumDo);

    return poTekstu && poDatumu;
  });


  const filtriraniZaposleni = zaposleni.filter(zaposlen =>
    !zaposleniFirmaFilter ||
    String(zaposlen.firma?.idFirma) === zaposleniFirmaFilter
  );


  const filtriraneNapomene = napomene.filter(napomena =>
    !napomeneFirmaFilter ||
    String(napomena.firma?.idFirma) === napomeneFirmaFilter
  );


  const filtriraneObaveze = obaveze.filter(obaveza =>
    !obavezeFirmaFilter ||
    String(obaveza.firma?.idFirma) === obavezeFirmaFilter
  );


  const izabranaFirmaObaveza = obavezeFirmaFilter
    ? firme.find(firma =>
        String(firma.idFirma) === obavezeFirmaFilter
      )
    : undefined;


  const izabranaFirmaZaposleni = zaposleniFirmaFilter
    ? firme.find(firma =>
        String(firma.idFirma) === zaposleniFirmaFilter
      )
    : undefined;


  const filtriraniDokumenti = dokumenti.filter(dokument => {
    const pojam = pretragaDokumenti.toLowerCase().trim();
    if (!pojam) {
      return true;
    }
    const tipNaziv = TIP_DOKUMENTA[dokument.tip] || dokument.tip;
    return (
      dokument.firma?.naziv?.toLowerCase().includes(pojam) ||
      tipNaziv.toLowerCase().includes(pojam) ||
      dokument.tip.toLowerCase().includes(pojam)
    );
  });


  const filtriraneAktivnosti = aktivnosti.filter(
    aktivnost =>
      aktivnost.akcija
        .toLowerCase()
        .includes(pretragaAktivnosti.toLowerCase()) ||
      aktivnost.korisnik
        .toLowerCase()
        .includes(pretragaAktivnosti.toLowerCase())
  );


  if (proveraPrijave) {
    return <div className="login-ekran"></div>;
  }


  if (!prijavljeniKorisnik) {

    return (

      <div className="login-ekran">

        <div className="login-kartica">

          <div className="login-logo">

            <div className="logo-icon">
              K
            </div>

            <div>

              <h2>
                Knjigovodstvene usluge
              </h2>

              <span>
                Poslovni informacioni sistem
              </span>

            </div>

          </div>


          {prijavaMod === "prijava" ? (

            <form onSubmit={prijaviSe}>

              <h3>
                Prijava
              </h3>

              <div className="login-field">

                <label>
                  Korisničko ime
                </label>

                <input
                    value={prijavaUsername}
                    onChange={e => setPrijavaUsername(e.target.value)}
                    placeholder="Unesite korisničko ime"
                    autoFocus
                />

              </div>

              <div className="login-field">

                <label>
                  Lozinka
                </label>

                <input
                    type="password"
                    value={prijavaPassword}
                    onChange={e => setPrijavaPassword(e.target.value)}
                    placeholder="Unesite lozinku"
                />

              </div>

              {prijavaGreska && (
                  <p className="login-greska">
                    {prijavaGreska}
                  </p>
              )}

              <button type="submit" className="login-button">
                Prijavi se
              </button>

              <button
                  type="button"
                  className="login-link"
                  onClick={() => {
                    setPrijavaMod("registracija");
                    setPrijavaGreska("");
                  }}
              >
                Nemate nalog? Registrujte se
              </button>

            </form>

          ) : (

            <form onSubmit={registrujSe}>

              <h3>
                Registracija
              </h3>

              <div className="login-field">

                <label>
                  Korisničko ime
                </label>

                <input
                    value={prijavaUsername}
                    onChange={e => setPrijavaUsername(e.target.value)}
                    placeholder="Izaberite korisničko ime"
                    autoFocus
                />

              </div>

              <div className="login-field">

                <label>
                  Lozinka
                </label>

                <input
                    type="password"
                    value={prijavaPassword}
                    onChange={e => setPrijavaPassword(e.target.value)}
                    placeholder="Izaberite lozinku"
                />

              </div>

              {prijavaGreska && (
                  <p className="login-greska">
                    {prijavaGreska}
                  </p>
              )}

              <button type="submit" className="login-button">
                Registruj se
              </button>

              <button
                  type="button"
                  className="login-link"
                  onClick={() => {
                    setPrijavaMod("prijava");
                    setPrijavaGreska("");
                  }}
              >
                Već imate nalog? Prijavite se
              </button>

            </form>

          )}

        </div>

      </div>
    );
  }


  return (

    <div className="app">



      <header className="header">

        <div className="logo">

          <div className="logo-icon">
            K
          </div>

          <div>

            <h1>
              Knjigovodstvene usluge
            </h1>

            <span>
              Poslovni informacioni sistem
            </span>

          </div>

        </div>


        <div className="profile-container">

          <button
            className="profile-button"
            onClick={() =>
              setProfilOtvoren(!profilOtvoren)
            }
          >

            <div className="user-icon">
              {prijavljeniKorisnik.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-name">

              <strong>
                {prijavljeniKorisnik.username}
              </strong>

              <span>
                {prijavljeniKorisnik.role === "ADMIN"
                  ? "Administrator"
                  : "Zaposleni"}
              </span>

            </div>

            <span className="arrow">
              ⌄
            </span>

          </button>

          {profilOtvoren && (

            <div className="profile-menu">

              <div className="profile-menu-header">

                <strong>
                  {prijavljeniKorisnik.username}
                </strong>

                <span>
                  {prijavljeniKorisnik.role === "ADMIN"
                    ? "Administrator"
                    : "Zaposleni"}
                </span>

              </div>

              {prijavljeniKorisnik.role === "ADMIN" && (

                  <button
                      onClick={() => {
                        setProfilOtvoren(false);
                        otvoriStranicu("korisnici");
                      }}
                  >
                    👥 Korisnici
                  </button>

              )}

              <button
                  onClick={() => {
                    setProfilOtvoren(false);
                    setTrenutnaLozinka("");
                    setNovaLicnaLozinka("");
                    setPotvrdaLozinke("");
                    setLozinkaGreska("");
                    setLozinkaGreskaPolja([]);
                    setPromenaLozinkeOtvoreno(true);
                  }}
              >
                🔑 Promeni lozinku
              </button>

              <div className="menu-divider"></div>

              <button className="logout" onClick={izlogujSe}>
                ↪ Izloguj se
              </button>

            </div>

          )}

        </div>

      </header>


      <main className="main">


        {/* POCETNA */}


        <div className="pocetna-raspored">

        {aktivnaStranica === "pocetna" && (

          <>

            <div className="welcome">

              <div>

                <h2>
                  Dobrodošli, {prijavljeniKorisnik.username}
                </h2>

                <p>
                  Pregled poslovanja i najvažnijih
                  informacija
                </p>

              </div>

            </div>

          </>

        )}



        {/* FIRME */}

        {aktivnaStranica === "pocetna" && (

          <>

            {/* STATISTIKA FIRMI */}

            <section className="statistics statistics-3">

              <div className="stat-card">

                <span>
                  Ukupno firmi
                </span>

                <strong>
                  {firme.length}
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  PDV obveznici
                </span>

                <strong>
                  {
                    firme.filter(
                        f => f.pdvObveznik
                    ).length
                  }
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Paušalci
                </span>

                <strong>
                  {
                    firme.filter(
                        f => f.pausalac
                    ).length
                  }
                </strong>

              </div>

            </section>


            {/* PRETRAGA */}

            <section className="card">

              <div className="card-header">

                <div>

                  <h3>
                    Pretraga firmi
                  </h3>

                  <p>
                    Pretražite firmu po nazivu,
                    PIB-u ili matičnom broju
                  </p>

                </div>

              </div>


              <div className="search-container">

                <span className="search-icon">
                  ⌕
                </span>

                <input
                    type="text"
                    placeholder="Unesite naziv firme, PIB ili matični broj..."
                    value={pretraga}
                    onChange={e =>
                        setPretraga(e.target.value)
                    }
                />

              </div>


              {/* PRETRAGA PO DATUMU OSNIVANJA */}

              <div className="datum-pretraga">

                <div className="form-group">

                  <label>
                    Osnovane od datuma
                  </label>

                  <div className="datum-polje">

                    <input
                        type="date"
                        className={
                            datumOd
                                ? "datum-izabran"
                                : "datum-prazan"
                        }
                        value={datumOd}
                        onChange={e =>
                            setDatumOd(e.target.value)
                        }
                    />

                    {!datumOd && (

                        <span className="datum-placeholder">
                          Unesite datum
                        </span>

                    )}

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Osnovane do datuma
                  </label>

                  <div className="datum-polje">

                    <input
                        type="date"
                        className={
                            datumDo
                                ? "datum-izabran"
                                : "datum-prazan"
                        }
                        value={datumDo}
                        onChange={e =>
                            setDatumDo(e.target.value)
                        }
                    />

                    {!datumDo && (

                        <span className="datum-placeholder">
                          Unesite datum
                        </span>

                    )}

                  </div>

                </div>


                <button
                    className="secondary-button"
                    onClick={() => {
                      setDatumOd("");
                      setDatumDo("");
                    }}
                >
                  Očisti datume
                </button>

              </div>

            </section>


            {/* TABELA FIRMI */}

            <section className="card" id="firme">

              <div className="card-header company-header">

                <div>

                  <h3>
                    Registrovane firme
                  </h3>

                  <p>
                    Pregled svih firmi u sistemu
                  </p>

                </div>

                <div className="company-header-actions">

                  <span className="company-number">
                    {filtriraneFirme.length} firmi
                  </span>

                  <button
                      className="dodaj-firmu-button"
                      onClick={() => {
                          ukloniIzborLoga();
                          setPrikaziFormuFirme(true);
                      }}
                  >
                    + Dodaj firmu
                  </button>

                </div>

              </div>


              {filtriraneFirme.length === 0 ? (

                <div className="empty">

                  <div className="empty-icon">
                    □
                  </div>

                  <p>
                    Nema firmi koje odgovaraju
                    pretrazi.
                  </p>

                </div>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                    <tr>

                      <th>
                        Logo
                      </th>

                      <th>
                        Naziv firme
                      </th>

                      <th>
                        PIB
                      </th>

                      <th>
                        Matični broj
                      </th>

                      <th>
                        Tip firme
                      </th>

                      <th>
                        PDV
                      </th>

                      <th>
                        Paušalac
                      </th>

                      <th>
                        Akcije
                      </th>

                    </tr>

                    </thead>


                    <tbody>

                    {filtriraneFirme.map(firma => (

                        <tr
                            key={firma.idFirma}
                        >

                          <td>

                            {firma.imaLogo ? (

                                <img
                                    src={`/api/firme/${firma.idFirma}/logo?v=${logoVerzija}`}
                                    alt={firma.naziv}
                                    className="logo-firme"
                                />

                            ) : (

                                <span
                                    className="logo-placeholder"
                                    title="Firma nema logo"
                                >
                                  {firma.naziv?.charAt(0).toUpperCase()}
                                </span>

                            )}

                          </td>

                          <td className="company-name">
                            {firma.naziv}
                          </td>

                          <td>
                            {firma.pib}
                          </td>

                          <td>
                            {firma.maticniBroj}
                          </td>

                          <td>

                            <span className="badge">
                              {firma.tipFirme}
                            </span>

                          </td>

                          <td>

                            {firma.pdvObveznik ? (

                                <span className="yes">
                              Da
                            </span>

                            ) : (

                                <span className="no">
                              Ne
                            </span>

                            )}

                          </td>

                          <td>

                            {firma.pausalac ? (

                                <span className="yes">
                              Da
                            </span>

                            ) : (

                                <span className="no">
                              Ne
                            </span>

                            )}

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                  className="edit-button"
                                  onClick={() =>
                                      setFirmaDetalji(firma)
                                  }
                              >
                                Detalji
                              </button>

                              <button
                                  className="edit-button"
                                  onClick={() => {
                                      ukloniIzborLoga();
                                      setFirmaZaIzmenu(firma);
                                  }}
                              >
                                Izmeni
                              </button>

                              <button
                                  className="edit-button"
                                  onClick={() => {
                                      setObavezeFirmaFilter(
                                          String(firma.idFirma)
                                      );
                                      otvoriStranicu("obaveze");
                                  }}
                              >
                                Obaveze
                              </button>

                              <button
                                  className="edit-button"
                                  onClick={() => {
                                      setZaposleniFirmaFilter(
                                          String(firma.idFirma)
                                      );
                                      otvoriStranicu("zaposleni");
                                  }}
                              >
                                Radnici
                              </button>

                              <button
                                  className="delete-button"
                                  onClick={() =>
                                      obrisiFirmu(
                                          firma.idFirma
                                      )
                                  }
                              >
                                Obriši
                              </button>

                            </div>

                          </td>

                        </tr>

                    ))}

                    </tbody>

                  </table>

                </div>

              )}


              {/* MODAL ZA DETALJE FIRME */}

              {firmaDetalji && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      {firmaDetalji.imaLogo && (

                          <div className="logo-detalji">

                            <img
                                src={`/api/firme/${firmaDetalji.idFirma}/logo?v=${logoVerzija}`}
                                alt={firmaDetalji.naziv}
                            />

                          </div>

                      )}

                      <h3>
                        {firmaDetalji.naziv}
                      </h3>


                      <div className="details-list">

                        <div>

                          <span>
                            PIB
                          </span>

                          <strong>
                            {firmaDetalji.pib}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Matični broj
                          </span>

                          <strong>
                            {firmaDetalji.maticniBroj}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Datum osnivanja
                          </span>

                          <strong>
                            {firmaDetalji.datumOsnivanja}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Tip firme
                          </span>

                          <strong>
                            {firmaDetalji.tipFirme}
                          </strong>

                        </div>


                        <div>

                          <span>
                            PDV obveznik
                          </span>

                          <strong>
                            {firmaDetalji.pdvObveznik ? "Da" : "Ne"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Paušalac
                          </span>

                          <strong>
                            {firmaDetalji.pausalac ? "Da" : "Ne"}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Zaduženi knjigovodja
                          </span>

                          <strong>
                            {firmaDetalji.zaduzeniKorisnik?.username ?? "—"}
                          </strong>

                        </div>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setFirmaDetalji(null)
                            }
                        >
                          Zatvori
                        </button>

                      </div>

                    </div>

                  </div>

              )}


              {/* MODAL ZA IZMENU FIRME */}

              {firmaZaIzmenu && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      <h3>
                        Izmena firme
                      </h3>


                      <div className="form-grid">

                        <div className="form-group">

                          <label>
                            Naziv firme
                          </label>

                          <input
                              value={firmaZaIzmenu.naziv}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    naziv: e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            PIB
                          </label>

                          <input
                              value={firmaZaIzmenu.pib}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    pib: e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 9)
                                  })
                              }
                              inputMode="numeric"
                              maxLength={9}
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Matični broj
                          </label>

                          <input
                              value={firmaZaIzmenu.maticniBroj}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    maticniBroj: e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                  })
                              }
                              inputMode="numeric"
                              maxLength={6}
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Datum osnivanja
                          </label>

                          <input
                              type="date"
                              value={firmaZaIzmenu.datumOsnivanja}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    datumOsnivanja: e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Tip firme
                          </label>

                          <select
                              value={firmaZaIzmenu.tipFirme}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    tipFirme: e.target.value
                                  })
                              }
                          >

                            <option value="DOO">
                              DOO
                            </option>

                            <option value="PR">
                              Preduzetnik
                            </option>

                            <option value="AD">
                              AD
                            </option>

                            <option value="OD">
                              OD
                            </option>

                          </select>

                        </div>


                        <div className="form-group">

                          <label>
                            Zaduženi knjigovodja
                          </label>

                          <select
                              value={firmaZaIzmenu.zaduzeniKorisnik?.idUser ?? ""}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    zaduzeniKorisnik:
                                      e.target.value === ""
                                        ? null
                                        : {
                                            idUser: Number(e.target.value),
                                            username:
                                              korisniciZaDodelu.find(
                                                korisnik =>
                                                  korisnik.idUser ===
                                                  Number(e.target.value)
                                              )?.username ?? ""
                                          }
                                  })
                              }
                          >

                            <option value="">
                              — nije zadužen —
                            </option>

                            {korisniciZaDodelu.map(korisnik => (
                              <option
                                key={korisnik.idUser}
                                value={korisnik.idUser}
                              >
                                {korisnik.username}
                              </option>
                            ))}

                          </select>

                        </div>

                      </div>


                      <div className="logo-sekcija">

                        <label>
                          Logo firme
                        </label>

                        <div className="logo-trenutni">

                          {logoPregled ? (

                              <img
                                  src={logoPregled}
                                  alt="Novi logo firme"
                                  className="logo-pregled"
                              />

                          ) : firmaZaIzmenu.imaLogo ? (

                              <img
                                  src={`/api/firme/${firmaZaIzmenu.idFirma}/logo?v=${logoVerzija}`}
                                  alt="Logo firme"
                                  className="logo-pregled"
                              />

                          ) : (

                              <span className="logo-nema">
                                Firma nema logo
                              </span>

                          )}

                          <label className="logo-dodaj">

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/gif"
                                onChange={izaberiLogo}
                            />

                            {firmaZaIzmenu.imaLogo || logoPregled
                                ? "Promeni sliku"
                                : "+ Izaberite sliku"}

                          </label>

                          {(firmaZaIzmenu.imaLogo || logoPregled) && (

                              <button
                                  className="secondary-button"
                                  onClick={() =>
                                      logoPregled
                                          ? ukloniIzborLoga()
                                          : ukloniLogoFirme(firmaZaIzmenu)
                                  }
                              >
                                {logoPregled
                                    ? "Otkaži izbor"
                                    : "Ukloni logo"}
                              </button>

                          )}

                        </div>

                        <p className="logo-hint">
                          PNG, JPG ili GIF, najviše 2MB
                        </p>

                      </div>


                      <div className="checkbox-section">

                        <label className="checkbox">

                          <input
                              type="checkbox"
                              checked={firmaZaIzmenu.pdvObveznik}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    pdvObveznik: e.target.checked
                                  })
                              }
                          />

                          <span>
                            Firma je PDV obveznik
                          </span>

                        </label>


                        <label className="checkbox">

                          <input
                              type="checkbox"
                              checked={firmaZaIzmenu.pausalac}
                              onChange={e =>
                                  setFirmaZaIzmenu({
                                    ...firmaZaIzmenu,
                                    pausalac: e.target.checked
                                  })
                              }
                          />

                          <span>
                            Firma je paušalac
                          </span>

                        </label>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setFirmaZaIzmenu(null)
                            }
                        >
                          Otkaži
                        </button>


                        <button
                            className="primary-button"
                            onClick={izmeniFirmu}
                        >
                          Sačuvaj izmene
                        </button>

                      </div>

                    </div>

                  </div>

              )}

            </section>


            {/* MODAL ZA DODAVANJE FIRME */}

            {prikaziFormuFirme && (

                <div className="edit-obaveza-overlay">

                  <div className="edit-obaveza-modal">

                    <h3>
                      Dodaj novu firmu
                    </h3>


              <form onSubmit={dodajFirmu}>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Naziv firme
                    </label>

                    <input
                        value={naziv}
                        onChange={e =>
                            setNaziv(e.target.value)
                        }
                        placeholder="npr. ABC Solutions"
                        required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      PIB
                    </label>

                    <input
                        value={pib}
                        onChange={e =>
                            setPib(
                                e.target.value.replace(/\D/g, "").slice(0, 9)
                            )
                        }
                        placeholder="Unesite PIB (9 brojeva)"
                        inputMode="numeric"
                        maxLength={9}
                        required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Matični broj
                    </label>

                    <input
                        value={maticniBroj}
                        onChange={e =>
                            setMaticniBroj(
                                e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                        }
                        placeholder="Unesite matični broj (6 brojeva)"
                        inputMode="numeric"
                        maxLength={6}
                        required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Datum osnivanja
                    </label>

                    <div className="datum-polje">

                      <input
                          type="date"
                          className={
                              datumOsnivanja
                                  ? "datum-izabran"
                                  : "datum-prazan"
                          }
                          value={datumOsnivanja}
                          onChange={e =>
                              setDatumOsnivanja(e.target.value)
                          }
                          required
                      />

                      {!datumOsnivanja && (

                          <span className="datum-placeholder">
                            Unesite datum
                          </span>

                      )}

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Tip firme
                    </label>

                    <select
                        value={tipFirme}
                        onChange={e =>
                            setTipFirme(e.target.value)
                        }
                        required
                    >

                      <option value="">
                        Izaberite tip
                      </option>

                      <option value="DOO">
                        DOO
                      </option>

                      <option value="PR">
                        Preduzetnik
                      </option>

                      <option value="AD">
                        AD
                      </option>

                      <option value="OD">
                        OD
                      </option>

                    </select>

                  </div>

                </div>


                <div className="logo-sekcija">

                  <label>
                    Logo firme (opciono)
                  </label>

                  {logoPregled ? (

                    <div className="logo-trenutni">

                      <img
                          src={logoPregled}
                          alt="Logo firme"
                          className="logo-pregled"
                      />

                      <button
                          type="button"
                          className="secondary-button"
                          onClick={ukloniIzborLoga}
                      >
                        Ukloni
                      </button>

                    </div>

                  ) : (

                    <label className="logo-dodaj">

                      <input
                          type="file"
                          accept="image/png,image/jpeg,image/gif"
                          onChange={izaberiLogo}
                      />

                      + Izaberite sliku loga

                    </label>

                  )}

                  <p className="logo-hint">
                    PNG, JPG ili GIF, najviše 2MB
                  </p>

                </div>


                <div className="checkbox-section">

                  <label className="checkbox">

                    <input
                        type="checkbox"
                        checked={pdvObveznik}
                        onChange={e =>
                            setPdvObveznik(e.target.checked)
                        }
                    />

                    <span>
                      Firma je PDV obveznik
                    </span>

                  </label>


                  <label className="checkbox">

                    <input
                        type="checkbox"
                        checked={pausalac}
                        onChange={e =>
                            setPausalac(e.target.checked)
                        }
                    />

                    <span>
                      Firma je paušalac
                    </span>

                  </label>

                </div>


                <div className="form-buttons">

                  <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setPrikaziFormuFirme(false)}
                  >
                    Otkaži
                  </button>


                  <button
                      type="submit"
                      className="primary-button"
                  >
                    + Dodaj firmu
                  </button>

                </div>

              </form>

                  </div>

                </div>

            )}

          </>

        )}


        {/* NEDAVNE AKTIVNOSTI */}

        {aktivnaStranica === "pocetna" && (

            <section className="card aktivnosti-kartica">

              <div className="aktivnosti-zaglavlje">

                <h3>
                  Nedavne aktivnosti
                </h3>

                <button
                  className="detail-button"
                  onClick={() => otvoriStranicu("aktivnosti")}
                >
                  Sve aktivnosti →
                </button>

              </div>

              {aktivnosti.length === 0 ? (

                  <p className="aktivnosti-prazno">
                    Još nema evidentiranih aktivnosti.
                  </p>

              ) : (

                  <ul className="aktivnosti-lista">

                    {aktivnosti.slice(0, 8).map(aktivnost => (

                        <li key={aktivnost.idLog}>

                          <div className="aktivnost-tekst">

                            <strong>
                              {aktivnost.korisnik}
                            </strong>

                            <span>
                              {aktivnost.akcija}
                            </span>

                          </div>

                          <small className="aktivnost-vreme">
                            {formatirajVreme(aktivnost.datum)}
                          </small>

                        </li>

                    ))}

                  </ul>

              )}

            </section>

        )}


        {/* DESNA KOLONA — DUGMAD */}

        {aktivnaStranica === "pocetna" && (

          <aside className="pocetna-desna">

            <button
              className="napomene-card"
              onClick={() => otvoriStranicu("dokumenti")}
            >

              <div className="stat-icon">
                ▤
              </div>

              <div className="napomene-card-info">
                <strong>Dokumenti</strong>
                <small>{dokumenti.length} dokumenata u sistemu</small>
              </div>

              <span className="napomene-arrow">
                →
              </span>

            </button>

            <button
              className="napomene-card"
              onClick={() => otvoriStranicu("napomene")}
            >

              <div className="stat-icon">
                📝
              </div>

              <div className="napomene-card-info">
                <strong>Napomene</strong>
                <small>{napomene.length} napomena u sistemu</small>
              </div>

              <span className="napomene-arrow">
                →
              </span>

            </button>

            <button
              className="napomene-card"
              onClick={() => otvoriStranicu("obaveze")}
            >

              <div className="stat-icon">
                ⚑
              </div>

              <div className="napomene-card-info">
                <strong>Obaveze</strong>
                <small>{obaveze.length} obaveza u sistemu</small>
              </div>

              <span className="napomene-arrow">
                →
              </span>

            </button>

          </aside>

        )}

        </div>



        {/* OBAVEZE */}

        {aktivnaStranica === "obaveze" && (

          <>

            <div className="obaveze-page">

              <button
                  className="back-button"
                  onClick={() => {

                    if (obavezeFirmaFilter) {
                      setObavezeFirmaFilter("");
                      otvoriStranicu("pocetna");
                    } else {
                      otvoriStranicu("pocetna");
                    }

                  }}
              >
                {obavezeFirmaFilter
                  ? "← Nazad na firme"
                  : "← Nazad na početnu"}
              </button>

              <div className="obaveze-title">

                <h2>
                  {izabranaFirmaObaveza
                    ? `Obaveze firme ${izabranaFirmaObaveza.naziv}`
                    : "Obaveze"}
                </h2>

              </div>

            </div>


            <div className={izabranaFirmaObaveza ? "obaveze-firma-pregled" : undefined}>

            {/* DETALJI IZABRANE FIRME */}

            {izabranaFirmaObaveza && (

                <section className="card obaveze-firma-detalji">

                  <div className="section-header">

                    <div>

                      <h3>
                        Detalji firme
                      </h3>

                      <p>
                        Osnovni podaci o firmi čije se
                        obaveze prikazuju
                      </p>

                    </div>

                  </div>


                  <div className="details-list">

                    <div>

                      <span>
                        Naziv firme
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.naziv}
                      </strong>

                    </div>


                    <div>

                      <span>
                        PIB
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.pib}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Matični broj
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.maticniBroj}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Datum osnivanja
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.datumOsnivanja}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Tip firme
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.tipFirme}
                      </strong>

                    </div>


                    <div>

                      <span>
                        PDV obveznik
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.pdvObveznik
                          ? "Da"
                          : "Ne"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Paušalac
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.pausalac
                          ? "Da"
                          : "Ne"}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Zaduženi knjigovodja
                      </span>

                      <strong>
                        {izabranaFirmaObaveza.zaduzeniKorisnik?.username ?? "—"}
                      </strong>

                    </div>

                  </div>

                </section>

            )}


            {/* SAŽETAK OBAVEZA */}

            <section className="sazetak-obaveza">

              <h3 className="sazetak-obaveza-naslov">
                Sažetak obaveza
              </h3>

              <div className="statistics">

              <div className="stat-card">

                <span>
                  {izabranaFirmaObaveza
                    ? "Obaveze firme"
                    : "Ukupno obaveza"}
                </span>

                <strong>
                  {filtriraneObaveze.length}
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Neplaćene
                </span>

                <strong>
                  {
                    filtriraneObaveze.filter(
                        o => !o.placeno
                    ).length
                  }
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Plaćene
                </span>

                <strong>
                  {
                    filtriraneObaveze.filter(
                        o => o.placeno
                    ).length
                  }
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Nerazdužen iznos
                </span>

                <strong>

                  {
                    filtriraneObaveze
                        .filter(o => !o.placeno)
                        .reduce(
                            (ukupno, o) =>
                                ukupno +
                                Number(o.iznos),
                            0
                        )
                        .toLocaleString("sr-RS")
                  }

                  {" "}RSD

                </strong>

              </div>

              </div>

            </section>

            </div>


            {/* OBAVEZE CARD */}

            <section className="card">

              <div className="section-header">

                <div>

                  <h3>
                    Registrovane obaveze
                  </h3>

                  <p>
                    Pregled svih obaveza po firmama
                  </p>

                </div>


                <div className="header-controls">

                  {!izabranaFirmaObaveza && (

                  <select
                      className="filter-select"
                      value={obavezeFirmaFilter}
                      onChange={e =>
                          setObavezeFirmaFilter(
                              e.target.value
                          )
                      }
                  >

                    <option value="">
                      Sve firme
                    </option>

                    {firme.map(firma => (

                        <option
                            key={firma.idFirma}
                            value={firma.idFirma}
                        >
                          {firma.naziv}
                        </option>

                    ))}

                  </select>

                  )}

                  <button
                      className="primary-button"
                      onClick={() =>
                          setPrikaziFormuObaveze(
                              !prikaziFormuObaveze
                          )
                      }
                  >
                    + Dodaj obavezu
                  </button>

                </div>

              </div>


              {/* FORMA ZA DODAVANJE */}

              {prikaziFormuObaveze && (

                  <div className="form-section">

                    <h3>
                      Dodavanje obaveze
                    </h3>


                    <div className="form-grid">


                      {!izabranaFirmaObaveza && (

                      <div className="form-group">

                        <label>
                          Firma
                          {greske["obaveza.firma"] && !obavezaFirma && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <select
                            className={greske["obaveza.firma"] && !obavezaFirma ? "polje-greska" : undefined}
                            value={obavezaFirma}
                            onChange={e =>
                                setObavezaFirma(
                                    e.target.value
                                )
                            }
                        >

                          <option value="">
                            Izaberite firmu
                          </option>

                          {firme.map(firma => (

                              <option
                                  key={firma.idFirma}
                                  value={firma.idFirma}
                              >
                                {firma.naziv}
                              </option>

                          ))}

                        </select>

                      </div>

                      )}


                      <div className="form-group">

                        <label>
                          Tip obaveze
                        </label>

                        <select
                            value={obavezaTip}
                            onChange={e =>
                                setObavezaTip(
                                    e.target.value
                                )
                            }
                        >

                          <option value="PDV">
                            PDV
                          </option>

                          <option value="POREZ">
                            Porez
                          </option>

                          <option value="DOPRINOSI">
                            Doprinosi
                          </option>

                          <option value="OBRACUN_ZARADE">
                            Obračun zarade
                          </option>

                          <option value="ZAVRSNI_RACUN">
                            Završni račun
                          </option>

                          <option value="TAKSA">
                            Taksa
                          </option>

                        </select>

                      </div>


                      <div className="form-group">

                        <label>
                          Iznos (RSD)
                          {greske["obaveza.iznos"] && !obavezaIznos && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <input
                            type="number"
                            className={greske["obaveza.iznos"] && !obavezaIznos ? "polje-greska" : undefined}
                            value={obavezaIznos}
                            onChange={e =>
                                setObavezaIznos(
                                    e.target.value
                                )
                            }
                            placeholder="npr. 50000"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Datum dospeća
                          {greske["obaveza.datum"] && !obavezaDatum && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <div className="datum-polje">

                          <input
                              type="date"
                              className={
                                  greske["obaveza.datum"] && !obavezaDatum
                                      ? "datum-prazan polje-greska"
                                      : obavezaDatum
                                          ? "datum-izabran"
                                          : "datum-prazan"
                              }
                              value={obavezaDatum}
                              onChange={e =>
                                  setObavezaDatum(
                                      e.target.value
                                  )
                              }
                          />

                          {!obavezaDatum && (

                              <span className="datum-placeholder">
                                Datum dospeća
                              </span>

                          )}

                        </div>

                      </div>

                    </div>


                    <div className="checkbox-section">

                      <label>

                        <input
                            type="checkbox"
                            checked={obavezaPlaceno}
                            onChange={e =>
                                setObavezaPlaceno(
                                    e.target.checked
                                )
                            }
                        />

                        Obaveza je plaćena

                      </label>

                    </div>


                    <div className="form-buttons">

                      <button
                          className="secondary-button"
                          onClick={() =>
                              setPrikaziFormuObaveze(false)
                          }
                      >
                        Otkaži
                      </button>


                      <button
                          className="primary-button"
                          onClick={dodajObavezu}
                      >
                        Sačuvaj obavezu
                      </button>

                    </div>

                  </div>

              )}


              {/* TABELA OBAVEZA */}

              <div className="table-container">

                <table>

                  <thead>

                  <tr>

                    {!izabranaFirmaObaveza && (

                        <th>
                          Firma
                        </th>

                    )}

                    <th>
                      Tip obaveze
                    </th>

                    <th>
                      Iznos
                    </th>

                    <th>
                      Datum dospeća
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Akcije
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {filtriraneObaveze.map(obaveza => (

                      <tr
                          key={obaveza.idObaveza}
                      >

                        {!izabranaFirmaObaveza && (

                            <td>
                              {obaveza.firma?.naziv}
                            </td>

                        )}


                        <td>
                          {TIP_OBAVE[obaveza.tip] || obaveza.tip}
                        </td>


                        <td>

                          {
                            Number(
                                obaveza.iznos
                            ).toLocaleString(
                                "sr-RS"
                            )
                          }

                          {" "}RSD

                        </td>


                        <td>
                          {obaveza.datumDospeca}
                        </td>


                        <td>

                          {obaveza.placeno ? (

                              <span className="status-paid">
                            Plaćeno
                          </span>

                          ) : (

                              <span className="status-unpaid">
                            Nije plaćeno
                          </span>

                          )}

                        </td>


                        <td>

                          <div className="action-buttons">

                            <button
                                className="edit-button"
                                onClick={() =>
                                    setObavezaZaIzmenu(
                                        obaveza
                                    )
                                }
                            >
                              Izmeni
                            </button>


                            <button
                                className="delete-button"
                                onClick={() =>
                                    obrisiObavezu(
                                        obaveza.idObaveza
                                    )
                                }
                            >
                              Obriši
                            </button>

                          </div>

                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>


              {/* MODAL ZA IZMENU */}

              {obavezaZaIzmenu && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      <h3>
                        Izmena obaveze
                      </h3>


                      <div className="form-grid">


                        {!izabranaFirmaObaveza && (

                        <div className="form-group">

                          <label>
                            Firma
                          </label>

                          <select
                              value={
                                obavezaZaIzmenu
                                    .firma
                                    .idFirma
                              }
                              onChange={e =>
                                  setObavezaZaIzmenu({
                                    ...obavezaZaIzmenu,

                                    firma: {
                                      ...obavezaZaIzmenu.firma,

                                      idFirma:
                                          Number(
                                              e.target.value
                                          )
                                    }
                                  })
                              }
                          >

                            {firme.map(firma => (

                                <option
                                    key={firma.idFirma}
                                    value={firma.idFirma}
                                >
                                  {firma.naziv}
                                </option>

                            ))}

                          </select>

                        </div>

                        )}


                        <div className="form-group">

                          <label>
                            Tip obaveze
                          </label>

                          <select
                              value={
                                obavezaZaIzmenu.tip
                              }
                              onChange={e =>
                                  setObavezaZaIzmenu({
                                    ...obavezaZaIzmenu,

                                    tip:
                                        e.target.value
                                  })
                              }
                          >

                            <option value="PDV">
                              PDV
                            </option>

                            <option value="POREZ">
                              Porez
                            </option>

                            <option value="DOPRINOSI">
                              Doprinosi
                            </option>

                            <option value="OBRACUN_ZARADE">
                              Obračun zarade
                            </option>

                            <option value="ZAVRSNI_RACUN">
                              Završni račun
                            </option>

                            <option value="TAKSA">
                              Taksa
                            </option>

                          </select>

                        </div>


                        <div className="form-group">

                          <label>
                            Iznos (RSD)
                          </label>

                          <input
                              type="number"
                              value={
                                obavezaZaIzmenu.iznos
                              }
                              onChange={e =>
                                  setObavezaZaIzmenu({
                                    ...obavezaZaIzmenu,

                                    iznos:
                                        Number(
                                            e.target.value
                                        )
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Datum dospeća
                          </label>

                          <input
                              type="date"
                              value={
                                obavezaZaIzmenu
                                    .datumDospeca
                              }
                              onChange={e =>
                                  setObavezaZaIzmenu({
                                    ...obavezaZaIzmenu,

                                    datumDospeca:
                                        e.target.value
                                  })
                              }
                          />

                        </div>

                      </div>


                      <div className="checkbox-section">

                        <label>

                          <input
                              type="checkbox"
                              checked={
                                obavezaZaIzmenu
                                    .placeno
                              }
                              onChange={e =>
                                  setObavezaZaIzmenu({
                                    ...obavezaZaIzmenu,

                                    placeno:
                                        e.target.checked
                                  })
                              }
                          />

                          Obaveza je plaćena

                        </label>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setObavezaZaIzmenu(null)
                            }
                        >
                          Otkaži
                        </button>


                        <button
                            className="primary-button"
                            onClick={
                              izmeniObavezu
                            }
                        >
                          Sačuvaj izmene
                        </button>

                      </div>

                    </div>

                  </div>

              )}

            </section>

          </>

        )}



        {/* ZAPOSLENI */}


        {aktivnaStranica === "zaposleni" && (

          <>

            <div className="obaveze-page">

              <button
                  className="back-button"
                  onClick={() => {

                    if (zaposleniFirmaFilter) {
                      setZaposleniFirmaFilter("");
                      otvoriStranicu("pocetna");
                    } else {
                      otvoriStranicu("pocetna");
                    }

                  }}
              >
                {zaposleniFirmaFilter
                  ? "← Nazad na firme"
                  : "← Nazad na početnu"}
              </button>

              <div className="obaveze-title">

                <h2>
                  {izabranaFirmaZaposleni
                    ? `Radnici firme ${izabranaFirmaZaposleni.naziv}`
                    : "Radnici"}
                </h2>

                <p>
                  {izabranaFirmaZaposleni
                    ? "Pregled radnika u izabranoj firmi"
                    : "Pregled radnika u svim firmama"}
                </p>

              </div>

            </div>


            {/* STATISTIKA ZAPOSLENIH */}

            <section className="statistics">

              <div className="stat-card">

                <span>
                  {izabranaFirmaZaposleni
                    ? "Radnici u firmi"
                    : "Ukupno radnika"}
                </span>

                <strong>
                  {filtriraniZaposleni.length}
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Menadžeri
                </span>

                <strong>
                  {
                    filtriraniZaposleni.filter(
                        z => z.uloga === "MENADZER"
                    ).length
                  }
                </strong>

              </div>

            </section>


            {/* ZAPOSLENI CARD */}

            <section className="card">

              <div className="section-header">

                <div>

                  <h3>
                    Registrovani radnici
                  </h3>

                  <p>
                    Pregled svih radnika po firmama
                  </p>

                </div>


                <div className="header-controls">

                  {!izabranaFirmaZaposleni && (

                  <select
                      className="filter-select"
                      value={zaposleniFirmaFilter}
                      onChange={e =>
                          setZaposleniFirmaFilter(
                              e.target.value
                          )
                      }
                  >

                    <option value="">
                      Sve firme
                    </option>

                    {firme.map(firma => (

                        <option
                            key={firma.idFirma}
                            value={firma.idFirma}
                        >
                          {firma.naziv}
                        </option>

                    ))}

                  </select>

                  )}


                  <button
                      className="primary-button"
                      onClick={() => {
                          if (!prikaziFormuZaposlenog) {
                              ukloniIzborSlike();
                          }
                          setPrikaziFormuZaposlenog(
                              !prikaziFormuZaposlenog
                          );
                      }}
                  >
                    + Dodaj radnika
                  </button>

                </div>

              </div>


              {/* FORMA ZA DODAVANJE ZAPOSLENOG */}

              {prikaziFormuZaposlenog && (

                  <div className="form-section">

                    <h3>
                      Dodavanje radnika
                    </h3>


                    <div className="form-grid">


                      <div className="form-group">

                        <label>
                          Ime
                          {greske["zaposleni.ime"] && !zaposleniIme && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <input
                            className={greske["zaposleni.ime"] && !zaposleniIme ? "polje-greska" : undefined}
                            value={zaposleniIme}
                            onChange={e =>
                                setZaposleniIme(
                                    e.target.value
                                )
                            }
                            placeholder="npr. Marko"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Prezime
                          {greske["zaposleni.prezime"] && !zaposleniPrezime && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <input
                            className={greske["zaposleni.prezime"] && !zaposleniPrezime ? "polje-greska" : undefined}
                            value={zaposleniPrezime}
                            onChange={e =>
                                setZaposleniPrezime(
                                    e.target.value
                                )
                            }
                            placeholder="npr. Marković"
                        />

                      </div>


                      {!izabranaFirmaZaposleni && (

                      <div className="form-group">

                        <label>
                          Firma
                          {greske["zaposleni.firma"] && !zaposleniFirma && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <select
                            className={greske["zaposleni.firma"] && !zaposleniFirma ? "polje-greska" : undefined}
                            value={zaposleniFirma}
                            onChange={e =>
                                setZaposleniFirma(
                                    e.target.value
                                )
                            }
                        >

                          <option value="">
                            Izaberite firmu
                          </option>

                          {firme.map(firma => (

                              <option
                                  key={firma.idFirma}
                                  value={firma.idFirma}
                              >
                                {firma.naziv}
                              </option>

                          ))}

                        </select>

                      </div>

                      )}


                      <div className="form-group">

                        <label>
                          Datum zaposlenja
                          {greske["zaposleni.datum"] && !zaposleniDatum && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <div className="datum-polje">

                          <input
                              type="date"
                              className={
                                  greske["zaposleni.datum"] && !zaposleniDatum
                                      ? "datum-prazan polje-greska"
                                      : zaposleniDatum
                                          ? "datum-izabran"
                                          : "datum-prazan"
                              }
                              value={zaposleniDatum}
                              onChange={e =>
                                  setZaposleniDatum(
                                      e.target.value
                                  )
                              }
                          />

                          {!zaposleniDatum && (

                              <span className="datum-placeholder">
                                Unesite datum
                              </span>

                          )}

                        </div>

                      </div>


                      <div className="form-group">

                        <label>
                          Uloga
                        </label>

                        <select
                            value={zaposleniUloga}
                            onChange={e =>
                                setZaposleniUloga(
                                    e.target.value
                                )
                            }
                        >

                          <option value="RADNIK">
                            Radnik
                          </option>

                          <option value="MENADZER">
                            Menadžer
                          </option>

                        </select>

                      </div>

                    </div>


                    <div className="logo-sekcija">

                      <label>
                        Slika radnika (opciono)
                      </label>

                      {slikaPregled ? (

                        <div className="logo-trenutni">

                          <img
                              src={slikaPregled}
                              alt="Slika radnika"
                              className="slika-pregled"
                          />

                          <button
                              className="secondary-button"
                              onClick={ukloniIzborSlike}
                          >
                            Ukloni
                          </button>

                        </div>

                      ) : (

                        <label className="logo-dodaj">

                          <input
                              type="file"
                              accept="image/png,image/jpeg,image/gif"
                              onChange={izaberiSliku}
                          />

                          + Izaberite sliku radnika

                        </label>

                      )}

                      <p className="logo-hint">
                        PNG, JPG ili GIF, najviše 2MB
                      </p>

                    </div>


                    <div className="form-buttons">

                      <button
                          className="secondary-button"
                          onClick={() =>
                              setPrikaziFormuZaposlenog(false)
                          }
                      >
                        Otkaži
                      </button>


                      <button
                          className="primary-button"
                          onClick={dodajZaposlenog}
                      >
                        Sačuvaj radnika
                      </button>

                    </div>

                  </div>

              )}


              {/* TABELA ZAPOSLENIH */}

              <div className="table-container">

                <table>

                  <thead>

                  <tr>

                    <th>
                      Ime
                    </th>

                    <th>
                      Prezime
                    </th>

                    <th>
                      Uloga
                    </th>

                    <th>
                      Firma
                    </th>

                    <th>
                      Datum zaposlenja
                    </th>

                    <th>
                      Radni status
                    </th>

                    <th>
                      Akcije
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {filtriraniZaposleni.map(zaposlen => (

                      <tr
                          key={zaposlen.idZaposleni}
                      >

                        <td>

                          <div className="radnik-ime">

                            {zaposlen.imaSliku ? (

                                <img
                                    src={`/api/zaposleni/${zaposlen.idZaposleni}/slika?v=${slikaVerzija}`}
                                    alt={`${zaposlen.ime} ${zaposlen.prezime}`}
                                    className="slika-radnika"
                                />

                            ) : (

                                <span
                                    className="slika-radnika-placeholder"
                                    title="Radnik nema sliku"
                                >
                                  {zaposlen.ime?.charAt(0).toUpperCase()}
                                </span>

                            )}

                            {zaposlen.ime}

                          </div>

                        </td>


                        <td>
                          {zaposlen.prezime}
                        </td>


                        <td>

                          <span
                              className={
                                zaposlen.uloga === "MENADZER"
                                  ? "uloga-admin"
                                  : "uloga-zaposleni"
                              }
                          >
                            {ULOGA_ZAPOSLENOG[
                              zaposlen.uloga ?? "RADNIK"
                            ] ?? "Radnik"}
                          </span>

                        </td>


                        <td>
                          {zaposlen.firma?.naziv}
                        </td>


                        <td>
                          {zaposlen.datumZaposlenja}
                        </td>


                        <td>

                          {trenutniStatus(zaposlen.idZaposleni) ? (

                              <span className="badge">
                                {
                                  TIP_RADNOG_STATUSA[
                                    trenutniStatus(zaposlen.idZaposleni)!.tip
                                  ]
                                }
                              </span>

                          ) : (

                              <span className="no-status">
                                —
                              </span>

                          )}

                        </td>


                        <td>

                          <div className="action-buttons">

                            <button
                                className="edit-button"
                                onClick={() => {
                                  setStatusiZaZaposlenog(zaposlen);
                                  setPrikaziFormuStatusa(false);
                                  setStatusZaIzmenu(null);
                            }}
                            >
                              Statusi
                            </button>

                            <button
                                className="edit-button"
                                onClick={() => {
                                    ukloniIzborSlike();
                                    setZaposleniZaIzmenu(
                                        zaposlen
                                    );
                                }}
                            >
                              Izmeni
                            </button>


                            <button
                                className="delete-button"
                                onClick={() =>
                                    obrisiZaposlenog(
                                        zaposlen.idZaposleni
                                    )
                                }
                            >
                              Obriši
                            </button>

                          </div>

                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>


              {/* MODAL ZA IZMENU ZAPOSLENOG */}

              {zaposleniZaIzmenu && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      <h3>
                        Izmena radnika
                      </h3>


                      <div className="form-grid">


                        <div className="form-group">

                          <label>
                            Ime
                          </label>

                          <input
                              value={zaposleniZaIzmenu.ime}
                              onChange={e =>
                                  setZaposleniZaIzmenu({
                                    ...zaposleniZaIzmenu,
                                    ime: e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Prezime
                          </label>

                          <input
                              value={zaposleniZaIzmenu.prezime}
                              onChange={e =>
                                  setZaposleniZaIzmenu({
                                    ...zaposleniZaIzmenu,
                                    prezime: e.target.value
                                  })
                              }
                          />

                        </div>


                        {!izabranaFirmaZaposleni && (

                        <div className="form-group">

                          <label>
                            Firma
                          </label>

                          <select
                              value={
                                zaposleniZaIzmenu
                                    .firma
                                    .idFirma
                              }
                              onChange={e =>
                                  setZaposleniZaIzmenu({
                                    ...zaposleniZaIzmenu,

                                    firma: {
                                      ...zaposleniZaIzmenu.firma,

                                      idFirma:
                                          Number(
                                              e.target.value
                                          )
                                    }
                                  })
                              }
                          >

                            {firme.map(firma => (

                                <option
                                    key={firma.idFirma}
                                    value={firma.idFirma}
                                >
                                  {firma.naziv}
                                </option>

                            ))}

                          </select>

                        </div>

                        )}


                        <div className="form-group">

                          <label>
                            Datum zaposlenja
                          </label>

                          <input
                              type="date"
                              value={
                                zaposleniZaIzmenu
                                    .datumZaposlenja
                              }
                              onChange={e =>
                                  setZaposleniZaIzmenu({
                                    ...zaposleniZaIzmenu,

                                    datumZaposlenja:
                                        e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Uloga
                          </label>

                          <select
                              value={
                                zaposleniZaIzmenu
                                    .uloga ??
                                  "RADNIK"
                              }
                              onChange={e =>
                                  setZaposleniZaIzmenu({
                                    ...zaposleniZaIzmenu,

                                    uloga:
                                        e.target.value
                                  })
                              }
                          >

                            <option value="RADNIK">
                              Radnik
                            </option>

                            <option value="MENADZER">
                              Menadžer
                            </option>

                          </select>

                        </div>

                      </div>


                      <div className="logo-sekcija">

                        <label>
                          Slika radnika
                        </label>

                        <div className="logo-trenutni">

                          {slikaPregled ? (

                              <img
                                  src={slikaPregled}
                                  alt="Nova slika radnika"
                                  className="slika-pregled"
                              />

                          ) : zaposleniZaIzmenu.imaSliku ? (

                              <img
                                  src={`/api/zaposleni/${zaposleniZaIzmenu.idZaposleni}/slika?v=${slikaVerzija}`}
                                  alt="Slika radnika"
                                  className="slika-pregled"
                              />

                          ) : (

                              <span className="logo-nema">
                                Radnik nema sliku
                              </span>

                          )}

                          <label className="logo-dodaj">

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/gif"
                                onChange={izaberiSliku}
                            />

                            {zaposleniZaIzmenu.imaSliku || slikaPregled
                                ? "Promeni sliku"
                                : "+ Izaberite sliku"}

                          </label>

                          {(zaposleniZaIzmenu.imaSliku || slikaPregled) && (

                              <button
                                  className="secondary-button"
                                  onClick={() =>
                                      slikaPregled
                                          ? ukloniIzborSlike()
                                          : ukloniSlikuZaposlenog(zaposleniZaIzmenu)
                                  }
                              >
                                {slikaPregled
                                    ? "Otkaži izbor"
                                    : "Ukloni sliku"}
                              </button>

                          )}

                        </div>

                        <p className="logo-hint">
                          PNG, JPG ili GIF, najviše 2MB
                        </p>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setZaposleniZaIzmenu(null)
                            }
                        >
                          Otkaži
                        </button>


                        <button
                            className="primary-button"
                            onClick={izmeniZaposlenog}
                        >
                          Sačuvaj izmene
                        </button>

                      </div>

                    </div>

                  </div>

              )}


              {/* MODAL ZA RADNE STATUSE ZAPOSLENOG */}

              {statusiZaZaposlenog && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal statusi-modal">

                      <h3>
                        Radni statusi — {statusiZaZaposlenog.ime} {statusiZaZaposlenog.prezime}
                      </h3>


                      {/* ISTORIJA STATUSA */}

                      {

                        radniStatusi.filter(
                            status =>
                                status.zaposleni?.idZaposleni ===
                                statusiZaZaposlenog.idZaposleni
                        ).length === 0 ? (

                          <p className="statusi-prazno">
                            Nema evidentiranih radnih statusa.
                          </p>

                        ) : (

                          <div className="statusi-tabela">

                            <table>

                              <thead>

                              <tr>

                                <th>
                                  Status
                                </th>

                                <th>
                                  Od datuma
                                </th>

                                <th>
                                  Do datuma
                                </th>

                                <th>
                                  Akcije
                                </th>

                              </tr>

                              </thead>


                              <tbody>

                              {[...radniStatusi]
                                  .filter(
                                      status =>
                                          status.zaposleni?.idZaposleni ===
                                          statusiZaZaposlenog.idZaposleni
                                  )
                                  .sort((a, b) =>
                                      a.datumOd < b.datumOd ? 1 : -1
                                  )
                                  .map(status => {

                                      const aktivan =
                                          !status.datumDo ||
                                          status.datumDo >= danas;

                                      return (

                                      <tr
                                          key={status.idStatus}
                                      >

                                        <td>

                                          <span className="badge">
                                            {
                                              TIP_RADNOG_STATUSA[
                                                status.tip
                                              ] ?? status.tip
                                            }
                                          </span>

                                          {trenutniStatus(
                                            statusiZaZaposlenog.idZaposleni
                                          )?.idStatus === status.idStatus && (

                                            <span className="trenutno-badge">
                                              Trenutno
                                            </span>

                                          )}

                                        </td>


                                        <td>
                                          {status.datumOd}
                                        </td>


                                        <td>
                                          {status.datumDo ?? "Traje"}
                                        </td>


                                        <td>

                                          {aktivan ? (

                                          <div className="action-buttons">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    setStatusZaIzmenu(
                                                        status
                                                    )
                                                }
                                            >
                                              Izmeni
                                            </button>


                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    obrisiStatus(
                                                        status.idStatus
                                                    )
                                                }
                                            >
                                              Obriši
                                            </button>

                                          </div>

                                          ) : (

                                            <span className="status-zavrsen">
                                              Završeno
                                            </span>

                                          )}

                                        </td>

                                      </tr>

                                      );

                                  })}

                              </tbody>

                            </table>

                          </div>

                        )

                      }


                      {/* FORMA ZA DODAVANJE STATUSA */}

                      {prikaziFormuStatusa ? (

                          <div className="form-section">

                            <h3>
                              Dodavanje radnog statusa
                            </h3>


                            <div className="form-grid">


                              <div className="form-group">

                                <label>
                                  Tip statusa
                                  {greske["status.tip"] && !statusTip && (
                                    <span className="zvezda-greska">*</span>
                                  )}
                                </label>

                                <select
                                    className={greske["status.tip"] && !statusTip ? "polje-greska" : undefined}
                                    value={statusTip}
                                    onChange={e =>
                                        setStatusTip(
                                            e.target.value
                                        )
                                    }
                                >

                                  <option value="RAD">
                                    Rad
                                  </option>

                                  <option value="BOLOVANJE">
                                    Bolovanje
                                  </option>

                                  <option value="PORODILJSKO">
                                    Porodiljsko odsustvo
                                  </option>

                                </select>

                              </div>


                              <div className="form-group">

                                <label>
                                  Od datuma
                                  {greske["status.datumOd"] && !statusDatumOd && (
                                    <span className="zvezda-greska">*</span>
                                  )}
                                </label>

                                <input
                                    type="date"
                                    className={greske["status.datumOd"] && !statusDatumOd ? "polje-greska" : undefined}
                                    value={statusDatumOd}
                                    onChange={e =>
                                        setStatusDatumOd(
                                            e.target.value
                                        )
                                    }
                                />

                              </div>


                              <div className="form-group">

                                <label>
                                  Do datuma (prazno — traje)
                                </label>

                                <input
                                    type="date"
                                    value={statusDatumDo}
                                    onChange={e =>
                                        setStatusDatumDo(
                                            e.target.value
                                        )
                                    }
                                />

                              </div>

                            </div>


                            <div className="form-buttons">

                              <button
                                  className="secondary-button"
                                  onClick={() =>
                                      setPrikaziFormuStatusa(false)
                                  }
                              >
                                Otkaži
                              </button>


                              <button
                                  className="primary-button"
                                  onClick={dodajStatus}
                              >
                                Sačuvaj status
                              </button>

                            </div>

                          </div>

                      ) : (

                          <div className="form-buttons statusi-dodaj">

                            <button
                                className="primary-button"
                                onClick={() => {
                                    setStatusTip("RAD");
                                    setStatusDatumOd("");
                                    setStatusDatumDo("");
                                    setGreske({});
                                    setPrikaziFormuStatusa(true);
                                }}
                            >
                              + Dodaj status
                            </button>

                          </div>

                      )}


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setStatusiZaZaposlenog(null)
                            }
                        >
                          Zatvori
                        </button>

                      </div>

                    </div>

                  </div>

              )}


              {/* MODAL ZA IZMENU RADNOG STATUSA */}

              {statusZaIzmenu && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      <h3>
                        Izmena radnog statusa
                      </h3>


                      <div className="form-grid">


                        <div className="form-group">

                          <label>
                            Tip statusa
                          </label>

                          <select
                              value={statusZaIzmenu.tip}
                              onChange={e =>
                                  setStatusZaIzmenu({
                                    ...statusZaIzmenu,
                                    tip: e.target.value
                                  })
                              }
                          >

                            <option value="RAD">
                              Rad
                            </option>

                            <option value="BOLOVANJE">
                              Bolovanje
                            </option>

                            <option value="PORODILJSKO">
                              Porodiljsko odsustvo
                            </option>

                          </select>

                        </div>


                        <div className="form-group">

                          <label>
                            Od datuma
                          </label>

                          <input
                              type="date"
                              value={statusZaIzmenu.datumOd}
                              onChange={e =>
                                  setStatusZaIzmenu({
                                    ...statusZaIzmenu,
                                    datumOd: e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Do datuma (prazno — traje)
                          </label>

                          <input
                              type="date"
                              value={statusZaIzmenu.datumDo ?? ""}
                              onChange={e =>
                                  setStatusZaIzmenu({
                                    ...statusZaIzmenu,
                                    datumDo: e.target.value || null
                                  })
                              }
                          />

                        </div>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setStatusZaIzmenu(null)
                            }
                        >
                          Otkaži
                        </button>


                        <button
                            className="primary-button"
                            onClick={izmeniStatus}
                        >
                          Sačuvaj izmene
                        </button>

                      </div>

                    </div>

                  </div>

              )}

            </section>

          </>

        )}



        {/* DOKUMENTI */}

          {aktivnaStranica === "dokumenti" && (

          <>

            <div className="obaveze-page">

              <button
                  className="back-button"
                  onClick={() => otvoriStranicu("pocetna")}
              >
                ← Nazad na početnu
              </button>

              <div className="obaveze-title">

                <h2>
                  Dokumenti
                </h2>

                <p>
                  Pregled dokumenata svih firmi
                </p>

              </div>

            </div>


            {/* STATISTIKA DOKUMENATA */}

            <section className="statistics">

              <div className="stat-card">

                <span>
                  Ukupno dokumenata
                </span>

                <strong>
                  {dokumenti.length}
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Fakture
                </span>

                <strong>
                  {
                    dokumenti.filter(
                        d => d.tip === "FAKTURA"
                    ).length
                  }
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Ugovori
                </span>

                <strong>
                  {
                    dokumenti.filter(
                        d => d.tip === "UGOVOR"
                    ).length
                  }
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Obrasci
                </span>

                <strong>
                  {
                    dokumenti.filter(
                        d => d.tip === "OBRAZAC"
                    ).length
                  }
                </strong>

              </div>

            </section>


            {/* PRETRAGA DOKUMENATA */}

            <section className="card">

              <div className="card-header">

                <div>

                  <h3>
                    Pretraga dokumenata
                  </h3>

                  <p>
                    Pretražite dokumente po firmi i tipu dokumenta
                  </p>

                </div>

              </div>


              <div className="search-container">

                <span className="search-icon">
                  ⌕
                </span>

                <input
                    type="text"
                    placeholder="Unesite naziv firme ili tip dokumenta (npr. Faktura)..."
                    value={pretragaDokumenti}
                    onChange={e =>
                        setPretragaDokumenti(
                            e.target.value
                        )
                    }
                />

              </div>

            </section>


            {/* DOKUMENTI CARD */}

            <section className="card">

              <div className="section-header">

                <div>

                  <h3>
                    Registrovani dokumenti
                  </h3>

                  <p>
                    Pregled svih dokumenata po firmama
                  </p>

                </div>


                <div className="header-controls">

                  <button
                      className="primary-button"
                      onClick={() =>
                          setPrikaziFormuDokumenta(
                              !prikaziFormuDokumenta
                          )
                      }
                  >
                    + Dodaj dokument
                  </button>

                </div>

              </div>


              {/* FORMA ZA DODAVANJE DOKUMENTA */}

              {prikaziFormuDokumenta && (

                  <div className="form-section">

                    <h3>
                      Dodavanje dokumenta
                    </h3>


                    <div className="form-grid">


                      <div className="form-group">

                        <label>
                          Naziv dokumenta
                          {greske["dokument.naziv"] && !dokumentNaziv && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <input
                            className={greske["dokument.naziv"] && !dokumentNaziv ? "polje-greska" : undefined}
                            value={dokumentNaziv}
                            onChange={e =>
                                setDokumentNaziv(
                                    e.target.value
                                )
                            }
                            placeholder="npr. Faktura 12/2026"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Tip dokumenta
                        </label>

                        <select
                            value={dokumentTip}
                            onChange={e =>
                                setDokumentTip(
                                    e.target.value
                                )
                            }
                        >

                          <option value="FAKTURA">
                            Faktura
                          </option>

                          <option value="UGOVOR">
                            Ugovor
                          </option>

                          <option value="OBRAZAC">
                            Obrazac
                          </option>

                          <option value="PREDRACUN">
                            Predračun
                          </option>

                          <option value="BANKARSKI_IZVOD">
                            Bankarski izvod
                          </option>

                          <option value="OTPREMNICA">
                            Otpremnica
                          </option>

                          <option value="POPISNA_LISTA">
                            Popisna lista
                          </option>

                          <option value="REVERS">
                            Revers
                          </option>

                          <option value="RESENJE">
                            Rešenje
                          </option>

                          <option value="PUTNI_NALOG">
                            Putni nalog
                          </option>

                          <option value="PORESKO_RESENJE">
                            Poresko rešenje
                          </option>

                        </select>

                      </div>


                      <div className="form-group">

                        <label>
                          Datum
                          {greske["dokument.datum"] && !dokumentDatum && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <div className="datum-polje">

                          <input
                              type="date"
                              className={
                                  greske["dokument.datum"] && !dokumentDatum
                                      ? "datum-prazan polje-greska"
                                      : dokumentDatum
                                          ? "datum-izabran"
                                          : "datum-prazan"
                              }
                              value={dokumentDatum}
                              onChange={e =>
                                  setDokumentDatum(
                                      e.target.value
                                  )
                              }
                          />

                          {!dokumentDatum && (

                              <span className="datum-placeholder">
                                Unesite datum
                              </span>

                          )}

                        </div>

                      </div>


                      <div className="form-group">

                        <label>
                          Firma
                          {greske["dokument.firma"] && !dokumentFirma && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <select
                            className={greske["dokument.firma"] && !dokumentFirma ? "polje-greska" : undefined}
                            value={dokumentFirma}
                            onChange={e =>
                                setDokumentFirma(
                                    e.target.value
                                )
                            }
                        >

                          <option value="">
                            Izaberite firmu
                          </option>

                          {firme.map(firma => (

                              <option
                                  key={firma.idFirma}
                                  value={firma.idFirma}
                              >
                                {firma.naziv}
                              </option>

                          ))}

                        </select>

                      </div>

                    </div>


                    <div className="form-buttons">

                      <button
                          className="secondary-button"
                          onClick={() =>
                              setPrikaziFormuDokumenta(false)
                          }
                      >
                        Otkaži
                      </button>


                      <button
                          className="primary-button"
                          onClick={dodajDokument}
                      >
                        Sačuvaj dokument
                      </button>

                    </div>

                  </div>

              )}


              {/* TABELA DOKUMENATA */}

              <div className="table-container">

                <table>

                  <thead>

                  <tr>

                    <th>
                      Naziv
                    </th>

                    <th>
                      Tip dokumenta
                    </th>

                    <th>
                      Datum
                    </th>

                    <th>
                      Firma
                    </th>

                    <th>
                      Akcije
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {filtriraniDokumenti.map(dokument => (

                      <tr
                          key={dokument.idDokumenta}
                      >

                        <td className="company-name">
                          {dokument.naziv}
                        </td>


                        <td>

                          <span className="badge">
                            {TIP_DOKUMENTA[dokument.tip] ?? dokument.tip}
                          </span>

                        </td>


                        <td>
                          {dokument.datum}
                        </td>


                        <td>
                          {dokument.firma?.naziv}
                        </td>


                        <td>

                          <div className="action-buttons">

                            <button
                                className="edit-button"
                                onClick={() =>
                                    setDokumentZaIzmenu(
                                        dokument
                                    )
                                }
                            >
                              Izmeni
                            </button>


                            <button
                                className="delete-button"
                                onClick={() =>
                                    obrisiDokument(
                                        dokument.idDokumenta
                                    )
                                }
                            >
                              Obriši
                            </button>

                          </div>

                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>


              {/* MODAL ZA IZMENU DOKUMENTA */}

              {dokumentZaIzmenu && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      <h3>
                        Izmena dokumenta
                      </h3>


                      <div className="form-grid">


                        <div className="form-group">

                          <label>
                            Naziv dokumenta
                          </label>

                          <input
                              value={dokumentZaIzmenu.naziv}
                              onChange={e =>
                                  setDokumentZaIzmenu({
                                    ...dokumentZaIzmenu,
                                    naziv: e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Tip dokumenta
                          </label>

                          <select
                              value={dokumentZaIzmenu.tip}
                              onChange={e =>
                                  setDokumentZaIzmenu({
                                    ...dokumentZaIzmenu,
                                    tip: e.target.value
                                  })
                              }
                          >

                            <option value="FAKTURA">
                              Faktura
                            </option>

                            <option value="UGOVOR">
                              Ugovor
                            </option>

                            <option value="OBRAZAC">
                              Obrazac
                            </option>

                            <option value="PREDRACUN">
                              Predračun
                            </option>

                            <option value="BANKARSKI_IZVOD">
                              Bankarski izvod
                            </option>

                            <option value="OTPREMNICA">
                              Otpremnica
                            </option>

                            <option value="POPISNA_LISTA">
                              Popisna lista
                            </option>

                            <option value="REVERS">
                              Revers
                            </option>

                            <option value="RESENJE">
                              Rešenje
                            </option>

                            <option value="PUTNI_NALOG">
                              Putni nalog
                            </option>

                            <option value="PORESKO_RESENJE">
                              Poresko rešenje
                            </option>

                          </select>

                        </div>


                        <div className="form-group">

                          <label>
                            Datum
                          </label>

                          <input
                              type="date"
                              value={dokumentZaIzmenu.datum}
                              onChange={e =>
                                  setDokumentZaIzmenu({
                                    ...dokumentZaIzmenu,
                                    datum: e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Firma
                          </label>

                          <select
                              value={
                                dokumentZaIzmenu
                                    .firma
                                    .idFirma
                              }
                              onChange={e =>
                                  setDokumentZaIzmenu({
                                    ...dokumentZaIzmenu,

                                    firma: {
                                      ...dokumentZaIzmenu.firma,

                                      idFirma:
                                          Number(
                                              e.target.value
                                          )
                                    }
                                  })
                              }
                          >

                            {firme.map(firma => (

                                <option
                                    key={firma.idFirma}
                                    value={firma.idFirma}
                                >
                                  {firma.naziv}
                                </option>

                            ))}

                          </select>

                        </div>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setDokumentZaIzmenu(null)
                            }
                        >
                          Otkaži
                        </button>


                        <button
                            className="primary-button"
                            onClick={izmeniDokument}
                        >
                          Sačuvaj izmene
                        </button>

                      </div>

                    </div>

                  </div>

              )}

            </section>

          </>

        )}


        {/* NAPOMENE */}

        {aktivnaStranica === "napomene" && (

          <>

            <div className="obaveze-page">

              <button
                  className="back-button"
                  onClick={() => otvoriStranicu("pocetna")}
              >
                ← Nazad na početnu
              </button>

              <div className="obaveze-title">

                <h2>
                  Napomene
                </h2>

                <p>
                  Pregled napomena povezanih sa firmama
                </p>

              </div>

            </div>


            {/* STATISTIKA NAPOMENA */}

            <section className="statistics">

              <div className="stat-card">

                <span>
                  Ukupno napomena
                </span>

                <strong>
                  {napomene.length}
                </strong>

              </div>

            </section>


            {/* NAPOMENE CARD */}

            <section className="card">

              <div className="section-header">

                <div>

                  <h3>
                    Registrovane napomene
                  </h3>

                  <p>
                    Pregled svih napomena po firmama
                  </p>

                </div>


                <div className="header-controls">

                  <select
                      className="filter-select"
                      value={napomeneFirmaFilter}
                      onChange={e =>
                          setNapomeneFirmaFilter(
                              e.target.value
                          )
                      }
                  >

                    <option value="">
                      Sve firme
                    </option>

                    {firme.map(firma => (

                        <option
                            key={firma.idFirma}
                            value={firma.idFirma}
                        >
                          {firma.naziv}
                        </option>

                    ))}

                  </select>


                  <button
                      className="primary-button"
                      onClick={() =>
                          setPrikaziFormuNapomene(
                              !prikaziFormuNapomene
                          )
                      }
                  >
                    + Dodaj napomenu
                  </button>

                </div>

              </div>


              {/* FORMA ZA DODAVANJE NAPOMENE */}

              {prikaziFormuNapomene && (

                  <div className="form-section">

                    <h3>
                      Dodavanje napomene
                    </h3>


                    <div className="form-grid">


                      <div className="form-group">

                        <label>
                          Firma
                          {greske["napomena.firma"] && !napomenaFirma && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <select
                            className={greske["napomena.firma"] && !napomenaFirma ? "polje-greska" : undefined}
                            value={napomenaFirma}
                            onChange={e =>
                                setNapomenaFirma(
                                    e.target.value
                                )
                            }
                        >

                          <option value="">
                            Izaberite firmu
                          </option>

                          {firme.map(firma => (

                              <option
                                  key={firma.idFirma}
                                  value={firma.idFirma}
                              >
                                {firma.naziv}
                              </option>

                          ))}

                        </select>

                      </div>


                      <div className="form-group">

                        <label>
                          Datum
                          {greske["napomena.datum"] && !napomenaDatum && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <div className="datum-polje">

                          <input
                              type="date"
                              className={
                                  greske["napomena.datum"] && !napomenaDatum
                                      ? "datum-prazan polje-greska"
                                      : napomenaDatum
                                          ? "datum-izabran"
                                          : "datum-prazan"
                              }
                              value={napomenaDatum}
                              onChange={e =>
                                  setNapomenaDatum(
                                      e.target.value
                                  )
                              }
                          />

                          {!napomenaDatum && (

                              <span className="datum-placeholder">
                                Unesite datum
                              </span>

                          )}

                        </div>

                      </div>


                      <div className="form-group form-group-full">

                        <label>
                          Tekst napomene
                          {greske["napomena.tekst"] && !napomenaTekst && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <textarea
                            className={greske["napomena.tekst"] && !napomenaTekst ? "polje-greska" : undefined}
                            value={napomenaTekst}
                            onChange={e =>
                                setNapomenaTekst(
                                    e.target.value
                                )
                            }
                            placeholder="Unesite tekst napomene..."
                        />

                      </div>

                    </div>


                    <div className="form-buttons">

                      <button
                          className="secondary-button"
                          onClick={() =>
                              setPrikaziFormuNapomene(false)
                          }
                      >
                        Otkaži
                      </button>


                      <button
                          className="primary-button"
                          onClick={dodajNapomenu}
                      >
                        Sačuvaj napomenu
                      </button>

                    </div>

                  </div>

              )}


              {/* TABELA NAPOMENA */}

              <div className="table-container">

                <table>

                  <thead>

                  <tr>

                    <th>
                      Firma
                    </th>

                    <th>
                      Datum
                    </th>

                    <th>
                      Napomena
                    </th>

                    <th>
                      Akcije
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {filtriraneNapomene.map(napomena => (

                      <tr
                          key={napomena.idNapomene}
                      >

                        <td>
                          {napomena.firma?.naziv}
                        </td>


                        <td>
                          {napomena.datum}
                        </td>


                        <td className="napomena-tekst">
                          {napomena.tekst}
                        </td>


                        <td>

                          <div className="action-buttons">

                            <button
                                className="edit-button"
                                onClick={() =>
                                    setNapomenaZaIzmenu(
                                        napomena
                                    )
                                }
                            >
                              Izmeni
                            </button>


                            <button
                                className="delete-button"
                                onClick={() =>
                                    obrisiNapomenu(
                                        napomena.idNapomene
                                    )
                                }
                            >
                              Obriši
                            </button>

                          </div>

                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>


              {/* MODAL ZA IZMENU NAPOMENE */}

              {napomenaZaIzmenu && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      <h3>
                        Izmena napomene
                      </h3>


                      <div className="form-grid">


                        <div className="form-group">

                          <label>
                            Firma
                          </label>

                          <select
                              value={
                                napomenaZaIzmenu
                                    .firma
                                    .idFirma
                              }
                              onChange={e =>
                                  setNapomenaZaIzmenu({
                                    ...napomenaZaIzmenu,

                                    firma: {
                                      ...napomenaZaIzmenu.firma,

                                      idFirma:
                                          Number(
                                              e.target.value
                                          )
                                    }
                                  })
                              }
                          >

                            {firme.map(firma => (

                                <option
                                    key={firma.idFirma}
                                    value={firma.idFirma}
                                >
                                  {firma.naziv}
                                </option>

                            ))}

                          </select>

                        </div>


                        <div className="form-group">

                          <label>
                            Datum
                          </label>

                          <input
                              type="date"
                              value={
                                napomenaZaIzmenu.datum
                              }
                              onChange={e =>
                                  setNapomenaZaIzmenu({
                                    ...napomenaZaIzmenu,

                                    datum:
                                        e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group form-group-full">

                          <label>
                            Tekst napomene
                          </label>

                          <textarea
                              value={
                                napomenaZaIzmenu.tekst
                              }
                              onChange={e =>
                                  setNapomenaZaIzmenu({
                                    ...napomenaZaIzmenu,

                                    tekst:
                                        e.target.value
                                  })
                              }
                          />

                        </div>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setNapomenaZaIzmenu(null)
                            }
                        >
                          Otkaži
                        </button>


                        <button
                            className="primary-button"
                            onClick={izmeniNapomenu}
                        >
                          Sačuvaj izmene
                        </button>

                      </div>

                    </div>

                  </div>

              )}

            </section>

          </>

        )}






        {/* AKTIVNOSTI */}

        {aktivnaStranica === "aktivnosti" && (

          <>

            <div className="obaveze-page">

              <button
                  className="back-button"
                  onClick={() => otvoriStranicu("pocetna")}
              >
                ← Nazad na početnu
              </button>

              <div className="obaveze-title">

                <h2>
                  Aktivnosti
                </h2>

                <p>
                  Evidencija aktivnosti korisnika u sistemu
                </p>

              </div>

            </div>


            {/* STATISTIKA AKTIVNOSTI */}

            <section className="statistics">

              <div className="stat-card">

                <span>
                  Ukupno aktivnosti
                </span>

                <strong>
                  {aktivnosti.length}
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Današnje aktivnosti
                </span>

                <strong>
                  {
                    aktivnosti.filter(
                        a => a.datum.slice(0, 10) === danas
                    ).length
                  }
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Aktivni korisnici
                </span>

                <strong>
                  {
                    new Set(
                        aktivnosti.map(a => a.korisnik)
                    ).size
                  }
                </strong>

              </div>

            </section>


            {/* AKTIVNOSTI CARD */}

            <section className="card">

              <div className="section-header">

                <div>

                  <h3>
                    Evidencija aktivnosti
                  </h3>

                  <p>
                    Svako dodavanje, izmena i brisanje podataka
                  </p>

                </div>


                <div className="header-controls">

                  <div className="search-container">

                    <span className="search-icon">
                      ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Pretraga po korisniku ili aktivnosti..."
                        value={pretragaAktivnosti}
                        onChange={e =>
                            setPretragaAktivnosti(e.target.value)
                        }
                    />

                  </div>

                </div>

              </div>


              <div className="table-container">

                <table>

                  <thead>

                  <tr>

                    <th>
                      Datum i vreme
                    </th>

                    <th>
                      Korisnik
                    </th>

                    <th>
                      Aktivnost
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {filtriraneAktivnosti.map(aktivnost => (

                      <tr key={aktivnost.idLog}>

                        <td>
                          {formatirajVreme(aktivnost.datum)}
                        </td>


                        <td>

                          <strong>
                            {aktivnost.korisnik}
                          </strong>

                        </td>


                        <td>
                          {aktivnost.akcija}
                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>

            </section>

          </>

        )}



        {/* KORISNICI (samo ADMIN) */}

        {aktivnaStranica === "korisnici" && prijavljeniKorisnik.role === "ADMIN" && (

          <>

            <div className="obaveze-page">

              <button
                  className="back-button"
                  onClick={() => otvoriStranicu("pocetna")}
              >
                ← Nazad na početnu
              </button>

              <div className="obaveze-title">

                <h2>
                  Korisnici
                </h2>

                <p>
                  Upravljanje nalozima i ulogama
                </p>

              </div>

            </div>


            {/* STATISTIKA KORISNIKA */}

            <section className="statistics">

              <div className="stat-card">

                <span>
                  Ukupno korisnika
                </span>

                <strong>
                  {korisnici.length}
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Administratori
                </span>

                <strong>
                  {korisnici.filter(k => k.role === "ADMIN").length}
                </strong>

              </div>


              <div className="stat-card">

                <span>
                  Zaposleni
                </span>

                <strong>
                  {korisnici.filter(k => k.role === "EMPLOYEE").length}
                </strong>

              </div>

            </section>


            {/* KORISNICI CARD */}

            <section className="card">

              <div className="section-header">

                <div>

                  <h3>
                    Registrovani korisnici
                  </h3>

                  <p>
                    Dodavanje, izmena i brisanje naloga
                  </p>

                </div>


                <div className="header-controls">

                  <button
                      className="primary-button"
                      onClick={() =>
                          setPrikaziFormuKorisnika(!prikaziFormuKorisnika)
                      }
                  >
                    + Dodaj korisnika
                  </button>

                </div>

              </div>


              {/* FORMA ZA DODAVANJE KORISNIKA */}

              {prikaziFormuKorisnika && (

                  <div className="form-section">

                    <div className="form-grid">

                      <div className="form-group">

                        <label>
                          Korisničko ime
                          {greske["korisnik.username"] && !korisnikUsername && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <input
                            className={greske["korisnik.username"] && !korisnikUsername ? "polje-greska" : undefined}
                            value={korisnikUsername}
                            onChange={e => setKorisnikUsername(e.target.value)}
                            placeholder="npr. marko"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Lozinka
                          {greske["korisnik.lozinka"] && !korisnikLozinka && (
                            <span className="zvezda-greska">*</span>
                          )}
                        </label>

                        <input
                            type="password"
                            className={greske["korisnik.lozinka"] && !korisnikLozinka ? "polje-greska" : undefined}
                            value={korisnikLozinka}
                            onChange={e => setKorisnikLozinka(e.target.value)}
                            placeholder="Početna lozinka"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Uloga
                        </label>

                        <select
                            value={korisnikUloga}
                            onChange={e => setKorisnikUloga(e.target.value)}
                        >

                          <option value="EMPLOYEE">
                            Zaposleni
                          </option>

                          <option value="ADMIN">
                            Administrator
                          </option>

                        </select>

                      </div>

                    </div>


                    <div className="form-buttons">

                      <button
                          className="secondary-button"
                          onClick={() => setPrikaziFormuKorisnika(false)}
                      >
                        Otkaži
                      </button>


                      <button
                          className="primary-button"
                          onClick={dodajKorisnika}
                      >
                        Sačuvaj korisnika
                      </button>

                    </div>

                  </div>

              )}


              {/* TABELA KORISNIKA */}

              <div className="table-container">

                <table>

                  <thead>

                  <tr>

                    <th>
                      Korisničko ime
                    </th>

                    <th>
                      Uloga
                    </th>

                    <th>
                      Akcije
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {korisnici.map(korisnik => (

                      <tr key={korisnik.idUser}>

                        <td>
                          <strong>
                            {korisnik.username}
                          </strong>

                          {korisnik.username === prijavljeniKorisnik.username && (
                              <small className="vi-ste">
                                (vi)
                              </small>
                          )}
                        </td>


                        <td>

                          <span
                              className={
                                korisnik.role === "ADMIN"
                                  ? "uloga-admin"
                                  : "uloga-zaposleni"
                              }
                          >
                            {korisnik.role === "ADMIN"
                              ? "Administrator"
                              : "Zaposleni"}
                          </span>

                        </td>


                        <td>

                          <div className="action-buttons">

                            <button
                                className="edit-button"
                                onClick={() => {
                                  setKorisnikZaIzmenu(korisnik);
                                }}
                            >
                              Izmeni
                            </button>


                            <button
                                className="delete-button"
                                onClick={() => obrisiKorisnika(korisnik.idUser)}
                            >
                              Obriši
                            </button>

                          </div>

                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>


              {/* MODAL ZA IZMENU KORISNIKA */}

              {korisnikZaIzmenu && (

                  <div className="edit-obaveza-overlay">

                    <div className="edit-obaveza-modal">

                      <h3>
                        Izmena korisnika
                      </h3>


                      <div className="form-grid">

                        <div className="form-group">

                          <label>
                            Korisničko ime
                          </label>

                          <input
                              value={korisnikZaIzmenu.username}
                              onChange={e =>
                                  setKorisnikZaIzmenu({
                                    ...korisnikZaIzmenu,
                                    username: e.target.value
                                  })
                              }
                          />

                        </div>


                        <div className="form-group">

                          <label>
                            Uloga
                          </label>

                          <select
                              value={korisnikZaIzmenu.role}
                              onChange={e =>
                                  setKorisnikZaIzmenu({
                                    ...korisnikZaIzmenu,
                                    role: e.target.value
                                  })
                              }
                          >

                            <option value="EMPLOYEE">
                              Zaposleni
                            </option>

                            <option value="ADMIN">
                              Administrator
                            </option>

                          </select>

                        </div>

                      </div>


                      <div className="form-buttons">

                        <button
                            className="secondary-button"
                            onClick={() => setKorisnikZaIzmenu(null)}
                        >
                          Otkaži
                        </button>


                        <button
                            className="primary-button"
                            onClick={izmeniKorisnika}
                        >
                          Sačuvaj izmene
                        </button>

                      </div>

                    </div>

                  </div>

              )}

            </section>

          </>

        )}


        {/* MODAL ZA PROMENU LIČNE LOZINKE */}

        {promenaLozinkeOtvoreno && (

            <div className="edit-obaveza-overlay">

              <div className="edit-obaveza-modal">

                <h3>
                  Promena lozinke
                </h3>


                {lozinkaGreska && (
                    <p className="login-greska">
                      {lozinkaGreska}
                    </p>
                )}


                <div className="form-grid">

                  <div className="form-group form-group-full">

                    <label>
                      Trenutna lozinka
                      {lozinkaGreskaPolja.includes("trenutna") && (
                          <span className="zvezda-greska">*</span>
                      )}
                    </label>

                    <input
                        type="password"
                        value={trenutnaLozinka}
                        onChange={e => setTrenutnaLozinka(e.target.value)}
                        className={
                          lozinkaGreskaPolja.includes("trenutna")
                            ? "polje-greska"
                            : undefined
                        }
                    />

                  </div>


                  <div className="form-group form-group-full">

                    <label>
                      Nova lozinka
                      {lozinkaGreskaPolja.includes("nova") && (
                          <span className="zvezda-greska">*</span>
                      )}
                    </label>

                    <input
                        type="password"
                        value={novaLicnaLozinka}
                        onChange={e => setNovaLicnaLozinka(e.target.value)}
                        className={
                          lozinkaGreskaPolja.includes("nova")
                            ? "polje-greska"
                            : undefined
                        }
                    />

                  </div>


                  <div className="form-group form-group-full">

                    <label>
                      Potvrda nove lozinke
                      {lozinkaGreskaPolja.includes("potvrda") && (
                          <span className="zvezda-greska">*</span>
                      )}
                    </label>

                    <input
                        type="password"
                        value={potvrdaLozinke}
                        onChange={e => setPotvrdaLozinke(e.target.value)}
                        className={
                          lozinkaGreskaPolja.includes("potvrda")
                            ? "polje-greska"
                            : undefined
                        }
                    />

                  </div>

                </div>


                <div className="form-buttons">

                  <button
                      className="secondary-button"
                      onClick={() => setPromenaLozinkeOtvoreno(false)}
                  >
                    Otkaži
                  </button>


                  <button
                      className="primary-button"
                      onClick={promeniLozinku}
                  >
                    Sačuvaj lozinku
                  </button>

                </div>

              </div>

            </div>

        )}


      </main>

    </div>
  );
}

export default App;
