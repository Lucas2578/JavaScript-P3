// Attendez que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
    const authToken = localStorage.getItem("authToken");
    const editButton = document.querySelector('.portfolio__edit-btn');

    // Si l'utilisateur possède le token de connexion, cela affichera le bouton "modifier"
    if (authToken) {
        editButton.style.display = 'flex';
    }

    const closeButtonModal1 = document.querySelector('.js-modal-close');
    const closeButtonModal2 = document.querySelector('.js-modal-close2');

    // Ajoutez un gestionnaire d'événements pour le clic sur le bouton de fermeture de la première modale
    closeButtonModal1.addEventListener('click', function () {
        modal1.style.display = 'none';
    });

    // Ajoutez un gestionnaire d'événements pour le clic sur le bouton de fermeture de la deuxième modale
    closeButtonModal2.addEventListener('click', function () {
        modal2.style.display = 'none';
    });

    const openModal2Button = document.getElementById("openModal2");

    // Ajoutez un gestionnaire d'événements pour le clic sur le bouton d'ouverture de la deuxième modale
    openModal2Button.addEventListener("click", function () {
        modal1.style.display = 'none';
        modal2.style.display = 'flex';
    });

    // Fermer la modale si on clique à l'extérieur
    window.addEventListener("click", function (event) {
        if (event.target === modal1) {
            modal1.style.display = 'none';
        } else if (event.target === modal2) {
            modal2.style.display = 'none';
        }
    });

    const addWorkForm = document.getElementById("addWorkForm");

    addWorkForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    const categorieSelect = document.getElementById("categorie");

    // On récupère les catégories de façon dynamique à l'aide de l'API
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
        })

        .catch(error => console.error("Erreur lors de la récupération des catégories :", error));
        const submitButton = document.querySelector('.js-addWork');

        // Ajouter un gestionnaire d'événements pour le formulaire d'ajout de travail
        submitButton.addEventListener("click", function (event) {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)
    
            // Récupérer les valeurs des champs du formulaire
            const image = document.getElementById("addPhotoButton");
            const title = document.getElementById("title").value;
            const category = document.getElementById("categorie").value;

            if (title === "" || image.files.length === 0) {
                alert("Merci de remplir tous les champs");
            } else {

                // Récupérer le token d'authentification depuis le localStorage
                const authToken = localStorage.getItem("authToken");
        
                // Vérifier si toutes les informations nécessaires sont présentes
                if (image && title && category && authToken) {
                    // Préparer les données à envoyer à l'API
                    const formData = new FormData();
                    console.log('form data image input', image.files);
                    formData.append("image", image.files[0]);
                    formData.append("title", title);
                    formData.append("category", category);
        
                    // Envoyer de la requête à l'API pour ajouter un nouveau travail
                    fetch(`${API_ROUTES.WORKS}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                        },
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Gérer la réponse de l'API (par exemple, affichez un message de succès)
                            console.log("Travail ajouté avec succès:", data);
        
                            // Réinitialiser le formulaire ou effectuez d'autres actions nécessaires
                            addWorkForm.reset();
        
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

function deleteWork(workId) {
    fetch(`${API_ROUTES.WORKS}/${workId}`, {
        method: "DELETE",
        headers: {
            // Ajoute l'en-tête "Authorization" à la requête HTTP avec le token d'authentification
            // Ceci permet d'authentifier l'utilisateur lors de la suppression d'un travail (work) via l'API.
            // Le token d'authentification est récupéré depuis le localStorage et inclus dans le format "Bearer [le_token]".
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Travail avec l'ID ${workId} supprimé avec succès.`);
                // Mettez à jour l'affichage des travaux après la suppression
                generateWorksInModal();
            } else {
                console.error(`Erreur lors de la suppression du travail avec l'ID ${workId}`);
            }
        })
        .catch(error => {
            console.error(`Erreur lors de la suppression du travail : ${error}`);
        });
}

// Fonction pour générer les éléments des travaux dans la modale
function generateWorksInModal() {
    fetch(API_ROUTES.WORKS)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (json) {
            let works = json;

            const modalListElements = document.querySelector(".modal-wrapper__list-elements");
            modalListElements.innerHTML = "";

            for (let i = 0; i < works.length; i++) {
                const work = works[i];

                const workElement = document.createElement("figure");
                workElement.className = "modal-wrapper__elements";

                const imgElement = document.createElement("img");
                imgElement.src = work.imageUrl;

                const deleteButton = document.createElement("button");
                deleteButton.className = "deleted-button";
                deleteButton.innerHTML = '<i class="fa-solid fa-trash-can fa-2xs"></i>';

                deleteButton.addEventListener("click", function () {
                    const workId = work.id;
                    deleteWork(workId); // Appeler la fonction de suppression avec l'ID du travail
                    generateWorks(0);
                });

                modalListElements.appendChild(workElement);
                workElement.appendChild(imgElement);
                workElement.appendChild(deleteButton);
            }
        });
}

document.querySelector('.js-modal').addEventListener('click', function() {
    // Récupération des travaux à afficher
    generateWorksInModal(0);
    // Applique un style cet élement
    document.getElementById("modal1").style.display = "flex";
});

// Récupérez le bouton "Ajouter une photo" dans la première modal
const openModal2Button = document.getElementById("openModal2");

// Récupérez les deux modales
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");

////// DRAG AND DROP SECTION //////

// Récupérez les éléments du formulaire et les éléments de la modal
const addWorkForm = document.getElementById("addWorkForm");
const imageDropzone = document.getElementById("imageDropzone");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");
const addPhotoButton = document.getElementById("addPhotoButton");

// Écoutez l'événement "dragover" sur la zone de glisser-déposer pour éviter le comportement par défaut
imageDropzone.addEventListener("dragover", function (event) {
    event.preventDefault();
});

// Écoutez l'événement "drop" sur la zone de glisser-déposer pour gérer le glisser-déposer
imageDropzone.addEventListener("drop", function (event) {
    event.preventDefault();

    const file = event.dataTransfer.files[0]; // Obtenez le fichier déposé
    // Vérifiez si le fichier est une image
    if (file && file.type.startsWith("image/")) {

        addPhotoButton.files = event.dataTransfer.files;

        // Affichez l'aperçu de l'image
        imagePreview.src = URL.createObjectURL(file);
        imagePreviewContainer.style.display = "block";

        const deleteElements = document.querySelectorAll(".js-preview-delete");
        deleteElements.forEach(function (element) {
            element.style.display = "none";
        });

        // Activez le bouton "Ajouter photo" pour soumettre le formulaire
        addPhotoButton.disabled = false;
    }
});

// Ajoute un gestionnaire d'événements à l'élément input "addPhotoButton" pour détecter le changement de fichier
addPhotoButton.addEventListener("change", function (event) {
    // Récupère le fichier choisi par l'utilisateur
    const file = event.target.files[0]; // Obtenez le fichier choisi

    if (file && file.type.startsWith("image/")) {

        // Affiche un aperçu de l'image sélectionnée
        imagePreview.src = URL.createObjectURL(file); // Créer un URL temporaire pour l'aperçu de l'image
        imagePreviewContainer.style.display = "flex"; // Affiche l'élément contenant l'aperçu

        // Cache les éléments ayant la classe "js-preview-delete" (par exemple : "jpg, png : 4mo max")
        const deleteElements = document.querySelectorAll(".js-preview-delete");
        deleteElements.forEach(function (element) {
            element.style.display = "none";
        });
    }
});