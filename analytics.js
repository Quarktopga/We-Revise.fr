console.log("[Analytics] Script chargé");

// ---------------------------------------------
// 📱 DÉTECTION APPAREIL
// ---------------------------------------------
function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|iphone|android/.test(ua)) return "mobile";
    if (/tablet|ipad/.test(ua)) return "tablet";
    return "desktop";
}

const device = detectDevice();
console.log("[Analytics] Device =", device);

// ---------------------------------------------
// 📄 DÉTECTION PAGE
// ---------------------------------------------
const page = location.pathname.replace("/", "") || "index";
console.log("[Analytics] Page =", page);

// ---------------------------------------------
// ⏱️ TIMER
// ---------------------------------------------
let startTime = Date.now();
console.log("[Analytics] Timer démarré à", startTime);

// ---------------------------------------------
// 📤 LOG À L’ARRIVÉE
// ---------------------------------------------
client.from("visites").insert({
    device,
    page,
    usage: "USER"
}).select().then(({ error }) => {
    if (error) console.error("[Analytics] Erreur insert arrivée :", error);
    else console.log("[Analytics] Arrivée enregistrée");
});

// ---------------------------------------------
// 📤 LOG À LA SORTIE
// ---------------------------------------------
document.addEventListener("visibilitychange", () => {
    console.log("[Analytics] visibilitychange =", document.visibilityState);

    if (document.visibilityState === "hidden") {
        const duration = Math.round((Date.now() - startTime) / 1000);
        console.log("[Analytics] Durée =", duration, "secondes");

        client.from("visites").insert({
            device,
            page,
            duration_seconds: duration,
            usage: "USER"
        }).select().then(({ error }) => {
            if (error) console.error("[Analytics] Erreur insert sortie :", error);
            else console.log("[Analytics] Sortie enregistrée");
        });
    }
});
