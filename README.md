## 1. Setup Folder Structure

- add frontend and backend folders
- use npm command to install dependencies
- lancez le backend et le frontend de l'application

## 2. [Bug report] - Bills | Login 🔥

- add a correct Admin selector element

## 3. [Bug report] - Bills | High| Image 🔥

- add a valid format on bill's image

```js
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

### 4. [Bug report] - Bills | High|Sorting 🔥

- Le test Bills / les notes de frais s'affichent par ordre décroissant est passé au rouge. Faire passer le test au vert en réparant la fonctionnalité.

```js
const rows = (data) => {
  // [Bug report] - Bills | High 🔥
  // return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
  return data && data.length
    ? data
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map((bill) => row(bill))
        .join("")
    : "";
};
```

### 5. [Bug Hunt] - Dashboard

```js
// [Bug hunt] - Dashboard | High 🔥
// bills.forEach(bill => { $(`#open-bill${ bill.id }`).click(e => this.handleEditTicket(e, bill, bills)); });
bills.forEach((bill) =>
  $(`#status-bills-container${this.index} #open-bill${bill.id}`).click((e) =>
    this.handleEditTicket(e, bill, bills)
  )
);
```

```js
/*
Ce code utilise la méthode forEach pour parcourir en boucle chaque objet facture dans un tableau, et pour chaque facture, il sélectionne un élément DOM avec l'ID #open-bill${bill.id} et y attache un récepteur d'événement de clic en utilisant la méthode click de jQuery.

La méthode handleEditTicket est ensuite appelée avec l'objet d'événement e, l'objet de facture actuel et le tableau de factures comme arguments lorsque l'événement de clic est déclenché.

Il convient de noter que la variable this.index est utilisée pour générer dynamiquement l'ID de l'élément conteneur des factures. 
*/
```

## Section 3: Ajout de tests unitaires et d'intégration

### 6. Bill test unitaires

### 7. NewBill test unitaires

### 8. NewBill test d'intégration

### 9. Bill test d'intégration

### 10.
