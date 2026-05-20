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
    return this.naziv + "\t" + this.ocena;
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
    let imeIgralca = delnoImeIgralca.toLowerCase().trim();

    // Iteriramo čez vsak film-div v sekciji #Filmi
    $("#Filmi .list-group").each(function () {
      let filmDiv = $(this);
      let najden = false;

      // Pregledamo vse <li> elemente znotraj tega film-diva (to so igralci)
      filmDiv.find("ul li").each(function () {
        let imeVSeznamu = $(this).text().toLowerCase();
        if (imeVSeznamu.includes(imeIgralca)) {
          najden = true;
          return false;
        }
      });

      if (najden) {
        filmDiv.show();
      } else {
        filmDiv.hide();
      }
    });
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

// onChange - se izvede/posodobi ko je "konec"
ocenaSlider.onchange = function () {
  ocenaPrikaz.textContent = "Ocena: " + ocenaSlider.value;
};

// 1. Tocka
$(document).ready(function () {
  //brisanje a elem. v nav
  $("#Navigacija a").empty();
});

// 2. Tocka
// Na podlagi ustvarjenega objekta ustvarite nov element HTML s spodaj definirano strukturo in ga dodajte v DOM (tj. vozlišče znotraj elementa SECTION, ki predstavlja filme).
function addElement(novFilm) {
  let filmiSection = $("#Filmi");

  const danes = new Date(); // Inicializiram objekt tipa Date
  let filmId = novFilm.naziv.toLowerCase().replace(/\s+/g, "-"); //vzames naslov pa ga spremenis v "obliko" ID-ja
  filmId = filmId + danes.getTime(); // Zdruzim Naslov + Timestamp = ID

  const prviDiv = $("<div>").addClass("list-group").attr("id", filmId); //dodas se attr ID p anot vstavs prej spremenjeno/ustvarjeno besedilo/spremenljivko

  const prviA = $("<a>")
    .attr("href", "#")
    .addClass("list-group-item list-group-item-action");
  prviDiv.append(prviA);

  const drugiDiv = $("<div>").addClass("d-flex w-100 justify-content-between");
  prviA.append(drugiDiv);

  const h5 = $("<h5>").addClass("mb-1").text(novFilm.IzpisNaslova());

  drugiDiv.appendTo(h5);
  const prviSmall = $("<small>").text("Ocena: " + novFilm.IzpisOcene());
  drugiDiv.append(prviSmall);

  const p = $("<p>")
    .addClass("mb-1")
    .text("Opis filma: " + novFilm.IzpisPodrobnosti());

  prviA.append(p);

  const drugiSmall = $("<small>");
  prviA.append(drugiSmall);
  const ul = $("<ul>");
  drugiSmall.append(ul);

  const igralciArr = novFilm.VrniIgralce();
  for (let i = 0; i < igralciArr.length; i++) {
    const li = $("<li>").text(igralciArr[i]);

    ul.append(li);
  }

  const drugiA = $("<a>")
    .attr("href", "#")
    .addClass("btn btn-danger")
    .text("Izbriši film");
  prviDiv.append(drugiA);

  const novImg = $("<img>")
    .attr("src", "#")
    .addClass("img-fluid img-thumbnail");
  prviDiv.append(novImg);

  filmiSection.append(prviDiv);

  const aVNav = $("<a>") //dodamo <a> v nav
    .attr("href", "#" + filmId)
    .addClass("nav-link")
    .text(novFilm.IzpisNaslova());

  $("#Navigacija div div div ul").append($("<li>").append(aVNav)); //gre po dedovanju iz nav do ol, ter na njega deduje nov element li, v katerem je dedovan aVNav

  // Gumb Izbriši film naj ima poslušalca dogodkov, ki ob kliku, pokliče ustrezno funkcijo brisi() razreda, ki predstavlja seznam filmov.
  // Funkcijo brisi() popravite tako, da odstranite celotni element <div class="list-group">, ki predstavlja film, ki ga želite izbrisati.
  drugiA.click(function (event) {
    event.preventDefault();
    const naslov = novFilm.naziv; // rabis samo naziv, ne pa naziv+ocena -> ne uporabis IzpisNaslova()
    const filmIndex = seznamFilmov.isciPoNaslovu(naslov);

    aVNav.closest("li").remove(); // odstrans tut element V nav, da ne ostane prazen element

    seznamFilmov.brisi(filmIndex, filmiSection[0], prviDiv[0]);
  });
}

// 3. Tocka
// dodajanje vnosnega polja in gumba
const iskalniObrazec = $("<form>")
  .addClass("d-flex nav-search-form")
  .attr("id", "iskanje-obrazec");

const iskalnoPolje = $("<input>")
  .addClass("form-control me-2")
  .attr("type", "search")
  .attr("id", "iskanje-input")
  .attr("placeholder", "Išči po igralcih...")
  .attr("aria-label", "Iskanje");

const iskalniGumb = $("<button>")
  .addClass("btn btn-outline-light")
  .attr("type", "submit")
  .text("Iskanje");

iskalniObrazec.append(iskalnoPolje);
iskalniObrazec.append(iskalniGumb);

$("#Navigacija").append(iskalniObrazec);

iskalniObrazec.on("submit", function (e) {
  e.preventDefault();
  const iskalniNiz = iskalnoPolje.val();
  seznamFilmov.isciPoIgralcu(iskalniNiz);
});

const ponastaviGumb = $("<button>")
  .addClass("btn btn-outline-secondary btn-sm")
  .attr("type", "button")
  .attr("id", "ponastavi-iskanje")
  .text("Prikaži vse");

$("#Navigacija").append(ponastaviGumb);

ponastaviGumb.on("click", function () {
  $("#Filmi .list-group").show();
  iskalnoPolje.val("");
});

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
});
