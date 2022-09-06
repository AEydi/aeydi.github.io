var centerLat = 35.699739;
var centerLng = 51.338097;
var searchText = ""
var allResult = []

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

var greenIcon = new L.Icon({
    iconUrl: `icon/marker-icon-2x-green.png`,
    shadowUrl: 'icon/shadow/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = new L.Icon({
    iconUrl: 'icon/marker-icon-2x-red.png',
    shadowUrl: 'icon/shadow/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


//on map click function
function addMarkerOnMap(e) {
    marker.setLatLng(e.latlng);
    //marker.bindPopup(`lat : ${e.latlng.lat} - lng : ${e.latlng.lng}`).openPopup();
    centerLat = e.latlng.lat;
    centerLng = e.latlng.lng;
    var texts = ["داروخانه", "درمانگاه", "بیمارستان", "مطب"];
    for (i = 0; i < 4; i++) {
        search(texts[i])
    }
}

var searchMarkers = [];

//sending request to Search API
function search(text) {
    // restarting the markers
    //for (var j = 0; j < searchMarkers.length; j++) {
    //    if (searchMarkers[j] != null) {
    //        myMap.removeLayer(searchMarkers[j]);
    //        searchMarkers[j] = null;
    //    }
    //}
    marker.setLatLng([centerLat, centerLng]);

    //getting term value from input tag
    var term = text;
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
            myMap.flyTo([centerLat, centerLng], 14);
            //for every search resualt add marker
            var i;
            for (i = 0; i < data.data.count; i++) {
                var info = data.data.items[i];
                if (!(allResult.some(e => e.title === info.title && distance(e.location.y, e.location.x, info.location.y, info.location.x)))) {
                    allResult.push(info)
                    if (term == "داروخانه") {
                        searchMarkers[i] = L.circle([info.location.y, info.location.x], {
                            color: '#00E676',
                            fillColor: '#00E676',
                            fillOpacity: 0.5,
                            radius: 25
                        }).addTo(myMap);
                        searchMarkers[i].bindPopup(info.title);
                    } else if ((term == "درمانگاه") || term == "بیمارستان") {
                        searchMarkers[i] = L.circle([info.location.y, info.location.x], {
                            color: '#FFC400',
                            fillColor: '#FFC400',
                            fillOpacity: 0.3,
                            radius: 50
                        }).addTo(myMap);
                        searchMarkers[i].bindPopup(info.title);
                    } else {
                        searchMarkers[i] = L.circle([info.location.y, info.location.x], {
                            color: '#FF1744',
                            weight: 1,
                            fillColor: '#FF1744',
                            fillOpacity: 0.5,
                            radius: 25
                        }).addTo(myMap);
                        searchMarkers[i].bindPopup(info.title);
                    }
                }

                //makeDiveResualt(data.data.items[i], i);
            }

        }).catch(error => {
            console.log(error.response);
        });
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    d = 12742000 * Math.asin(Math.sqrt(a));
    return d < 20; // 2 * R; R = 6371 km
  }

function makeDiveResualt(data, index) {
    var resultsDiv = document.getElementById("resualt");
    var resultDiv = document.createElement("div");
    resultDiv.onclick = function (e) {
        myMap.flyTo([data.location.y, data.location.x], 14);
        // searchMarkers[index].setIcon(redIcon);
        // setTimeout(function(){
        //     searchMarkers[index].setIcon(greenIcon);
        // },4000);
        for (var i = 0; i < searchMarkers.length; i++) {
            if (i == index) {
                searchMarkers[i].setIcon(redIcon);
                continue;
            }
            searchMarkers[i].setIcon(greenIcon);
        }

    }
    resultDiv.dir = "ltr";
    var resultAddress = document.createElement("pre");
    resultAddress.textContent = `title : ${data.title} \n Address : ${data.address} \n type : ${data.type}`;
    resultAddress.style = `border: solid ${generateRandomColor()};`;
    resultsDiv.appendChild(resultDiv);
    resultDiv.appendChild(resultAddress);

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