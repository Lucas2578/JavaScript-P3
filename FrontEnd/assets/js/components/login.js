document.addEventListener("DOMContentLoaded", function () {
    // Gestion de la soumission du formulaire
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // On créer un objet avec les informations récupérées du formulaire
        const authData = {
            email: email,
            password: password
        };

        // On obtient la configuration actuelle du localStorage
        const currentConfig = localStorage.getItem("appConfig");

        // On fait une requête POST pour vérifier l'authentification
        fetch(`${API_ROUTES.LOGIN}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // On insère ici un .json avec comme informations ceux de la variable authData
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
                // Si l'authentification est réussie, on obtient le token de connexion qu'on stock dans authToken
                const authToken = data.token;
                localStorage.setItem("authToken", authToken);

                alert("Connexion réussie !");
                window.location.href = "index.html";
            })
            .catch(error => {
                alert("Connexion échouée. Vérifiez vos identifiants.");
                console.error(error);
            });
    });

    // On vérifie si l'utilisateur est déjà connecté lorsqu'il arrive sur la page
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
        // Si oui, on le rediriger vers la page d'accueil
        window.location.href = "index.html";
    }
});