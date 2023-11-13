document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.querySelector('.js-logout');
    const loginButton = document.querySelector('.js-login');

    const authToken = localStorage.getItem("authToken");

    if (authToken) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'flex';
    } else {
        loginButton.style.display = 'flex';
        logoutButton.style.display = 'none';
    }
    logoutButton.addEventListener("click", function () {
        logout();
    })
});

function logout() {
    // Permet de supprimer le token de connexion étant dans le localStorage
    localStorage.removeItem('authToken');

    // Permet de rediriger l'utilisateur vers la page principale
    window.location.href = "index.html";
};