document.addEventListener("DOMContentLoaded", function () {
    // On récupère les boutons de login/logout
    const logoutButton = document.querySelector('.js-logout');
    const loginButton = document.querySelector('.js-login');

    // On récupère le token de connexion et le met dans "authToken"
    const authToken = localStorage.getItem("authToken");

    // Si l'utilisateur possède le token d'authentification, cela enlève le bouton "login" et met le bouton "logout"
    if (authToken) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'flex';
    } 
    // Sinon, cela affiche le bouton "login" et pas le bouton "logout"
    else { 
        loginButton.style.display = 'flex';
        logoutButton.style.display = 'none';
    }

    // Exécute la fonction "logout" lorsqu'on clic sur le bouton de logout
    logoutButton.addEventListener("click", function () {
        logout();
    })
});

function logout() {
    // Permet de supprimer le token de connexion étant dans le localStorage
    localStorage.removeItem('authToken');
};