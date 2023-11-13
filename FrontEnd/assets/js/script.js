// Génère les travaux
function generateWorks(categoryId) {
    fetch(API_ROUTES.WORKS)
        .then(function (reponse) {
            // Permet d'extraire le corps de la réponse http sous forme json
            return reponse.json();
        })
        .then(function (json) {
            let works = [];
            // On filtre les travaux uniquement si la catégorie sélectionnée n'est pas "Tous"
            if (categoryId != 0) {
                works = json.filter(function (work) {
                    return work.categoryId == categoryId;
                });
            } else {
                // Pas de filtre quand la catégorie "Tous" est sélectionnée
                works = json;
            }

            // On vide la gallery avant d'insérer de nouveaux éléments
            const sectionGallery = document.querySelector(".portfolio__gallery");
            sectionGallery.innerHTML = "";

            for (let i = 0; i < works.length; i++) {
                const work = works[i];

                const workElement = document.createElement("figure");

                const imgElement = document.createElement("img");
                imgElement.src = work.imageUrl;

                const nomElement = document.createElement("figcaption");
                nomElement.innerText = work.title;

                sectionGallery.appendChild(workElement);
                workElement.appendChild(imgElement);
                workElement.appendChild(nomElement);

            }
        });
}

fetch(API_ROUTES.CATEGORIES).then(function (reponse) {
    return reponse.json();
}).then(function (json) {
    // Ajout d'une nouvelle catégorie en dur
    let categories = [];
    categories.push({
        id: 0,
        name: "Tous",
        // On met la catégorie "Tous" qui renvoie par défaut la propriété isTrue: true pour être sélectionné de base
        isTrue: true
    });
    // On fusionne notre catégorie en dur avec les catégories en json
    generateCategories(categories.concat(json));
});

// Ajout des boutons dynamiquement pour prévenir l'ajout de futurs catégories
function generateCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const sectionFilters = document.querySelector(".portfolio__filters");
        const categoryElement = document.createElement("button");
        categoryElement.className = "portfolio__filters--btn";

        // On ajoute la class "btn-active" à la catégorie qui renverra la valeur "True" dès la génération des catégories
        if (category.isTrue) {
            categoryElement.classList.add("btn-active");
        }

        categoryElement.innerText = category.name;

        // Ajouter un évènement click sur chaque bouton pour re générer la liste des travaux avec le filtre correspondant à chaque bouton
        categoryElement.addEventListener("click", function () {
            const categoryButtons = document.querySelectorAll(".portfolio__filters--btn");

            // Supprimer "btn-active" de tous les boutons lorsqu'on clique sur une catégorie
            categoryButtons.forEach(function (btn) {
                btn.classList.remove("btn-active");
            });

            // Ajoutez la classe "btn-active" à l'élément de catégorie cliqué
            categoryElement.classList.add("btn-active");
            // Appeler la fonction de génération des travaux en lui passant l'id de la catégorie
            generateWorks(category.id);
        });

        sectionFilters.appendChild(categoryElement);
    }
}

// Par défaut, on génère tous les travaux
generateWorks(0);