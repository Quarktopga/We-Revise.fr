async function loadComponent(selector, file) {
    const container = document.querySelector(selector);
    if (!container) return;

    try {
        const response = await fetch(file);
        const html = await response.text();
        container.innerHTML = html;
    } catch (err) {
        console.error("Erreur chargement composant :", file, err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "header.html");
    loadComponent("footer", "footer.html");
});
