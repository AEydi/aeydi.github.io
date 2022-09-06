var centerLat = 35.699739;
var centerLng = 51.338097;
var searchText = "";
var allResult = [];
var farParmacy = 0;
var desire = 200;
var actualZoom = 14;
var possible = [];
var parmacies = [];
var done = 0;

//init the map
var myMap = new L.Map('map', {
    key: 'web.89f242966233457cbb1f46c665eca8b9',
    maptype: 'dreamy',
    poi: true,
    traffic: false,
    center: [35.699739, 51.338097],
    zoom: 14
});
//adding the marker to map
var marker = L.marker([35.699739, 51.338097]).addTo(myMap);
//on map binding
myMap.on('click', addMarkerOnMap);

//on map click function
function addMarkerOnMap(e) {
    marker.setLatLng(e.latlng);
    //marker.bindPopup(`lat : ${e.latlng.lat} - lng : ${e.latlng.lng}`).openPopup();
    centerLat = e.latlng.lat;
    centerLng = e.latlng.lng;
    parmacies = [];
    done = 0;
    possible = []
    search("داروخانه");
    //var texts = ["داروخانه", "درمانگاه", "بیمارستان", "مطب"];
    //for (i = 0; i < 4; i++) {
    //    search(texts[i])
    //}
}

var searchMarkers = [];

//sending request to Search API
function search(text) {
    marker.setLatLng([centerLat, centerLng]);
    //getting term value from input tag
    var term = text;
    // we need b inside search to create circle and remove that global not work here
    var b;
    var condition = false;
    //making url 
    var url = `https://api.neshan.org/v1/search?term=${term}&lat=${centerLat}&lng=${centerLng}`;
    //add your api key
    var params = {
        headers: {
            'Api-Key': 'service.11ed21519e32475492de20770d1c02ae'
        },

    };
    //sending get request
    axios.get(url, params)
        .then(data => {
            //set center of map to marker location
            actualZoom = myMap._zoom;
            myMap.flyTo([centerLat, centerLng], actualZoom);
            //for every search resualt add marker
            if (term == "داروخانه") {
                farParmacy = distance(data.data.items[29].location.y, data.data.items[29].location.x, centerLat, centerLng)
                b = L.circle([centerLat, centerLng], {
                    color: '#2979FF',
                    weight: 1,
                    fillColor: '#2979FF',
                    fillOpacity: 0.1,
                    radius: farParmacy
                }).addTo(myMap);
                setTimeout(() => {
                    myMap.removeLayer(b);
                }, 5000); // 👈️ time in milliseconds
            }
            var count = data.data.count;
            for (i = 0; i < data.data.count; i++) {
                var info = data.data.items[i];
                var searchMarker;
                if (!(allResult.some(e => e.title === info.title && distance(e.location.y, e.location.x, info.location.y, info.location.x) < 30))) {
                    allResult.push(info)
                    if (term == "داروخانه") {
                        parmacies.push(info);
                        searchMarker = L.circle([info.location.y, info.location.x], {
                            color: '#00E676',
                            weight: 1,
                            fillColor: '#00E676',
                            fillOpacity: 0.3,
                            radius: 25
                        }).addTo(myMap);
                        searchMarker.bindPopup(info.title);
                        searchMarkers.push(searchMarker);
                    } else if ((term == "درمانگاه") || term == "بیمارستان") {
                        condition = false;
                        if (distance(info.location.y, info.location.x, centerLat, centerLng) < farParmacy) {
                            condition = true;
                            for (j = 0; j < parmacies.length; j++) {
                                if (distance(parmacies[j].location.y, parmacies[j].location.x, info.location.y, info.location.x) < desire) {
                                    condition = false;
                                }
                            }
                        }
                        if (condition) {
                            possible.push({
                                name: info.title,
                                type: "درمانگاه",
                                location: info.location
                            });
                        }
                        searchMarker = L.circle([info.location.y, info.location.x], {
                            color: '#FFC400',
                            weight: 1,
                            fillColor: '#FFC400',
                            fillOpacity: 0.3,
                            radius: 50
                        }).addTo(myMap);
                        searchMarker.bindPopup(info.title);
                        searchMarkers.push(searchMarker);
                    } else {
                        condition = false;
                        if (distance(info.location.y, info.location.x, centerLat, centerLng) < farParmacy) {
                            condition = true;
                            for (j = 0; j < parmacies.length; j++) {
                                if (distance(parmacies[j].location.y, parmacies[j].location.x, info.location.y, info.location.x) < desire) {
                                    condition = false;
                                }
                            }
                        }
                        if (condition) {
                            possible.push({
                                name: info.title,
                                type: "مطب",
                                location: info.location
                            });
                        }
                        searchMarker = L.circle([info.location.y, info.location.x], {
                            color: '#FF1744',
                            weight: 1,
                            fillColor: '#FF1744',
                            fillOpacity: 0.5,
                            radius: 25
                        }).addTo(myMap);
                        searchMarker.bindPopup(info.title);
                        searchMarkers.push(searchMarker);
                    }
                }
                if (i == count - 1) {
                    var texts = ["مطب",
                            "بیمارستان",
                            "درمانگاه"
                    ];
                    if (done < 3) {
                        search(texts[done]);
                    }
                    done = done + 1;
                }
                if (done == 4) {
                    for (k = 0; k < possible.length; k++) {
                        if (possible[k].type == "درمانگاه") {
                            searchPlus("داروخانه", "درمانگاه", possible[k].name, possible[k].location.y, possible[k].location.x)
                        } else if (possible[k].type == "مطب") {
                            searchPlus("داروخانه", "مطب", possible[k].name, possible[k].location.y, possible[k].location.x)
                        }
    
                    }
                }
            }

        }).catch(error => {
            console.log(error.response);
        });
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;
    var d = 12742000 * Math.asin(Math.sqrt(a));
    return d // 2 * R; R = 6371 km
}

function searchPlus(text, type, name, slat, slng) {
    var term = text;
    //making url 
    var url = `https://api.neshan.org/v1/search?term=${term}&lat=${slat}&lng=${slng}`;
    //add your api key
    var params = {
        headers: {
            'Api-Key': 'service.11ed21519e32475492de20770d1c02ae'
        },

    };
    //sending get request
    axios.get(url, params)
        .then(data => {
            //for every search resualt add marker
            var parmacy = [];
            var searchMarkerr;
            var infos
            console.log(data.data);
            for (ii = 0; ii < data.data.count; ii++) {
                ab = 1;
                infos = data.data.items[ii];
                parmacy.push(infos);
                
                //searchMarkers.push(searchMarker);
            }
            var cond = true;
            for (ii = 0; ii < parmacy.length; ii++) {
                if (distance(parmacy[ii].location.y, parmacy[ii].location.x, slat, slng) < desire) {
                    cond = false;
                }
            }
            if (cond) {
                if (type == "درمانگاه") {
                    searchMarkerr = L.circle([slat, slng], {
                        color: '#FFC400',
                        weight: 1,
                        fillColor: '#FFC400',
                        fillOpacity: 0.1,
                        radius: desire
                    }).addTo(myMap);
                    searchMarkerr.bindPopup(name);
                } else if (type == "مطب") {
                    searchMarkerr = L.circle([slat, slng], {
                        color: '#FF1744',
                        weight: 1,
                        fillColor: '#FF1744',
                        fillOpacity: 0.1,
                        radius: desire
                    }).addTo(myMap);
                    searchMarkerr.bindPopup(name);
                }
            }
        }).catch(error => {
            console.log(error.response);
        });
}

//random color generator :))
function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}