document.addEventListener("DOMContentLoaded", function () {
    // Gestion de la soumission du formulaire
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Créez un objet avec les informations d'authentification
        const authData = {
            email: email,
            password: password
        };

        // Obtenez la configuration actuelle de l'application
        const currentConfig = localStorage.getItem("appConfig");

        // Effectuez une requête POST vers votre API pour vérifier l'authentification
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(authData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Authentification échouée");
                }
            })
            .then(data => {
                // Authentification réussie, obtenir un token
                const authToken = data.token; // Remplacez par le vrai token
                localStorage.setItem("authToken", authToken);

                // Restaurez la configuration de l'application si elle existe
                if (currentConfig) {
                    localStorage.setItem("appConfig", currentConfig);
                }

                alert("Connexion réussie !");
                window.location.href = "index.html"; // Rediriger l'utilisateur vers la page d'accueil
            })
            .catch(error => {
                alert("Connexion échouée. Vérifiez vos identifiants.");
                console.error(error);
            });
    });

    // Vérifier l'authentification à l'ouverture de la page
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
        // L'utilisateur est déjà authentifié, vous pouvez effectuer des actions en fonction de cela.
        // Rediriger vers la page d'accueil
        window.location.href = "index.html";
    }
});