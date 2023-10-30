// Génère les travaux
function generateWorks(categoryId) {
    fetch("http://localhost:5678/api/works")
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (json) {
            let works = [];
            // On filtre les travaux uniquement si la catégorie sélectionnée n'est pas Tous
            if (categoryId != 0) {
                works = json.filter(function (work) {
                    // 1 == "1" => true (comparaison de valeurs)
                    // 1 === "1" => false (comparaison de valeurs et de types)
                    // && => a et b
                    // || => a ou b
                    return work.categoryId == categoryId;
                });
            } else {
                // Pas de filtre quand la catégorie Tous est sélectionnée
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

fetch("http://localhost:5678/api/categories").then(function (reponse) {
    return reponse.json();
}).then(function (json) {
    // Ajout d'une nouvelle catégorie en dur
    let categories = [];
    categories.push({
        id: 0,
        name: "Tous"
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
        categoryElement.innerText = category.name;
        // Ajouter un évènement click sur chaque bouton pour re générer la liste des travaux avec le filtre correspondant à chaque bouton
        categoryElement.addEventListener("click", function () {
            // Appeler la fonction de génération des travaux en lui passant l'id de la catégorie
            generateWorks(category.id);
        });

        sectionFilters.appendChild(categoryElement);
    }
}

// Par défaut, on génère tous les travaux
generateWorks(0);