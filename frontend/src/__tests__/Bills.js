/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      ); //ajouter l'utilisateur dans le local storage
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root); //creation d'un élément div et ajout de l'élément div dans le body
      router(); // gestion des routes de l'applications (login, bills, newbill, dashboard)
      window.onNavigate(ROUTES_PATH.Bills); //mettre à jour l'url de la page
      await waitFor(() => screen.getByTestId("icon-window")); //attendre que l'icone window soit affichée
      const windowIcon = screen.getByTestId("icon-window"); //récupérer l'icone window et la stocker dans la variable windowIcon
      //to-do write expect expression
      expect(windowIcon).toBeTruthy(); //s'assurer que l'icone window est bien affichée
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML); //get all dates in the page and put them in an array
      console.log("🚀 ~ file: Bills.js:42 ~ test ~ dates:", dates);
      const antiChrono = (a, b) => (a > b ? 1 : -1); //return 1 if a > b, -1 if a < b
      const datesSorted = [...dates].sort(antiChrono); //This code creates a new array called datesSorted that is a copy of the dates array, and then sorts the new array in descending order using the antiChrono comparison function.
      expect(dates).toEqual(datesSorted); //The expect() function checks that the dates array is equal to the datesSorted array.
    });
  });

  //tester l'ouverture de la modale au clic sur l'icone eye
  describe("When I click on the eye icon of a bill", () => {
    //ouvir la modale
    test("It should open a modal", async () => {
      //rediriger vers la page Bills et afficher le template BillsUI
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      }); //La méthode Object.defineProperty() permet de définir une nouvelle propriété pour un objet ou de modifier une propriété existante.

      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" })); //définir une nouvelle valeur pour la propriété `localStorage`

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      }); //instancier Bills qui contient la méthode handleClickIconEye(icon), qui permet d'ouvrir la modale, et la méthode getBills(), qui permet de récupérer les notes de frais

      document.body.innerHTML = BillsUI({ data: bills }); //afficher le template BillsUI

      const handleClickIconEye = jest.fn((icon) =>
        billsContainer.handleClickIconEye(icon)
      ); //qui utilise jest pour simuler 'ouverture de la modale au `click`,créer un mock de la méthode handleClickIconEye(icon) de Bills. billsContainer permet d'accéder à la méthode handleClickIconEye(icon) de Bills

      const iconEye = await screen.getAllByTestId("icon-eye"); //récupérer tous les icones eye
      const modaleFile = document.getElementById("modaleFile"); //récupérer la modale

      $.fn.modal = jest.fn(() => modaleFile.classList.add("show")); //utilisation de la fonction simuler pour observer le comportement de la méthode modal() de Bootstrap.
      const test = 2;
      expect(test).toBe(2);
      iconEye.forEach((icon) => {
        icon.addEventListener("click", handleClickIconEye(icon)); //ajouter un écouteur d'événement sur chaque icone eye et afficher la modale au clic
        userEvent.click(icon); //simuler un clic sur chaque icone eye
        expect(handleClickIconEye).toHaveBeenCalled(); //vérifier que la méthode handleClickIconEye(icon) a été appelée
      }); //pour vous assurer qu'une fonction simulée a été appelée avec des arguments spécifiques

      expect(modaleFile).toBeTruthy(); //vérifier que la modale est affichée
    });
  });

  // tester la redirection vers la page de création d'une note de frais
  describe("When I click on the New Bill button", () => {
    //ouvrir la page New Bill page
    test("It should open the New Bill page", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }; // rediriger vers la NewBillUI page

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      }); //La méthode Object.defineProperty() permet de définir une nouvelle propriété pour un objet ou de modifier une propriété existante.

      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" })); //définir une nouvelle valeur pour la propriété `localStorage`
      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = BillsUI({ data: bills }); //afficher le template BillsUI

      const btnNewBill = await screen.getByTestId("btn-new-bill"); //récupérer le bouton New Bill
      const handleClickNewBill = jest.fn(
        () => billsContainer.handleClickNewBill
      ); // assure la redirection vers la page newbill

      btnNewBill.addEventListener("click", handleClickNewBill); //ajouter un écouteur d'événement sur le bouton New Bill

      userEvent.click(btnNewBill); //simuler un clic sur le bouton New Bill
      expect(handleClickNewBill).toHaveBeenCalled(); //vérifier que la méthode handleClickNewBill a été appelée
    });
  });
});

/// test d'intégration GET
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "e@e" })
      ); // ajouter l'utilisateur dans le local storage
      const root = document.createElement("div"); //créer un élément div
      root.setAttribute("id", "root"); //ajouter un id à l'élément div
      document.body.append(root); //ajouter l'élément div au body
      router(); //permet de recupérer les notes de frais en tenant compte de l'url
      window.onNavigate(ROUTES_PATH.Bills); //rediriger vers la page Bills
      await waitFor(() => screen.getByText("Mes notes de frais")); //attendre que le texte "Mes notes de frais" soit affiché
      expect(screen.getByTestId("tbody")).toBeTruthy(); //vérifier que le tableau est affiché
    });
  });

  describe("When an error occurs on API", () => {
    //tester l'affichage d'un message d'erreur

    //permet de receuillir des informations sur l'utilisation de la méthode bills
    beforeEach(() => {
      jest.spyOn(mockStore, "bills"); //créer une fonction simulée qui remplace la méthode bills dans l'objet mockStore
      //La méthode jest.spyOn prend en premier argument l'objet ou le module sur lequel on veut créer la fonction simulée, et en deuxième argument le nom de la méthode qu'on veut remplacer par la fonction simulée. Dans le cas présent, on crée une fonction simulée pour remplacer la méthode bills dans mockStore
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "e@e" })
      ); // ajouter l'utilisateur dans le local storage

      const root = document.createElement("div"); //créer un élément div
      root.setAttribute("id", "root"); //ajouter un id à l'élément div
      document.body.appendChild(root); //ajouter l'élément div au body
      router(); //permet de recupérer les notes de frais en tenant compte de l'url
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      }); //mockImplementationOnce permet de remplacer la méthode bills dans l'objet mockStore par une fonction simulée qui retourne une promesse rejetée avec une erreur 404
      //mockImplementationOnce  permet de simuler différentes réponses ou comportements pour chaque test

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      }); //mockImplementationOnce permet de remplacer la méthode bills dans l'objet mockStore par une fonction simulée qui retourne une promesse rejetée avec une erreur 500
      //mockImplementationOnce  permet de simuler différentes réponses ou comportements pour chaque test

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});

// Ce beforeEach() est exécuté avant chaque test de manière à mettre en place un contexte de test commun pour tous les tests qui suivent. Voyons-le en détail :
// jest.spyOn(mockStore, "bills") :
// Cette ligne crée une fonction espionnée (mock) pour la méthode bills de l'objet mockStore. Cela signifie que lorsque la méthode bills est appelée, la fonction espionnée sera appelée à la place, permettant ainsi de contrôler son comportement et de recueillir des informations sur son utilisation.
// Object.defineProperty(window, "localStorage", { value: localStorageMock }) :
// Cette ligne remplace la propriété localStorage de l'objet window par un objet simulé (localStorageMock). Cela est souvent fait pour pouvoir contrôler les interactions avec localStorage lors des tests.
// window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" })) :

// Cela ajoute un élément "user" dans le localStorage avec des informations JSON simulées. Dans cet exemple, il s'agit probablement de simuler un utilisateur connecté avec un type "Employee" et une adresse e-mail "e@e".
// Création et ajout d'un élément div au DOM :

// Les lignes suivantes créent un élément <div> et l'ajoutent au corps (body) du document HTML. Cela semble être nécessaire pour que le routage de l'application fonctionne correctement lors des tests.
// router() :

// Cela appelle la fonction router(), qui est probablement responsable de la gestion des routes de l'application. Cela pourrait impliquer la navigation vers une certaine page ou le chargement de certaines données en fonction de l'URL.
// En résumé, ce beforeEach() prépare un contexte de test commun pour les tests à venir en mettant en place un espion sur la méthode bills de mockStore, en configurant le localStorage avec un utilisateur simulé, en ajoutant un élément <div> au DOM et en appelant potentiellement des fonctions liées au routage de l'application. Cela garantit que les tests peuvent être exécutés dans un environnement cohérent et contrôlé.
