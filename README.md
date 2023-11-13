## Section 1: Installation

## 1. Setup Folder Structure

## L'architecture du projet :

Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

## Organiser son espace de travail :

Pour une bonne organization, vous pouvez créer un dossier bill-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Clonez le projet backend dans le dossier bill-app :

```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

```
bill-app/
   - Billed-app-FR-Back
```

Clonez le projet frontend dans le dossier bill-app :

```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
```

```
bill-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Front
```

## Comment lancer l'application en local ?

### étape 1 - Lancer le backend :

Suivez les indications dans le README du projet backend.

### étape 2 - Lancer le frontend :

Allez au repo cloné :

```
$ cd Billed-app-FR-Front
```

Installez les packages npm (décrits dans `package.json`) :

```
$ npm install
```

Installez live-server pour lancer un serveur local :

```
$ npm install -g live-server
```

Lancez l'application :

```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`

## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur :

```
utilisateur : admin@test.tld
mot de passe : admin
```

### employé :

```
utilisateur : employee@test.tld
mot de passe : employee
```

Après avoir installe r tout ce qui était necessaire au démarrage du projet , je me suis d'entrée de je me suis d'entrée de jeu penché sur les bugs

## Section 2: Découverte des Bugs

## 2. [Bug report] - Bills | Login 🔥

### Description

Dans le rapport de test "Login, si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard", le test est passé au rouge (cf. copie d'écran).

## To-do

Faire passer le test au vert en réparant la fonctionnalité.

- Lors du lancement du test jest src/**tests**/Login.js,
  j'ai une erreur me disant

### ![Login Test](images/Login/../../frontend/images/Login/Login-test.png)

- je localise l'erreur grace aux informations données
  `at HTMLFormElement.handleSubmitAdmin (src/containers/Login.js:44:81)`

### ![Login Test](images/Login/../../frontend/images/Login/Login-container.png)

- j'essaie de me connecter en tant qu'Admin, mon anvigateur ne me renvoi aucune erreur
- je vais sur le debuggeur de Google Chrome pour , je mets des points d'arrets au niveau de l'erreur!
  - j'ai le même message `Uncaught TypeError: Cannot read properties of null (reading 'value')`

### ![Login Test](images/Login/../../frontend/images/Login/Login-breakPoint.png)

- je recherche la [vue (LoginUI)](frontend/src/views/LoginUI.js) du formulaire Administrateur pour voir les noms des sélecteurs des inputs sélectionnés pour les comparer avec ceux utilisés. Je remarque que j'ai `admin-email-input` et `admin-password-input` au lieu de `employee-email-input`et`employee-password-input`
- je fais les changements et resfait le test. Tout passe et je me connecte en tant qu'administrateur!
  ### ![Login Test](images/Login/../../frontend/images/Login/Login-test-2.png)
  ### ![Login Test](images/Login/../../frontend/images/Login/admin.png "Admin Dashboard")

## 3. [Bug report] - Bills | High| Image 🔥

## Description

Je suis connecté en tant qu'employé, je saisis une note de frais avec un justificatif qui a une extension différente de jpg, jpeg ou png, j'envoie. J'arrive sur la page Bills, je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.

Si je me connecte à présent en tant qu'Admin, et que je clique sur le ticket correspondant, le nom du fichier affiché est null. De même, lorsque je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.

## To-do

Comportements attendus :

- [ ] la modale doit afficher l'image.
- [ ] dans le dashboard, le formulaire correspondant au ticket doit afficher le nom du fichier.

Suggestion : empêcher la saisie d'un document qui a une extension différente de jpg, jpeg ou png au niveau du formulaire du fichier NewBill.js. Indice : cela se passe dans la méthode handleChangeFile...

- ajouter une facture en tant qu'employé et voir le résultat en tant qu'employé et

### ![Bill Format](images/Bills/bill.png "Admin Dashboard")

- trouver le fichier [NewBill](frontend/src/containers/NewBill.js)
- mettre à jour la fonction [handleChangeFile](frontend/src/containers/NewBill.js) qui gère le format des fichiers.
  - ajouter les formats des fichiers acceptés
  - mettre ajouter la condition au niveau de la création de fichier

```js
const validExtensions = ["image/jpg", "image/jpeg", "image/png"]; //liste des types de fichiers acceptés
// If the file type is included in the list of allowed file types,
// create a new bill with the file and email using the bills store's create method
if (validExtensions.includes(file.type)) {
  this.store
    .bills()
    .create({
      data: formData,
      headers: { noContentType: true },
    })
    .then(({ fileUrl, key }) => {
      console.log(fileUrl);
      this.billId = key;
      this.fileUrl = fileUrl;
      this.fileName = fileName;
    })
    .catch((error) => console.error(error));
} else {
  // If the file type is not allowed, show an alert and reset the file input's value
  alert("Le fichier doit être une image avec une extension JPG, JPEG ou PNG.");
  e.target.value = "";
}
```

- lancement du test

### ![View Bill ](images/Bills/viewBill.png "Employé Bill")

### 4. [Bug report] - Bills | High|Sorting 🔥

## Description

Le test Bills / les notes de frais s'affichent par ordre décroissant est passé au rouge.

## To-do

Faire passer le test au vert en réparant la fonctionnalité.

- lancer le test de [Bills](frontend/src/__tests__/Bills.js)

### ![View Test ](frontend/images/Bills/BillTest.png "Employé Bill")

- On remarque tout de suite au niveau du test , on importe des données du fichier `import { bills } from "../fixtures/bills.js"`
- ces données sont tranmises au fichier à `BillsUI`, c'est donc dans BillsUI que doit se trouver l'erreur. Il faut noter qu'au niveau du debuggeur , je n'aurais pas de retour , car toutes les informations sont bien transmises. Je regarde donc la fonction chargé d'afficher les données de chaque facture.

```js
const rows = (data) => {
  return data && data.length ? data.map((bill) => row(bill)).join("") : "";
};
```

- elle reçoit juste les données des factures sans les trier
- on va trier les données reçu en ordre décroissant en fonction de la date (de la plus récente à la plus ancienne) avant de les afficher.

```js
const rows = (data) => {
  return data && data.length
    ? data
        .sort((a, b) => new Date(b.date) - new Date(a.date)) //TODO 4 Sort bills by date
        .map((bill) =>
          row({
            ...bill,
            date: bill.date,
          })
        )
        .join("")
    : "";
};
```

- on relance le test pour voir si cela passe

### ![View Test ](frontend/images/Bills/BillSort.png "Employé Bill")

### 5. [Bug Hunt] - Dashboard 🔥

## Description

Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets (par exemple : statut "validé"), je sélectionne un ticket, puis je déplie une seconde liste (par exemple : statut "refusé"), je ne peux plus sélectionner un ticket de la première liste.

## To-do

Comportement attendu : pourvoir déplier plusieurs listes, et consulter les tickets de chacune des deux listes.

Pas besoin d'ajouter de tests.

- je vais au niveau de Dashboard pour trouver la function qui gère l'affichage des facture ainsi que le click.
- Je vais sur le débugger et je mets les différents breakPoints pour
  voir à quel moment chaque élément s'affichent.
  - tout s'affiche à partir de la function `handleEditTicket`,elle va gérée des évennement comme l'acceptation ou le refus des factures
  - `handleShowTickets` va gérer les icons , filtrer les factures par status et le comportment au niveau des clicks de chaque facture.

```js
bills.forEach((bill) => {
  $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills));
});
```

- l'identifiant `#open-bill${bill.id}` fait référence à La facture ``Card
- <!-- - je me rends dans `DashboardUI` qui représente la vue des différentes section de tri `En attente`,`Validé`, `Refusé`. -->
- `handleShowTickets` Ce gère l'affichage et l'interaction avec des tickets ou des factures dans un contexte où différents types de tickets sont regroupés par statut. Je vais expliquer chaque partie du code en détail. Elle va gérer les icons , filtrer les factures par status et le comportment au niveau des clicks de chaque facture.

```js
//[Bug hunt] - Dashboard | High 🔥
bills.forEach((bill) => {
  $(`#open-bill${bill.id}`).off("click"); //TODO 5 - On remove l'eventListener existant avant d'en ajouter un
  $(`#open-bill${bill.id}`).on("click", (e) => {
    this.handleEditTicket(e, bill, bills);
  });
});
```

En utilisant la méthode .off() pour supprimer les gestionnaires de clic existants avant d'en ajouter de nouveaux, vous évitez tout risque de doublons ou de comportements inattendus liés aux événements.

## Section 3: Ajout de tests unitaires et d'intégration

### Bill test unitaires et d'intégrations

#### 6. Bill test unitaires

- lancement des tests `npm test`

### ![Tous les Tests ](images/couverture-init.png "Project Billed")

- tous les composants view sont couverts à `100%`
- ajout de l'assertion au niveau du premier test `Given I am connected as an employee` de [Bills](frontend/src/__tests__/Bills.js) pour s'assurer qu'on a bien l'attribut de données `icon-window`

```js
//to-do write expect expression
expect(windowIcon).toBeTruthy();
```

# Couvrir un maximum de `statements` composant container/Bills `80%`: Ajout des test Unitaires

Il existe déjà deux tests au niveau de [Bills](frontend/src/__tests__/Bills.js):

#### Vérifier que l'icone sur la barre verticale est en surbrillance

- lorsqu'on est connecté ent tant qu'employé et sur la page d'acceuille, l'icon des facture sur la barre verticale doit etre mis en évidence.

### ![Bills icons ](images/Bills/icons.png "Project Billed")

on récupère l'attribut de données des icons `icon-window` et on verifie qu'il existe , s'il existe le test passe , si non le teste échoue

#### Vérifier que les factures sont classées par ordre décroissant

- le second test vérifie que les factures doivent ensuite être classées de la plus ancienne à la plus récente. on extrait les dates de toutes les factures, on les compare puis on les tries du plus ancien au plus récent . Au niveau de l'assertion on compare les les dates triés sont égales celles récupérés. Si c'est le cas le test passe , si non il échoue.

  #### La modale s'ouvre au clic sur l'icone eye

- on récupère tous les attributs de données `icon-eye` pour l'icon et `modaleFile` pour la modale , on simule l'ouverture de la modale avec la fonction `handleClickIconEye` qui utilise jest pour simuler 'ouverture de la modale au `click`. On verifie que la modale est affiché grace à l'aasertion expect

#### tester la création d'une note de frais

- au click sur la créer une note de frais , on doit être rediriger vers une nouvelle page,on récupère l'attrbut de données `btn-new-bill"` ,on vérifie le changement de route au clic, on simule le clic sur le bouton grace à l'interaction utilisteur,
  À utiliser .`toHaveBeenCalledWithpour` garantir qu'une fonction fictive a été appelée avec des arguments spécifiques.

#### 7. Bill test d'intégrations

#### vérifier l'existence du texte Mes notes de frais et du tableau des facture

- on récupère le text `Mes notes de frais` grace à la méthode,
  on vérifie l'existence du tableau des notes de frais grace à l'attribut de données `tbody`.

#### tester l'affichage d'erreur

- on récupère toutes les notes de frais avant chaque test, on simule une erreur 404, on s'attend à ce que l'assertion soit vraie.On fait cela avec une erreur 404 et 500.

### NewBill test unitaires et d'intégrations

#### 8. NewBill test unitaires

- Au niveau de `Newbill` , il m'a fallut créer un premier test permettant de vérifier que l'icon mail est en toujours en surbrillance lorsque je suis connecté en tant qu'employé.on récupère l'attribut de données lié à l'icon , et on vérifie que via l'assertion except qu'il est bien affiché.

#### 9. NewBill test d'intégration

- au niveau du test d'intégration de New Bill , lobjectif est de vérifier on va vérifier le fonctionnement du formulaire de création d'une nouvelle facture, qu'elle est bien effective. on récupère la vue NewBill,on l'ajoute au body, on crée une variable contenant les informations des différents champs, on récupère les attributs de données des différents champs et on simule lajout des données et le changement de champs.
  On verifie via les assertions qu'on reçoit le bon format d'image, que la soumission de la création de la nouvelle facture est effective.

## Section 4: Test End To End

#### 10. E2E

- ajouter les documents du test E2E dans le [docs](frontend/src/docs)



