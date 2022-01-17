// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

let clientTags = [];
let mapManager;

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    let tagLat = document.getElementById("taggingLatitude")
    let tagLong = document.getElementById("taggingLongitude")

    // Part 1: GeoLocation API
//    if (tagLat.value == null || tagLong.value == null ||
//        tagLat.value === "" || tagLong.value === "") {
    try {
        LocationHelper.findLocation(updateDocument);
    } catch (e) {
        console.log("The GeoLocation API is currently unavailable.");
    }
//    }

}

function updateDocument(helper) {
    document.getElementById("taggingLatitude").value = helper.latitude;
    document.getElementById("taggingLongitude").value = helper.longitude;
    document.getElementById("searchLatitude").value = helper.latitude;
    document.getElementById("searchLongitude").value = helper.longitude;

    console.log("Location updated.");

    // Part 2: MapQuest API
    mapManager = new MapManager("3AxCFIxyzjGPuyQJTKjFZiqCIfHqTPDX");
    let taglist = document.getElementById("mapView").dataset.tags;

    console.log(taglist);

    /*    let mapString = mapManager.getMapUrl(
            helper.latitude,
            helper.longitude,
            JSON.parse(taglist));
        document.getElementById("mapView").src = mapString;*/
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    getInitialValues();
})

document.getElementById("addButton").addEventListener("click", function (event) {
    let taggingData = {
        latitude: document.getElementById("taggingLatitude").value,
        longitude: document.getElementById("taggingLongitude").value,
        name: document.getElementById("taggingName").value,
        hashtag: document.getElementById("taggingHashtag").value
    }
    if (!(taggingData.hashtag.match(/#[a-zA-Z0-9]+/))) {
        return;
    }

    fetch("/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(taggingData)
    })
        .then(response => response.json())
        .then(data => onAddButtonSuccess(data, taggingData.latitude, taggingData.longitude))
        .catch(error => console.log(error));
});

function onAddButtonSuccess (data, lat, lon) {
    let dataJson = data;

    let element = document.createElement("li")
    element.innerHTML = (`${dataJson.name} ${dataJson.latitude} ${dataJson.longitude} ${dataJson.hashtag}`);
    document.getElementById("discoveryResults").appendChild(element);
    clientTags.push(dataJson);
    console.log(dataJson);

    updateMapWithData(clientTags, lat, lon);
}

document.getElementById("searchButton").addEventListener("click", function () {
    let searchWord = document.getElementById("searchterm").value.toLowerCase();
    let taggingData = {
        latitude: document.getElementById("taggingLatitude").value,
        longitude: document.getElementById("taggingLongitude").value,
        name: document.getElementById("taggingName").value,
        hashtag: document.getElementById("taggingHashtag").value
    }

    let getURL = "/api/geotags";
    let searchString = "?search=" + searchWord + "&lat=" + taggingData.latitude + "&lon=" + taggingData.longitude;

    if (searchWord.length > 0) {
        getURL = getURL + searchString;
    }

    fetch( getURL, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => onSearchSuccess(data, taggingData.latitude, taggingData.longitude))
        .catch(error => console.log('Error: ' + error));
});

function getInitialValues() {
    let taggingData = {
        latitude: document.getElementById("taggingLatitude").value,
        longitude: document.getElementById("taggingLongitude").value,
        name: document.getElementById("taggingName").value,
        hashtag: document.getElementById("taggingHashtag").value
    }

    fetch("/api/geotags", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => onSearchSuccess(data, taggingData.latitude, taggingData.longitude))
        .catch(error => console.log('Error: ' + error))
}

function onSearchSuccess(data, lat, lon) {
    console.log(data);

    document.getElementById("discoveryResults").innerHTML = "";
    for (let i = 0; i < data.geotags.length; i++) {
        let element = document.createElement("li")
        element.innerHTML = (`${data.geotags[i].name} ${data.geotags[i].latitude} ${data.geotags[i].longitude} ${data.geotags[i].hashtag}`);
        document.getElementById("discoveryResults").appendChild(element);
    }
    clientTags = data.geotags.slice();
    updateMapWithData(clientTags, lat, lon);
}

function updateMapWithData(data, lat, lon) {
    let newMap = document.createElement("img");
    newMap.setAttribute("data-tags", JSON.stringify(data));
    newMap.setAttribute("id", "mapView");
    newMap.setAttribute("alt", "2 a map with locations");
    newMap.setAttribute("src", mapManager.getMapUrl(lat, lon, data));
    console.log(newMap);
    document.getElementById("mapView").replaceWith(newMap);
}
