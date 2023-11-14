// On récupère les deux modales
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");

// On récupère le formulaire d'ajout de travaux
const addWorkForm = document.getElementById("addWorkForm");

document.addEventListener("DOMContentLoaded", function () {

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    //////#####  EDIT BUTTON VISIBILITY #####//////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    const authToken = localStorage.getItem("authToken");
    const editButton = document.querySelector('.portfolio__edit-btn');

    // Si l'utilisateur possède le token de connexion, cela affichera le bouton "modifier"
    if (authToken) {
        editButton.style.display = 'flex';
    }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////###### CLOSE MODAL SECTION ######///////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    // Fermer les modales individuellement lorsqu'on clic sur la croix
    const closeButtonModals = document.querySelectorAll('.js-modal-close');
    closeButtonModals.forEach(function (closeButtonModal) {
        closeButtonModal.addEventListener("click", function () {
            const modal = closeButtonModal.closest('.modal');
    
            if (modal) {
                modal.style.display = 'none';
                closeAndResetModal();
            }
        });
    });

    // Fermer la modale si on clique à l'extérieur
    window.addEventListener("click", function (event) {
        if (event.target === modal1) {
            modal1.style.display = 'none';
            closeAndResetModal();
        } else if (event.target === modal2) {
            modal2.style.display = 'none';
            closeAndResetModal();
        }
    });

    // Ajout d'un événement pour ouvrir la deuxième modal et fermer la première lorsqu'on clic sur "Ajouter une photo"
    const openModal2Button = document.getElementById("openModal2");
    openModal2Button.addEventListener("click", function () {
        modal1.style.display = 'none';
        modal2.style.display = 'flex';
    });

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    //////###### ADD NEW WORKS SECTION ######//////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    // Annulation du comportement par défaut de l'envoie des données du formulaire addWorkForm
    addWorkForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    // On récupère les catégories de façon dynamique à l'aide de l'API
    const categorieSelect = document.getElementById("categorie");
    fetch(API_ROUTES.CATEGORIES)
        .then(response => response.json())
        .then(categories => {
            // On génère les options de la liste déroulante
            categories.forEach(category => {
                const option = document.createElement("option");
                // Avec comme valeur l'id de la catégorie
                option.value = category.id;
                // Avec comme nom le nom de la catégorie
                option.textContent = category.name;
                // C'est un enfant de la balise <select>
                categorieSelect.appendChild(option);
            });
        }).catch(error => console.error("Erreur lors de la récupération des catégories :", error));

        // Ajouter un gestionnaire d'événements pour le formulaire d'ajout de travail
        const submitButton = document.querySelector('.js-addWork');
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();
    
            // Récupérer les valeurs des champs du formulaire
            const image = document.getElementById("addPhotoButton");
            const title = document.getElementById("title").value;
            const category = document.getElementById("categorie").value;

            // Empêche l'utilisateur d'ajouter des travaux si tous les champs ne sont pas remplis
            if (title === "" || image.files.length === 0) {
                alert("Merci de remplir tous les champs");
            } else {

                // Récupérer le token d'authentification depuis le localStorage
                const authToken = localStorage.getItem("authToken");
        
                // Vérifier si toutes les informations nécessaires sont présentes
                if (image && title && category && authToken) {
                    // Création du formData pour envoyer toutes les données que l'utilisateur a remplis dans le formulaire
                    const formData = new FormData();
                    console.log('form data image input', image.files);
                    formData.append("image", image.files[0]);
                    formData.append("title", title);
                    formData.append("category", category);
        
                    // Envoie de la requête vers l'API
                    fetch(`${API_ROUTES.WORKS}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                        },
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                            // On ajoute un console.log pour dire que le travail a bien été ajouté
                            console.log("Travail ajouté avec succès:", data);

                            // On informe l'utilisateur que l'ajout a bien été réalisé
                            alert("Nouvel ajout réalisé !");
        
                            // Permet de réinitialiser le formulaire, supprimer l'image de la preview et de l'input file
                            closeAndResetModal();
        
                            // Mettre à jour l'affichage des travaux dans la après l'ajout
                            generateWorksInModal();

                            // Re-génère les travaux avec les nouveaux travaux
                            generateWorks(0);
                        })
                        .catch(error => console.error("Erreur lors de l'ajout du travail :", error));
                } else {
                    console.error("Informations manquantes pour l'ajout du travail.");
                }
            }
        });
});

///////////////////////////////////////////////
///////////////////////////////////////////////
////### FUNCTION CLOSE AND RESET MODAL  ###////
///////////////////////////////////////////////
///////////////////////////////////////////////

// On récupère le container de la preview et l'image de la preview
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");

function closeAndResetModal() {
    // On ferme la modale qui ajoute de nouveaux travaux
    modal2.style.display = 'none';
    // On reset le formulaire (le champs "Titre")
    addWorkForm.reset()

    // On supprime la preview
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    imagePreviewContainer.style.display = 'none';

    // On supprime l'url blob de l'ancienne image
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.removeAttribute('src');

    // On rend de nouveau visible les éléments qui doivent être supprimés lorsqu'on ajoute l'image pour la preview
    // A savoir l'icône, le bouton ajouter photo et "jpg, png : 4mo max"
    const deleteElements = document.querySelectorAll(".js-preview-delete2");
    deleteElements.forEach(function (element) {
        element.style.display = "flex";
    });

    // On enlève l'image de l'input file
    const imageInput = document.getElementById('addPhotoButton');
    imageInput.value = '';
}

///////////////////////////////////////////////
///////////////////////////////////////////////
////////#### FUNCTION DELETE WORK  ####////////
///////////////////////////////////////////////
///////////////////////////////////////////////

function deleteWork(workId) {
    // On envoie une requête à l'API qui permet de supprimer les travaux
    fetch(`${API_ROUTES.WORKS}/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Travail avec l'ID ${workId} supprimé avec succès.`);
                // On met à jour ici les travaux dans la modale
                generateWorksInModal();
            } else {
                console.error(`Erreur lors de la suppression du travail avec l'ID ${workId}`);
            }
        })
        .catch(error => {
            console.error(`Erreur lors de la suppression du travail : ${error}`);
        });
}

///////////////////////////////////////////////
///////////////////////////////////////////////
//////##### GENERATE WORKS IN MODAL #####//////
///////////////////////////////////////////////
///////////////////////////////////////////////

function generateWorksInModal() {
    // On envoie une requête à l'API afin d'avoir un retour dans un .json
    fetch(API_ROUTES.WORKS)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (json) {
            // On insère ce .json dans la variable "works"
            let works = json;

            // On supprime tous les travaux existants dans la modale
            const modalListElements = document.querySelector(".modal-wrapper__list-elements");
            modalListElements.innerHTML = "";

            for (let i = 0; i < works.length; i++) {
                // On insère dans la variable "work" l'élément actuel de "works"
                const work = works[i];

                // On génère une balise figure avec une class
                const workElement = document.createElement("figure");
                workElement.className = "modal-wrapper__elements";

                // On génère une balise img avec comme source l'url de la variable work actuelle
                const imgElement = document.createElement("img");
                imgElement.src = work.imageUrl;

                // On génère le bouton de suppression avec une class et l'icône
                const deleteButton = document.createElement("button");
                deleteButton.className = "deleted-button";
                deleteButton.innerHTML = '<i class="fa-solid fa-trash-can fa-2xs"></i>';

                // On supprime les travaux lorsque l'on clic sur notre bouton de suppression
                deleteButton.addEventListener("click", function () {
                    // Initialisation d'une variable "workId" et on stock l'id du travaux sur lequel on clic
                    const workId = work.id;

                    // On supprime le travail que l'on a choisi avec en option l'id du travail sur lequel on a cliqué
                    deleteWork(workId);

                    // On regénère tous les travaux avec la suppression apportée
                    generateWorks(0);
                });

                modalListElements.appendChild(workElement);
                workElement.appendChild(imgElement);
                workElement.appendChild(deleteButton);
            }
        });
}

// Génération de tous les travaux dans la modal lorsque l'on clic dessus
document.querySelector('.js-modal').addEventListener('click', function() {
    // Récupération des travaux à afficher
    generateWorksInModal(0);
    // Applique un style cet élement
    document.getElementById("modal1").style.display = "flex";
});

///////////////////////////////////////////////
///////////////////////////////////////////////
//////##### FILE TRANSFERT SECTION  #####//////
///////////////////////////////////////////////
///////////////////////////////////////////////

// On récupère la drop zone pour le drag and drop et le bouton pour ajouter une photo
const imageDropzone = document.getElementById("imageDropzone");
const addPhotoButton = document.getElementById("addPhotoButton");

function addPhotoFileAndPreview(file) {
    // Créer et insère un url temporaire (blob) en tant que src dans imagePreview
    imagePreview.src = URL.createObjectURL(file);
    // Rend visible le container preview
    imagePreviewContainer.style.display = "block";

    // On masque tous les éléments comme l'icône, le texte et le bouton "ajouter photo" dans la zone d'ajout de photo
    const deleteElements = document.querySelectorAll(".js-preview-delete, .js-preview-delete2");
    deleteElements.forEach(function (element) {
        element.style.display = "none";
    });
}

// On écoute l'événement "dragover" pour annuler le comportement par défaut du dragover
imageDropzone.addEventListener("dragover", function (event) {
    event.preventDefault();
});

// On écoute l'événement de "drop" lorsque l'utilisateur met un fichier en drag and drop
imageDropzone.addEventListener("drop", function (event) {
    event.preventDefault();

    // On insère le fichier dans la variable "file"
    const file = event.dataTransfer.files[0];
    
    // Vérification que le fichier est bien une image
    if (file && file.type.startsWith("image/")) {

        // Met à jour le fichier sélectionné dans le champ de fichier avec le fichier déposé
        addPhotoButton.files = event.dataTransfer.files;

        // On affiche la preview et ajoute le fichier dans balise input
        addPhotoFileAndPreview(file)
    }
});

// On écoute l'événement "change" pour lorsqu'on ajoute une photo avec le bouton "Ajouter photo" directement
addPhotoButton.addEventListener("change", function (event) {
    // On insère le fichier dans la variable "file"
    const file = event.target.files[0];

    // Vérification que le fichier est bien une image
    if (file && file.type.startsWith("image/")) {

        // On affiche la preview et ajoute le fichier dans balise input
        addPhotoFileAndPreview(file)
    }
});