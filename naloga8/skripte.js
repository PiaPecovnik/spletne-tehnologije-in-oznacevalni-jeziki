class Film {
  naziv = "";
  opis = "";
  igralci = [];
  ocena = 0;
  slika = "";

  constructor(naziv, opis, igralci, ocena, slika) {
    this.naziv = naziv;
    this.opis = opis;
    this.igralci = igralci;
    this.ocena = parseFloat(ocena).toFixed(1);
    this.slika = slika;
  }

  IzpisNaslova() {
    return this.naziv;
  }
  IzpisOcene() {
    return this.ocena.toString();
  }
  VrniIgralce() {
    return this.igralci;
  }
  IzpisPodrobnosti() {
    return this.opis;
  }
}

class SeznamFilmov {
  filmi = [];

  dodaj(film) {
    if (film instanceof Film) {
      this.filmi.push(film);
    } else {
      console.error("NAPAKA! Dodan objekt ni primerek razreda Film.");
    }
  }

  izpisi() {
    this.filmi.forEach((film) => {
      console.log(film.IzpisPodrobnosti());
    });
  }

  brisi(index, obrazecRef, divRef) {
    if (typeof index === "number" && index >= 0 && index < this.filmi.length) {
      this.filmi.splice(index, 1);
      obrazecRef.removeChild(divRef);
    } else {
      console.error("NAPAKA! Parameter ni število ali index ni pravilen.");
    }
  }

  isciPoIgralcu(delnoImeIgralca) {
    let filmiZIgralcem = [];

    let imeIgralca = delnoImeIgralca.toLowerCase();
    for (let i = 0; i < this.filmi.length; i++) {
      let film = this.filmi[i];
      for (let j = 0; j < film.igralci.length; j++) {
        let igralec = film.igralci[j].toLowerCase();
        if (igralec.includes(imeIgralca)) {
          filmiZIgralcem.push(film);
          break;
        }
      }
    }

    return filmiZIgralcem;
  }

  isciPoNaslovu(naslovFilma) {
    for (let i = 0; i < this.filmi.length; i++) {
      if (this.filmi[i].naziv === naslovFilma) {
        return i;
      }
    }
  }
}

let seznamFilmov = new SeznamFilmov();

// Ko se dokument naloži, nastavite ustrezni dogodek za drsnik, ki prikazuje trenutno izbrano oceno filma
let ocenaSlider = document.getElementById("ocena");
let ocenaPrikaz = document.getElementById("ocena-prikaz");

ocenaSlider.onchange = function () {
  // onChange - se izvede/posodobi ko je "konec"
  ocenaPrikaz.textContent = "Ocena: " + ocenaSlider.value;
};

/*
ocenaSlider.addEventListener("input", function () {             // eventListener - se posodablja sproti ko se izvaja akcija
  ocenaPrikaz.textContent = "Ocena: " + ocenaSlider.value;
});
*/

// Na podlagi ustvarjenega objekta ustvarite nov element HTML s spodaj definirano strukturo in ga dodajte v DOM (tj. vozlišče znotraj elementa SECTION, ki predstavlja filme).

function addElement(novFilm) {
  let filmiSection = document.getElementById("Filmi");

  const prviDiv = document.createElement("div");
  prviDiv.classList = "list-group";

  const prviA = document.createElement("a");
  prviA.setAttribute("href", "#");
  prviA.classList = "list-group-item list-group-item-action";
  prviDiv.appendChild(prviA);

  const drugiDiv = document.createElement("div");
  drugiDiv.classList = "d-flex w-100 justify-content-between";
  prviA.appendChild(drugiDiv);

  const h5 = document.createElement("h5");
  h5.classList = "mb-1";
  const h5Text = document.createTextNode(novFilm.IzpisNaslova());
  h5.appendChild(h5Text);

  drugiDiv.appendChild(h5);
  const prviSmall = document.createElement("small");
  const prviSmallText = document.createTextNode(
    "Ocena: " + novFilm.IzpisOcene(),
  );
  prviSmall.appendChild(prviSmallText);
  drugiDiv.appendChild(prviSmall);

  const p = document.createElement("p");
  p.classList = "mb-1";
  const pText = document.createTextNode(
    "Opis filma: " + novFilm.IzpisPodrobnosti(),
  );
  p.appendChild(pText);

  prviA.appendChild(p);

  const drugiSmall = document.createElement("small");
  prviA.appendChild(drugiSmall);
  const ul = document.createElement("ul");
  drugiSmall.appendChild(ul);

  const igralciArr = novFilm.VrniIgralce();
  for (let i = 0; i < igralciArr.length; i++) {
    const li = document.createElement("li");
    const liText = document.createTextNode(igralciArr[i]);
    li.appendChild(liText);
    ul.appendChild(li);
  }

  const drugiA = document.createElement("a");
  drugiA.setAttribute("href", "#");
  drugiA.classList = "btn btn-danger";
  const drugiAText = document.createTextNode("Izbriši film");
  drugiA.appendChild(drugiAText);
  prviDiv.appendChild(drugiA);

  const novImg = document.createElement("img");
  novImg.setAttribute("src", "#");
  novImg.classList = "img-fluid img-thumbnail";
  prviDiv.appendChild(novImg);

  filmiSection.appendChild(prviDiv);

  // Gumb Izbriši film naj ima poslušalca dogodkov, ki ob kliku, pokliče ustrezno funkcijo brisi() razreda, ki predstavlja seznam filmov.
  // Funkcijo brisi() popravite tako, da odstranite celotni element <div class="list-group">, ki predstavlja film, ki ga želite izbrisati.
  drugiA.addEventListener("click", function (event) {
    event.preventDefault();
    const naslov = novFilm.IzpisNaslova();
    const filmIndex = seznamFilmov.isciPoNaslovu(naslov);

    seznamFilmov.brisi(filmIndex, filmiSection, prviDiv);
  });
}

// Ob kliku na gumb Dodaj, naj se obrazec potrdi  +  Ob potrditvi se ustvari nova instanca razreda Film z vrednostmi iz vnosnih polj.
let obrazec = document.getElementById("obrazec");
obrazec.addEventListener("submit", function (e) {
  e.preventDefault();

  var formData = new FormData(obrazec);

  let naslovFilma = formData.get("naslov");
  let opisFilma = formData.get("opis");
  let igralci = formData.get("igralec");
  let ocenaFilma = formData.get("ocena");
  let slikaFilma = formData.get("slika");

  let novFilm = new Film(
    naslovFilma,
    opisFilma,
    igralci.split("\n"), // Vrednost elementa, ki predstavlja igralce, razdelite s pomočjo metode split() po novi vrstici (\n) + igralce shraniš v ustrezno lastnost v razredu film.
    ocenaFilma,
    slikaFilma,
  );

  obrazec.reset(); // Ob potrditvi obrazca, kot tudi ob kliku na gumb Ponastavi, se naj obrazec ponastavi.
  addElement(novFilm);
  seznamFilmov.dodaj(novFilm);
  console.log(JSON.stringify(seznamFilmov));
});
