// ===============================
//  ANALYTICS.JS — We Revise
//  Détection : page, appareil, durée
//  Fonctionne automatiquement sur TOUTES les pages
// ===============================

// --- Détection de la page actuelle ---
const page = location.pathname.split("/").pop().replace(".html", "") || "index";

// --- Détection de l'appareil ---
function getDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|iphone|android/.test(ua)) return "mobile";
    if (/tablet|ipad/.test(ua)) return "tablet";
    return "desktop";
}

const device = getDevice();

// --- Timer pour mesurer le temps passé sur la page ---
let startTime = Date.now();

// --- Fonction d'envoi à Supabase ---
function sendAnalytics(extra = {}) {
    // Sécurité : attendre que Supabase soit chargé
    if (!window.client) return;

    client.from("site_analytics").insert([{
        page,
        device,
        ...extra
    }]);
}

// --- Envoi immédiat à l'arrivée sur la page ---
sendAnalytics();

// --- Envoi du temps passé au moment de quitter la page ---
window.addEventListener("beforeunload", () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    sendAnalytics({ duration });
});
