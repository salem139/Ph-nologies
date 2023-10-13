
var mymap = L.map('map', {
    center: [48.58, 7.74],
    zoom: 14,
    minZoom: 10,
    maxZoom: 18,
    zoomControl: false
});

var baselayers = {
    LIGHT: L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=OFCl0kpcDyvePBetMgGBXyAYT2B8U7iQmzPMLToEsUT9W1i6Q7WdkHJ3CGUE0o9e', { attribution: 'Master OTG Strasbourg / Guillot ', minZoom: 10 }),
    DARK: L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=OFCl0kpcDyvePBetMgGBXyAYT2B8U7iQmzPMLToEsUT9W1i6Q7WdkHJ3CGUE0o9e', { attribution: 'Master OTG Strasbourg / Guillot', minZoom: 10 }),
    TOPOGRAPHY: L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=OFCl0kpcDyvePBetMgGBXyAYT2B8U7iQmzPMLToEsUT9W1i6Q7WdkHJ3CGUE0o9e', { attribution: 'Master OTG Strasbourg / Guillot', minZoom: 10 }),
    SATELLITE: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Master OTG Strasbourg / Guillot', minZoom: 10 })
};

baselayers.LIGHT.addTo(mymap);

L.control.layers(baselayers, null, { position: 'topright' }, { collapsed: false }).addTo(mymap);

L.control.zoom({
    position: 'topright'
}).addTo(mymap);

L.control.scale({
    position: 'bottomright'
}).addTo(mymap);

var tabCarte = document.getElementById('tabCarte');
var tabTutoriel = document.getElementById('tabTutoriel');
var tabAPropos = document.getElementById("tabAPropos");

tabAPropos.addEventListener("click", function () {
    window.location.href = "https://salem139.github.io/Phenology-2/";
});


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
        content: "Les données étant assez importantes, il est conseillé pour la réactivé du slider de zoomer sur une zone en particulier, mais cela n'est pas obligatoire."
    }
];

tabTutoriel.addEventListener('click', function () {
    var stepIndex = 0;

    function showNextStep() {
        Swal.fire({
            title: tutorialSteps[stepIndex].title,
            html: tutorialSteps[stepIndex].content,
            confirmButtonText: 'Étape suivante &rarr;',
            showCancelButton: true,
            progressSteps: [String(stepIndex + 1)],
            reverseButtons: true,
            cancelButtonText: "Quitter",
            onBeforeOpen: () => {
                $('.swal2-confirm').removeClass('swal2-confirm');
            }
        }).then((result) => {
            if (result.value) {
                stepIndex++;
                if (stepIndex < tutorialSteps.length) {
                    showNextStep();
                } else {
                    Swal.fire({
                        title: 'Informations complémentaires',
                        html: "Pour plus de renseignements, veuillez vous référer à la section '<u>À propos</u>'.",
                        confirmButtonText: "C'est parti !"
                    });
                }
            }
        });
    }

    showNextStep();
});



// ---------------------------------------- arbres ---------------------------------------// 
$(document).ready(function () {
    var treeMarkers = {};
    var dataArray;
    var selectedDay;

    var slider = $("#slider");

    function createCircleMarker(latlng, color = 'gray', radius = 2) {
        let circleRadius = 2;

        const currentZoom = mymap.getZoom();

        if (currentZoom >= 10 && currentZoom < 12) {
            circleRadius = 1;
        } else if (currentZoom >= 12 && currentZoom < 17) {
            circleRadius = 2;
        } else if (currentZoom === 17) {
            circleRadius = 3;
        } else if (currentZoom === 18) {
            circleRadius = 4;
        }

        return L.circleMarker(latlng, {
            radius: circleRadius,
            fillColor: color,
            color: color,
            weight: 0,
            opacity: 1,
            fillOpacity: 0.85
        });
    }

    mymap.on('zoomend', function () {
        treeMarkerGroup.eachLayer(function (layer) {
            layer.setRadius(createCircleMarker(layer.getLatLng()).getRadius());
        });
    });

    function createTreeMarkers(data) {
        data.features.forEach(feature => {
            const treeId = feature.properties['fid'];
            const latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
            const circleMarker = createCircleMarker(latlng);
            circleMarker.addTo(mymap);
            treeMarkers[treeId] = circleMarker;
        });
        console.log('Tree markers created.');
    }

    var treeMarkerGroup = L.layerGroup().addTo(mymap);

    function updateVisibleTreeColors() {
        treeMarkerGroup.clearLayers();
        const bounds = mymap.getBounds();

        dataArray.forEach(data => {
            data.features.forEach(feature => {
                const treeId = feature.properties['fid'];
                const circleMarker = treeMarkers[treeId];
                let color = 'gray';

                const latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                if (bounds.contains(latlng)) {
                    const sos = parseInt(feature.properties['PNT_SOS']);
                    const peak = parseInt(feature.properties['PNT_Peak']);
                    const eos = parseInt(feature.properties['PNT_EOS']);

                    if (!isNaN(sos) && !isNaN(peak) && !isNaN(eos)) {
                        if (selectedDay >= sos && selectedDay < peak) {
                            color = 'lightgreen';
                        } else if (selectedDay >= peak && selectedDay < eos) {
                            color = 'darkgreen';
                        } else if (selectedDay >= eos) {
                            color = 'purple';
                        }
                    }

                    if (circleMarker) {
                        circleMarker.setStyle({ fillColor: color });
                        circleMarker.addTo(treeMarkerGroup);
                    }
                }
            });
        });

        console.log('Tree colors updated for the visible area.');
    }

    mymap.on('moveend', updateVisibleTreeColors);

    function updateTreeColors(selectedDay) {
        treeMarkerGroup.clearLayers();

        dataArray.forEach(data => {
            data.features.forEach(feature => {
                const treeId = feature.properties['fid'];
                const circleMarker = treeMarkers[treeId];
                let color = 'gray';

                const sos = parseInt(feature.properties['PNT_SOS']);
                const peak = parseInt(feature.properties['PNT_Peak']);
                const eos = parseInt(feature.properties['PNT_EOS']);

                if (!isNaN(sos) && !isNaN(peak) && !isNaN(eos)) {
                    if (selectedDay >= sos && selectedDay < peak) {
                        color = 'lightgreen';
                    } else if (selectedDay >= peak && selectedDay < eos) {
                        color = 'darkgreen';
                    } else if (selectedDay >= eos) {
                        color = 'purple';
                    }
                }

                if (circleMarker) {
                    circleMarker.setStyle({ fillColor: color });
                    circleMarker.addTo(treeMarkerGroup);
                }
            });
        });

        console.log('Tree colors updated.');
    }

    var sliderTitle = $('#slider-title');
    var sliderLabel = document.getElementById('day-label');
    selectedDay = slider.val();

    slider.on('input', function () {
        selectedDay = $(this).val();
        sliderTitle.text('Phénologie des arbres en 2022');
        sliderLabel.textContent = "Jour de l'année : " + selectedDay;
        updateTreeColors(selectedDay);
        console.log('Slider value changed to: ' + selectedDay);
    });

    sliderTitle.text('Phénologie des arbres en 2022');
    sliderLabel.textContent = "Jour de l'année : " + selectedDay;

    var geojsonUrls = [
        'https://raw.githubusercontent.com/salem139/Ph-nologies/main/BD_arbre.geojson'
    ];

    function loadGeoJSON(url) {
        return fetch(url)
            .then(response => response.json());
    }

    Promise.all(geojsonUrls.map(url => loadGeoJSON(url)))
        .then(dataArrayResponse => {
            dataArray = dataArrayResponse;
            dataArray.forEach(data => {
                createTreeMarkers(data);
            });
            updateTreeColors(selectedDay);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données GeoJSON :', error);
        });

    var survolContainer = document.getElementById('survol-container');
    var survolContent = document.getElementById('survol-content');

});

// --------------------------------------------- Communes ------------------------------------- //

var communesLayer = L.tileLayer.wms('http://31.32.249.29:85/cgi-bin/qgis_mapserv.fcgi?', {
    layers: 'limites_ems',
    MAP:'/M2OTG/Romain/Carte_phenology.qgs',
    format: 'image/png',
    transparent: true,
}).addTo(mymap);


// Gestionnaire d'événements pour la couche "Communes"
var communesToggle = document.getElementById('communesToggle');

// Fonction pour activer ou désactiver la couche des communes
function toggleCommunesLayer(activate) {
    if (activate) {
        communesLayer.addTo(mymap);
        communesToggle.checked = true; // Cochez le bouton
    } else {
        mymap.removeLayer(communesLayer);
        communesToggle.checked = false; // Décochez le bouton
    }
}

// Ajoutez la couche des communes à la carte et activez le bouton dès l'ouverture de la page
toggleCommunesLayer(true);

// Ajoutez un gestionnaire d'événements pour le bouton de bascule
communesToggle.addEventListener('change', function () {
    toggleCommunesLayer(this.checked);
});


// -------------------------------------- Mapuce ---------------------------------------------//

// Code pour la couche "MAPUCES"
var mapuceLayer = L.tileLayer.wms('http://31.32.249.29:85/cgi-bin/qgis_mapserv.fcgi?', {
    MAP: '/M2OTG/Romain/Carte_phenology.qgs',
    layers: 'LCZ_mapuce',
    format: 'image/png',
    transparent: true,
});

function toggleLegendVisibility(show) {
    var legendContainer = document.getElementById('legendContainer');
    if (show) {
      legendContainer.style.display = 'block';
    } else {
      legendContainer.style.display = 'none';
    }
}

mapuceToggle.addEventListener('change', function () {
    if (this.checked) {
        mapuceLayer.addTo(mymap);
        // Affichez la légende lorsque la couche est activée
        toggleLegendVisibility(true);
    } else {
        mymap.removeLayer(mapuceLayer);
        // Masquez la légende lorsque la couche est désactivée
        toggleLegendVisibility(false);
    }
});


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
    // ... Ajoutez les autres codes et leurs propriétés ici
};
  
// Ajoutez le contenu de la légende LCZ au div
var legendContent = `
    <h2 class="legend-title">Légende MAPUCE</h2>
    <div id="legend"></div>
`;

for (var code in legendLCZ) {
    var item = legendLCZ[code];
    legendContent += `
        <div class="legend-item">
            <span class="legend-color" style="background-color: ${item.color}"></span>
            ${item.name}
        </div>
    `;
}

document.getElementById('legendContainer').innerHTML = legendContent;
