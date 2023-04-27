/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";

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
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toBeTruthy();
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

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a > b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
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
      ); //créer un mock de la méthode handleClickIconEye(icon) de Bills. billsContainer permet d'accéder à la méthode handleClickIconEye(icon) de Bills

      const iconEye = await screen.getAllByTestId("icon-eye"); //récupérer tous les icones eye
      const modaleFile = document.getElementById("modaleFile"); //récupérer la modale

      $.fn.modal = jest.fn(() => modaleFile.classList.add("show")); //utilisation de la fonction simuler pour observer le comportement de la méthode modal() de Bootstrap.

      iconEye.forEach((icon) => {
        icon.addEventListener("click", handleClickIconEye(icon)); //ajouter un écouteur d'événement sur chaque icone eye et afficher la modale au clic
        userEvent.click(icon); //simuler un clic sur chaque icone eye
        expect(handleClickIconEye).toHaveBeenCalled(); //vérifier que la méthode handleClickIconEye(icon) a été appelée
      }); //pour vous assurer qu'une fonction simulée a été appelée avec des arguments spécifiques

      expect(modaleFile).toBeTruthy(); //vérifier que la modale est affichée
    });
  });

  // tester la création d'une note de frais
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
      ); //simuler un clic sur le bouton New Bill

      btnNewBill.addEventListener("click", handleClickNewBill); //ajouter un écouteur d'événement sur le bouton New Bill

      userEvent.click(btnNewBill); //simuler un clic sur le bouton New Bill
      expect(handleClickNewBill).toHaveBeenCalled(); //vérifier que la méthode handleClickNewBill a été appelée
    });
  });
});

// test d'intégration GET
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "e@e" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills); //rediriger vers la page Bills
      await waitFor(() => screen.getByText("Mes notes de frais")); //attendre que le texte "Mes notes de frais" soit affiché
      expect(screen.getByTestId("tbody")).toBeTruthy(); //vérifier que le tableau est affiché
    });
  });
});
