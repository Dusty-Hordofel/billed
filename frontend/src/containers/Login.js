import { ROUTES_PATH } from "../constants/routes.js";
export let PREVIOUS_LOCATION = "";

// we use a class so as to test its methods in e2e tests
export default class Login {
  constructor({
    document,
    localStorage,
    onNavigate,
    PREVIOUS_LOCATION,
    store,
  }) {
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION;
    this.store = store;
    const formEmployee = this.document.querySelector(
      `form[data-testid="form-employee"]`
    );
    formEmployee.addEventListener("submit", this.handleSubmitEmployee);
    const formAdmin = this.document.querySelector(
      `form[data-testid="form-admin"]`
    );
    formAdmin.addEventListener("submit", this.handleSubmitAdmin);
  }
  // permet de se connecter en tant qu'employé
  handleSubmitEmployee = (e) => {
    e.preventDefault(); //empêcher le comportement par défaut du navigateur (rechargement de la page)
    const user = {
      type: "Employee",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`)
        .value,
      password: e.target.querySelector(
        `input[data-testid="employee-password-input"]`
      ).value,
      status: "connected",
    }; //récupérer les valeurs des inputs
    this.localStorage.setItem("user", JSON.stringify(user)); //ajouter les valeurs de l'utilisateur dans le local storage
    //login de l'utilisateur
    this.login(user)
      .catch((err) => this.createUser(user))
      .then(() => {
        this.onNavigate(ROUTES_PATH["Bills"]); //redirection vers la page des notes de frais
        this.PREVIOUS_LOCATION = ROUTES_PATH["Bills"]; //la page précédente est la page des notes de frais
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
        this.document.body.style.backgroundColor = "#fff"; //changer la couleur du background
      }); //catch((err) => this.createUser(user)),Cela signifie que si la promesse précédente échoue, le code tentera de créer un utilisateur avec les données transmises en tant qu'utilisateur.
  };

  // permet de se connecter en tant qu'admin
  handleSubmitAdmin = (e) => {
    e.preventDefault(); //empêcher le comportement par défaut du navigateur (rechargement de la page)
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`)
        .value,
      password: e.target.querySelector(
        `input[data-testid="admin-password-input"]`
      ).value,
      status: "connected",
    }; //réupérer les valeurs des inputs de l'admin

    console.log(
      e.target.querySelector(`input[data-testid="admin-email-input"]`).value
    );
    console.log(
      e.target.querySelector(`input[data-testid="admin-password-input"]`).value
    );

    this.localStorage.setItem("user", JSON.stringify(user)); //ajouter les valeurs de l'administrateurs dans le local storage
    this.login(user)
      .catch((err) => this.createUser(user))
      .then(() => {
        this.onNavigate(ROUTES_PATH["Dashboard"]); //redirection vers la page du dashboard
        this.PREVIOUS_LOCATION = ROUTES_PATH["Dashboard"]; //la page précédente est la page du dashboard
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
        document.body.style.backgroundColor = "#fff"; //changer la couleur du background
      });
  }; //catch((err) => this.createUser(user)),Cela signifie que si la promesse précédente échoue, le code tentera de créer un utilisateur avec les données transmises en tant qu'utilisateur.

  // not need to cover this function by tests
  login = (user) => {
    //si le store existe alors on se connecte
    if (this.store) {
      return this.store
        .login(
          JSON.stringify({
            email: user.email,
            password: user.password,
          })
        )
        .then(({ jwt }) => {
          localStorage.setItem("jwt", jwt);
        });
    } else {
      //sinon on retourne null
      return null;
    }
  }; //function permettant de se connecter

  // not need to cover this function by tests
  createUser = (user) => {
    if (this.store) {
      return this.store
        .users()
        .create({
          data: JSON.stringify({
            type: user.type,
            name: user.email.split("@")[0],
            email: user.email,
            password: user.password,
          }),
        })
        .then(() => {
          console.log(`User with ${user.email} is created`);
          return this.login(user);
        });
    } else {
      return null;
    }
  }; //permets de créer un utilisateur
}
