/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

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
    // test("Then bills should be ordered from earliest to latest", () => {
    //   document.body.innerHTML = BillsUI({ data: bills });
    //   const dates = screen
    //     .getAllByText(
    //       /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
    //     )
    //     .map((a) => a.innerHTML);
    //   const antiChrono = (a, b) => (a < b ? 1 : -1);
    //   const datesSorted = [...dates].sort(antiChrono);
    //   expect(dates).toEqual(datesSorted);
    // });
  });
});
