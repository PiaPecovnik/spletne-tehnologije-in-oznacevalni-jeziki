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

class Program {
  static zagon() {
    try {
      let film1 = new Film("f1", "o1", ["f11", "f12"], 2, "s1");
      let film2 = new Film("f2", "o2", ["f21", "f22"], 2, "s2");
      let film3 = new Film("f3", "o3", ["f31", "f32"], 3, "s3");

      addElement(film1);
      seznamFilmov.dodaj(film1);
      addElement(film2);
      seznamFilmov.dodaj(film2);
      addElement(film3);
      seznamFilmov.dodaj(film3);
    } catch (error) {
      console.error(error);
    }
  }

  /* === jQueryUI === */
  static pripraviDialogHTML() {
    $(".film-dodan-uspeh").hide();

    let dialog = $("#obrazec").dialog({
      autoOpen: false,
      height: 850,
      width: 900,
      modal: true,
      buttons: {
        "Dodaj Film": function () {
          $("#obrazec").submit();
        },
        Cancel: function () {
          dialog.dialog("close");
          $("#obrazec")[0].reset();
        },
      },
      open: function (event, ui) {
        $("#obrazec").css({ backgroundColor: "lightGray", padding: 20 });
        $(".ui-dialog-titlebar-close").hide();
      },
    });

    this.submitListener();

    $("#dodaj-film").on("click", function () {
      dialog.dialog("open");
    });
  }

  static submitListener() {
    $("#obrazec").on("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(this);

      // Pridobimo vrednosti iz polj
      let naslovFilma = formData.get("naslov");
      let opisFilma = formData.get("opis");
      let igralci = formData.get("igralec");
      let ocenaFilma = formData.get("ocena");
      let urlSlikeFilma = formData.get("slika"); // oz. URL

      // Izvedemo validacijo polj

      // Preverimo, da so naslov, opis in url daljši od 10 znakov - 11, 12, 13, 14, itd.
      if (
        naslovFilma.length < 11 ||
        opisFilma.length < 11 ||
        urlSlikeFilma.length < 11
      ) {
        $(".film-dodan-napaka").text(
          "NAPAKA pri dodaji filma! Preverjanje dolzine naslova, opisa in url-ja neuspesno!",
        );

        $(this)[0].reset();
        $("#obrazec").dialog("close");
        return false;
      }

      // Za naslov uporabimo obstojec regex - ce ni resnicen naredimo izhod
      const regex = /^[A-Za-zČčŠšŽž ]+$/; // Regularni izraz za preverjanje naslova
      if (regex.test(naslovFilma) == false) {
        $(".film-dodan-napaka").text(
          "NAPAKA pri dodaji filma! Preverjanje naslova neuspesno!",
        );

        $(this)[0].reset();
        $("#obrazec").dialog("close");
        return false;
      }

      let novFilm = new Film(
        naslovFilma,
        opisFilma,
        igralci.split("\n"),
        ocenaFilma,
        urlSlikeFilma,
      );

      $(this)[0].reset();
      addElement(novFilm);
      seznamFilmov.dodaj(novFilm);

      $("#obrazec").dialog("close");

      $(".film-dodan-uspeh").show();
      $(".film-dodan-napaka").text("");
      setTimeout(() => {
        $(".film-dodan-uspeh").hide();
      }, 3000);
    });
  }
}

//Program.zagon();
Program.pripraviDialogHTML();

// NALOGA: Spletne storitve
// 1. Tocka - Spraznemo tabelo
const table = $("aside table").empty();

// 2. Tocka - Dodamo thead aka table head aka glavo oz. stolpce tabele
const thead = $("<thead>");
const tr = $("<tr>");
const thFilm = $("<th>").text("Film");
const thOpis = $("<th>").text("Opis");
const thOcena = $("<th>").text("Ocena");
const thMoznosti = $("<th>").text("Možnosti");

tr.append(thFilm);
tr.append(thOpis);
tr.append(thOcena);
tr.append(thMoznosti);
thead.append(tr);
table.append(thead);

// 3. Tocka - Fetch aka dobimo podatke filmov iz streznika TMDB
async function dobimoFilme() {
  const url =
    "https://api.themoviedb.org/3/movie/now_playing?api_key=789ddcb6a3e2c6357bb14ea321599aaa&language=en-US&page=1";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

// 6. Tocka - Fetch aka dobimo podatke zvrsti iz streznika TMDB
async function dobimoZvrsti() {
  const url =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=789ddcb6a3e2c6357bb14ea321599aaa&language=en-US";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

let vsiFilmi = [];

function shraniFilmVLokalnoShrambo(idFilma) {
  const najdenFilm = vsiFilmi.find((film) => film.id === idFilma);

  if (najdenFilm != null) {
    // Preberemo obstoječe filme iz lokalne shrambe
    let obstojeciFilmi = JSON.parse(localStorage.getItem("filmiLS") || "[]");

    // Preverimo, da se film ni shranjen - duplikati
    const jeZeShranjen = obstojeciFilmi.some((film) => film.id === idFilma);
    if (jeZeShranjen) {
      alert("Že obstaja!");
    } else {
      obstojeciFilmi.push(najdenFilm);
    }

    // Shranimo nazaj kot JSON string
    localStorage.setItem("filmiLS", JSON.stringify(obstojeciFilmi));
  }

  // Osvezimo seznam
  $("#seznam-priljubljenih").remove();
  ustvariSeznamPriljubljenih();
}

// 5., 6. in 7. Tocka - Iteriramo crez filme. Uporabimo .find() metodo za iskanje zvrsti filma v "zvrstiFilmov" tabeli. Nastavimo Bootstrap classe glede na "vote_average" spremenljivko
async function vstaviFilmeVTabelo() {
  const filmiIzTMDB = await dobimoFilme();
  const zvrstiFilmov = await dobimoZvrsti();

  filmiIzTMDB.results.forEach((film) => {
    vsiFilmi.push(film); // Dodamo film v globalno tabelo filmov

    const bodyTr = $("<tr>");
    const tdFilm = $("<td>").text(film.title);
    const tdOpis = $("<td>").text(film.overview);
    const tdOcena = $("<td>");
    const tdMoznosti = $("<td>");

    if (film.vote_average != null) {
      tdOcena.text(film.vote_average);

      // Ocena obstaja - nastavimo bootstrap razred na <tr> element
      bodyTr.addClass("bg-success");
    } else {
      tdOcena.text("N/A");

      // Ocena NE obstaja - nastavimo bootstrap razred na <tr> element
      bodyTr.addClass("bg-warning");
    }

    // Gremo skozi tabelo zvrsti(genre aka zanr) in jih dodamo v title attribut
    let najdeneZvrsti = [];
    film.genre_ids.forEach((genreID) => {
      const najdenaZvrst = zvrstiFilmov.genres.find(
        (element) => element.id === genreID,
      );

      if (najdenaZvrst) {
        najdeneZvrsti.push(najdenaZvrst.name);
      } else {
        najdeneZvrsti.push("Zvrst ni opredeljena.");
      }
    });

    // Zdruzimo vse vrednosti v najdenih zvrsteh v obliko "Action in Drama in itd."
    const titleBesedilo = najdeneZvrsti.join(" in ");
    bodyTr.attr("title", titleBesedilo);

    // Za vsako vrstico v tabeli dodajte gumb "+" v stolpec Moznosti
    const gumb = $("<button>")
      .attr("data-id", film.id)
      .text("+")
      .addClass("btn btn-light")
      .click(() => shraniFilmVLokalnoShrambo(film.id));

    tdMoznosti.append(gumb);

    bodyTr.append(tdFilm);
    bodyTr.append(tdOpis);
    bodyTr.append(tdOcena);
    bodyTr.append(tdMoznosti);

    table.append(bodyTr);
  });
}

function ustvariSeznamPriljubljenih() {
  const aside = $("aside");

  const div = $("<div>").addClass("card").attr("id", "seznam-priljubljenih");
  const divCardHeader = $("<div>")
    .addClass("card-header")
    .text("Seznam Priljubljenih");
  const ul = $("<ul>").addClass("list-group list-group-flush");

  // Dobimo filme iz localStorage
  const shranjeniFilmi = JSON.parse(localStorage.getItem("filmiLS") || "[]");

  shranjeniFilmi.forEach((film) => {
    const li = $("<li>")
      .addClass("list-group-item")
      .text(film.title)
      .css("cursor", "pointer")
      .click(() => {
        if (confirm("Želite izbrisati zapis?")) {
          odstraniFilmIzShrambe(film.id);
        }
      });

    ul.append(li);
  });

  div.append(divCardHeader);
  div.append(ul);
  aside.prepend(div);
}

function odstraniFilmIzShrambe(idFilma) {
  let shranjeniFilmi = JSON.parse(localStorage.getItem("filmiLS") || "[]");

  // Dobimo shranjen film
  shranjeniFilmi = shranjeniFilmi.filter((film) => film.id !== idFilma);

  localStorage.setItem("filmiLS", JSON.stringify(shranjeniFilmi));

  // Osvezimo seznam
  $("#seznam-priljubljenih").remove();
  ustvariSeznamPriljubljenih();
}

vstaviFilmeVTabelo();
ustvariSeznamPriljubljenih();
