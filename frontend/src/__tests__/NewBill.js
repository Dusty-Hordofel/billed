/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    //s'assurer que l'icon mail est bien mise en avant
    test("Then mail icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" })); // ajout de l'utilisateur dans le local storage
      const root = document.createElement("div"); // création d'un élément div
      root.setAttribute("id", "root"); // ajout d'un id root à l'élément div
      document.body.append(root); // ajout de l'élément div dans le body
      router(); //permet d'ajouter la class active-icon à layout-icon2 qui correspond à l'icone mail
      window.onNavigate(ROUTES_PATH.NewBill); //permet de naviguer vers la page NewBill
      await waitFor(() => screen.getByTestId("icon-mail")); //attendre que l'email soit affiché
      const mailIcon = screen.getByTestId("icon-mail"); //récupérer l'icone mail et la stocker dans la variable mailIcon
      expect(mailIcon).toBeTruthy(); //s'assurer que l'icone mail est bien affichée
    });
  });

  // test d'intégration POST
  describe("When I am on NewBill Page, I fill the form and submit", () => {
    //verifier que la facture est bien ajoutée à l'API
    test("Then the bill is added to API POST", async () => {
      const html = NewBillUI(); //récupérer le html de la page NewBill
      document.body.innerHTML = html; //ajouter le html de la page NewBill dans le body

      const bill = {
        email: "employee@test.tld",
        type: "Hôtel et logement",
        name: "Hôtel du centre ville",
        amount: 120,
        date: "2022-12-30",
        vat: "10",
        pct: 10,
        commentary: "",
        fileUrl: "testFacture.png",
        fileName: "testFacture",
        status: "pending",
      }; //création d'une facture

      //fireEvent.change(element, { target: { value: 'new value' } }), permet de simuler un événement de changement sur un élément d'entrée ou de sélection dans le DOM.

      const typeField = screen.getByTestId("expense-type"); //récupérer le champ type de la facture
      fireEvent.change(typeField, { target: { value: bill.type } }); //changer la valeur du champ type de la facture
      expect(typeField.value).toBe(bill.type); //s'assurer que la valeur du champ type de la facture est bien bill.type
      const nameField = screen.getByTestId("expense-name");
      fireEvent.change(nameField, { target: { value: bill.name } });
      expect(nameField.value).toBe(bill.name);
      const dateField = screen.getByTestId("datepicker");
      fireEvent.change(dateField, { target: { value: bill.date } });
      expect(dateField.value).toBe(bill.date);
      const amountField = screen.getByTestId("amount");
      fireEvent.change(amountField, { target: { value: bill.amount } });
      expect(parseInt(amountField.value)).toBe(parseInt(bill.amount));
      const vatField = screen.getByTestId("vat");
      fireEvent.change(vatField, { target: { value: bill.vat } });
      expect(parseInt(vatField.value)).toBe(parseInt(bill.vat));
      const pctField = screen.getByTestId("pct");
      fireEvent.change(pctField, { target: { value: bill.pct } });
      expect(parseInt(pctField.value)).toBe(parseInt(bill.pct));
      const commentaryField = screen.getByTestId("commentary");
      fireEvent.change(commentaryField, { target: { value: bill.commentary } });
      expect(commentaryField.value).toBe(bill.commentary);

      const newBillForm = screen.getByTestId("form-new-bill"); //récupérer le formulaire de la page NewBill
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile); //création d'une fonction qui permet de simuler le changement le fichier de la facture
      newBillForm.addEventListener("change", handleChangeFile); //ajouter un écouteur d'événement sur le formulaire de la page NewBill qui permet de changer le fichier de la facture
      const fileField = screen.getByTestId("file"); //récupérer le champ file de la facture
      fireEvent.change(fileField, {
        target: {
          files: [
            new File([bill.fileName], bill.fileUrl, { type: "image/png" }),
          ],
        },
      }); //Simuler un événement de changement sur le champ file de la facture
      expect(fileField.files[0].name).toBe(bill.fileUrl); //s'assurer que le nom du fichier de la facture est bien bill.fileUrl
      expect(fileField.files[0].type).toBe("image/png"); //s'assurer que le type du fichier de la facture est bien image/png
      expect(handleChangeFile).toHaveBeenCalled(); //s'assurer que la fonction handleChangeFile a bien été appelée

      const handleSubmit = jest.fn(newBill.handleSubmit); //création d'une fonction qui permet de simuler la soumission du formulaire de la page NewBill
      newBillForm.addEventListener("submit", handleSubmit); //ajouter un écouteur d'événement sur le formulaire de la page NewBill qui permet de soumettre le formulaire de la page NewBill
      fireEvent.submit(newBillForm); //Simuler un événement de soumission sur le formulaire de la page NewBill
      expect(handleSubmit).toHaveBeenCalled(); //s'assurer que la fonction handleSubmit a bien été appelée
    });
  });
});
