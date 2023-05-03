## LOGIN

- au niveau de la page d'acceuil on utilise le template [LoginUI](src/views/LoginUI.js) les formulaire de connection.
- la class [Login](src/containers/Login.js) permet de connecter les utilisteurs et les administrateurs en récupérant leurs données et en les soumettant en utilisant la function handleSubmitAdmin() et handleSubmitEmployee qui récupèrent les données des input , connectent l'utilisateur s'il existe ou crée un nouvel utilisateur et le redirige vers la page concerné.

## EMPLOYE

- après conenction l'employé est renvoyé sur la page des notes de frais ["#employee/bills"]
- [BillsUI.js](src/views/BillsUI.js) contient le template permettant d'afficher la sidebar (VerticalLayout) et les notes de frais grace à a function rows(), les justificatifs des notes de frais (modals()) et le rendu grace au template.
- La class [Bills](src/containers/Bills.js) contient les functions permettant de créer une nouvelle note , d'obtenir les notes de frais
- [NewBillUI.js](src/views/NewBillUI.js) contient le template permettant de de créer une nouvelle note de frais
- [NewBill](src/containers/NewBill.js) permet de soumettre le formulaire contenant les informations de la nouvelle note de frais (gestion des types de fichiers, téléverser et autres...).
- On utilise [Router.js](src/app/Router.js) pour afficher tous les templates en fonction de url.

- eyeBlueIcon (icon pour déclencher la modale) est contenu dans [Actions.js](src/views/Actions.js). la class [Bills](src/containers/Bills.js) contient handleClickIconEye() qui gère l'affichage de la modale lorsque je clique sur l'oeil.

### Admin
