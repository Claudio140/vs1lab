// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    let tagLat = document.getElementById("taggingLatitude")
    let tagLong = document.getElementById("taggingLongitude")

    // Part 1: GeoLocation API
    if (tagLat.value == null || tagLong.value == null ||
        tagLat.value === "" || tagLong.value === "") {
        try {
            LocationHelper.findLocation(updateDocument);
        } catch (e) {
            console.log("The GeoLocation API is currently unavailable.");
            return;
        }
    }

    updateMap(tagLat.value, tagLong.value);
}

function updateDocument(helper) {
    document.getElementById("taggingLatitude").value = helper.latitude;
    document.getElementById("taggingLongitude").value = helper.longitude;
    document.getElementById("searchLatitude").value = helper.latitude;
    document.getElementById("searchLongitude").value = helper.longitude;

    console.log("Location updated.");
}

function updateMap(lat, lon) {
    // Part 2: MapQuest API
    let mapManager = new MapManager("3AxCFIxyzjGPuyQJTKjFZiqCIfHqTPDX");
    let taglist = document.getElementById("mapView").dataset.tags;

    console.log(taglist);

    let mapString = mapManager.getMapUrl(lat, lon, JSON.parse(taglist));
    document.getElementById("mapView").src = mapString;
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
