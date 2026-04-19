class Film {
  naziv: string = "";
  opis: string = "";
  igralci: Array<string> = [];
  ocena: number = 0;
  slika: string = "";

  constructor(
    naziv: string,
    opis: string,
    igralci: Array<string>,
    ocena: number,
    slika: string,
  ) {
    this.naziv = naziv;
    this.opis = opis;
    this.igralci = igralci;
    this.ocena = Number(ocena.toFixed(1));
    this.slika = slika;
  }

  IzpisNaslova(): string {
    return this.naziv + " \t " + this.ocena;
  }

  IzpisPodrobnosti(): string {
    return (
      "Opis filma " +
      this.naziv +
      "(" +
      this.ocena +
      "):" +
      this.opis +
      ". Igrajo: " +
      this.igralci.join(";")
    );
  }
}

class SeznamFilmov {
  filmi: Array<Film> = [];

  dodaj(film: any): void {
    if (film instanceof Film) {
      this.filmi.push(film);
    } else {
      console.error("NAPAKA! Dodan objekt ni primerek razreda Film.");
    }
  }

  izpisi(): void {
    this.filmi.forEach((film) => {
      console.log(film.IzpisPodrobnosti());
    });

    /*
    for (const film of this.filmi) {
      console.log(film.IzpisPodrobnosti());
    }
      */
  }

  brisi(index: number): void {
    if (typeof index === "number" && index >= 0 && index < this.filmi.length) {
      this.filmi.splice(index, 1);
    } else {
      console.error("NAPAKA! Parameter ni število ali index ni pravilen.");
    }
  }

  isciPoIgralcu(delnoImeIgralca: string): Array<Film> {
    let filmiZIgralcem: Array<Film> = [];

    let imeIgralca: string = delnoImeIgralca.toLowerCase();
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
}

class Program {
  static zagon(): void {
    try {
      let film1 = new Film("f1", "o1", ["f11", "f12"], 2, "s1");
      let film2 = new Film("f2", "o2", ["f21", "f22"], 2, "s2");
      let film3 = new Film("f3", "o3", ["f31", "f32"], 3, "s3");
      let seznamFilomv = new SeznamFilmov();

      console.log("Dodaja 1, 2");
      seznamFilomv.dodaj(film1);
      seznamFilomv.dodaj(film2);
      seznamFilomv.izpisi();
      console.log("Brisi 2");
      seznamFilomv.brisi(1);
      seznamFilomv.izpisi();
      console.log("Dodaja 3");
      seznamFilomv.dodaj(film3);
      seznamFilomv.izpisi();
      console.log("Igralci");
      let arrFilmov = seznamFilomv.isciPoIgralcu("f11");
      arrFilmov.forEach((film) => {
        console.log(film.IzpisPodrobnosti());
      });
    } catch (error) {
      console.error(error);
    }
  }
}

Program.zagon();
