const openModal = function (event) {
    event.preventDefault()
    const target = document.querySelector(event.target.getAttribute('href'))
    target.style.display = null;
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    // modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
}

const closeModal = function (event) {
    if (modal === null) return
    event.preventDefault()
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal = null
}

// Ajouter l'évènement pour ouvrir pour la modal
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

function deleteWork(workId) {
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            // Jeton Bearer (jeton d'authentification utilisé dans les protocoles d'authentification et d'autorisation)
            "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Assurez-vous d'inclure le jeton d'authentification si nécessaire
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

// Créez une fonction pour générer les éléments des travaux dans la modale
function generateWorksInModal() {
    fetch("http://localhost:5678/api/works")
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

// Ajoutez un gestionnaire d'événements pour afficher la deuxième modal
openModal2Button.addEventListener("click", function () {
    // Masquez la première modal
    modal1.style.display = "none";

    // Affichez la deuxième modal
    modal2.style.display = "flex";
});