// ----------------------------------------------------------------------------------------------------------------// 
// ---------------------------------------- La carte et ces fonds de cartes ---------------------------------------// 
// ----------------------------------------------------------------------------------------------------------------// 


// Variable pour la création de la carte, et ces paramètres
var mymap = L.map('map', {
    center: [48.58, 7.74], // Les coordonnées appliqués à la vue lors de l'ouverture de la page
    zoom: 14, // Le niveau de zoom associé
    minZoom: 10, // Le niveau min de zoom que l'on modifier sur la carte
    maxZoom: 18, // Même chose avec le niveau maximum
    zoomControl: false // Le zoom de base est désactivé, nous le définissons par la suite
});

// Variable pour l'appel et l'affichage des fonds de cartes
var baselayers = {
    LIGHT: L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=OFCl0kpcDyvePBetMgGBXyAYT2B8U7iQmzPMLToEsUT9W1i6Q7WdkHJ3CGUE0o9e', { attribution: 'Master OTG Strasbourg / Guillot ', minZoom: 10 }),
    DARK: L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=OFCl0kpcDyvePBetMgGBXyAYT2B8U7iQmzPMLToEsUT9W1i6Q7WdkHJ3CGUE0o9e', { attribution: 'Master OTG Strasbourg / Guillot', minZoom: 10}),
    TOPOGRAPHY: L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=OFCl0kpcDyvePBetMgGBXyAYT2B8U7iQmzPMLToEsUT9W1i6Q7WdkHJ3CGUE0o9e', { attribution: 'Master OTG Strasbourg / Guillot', minZoom: 10}),
    SATELLITE: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Master OTG Strasbourg / Guillot', minZoom: 10})
};

baselayers.LIGHT.addTo(mymap); // Le fond de carte light est définit par défaut pour l'affichage 

L.control.layers(baselayers, null, { position: 'topright' }, { collapsed: false }).addTo(mymap); // On ajoute l'onglet pour la sélection des différents fonds

// On définit et ajoute la sélection des niveaux de zoom
L.control.zoom({
    position: 'topright' // La position sur la page
}).addTo(mymap);

// On définit et ajoute la sélection de l'échelle
L.control.scale({
    position: 'bottomright'
}).addTo(mymap);

// ----------------------------------------------------------------------------------------------------------------// 
// ------------------------------------------- Les onglets et le tutoriel -----------------------------------------// 
// ----------------------------------------------------------------------------------------------------------------// 


// Création des variables contenant les élements html avec leurs id correspondant, pour la carte, l'onglet du tutoriel, d'a propos et de la référence de la page
var tabCarte = document.getElementById('tabCarte');
var tabAPropos = document.getElementById("tabAPropos");
var tabTutoriel = document.getElementById('tabTutoriel');
var tabref = document.getElementById("tabref");

// Pour l'onglet A propos, on fait appel à une autre page html créer pour la visualisation 
tabAPropos.addEventListener("click", function () { // Cela s'exécute lorsque l'on clique sur l'onglet
    window.location.href = "https://raw.githubusercontent.com/salem139/Ph-nologies/main/A_Propos.html";
});



// Le tutoriel ; on définit d'abord le titre de chaque étape ainsi que son contenu
var tutorialSteps = [
    {
        title: "Tutoriel de l'interface",
        content: "Cette interface donne à l'utilisateur à la fois la possibilité de visualiser une partie de la population arborée de l'Eurométropole de Strasbourg. La coloration des arbres apporte des informations sur la phénologie à travers l'étude de plusieurs métriques phénologiques pour l'année 2022. "
    },
    {
        title: "Prise en main",
        content: "Il est possible de se déplacer sur la carte, de modifier le zoom, ou encore de changer le fond de la carte."
    },
    {
        title: "Visualisation des données",
        content: "En cliquant à travers les boutons présents, il est possible d'obtenir des informations variées en fonction du cas souhaité ; les limites des communes de l'Eurométropole ou encore les local climates zones (classification de la morphologie urbaine)."
    },
    {
        title: "Visualisation de données avancées",
        content: "En déplacement le slider, il vous est possible de visualiser l'apparition des métriques phénologiques (en fonction des jours de l'année)."
    },  
    {
        title: "Fluidité de la page",
        content: "Les données étant assez importantes, il est conseillé pour la réactivité du slider de zoomer sur la page (zoomer sur une zone en particulier), mais cela n'est pas obligatoire."
    }
];

// Le tutoriel démarre à la première étape lorsque l'on clique sur l'onglet
tabTutoriel.addEventListener('click', function () {
    var stepIndex = 0;

    // Cette fonction permet de gérer l'intéractivité de chaque étape du tutoriel
    function showNextStep() {
        Swal.fire({
            title: tutorialSteps[stepIndex].title, // Affichage du titre
            html: tutorialSteps[stepIndex].content, // Affichage du contenu
            confirmButtonText: 'Étape suivante &rarr;', // Affichage du bouton passage à l'étape suivante
            showCancelButton: true, // Ajout du bouton ou l'on peut quitter le menu tutoriel
            progressSteps: [String(stepIndex + 1)], // Définition des étapes avec un index pour passer à l'étape suivante
            reverseButtons: true, // On peut revenir à l'étape précédente
            cancelButtonText: "Quitter", // Le titre du bouton quitter
            onBeforeOpen: () => { // Modification des éléments d'affichage avant son ouverture
                $('.swal2-confirm').removeClass('swal2-confirm');
            }
        }).then((result) => { // Exécution des étapes fléchées
            if (result.value) { // Contrôle si les flèches ont été activées
                stepIndex++; // Si oui, on ingrémente la variable step index sur le nombre d'étape enregistrer
                if (stepIndex < tutorialSteps.length) {
                    showNextStep(); // On passe à l'étape suivante
                } else { // Condition si il n'y a pas d'étape suivante (cad la fin)
                    Swal.fire({ // On ajoute un dernier onglet avec ; 
                        title: 'Informations complémentaires', // Le titre
                        html: "Pour plus de renseignements, veuillez vous référer à la section '<u>À propos</u>'.", // Le texte lien l'onglet A propos
                        confirmButtonText: "C'est parti !" // Un bouton de confirmation de fin de tutoriel permettant de revenir à la vue carte
                    });
                }
            }
        });
    }

    showNextStep(); 
});



// On réalise le même principe pour ce second 'tutoriel'. Ce format a été choisi par le peu de donnée à représenter. 
var referenceSteps = [
    {
        title: "Réalisation",
        content: "Guillot Romain<br>M2 OTG<br>2023/2024<br>UE : Service Web"
    },
    {
        title: "Sitographie",
        content: "https://docs.qgis.org/3.28/fr/docs/server_manual/services/wms.html<br>https://leafletjs.com/reference.html"
    }
];


tabref.addEventListener('click', function () {
    var stepIndex = 0;

    function showNextStep() {
        var buttons = ["Quitter"];
        if (stepIndex === 0) {
            buttons.unshift('Étape suivante &rarr;');
        }

        Swal.fire({
            title: referenceSteps[stepIndex].title,
            html: referenceSteps[stepIndex].content,
            showCancelButton: true,
            confirmButtonText: buttons[0],
            showConfirmButton: buttons.length > 1,
            progressSteps: [String(stepIndex + 1)],
            reverseButtons: true,
            cancelButtonText: "Quitter",
            onBeforeOpen: () => {
                $('.swal2-confirm').removeClass('swal2-confirm');
            }
        }).then((result) => {
            if (result.value) {
                stepIndex++;
                if (stepIndex < referenceSteps.length) {
                    showNextStep();
                }
            }
        });
    }

    showNextStep();
});

// ----------------------------------------------------------------------------------------------------------------// 
// --------------------------------------------- La couche commune ------------------------------------------------// 
// ----------------------------------------------------------------------------------------------------------------// 

// On charge dans une variable les données (en version image) de notre couche commune depuis le serveur qgis grâce à un lien wms
var communesLayer = L.tileLayer.wms('http://31.32.249.29:85/cgi-bin/qgis_mapserv.fcgi?', { // On fait appel au serveur
    layers: 'limites_ems', // On spécifie la couche 
    MAP:'/M2OTG/Romain/Carte_phenology.qgs', // On spécifie le bon répertoire pour notre projet qgis
    format: 'image/png', // On indique le bon format
    transparent: true, // On indique la transparence pour la superposition à la carte et à d'autres éléments
}).addTo(mymap); // On ajoute à la carte 


// La variable de gestion d'événements pour la couche communes
var communesToggle = document.getElementById('communesToggle');

// Notre fonction pour activer ou désactiver la couche des communes
function toggleCommunesLayer(activate) {
    if (activate) { // Condition si on l'active 
        communesLayer.addTo(mymap);// Elle s'affiche à la carte
        communesToggle.checked = true; // On coche le bouton
    } else { // Condition 'inverse' 
        mymap.removeLayer(communesLayer);
        communesToggle.checked = false; 
    }
}

// Permet d'ajouter la couche à la carte et activez le bouton dès l'ouverture de la page
toggleCommunesLayer(true);

// On ajoute un gestionnaire d'événements pour le bouton de bascule
communesToggle.addEventListener('change', function () {
    toggleCommunesLayer(this.checked); // Permet la vérification de l'évènement du bouton
});


// ----------------------------------------------------------------------------------------------------------------// 
// --------------------------------------------- La couche MAPUCE -------------------------------------------------// 
// ----------------------------------------------------------------------------------------------------------------// 


// Code pour la couche "MAPUCES"
// Même principe que pour la couche précédente
var mapuceLayer = L.tileLayer.wms('http://31.32.249.29:85/cgi-bin/qgis_mapserv.fcgi?', {
    MAP: '/M2OTG/Romain/Carte_phenology.qgs',
    layers: 'LCZ_mapuce',
    format: 'image/png',
    transparent: true,
});

//Définition de la fonction pour basculer la visibilité de la légende
function toggleLegendVisibility(show) {
    var legendContainer = document.getElementById('legendContainer'); // Récupération de l'élément HTML avec l'ID "legendContainer"
    if (show) { // Si l'argument "show" est vrai (true), on affiche la légende 
      legendContainer.style.display = 'block';
    } else {// Sinon non
      legendContainer.style.display = 'none';
    }
}
// Ajout d'un écouteur d'événement "change" à la case à cocher avec l'ID "mapuceToggle"
mapuceToggle.addEventListener('change', function () {
    if (this.checked) { // Si la case est coché
        mapuceLayer.addTo(mymap); // On affiche la couche à la carte
        // Affichage de la légende lorsque la couche est activée
        toggleLegendVisibility(true);
    } else {
        mymap.removeLayer(mapuceLayer);
        // On masque la légende lorsque la couche est désactivée
        toggleLegendVisibility(false);
    }
});

// On créer notre dictionnaire pour les rectangles de couleurs et la typologie des classes correspondantes.
var legendLCZ = {
    1: { color: '#8f0f0f', name: 'Compact high-rise' },
    2: { color: '#e31a1c', name: 'Compact mid-rise' },
    3: { color: '#f25e60', name: 'Compact low-rise' },
    4: { color: '#d15c0e', name: 'Open high-rise' },
    5: { color: '#ff7f00', name: 'Open mid-rise' },
    6: { color: '#f2b75e', name: 'Open low-rise' },
    7: { color: '#ecdf26', name: 'Lightweight low-rise' },
    8: { color: '#dccccc', name: 'Large low-rise' },
    9: { color: '#d4d69d', name: 'Sparsely built' },
    101: { color: '#126d27', name: 'Dense trees' },
    102: { color: '#26a42a', name: 'Scattered trees' },
    104: { color: '#dcff6b', name: 'Low plants' },
    105: { color: '#000000', name: 'Bare rock or paved' },
    107: { color: '#a6cee3', name: 'Water' },
};
  
// On ajoute le contenu de la légende LCZ à la balise
var legendContent = `
    <h2 class="legend-title">Légende MAPUCE</h2>
    <div id="legend"></div>
`;

for (var code in legendLCZ) {
    var item = legendLCZ[code]; // On ajoute tous les items à la légende, en lien avec la balise et le style
    legendContent += `
        <div class="legend-item"> 
            <span class="legend-color" style="background-color: ${item.color}"></span>
            ${item.name}
        </div>
    `;
}

document.getElementById('legendContainer').innerHTML = legendContent; // On récupère l'élément HTML qui a l'ID "legendContainer" et remplace le contenu par ce qui est contenu dans la variable


// ----------------------------------------------------------------------------------------------------------------// 
// --------------------------------------------- La couche arborée ------------------------------------------------// 
// ----------------------------------------------------------------------------------------------------------------// 

var treeMarkers = {}; // Création d'un marqueur vide pour le stockage des données de la fonction
var previousSelectedDay = null; // Création d'un variable pour le stockage des données qui n'ont pas besoin d'être mise à jour
var data = null; // Déclaration de la variable data
var sliderTitle = $("Phénologie des arbres en 2022"); // On définit le titre du slider


$(document).ready(function () { // On éxécute la suite du code lorsque la page est entièrement chargée. 
    var slider = $("#slider"); // On initialise le slider 
    var treeMarkerGroup = L.layerGroup().addTo(mymap); // On ajoute les marqueurs directement à la carte

    // Il s'agit de la fonction qui créer les cercles des données d'arbres 
    function createCircleMarker(latlng, color = 'gray', radius = 2) { // Avec les coordonnées, on définit également une couleur et une taille de cercle 
        let circleRadius = 2; // Par défault, la taille est de 2

        const currentZoom = mymap.getZoom(); // Permet d'avoir les informations de zoom pour la suite de la fonction

        if (currentZoom >= 10 && currentZoom < 12) { // On créer une condition en fonction du niveau de zoom pour assigner des tailles de cercles en fonction du niveau de zoom
            circleRadius = 1;
        } else if (currentZoom >= 12 && currentZoom < 15) {
            circleRadius = 2;
        } else if (currentZoom === 15) {
            circleRadius = 4;
        } else if (currentZoom >= 16 && currentZoom < 18) {
            circleRadius = 10;
        }
        // On retourne les informations et on ajoute des informations fixes sur les cercles
        return L.circleMarker(latlng, { // Les coordonnées 
            radius: circleRadius, // La taille définit juste au dessus
            fillColor: color, // La couleur du contour
            color: color, // La couleur du cercle
            weight: 0, // L'épaisseur de la bordure 
            opacity: 1, // L'opacité 
            fillOpacity: 0.85 // L'opacité pour le contour 
        });
    }
    // Une seconde fonction pour la création des marqueurs d'arbres
    function createTreeMarkers() {
        data.features.forEach(feature => {
            const treeId = feature.properties['fid']; // On extrait les données dans une variable à partir de la colonne fid de la table attributaire de la couche 
            const latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]); // On récupère le couple de coordonnées pour le placement des points sur la carte 
            const circleMarker = createCircleMarker(latlng); // On créer le marqueur en fonction de la fonction précédente avec les marqueurs circulaires
            treeMarkers[treeId] = circleMarker; // Chaque marqueur est stocké dans l'objet treeMarkers avec l'identifiant de l'arbre comme clé
        });
        updateVisibleTreeMarkers(); // On met à jour la fonction avec les données de la fonction d'en dessous
        console.log('Tree markers created.');
    }
    // Une autre fonction pour mettre à jour les marqueurs en fonction de la fenêtre d'affichage 
    function updateVisibleTreeMarkers() {
        treeMarkerGroup.clearLayers(); // Efface les marqueurs existants dans le groupe de calques
        data.features.forEach(feature => { // On lit toutes les entités
            const treeId = feature.properties['fid']; // par rapport à toujours la colonne fid (identifiant unique)
            const circleMarker = treeMarkers[treeId];  // Récupère le marqueur de cercle pour cet arbre
            if (circleMarker && mymap.getBounds().contains(circleMarker.getLatLng())) { // On ajoute à la couche uniquement si les marqueurs si ils sont dans la fenêtre d'affichage
                treeMarkerGroup.addLayer(circleMarker);
            }
        });
    }
     // Une autre fonction pour mettre à jour les marqueurs en fonction du jour spécifié par le slider ; seulement le même principe que la fonction précédente
    function updateTreeColors(selectedDay) {
        treeMarkerGroup.clearLayers();
        data.features.forEach(feature => {
            const treeId = feature.properties['fid'];
            const circleMarker = treeMarkers[treeId];
            let color = 'gray'; // On définit la couleur de base

            // On créer des variables (const) pour récupérer les jours des 3 métriques phénologiques
            const sos = parseInt(feature.properties['PNT_SOS']);
            const peak = parseInt(feature.properties['PNT_Peak']);
            const eos = parseInt(feature.properties['PNT_EOS']);

            // On créer une variable pour enregistrer les couleurs des marqueurs en fonction de la métrique
            var colorMap = {
                1: 'lightgreen',
                2: 'darkgreen',
                3: 'purple'
            };

            // On vérifie si les valeurs sont des nombres
            // On créer des conditions pour spécifier les couleurs en fonction de la variable créer juste au dessus
            if (selectedDay >= sos && selectedDay < peak) {
                color = colorMap[1];
            } else if (selectedDay >= peak && selectedDay < eos) {
                color = colorMap[2];
            } else if (selectedDay >= eos) {
                color = colorMap[3];
            }

            if (circleMarker) { // On vérifie si circleMarker est défini
                circleMarker.setStyle({ fillColor: color }); // On applique la couleur spécifique pour l'arbre
                if (mymap.getBounds().contains(circleMarker.getLatLng())) { // On applique la couleur si les marqueurs sont contenu dans la vue de l'utilisateur 
                    treeMarkerGroup.addLayer(circleMarker);
                }
            }
        });

        console.log('Tree colors updated.');
    }

    // Événement pour détecter le changement de position de la carte
    mymap.on('moveend', function () {
        updateVisibleTreeMarkers();
    });

    // Événement pour détecter le changement de zoom de la carte
    mymap.on('zoomend', function () {
        updateVisibleTreeMarkers();
    });

    // Fonction pour faire une requete http et chargé les données
    fetch('https://raw.githubusercontent.com/salem139/Ph-nologies/main/BD_arbre.geojson') // Permet le chargement de notre fichier geojson
        .then(response => response.json()) // Une fois que la donnée est disponible 
        .then(responseData => {
            data = responseData; // On assigne les données à la variable data globale
            createTreeMarkers(); // On créer les marqueurs d'arbres
            updateTreeColors(selectedDay); // On met à jour les couleurs des arbres en fonction du jour sélectionné
            console.log('GeoJSON data loaded.');  // Simple vérification, aussi des problèmes à la configuration ;(
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données GeoJSON:', error);
        });

    var selectedDay = document.getElementById('slider').value;  // On récupère la valeur du slider
    var sliderLabel = document.getElementById('day-label');

    // Écouteur d'événement pour le changement de la valeur du slider
    slider.on('input', function () {
        selectedDay = $(this).val(); // On met à jour la valeur de selectedDay avec la nouvelle valeur du slider
        if (selectedDay !== previousSelectedDay) { // On vérifie si la valeur a changé depuis la dernière mise à jour
            updateTreeColors(selectedDay);  // On appelle la fonction updateTreeColors pour mettre à jour les couleurs des marqueurs
            previousSelectedDay = selectedDay;  // On met à jour la valeur précédente avec la nouvelle valeur
        }
        sliderLabel.textContent = "Jour de l'année : " + selectedDay; // On met à jour l'étiquette de l'affichage du jour de l'année
    });

});

// ----------------------------------------------------------------------------------------------------------------// 
// --------------------------------------------- C'est la fin ... -------------------------------------------------// 
// ----------------------------------------------------------------------------------------------------------------// 
