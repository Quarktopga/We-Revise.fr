/* ============================================================
   We Revise — ask.js
   Assistant interne basé sur mots-clés + effet typewriter
   ============================================================ */


/* ============================================================
   We Revise — ask.js
   ============================================================ */

// box doit être accessible partout (getResponse, typeWriter, etc.)
const box = document.getElementById("ask-response");

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("ask-input");
    const btn = document.getElementById("ask-btn");

    btn.onclick = () => processQuestion();

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") processQuestion();
    });

    async function processQuestion() {
    const q = input.value.trim().toLowerCase();
    if (q.length === 0) return;

    const result = getResponse(q);  // ← maintenant un objet { text, understood }

    // Enregistrement Supabase (non bloquant)
    saveAskQuery(q, result.understood).catch(err => console.error(err));

    // Effet d’écriture premium
    typeWriter(result.text);
}

});

/* ============================================================
   Enregistrement Supabase : table ask_logs
   ============================================================ */

async function saveAskQuery(question, understood) {
    return await client
        .from("ask_logs")
        .insert([{ question, understood }]);
}

   /* ========================================================
   1. Moteur de mots-clés
   ======================================================== */

function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
/* ============================================================
   Synonymes pour améliorer la compréhension d’ASK
   ============================================================ */

const synonyms = {
    fiche: ["fiche", "fiches", "pdf", "document", "doc", "fichier", "image", "png", "jpeg", "jpg"],
    chapitre: ["chapitre", "chapitres", "section", "dossier"],
    feedback: ["feedback", "avis", "message", "commentaire", "retour"],
    entrainement: ["entrainement", "entrainements", "quiz", "exercice", "exercices", "questions"],
    matiere: ["matiere", "matieres", "discipline", "cours"],
    ask: ["ask", "assistant", "bot", "ia", "aide"]
};
function includesAny(text, keywords) {
    for (const k of keywords) {
        // 1) Vérifie le mot directement
        if (text.includes(k)) return true;

        // 2) Vérifie dans les synonymes
        if (synonyms[k]) {
            for (const syn of synonyms[k]) {
                if (text.includes(syn)) return true;
            }
        }
    }
    return false;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getResponse(rawQuery) {
   
   
    const q = normalize(rawQuery);

    /* Intentions prioritaires */

    // Ajouter une fiche
    if (includesAny(q, ["ajouter", "importer", "mettre"]) &&
        includesAny(q, ["fiche"])) {
        return {
            text: pick([
            "Pour ajouter une fiche : ouvre un chapitre → clique sur « Importer une fiche » → choisis ton fichier → donne-lui un nom → confirme. La fiche sera stockée dans Supabase Storage et visible par tous.",
            "Tu peux importer une fiche en ouvrant un chapitre, puis en cliquant sur « Importer une fiche ». Sélectionne ton fichier, nomme-le, et valide l’import : il sera enregistré dans Supabase Storage.",
            "L’ajout d’une fiche se fait depuis un chapitre : bouton « Importer une fiche », choix du fichier, nom, confirmation. La fiche est ensuite stockée dans Supabase Storage.",
            "Pour mettre une fiche en ligne, rends-toi dans un chapitre et utilise « Importer une fiche ». Choisis ton document, donne-lui un nom, et il sera immédiatement disponible pour tous.",
            "L’import d’une fiche est rapide : ouvre un chapitre, clique sur « Importer une fiche », sélectionne ton fichier et valide. Le document sera automatiquement enregistré dans Supabase Storage."
        ]),
        understood: true
    };
}
    // Ajouter un chapitre
    if (includesAny(q, ["ajouter", "creer", "créer"]) &&
        includesAny(q, ["chapitre"])) {
        return {
            text: pick([
                "Pour créer un chapitre : choisis une matière → clique sur « + Contribuer » → entre un nom simple → regulateur.js vérifie le texte → le chapitre apparaît immédiatement.",
                "La création d’un chapitre se fait dans une matière : bouton « + Contribuer », nom clair, validation par regulateur.js, et le chapitre est ajouté instantanément.",
                "Tu peux ajouter un chapitre en ouvrant une matière puis en cliquant sur « + Contribuer ». Saisis un nom, regulateur.js le vérifie, et le chapitre est créé.",
                "Pour ajouter un chapitre, ouvre une matière et utilise « + Contribuer ». Entre un nom clair, laisse regulateur.js vérifier, et ton chapitre sera créé en quelques secondes.",
                "Créer un chapitre est simple : choisis une matière, clique sur « + Contribuer », propose un nom, et regulateur.js s’assure qu’il est correct avant de l’ajouter."
            ]),
            understood: true
        };
        }    


    /* Catégories générales */

    // Matières
    if (includesAny(q, ["matiere"])) {
        return {
            text: pick([
            "We Revise propose les matières du collège : Français, Histoire, Géographie, EMC, Maths, SPC, Technologie, SVT, Allemand, Espagnol, Anglais, Musique et Latin. Les utilisateurs enrichissent chaque matière avec leurs chapitres et fiches.",
            "Les matières disponibles sur We Revise sont : Français, Histoire, Géographie, EMC, Maths, SPC, Technologie, SVT, Allemand, Espagnol, Anglais, Musique et Latin. Elles contiennent des chapitres et fiches créés par la communauté.",
            "We Revise organise la révision autour des matières du collège : Français, Histoire, Géographie, EMC, Maths, SPC, Technologie, SVT, Allemand, Espagnol, Anglais, Musique et Latin. Chaque matière peut être enrichie par les utilisateurs.",
            "Toutes les matières du collège sont présentes sur We Revise : Français, Histoire, Géographie, EMC, Maths, SPC, Technologie, SVT, Allemand, Espagnol, Anglais, Musique et Latin. Elles évoluent grâce aux contributions des élèves.",
            "We Revise couvre l’ensemble des matières du collège, de Français à Latin. Chaque matière accueille des chapitres et fiches ajoutés librement par les utilisateurs."
        ]),
            understood: true
        };
    }

    // Chapitres
    if (includesAny(q, ["chapitre"])) {
       return {
            text: pick([
            "Les chapitres sont créés par les utilisateurs. Ils appartiennent à une matière et servent à organiser les fiches. Ils sont stockés dans la base Supabase.",
            "Un chapitre est ajouté par les utilisateurs dans une matière. Il permet de regrouper les fiches et est enregistré dans la base Supabase.",
            "Les chapitres structurent les fiches dans chaque matière. Ils sont créés par les utilisateurs et sauvegardés dans la base Supabase.",
            "Un chapitre sert de dossier dans une matière : il regroupe les fiches et est enregistré automatiquement dans la base Supabase.",
            "Les chapitres permettent d’organiser les contenus d’une matière. Ils sont créés par les utilisateurs et stockés dans la base Supabase."
        ]),
            understood: true
        };
    }

    // Fiches
    if (includesAny(q, ["fiche"])) {
        return {
            text: pick([
            "Les fiches sont des fichiers PDF, PNG ou JPEG importés dans un chapitre. Elles sont hébergées dans Supabase Storage et consultables en un clic.",
            "Une fiche est un fichier PDF/PNG/JPEG ajouté dans un chapitre. Elle est stockée dans Supabase Storage et accessible instantanément.",
            "Les fiches correspondent à des documents PDF, PNG ou JPEG importés dans un chapitre. Elles sont enregistrées dans Supabase Storage.",
            "Une fiche est simplement un document que tu ajoutes dans un chapitre. Il est ensuite stocké dans Supabase Storage pour être consulté facilement.",
            "Les fiches sont des documents importés par les utilisateurs dans les chapitres. Elles sont hébergées dans Supabase Storage pour un accès rapide."
        ]),
            understood: true
        };
    }

    // Feedback
    if (includesAny(q, ["feedback"])) {
        return {
            text: pick([
            "La page Feedback permet d’envoyer un message de 300 caractères maximum. Aucun compte n’est requis, et les messages peuvent être lus pour améliorer la plateforme, sans obligation de réponse.",
            "Tu peux laisser un message via la page Feedback (300 caractères max). L’équipe peut les consulter pour améliorer We Revise, mais n’a aucune obligation d’y répondre.",
            "Le Feedback sert à envoyer un court message (300 caractères). Il peut être lu par l’équipe, mais cela ne garantit ni réponse ni prise en compte.",
            "Le Feedback te permet de partager une remarque courte. L’équipe peut les consulter, mais rien ne l’oblige à répondre ou à agir dessus.",
            "Tu peux envoyer une suggestion via le Feedback. C’est anonyme, limité à 300 caractères, et l’équipe peut choisir de le lire ou non."
        ]),
            understood: true
        };
        
    }

    // Entraînement
    if (includesAny(q, ["entrainement"])) {

        return {
            text: pick([
            "La page Entraînement propose des exercices interactifs basés sur les chapitres et fiches. Elle évoluera avec de nouveaux formats.",
            "Les exercices de la page Entraînement utilisent les contenus des chapitres et fiches. De nouvelles activités y seront ajoutées.",
            "La section Entraînement regroupe des activités interactives liées aux fiches et chapitres. Elle sera enrichie progressivement.",
            "L’Entraînement te permet de t’exercer à partir des contenus ajoutés sur We Revise. De nouveaux types d’activités arriveront avec le temps.",
            "La page Entraînement propose des activités basées sur les fiches et chapitres. Elle continuera de s’améliorer au fil des mises à jour."
        ]),
            understood: true
        };
    }

    // ASK
    if (includesAny(q, ["ask"])) {
    
        return {
            text: pick([
            "✦ASK est l’assistant interne de We Revise. Il fonctionne uniquement avec des mots-clés et ne fait aucune requête externe.",
            "✦ASK est un assistant basé sur des mots-clés, conçu pour répondre uniquement à des questions sur We Revise, sans IA externe.",
            "✦ASK est un assistant interne très simple : il reconnaît des mots-clés et répond uniquement sur le fonctionnement de We Revise.",
            "✦ASK n’est pas une IA complète : il analyse juste quelques mots-clés pour t’aider à comprendre We Revise.",
            "✦ASK est un petit assistant intégré à We Revise. Il ne fait que reconnaître des mots-clés pour te guider dans la plateforme."
        ]),
            understood: true
        };
    }

    /* Fonctionnement global */

    if (includesAny(q, ["fonctionne", "marche", "utiliser", "usage"])) {
    
        return {
            text: pick([
            "We Revise est une plateforme de révision collaborative sans compte. Tu choisis une matière, tu ajoutes des chapitres et des fiches, et tout est stocké dans Supabase.",
            "Le fonctionnement de We Revise est simple : aucune inscription, tu ajoutes des chapitres et fiches dans les matières, et Supabase stocke tout.",
            "We Revise fonctionne sans compte : tu navigues dans les matières, ajoutes des chapitres et fiches, et Supabase gère le stockage.",
            "We Revise est pensé pour être simple : tu ajoutes des contenus et Supabase s’occupe de tout enregistrer automatiquement.",
            "Le site fonctionne sans inscription : tu contribues librement, et Supabase assure la sauvegarde des données."
        ]),
            understood: true
        };
    }
        // Informations générales sur We Revise
    if (includesAny(q, ["we revise", "plateforme", "site", "projet", "but", "objectif", "presentation", "présentation"])) {

        return {
            text: pick([
            "We Revise est une plateforme de révision collaborative pensée pour les élèves. Elle permet d’ajouter des chapitres et des fiches dans chaque matière, sans compte et avec une interface simple.",
            "We Revise est un site de révision où chacun peut contribuer en ajoutant des chapitres et des fiches. Le but est de créer une base de contenus claire, organisée et accessible à tous.",
            "We Revise est un projet éducatif qui centralise des fiches et chapitres créés par les utilisateurs. L’objectif est de rendre la révision plus simple, plus rapide et plus collaborative.",
            "We Revise est une plateforme conçue pour faciliter la révision : tu choisis une matière, tu ajoutes des chapitres et des fiches, et tout le monde peut en profiter. Le site repose sur la contribution collective.",
            "We Revise est un espace de révision participatif. Il permet de structurer les matières en chapitres et d’y importer des fiches, le tout sans inscription et avec un fonctionnement volontairement minimaliste."
        ]),
            understood: true
        };
    }

    if (includesAny(q, ["supabase", "stockage", "base", "donnees", "sql"])) {

        return {
            text: pick([
            "We Revise utilise Supabase : la base SQL stocke les matières, chapitres et fiches, et Supabase Storage héberge les fichiers.",
            "La plateforme repose sur Supabase : SQL pour les données (matières, chapitres, fiches) et Storage pour les fichiers PDF/PNG/JPEG.",
            "Supabase gère toute la structure : base SQL pour les données textuelles et Storage pour les fichiers importés.",
            "Supabase est utilisé pour organiser les données : la base SQL gère les textes, et Storage conserve les fichiers.",
            "We Revise s’appuie sur Supabase pour stocker les informations et héberger les fichiers importés par les utilisateurs."
        ]),
            understood: true
        };
    }

    /* Réponse par défaut */
    return {
        text: pick([
        "Je n’ai pas compris ta question. Tu peux me demander des informations sur : les matières, les chapitres, les fiches, l’import, le feedback ou l’entraînement.",
        "Je ne suis pas sûr de comprendre. Tu peux me poser des questions sur les matières, les chapitres, les fiches, l’import ou le feedback.",
        "Je n’ai pas trouvé de réponse. Tu peux m’interroger sur les matières, les chapitres, les fiches, l’import, le feedback ou l’entraînement.",
        "Je ne vois pas encore comment répondre à ça. Essaie de me parler des matières, des chapitres, des fiches ou du feedback.",
        "Je n’ai pas d’information pour cette question. Tu peux m’interroger sur le fonctionnement de We Revise ou ses différentes pages."
    ]),
        understood: false
    };
}


/* ========================================================
   2. Effet machine à écrire premium
   ======================================================== */

let isGenerating = false; // empêche une nouvelle question pendant la génération

function typeWriter(text) {

    if (isGenerating) return; // bloque toute nouvelle génération
    isGenerating = true;

    box.textContent = "";
    let i = 0;

    /* Effet réflexion premium */
    box.textContent = "✦ Réflexion";
    let dots = 0;

    const thinkingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        box.textContent = "✦ Réflexion" + ".".repeat(dots);
    }, 350);

    /* Fonction vitesse naturelle */
    function getSpeed(char) {
        let base = 30 + Math.random() * 45; // vitesse plus lente et plus humaine

        if (".!?".includes(char)) return base + 350;  // pause longue
        if (",;:".includes(char)) return base + 180;  // respiration
        if (char === " ") return base - 20;           // espace rapide

        return base;
    }

    /* Lancement après réflexion */
    setTimeout(() => {
        clearInterval(thinkingInterval);
        box.textContent = "";
        write();
    }, 1200 + Math.random() * 600); // réflexion variable

    /* Machine à écrire */
    function write() {
        if (i < text.length) {
            box.textContent += text.charAt(i);

            const delay = getSpeed(text.charAt(i));
            i++;

            setTimeout(write, delay);
        } else {
            // fin premium : fade-in subtil
            box.style.opacity = 0.85;
            setTimeout(() => {
                box.style.transition = "opacity 300ms ease";
                box.style.opacity = 1;
            }, 30);

            // libère la génération
            setTimeout(() => {
                isGenerating = false;
            }, 200);
        }
    }
}
