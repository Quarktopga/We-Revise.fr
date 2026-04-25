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

// ---------------------------------------------
// 📄 DÉTECTION PAGE
// ---------------------------------------------
const page = location.pathname.replace("/", "") || "index";

// ---------------------------------------------
// ⏱️ TIMER
// ---------------------------------------------
let startTime = Date.now();

// ---------------------------------------------
// 📤 LOG À L’ARRIVÉE (via Supabase-js)
// ---------------------------------------------
if (typeof client !== "undefined") {
    client.from("visites").insert({
        device,
        page,
        usage: "USER"
    });
} else {
    console.error("Supabase client non trouvé : vérifie supabase.js");
}

// ---------------------------------------------
// 📤 LOG À LA SORTIE (durée via sendBeacon)
// ---------------------------------------------
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        const duration = Math.round((Date.now() - startTime) / 1000);

        const payload = {
            device,
            page,
            duration_seconds: duration,
            usage: "USER"
        };

        navigator.sendBeacon(
            "https://jaedzrrkdtglnltvbded.supabase.co/rest/v1/visites",
            JSON.stringify(payload)
        );
    }
});
