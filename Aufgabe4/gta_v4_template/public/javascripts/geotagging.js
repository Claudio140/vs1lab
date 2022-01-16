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
    if (tagLat.value == null || tagLong.value == null ||
        tagLat.value === "" || tagLong.value === "") {
        try {
            LocationHelper.findLocation(updateDocument);
        } catch (e) {
            console.log("The GeoLocation API is currently unavailable.");
        }
    }

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

    let mapString = mapManager.getMapUrl(
        helper.latitude,
        helper.longitude,
        JSON.parse(taglist));
    document.getElementById("mapView").src = mapString;
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    getInitialValues();
})

    document.getElementById("addButton").addEventListener("click", function (event) {
        let data = {
            latitude: document.getElementById("taggingLatitude").value,
            longitude: document.getElementById("taggingLongitude").value,
            name: document.getElementById("taggingName").value,
            hashtag: document.getElementById("taggingHashtag").value
        }
        if (!(data.hashtag.match(/#[a-zA-Z0-9]+/))) {
            return;
        }
        const xhttp = new XMLHttpRequest(),
            method = "POST",
            url = "http://localhost:3000/api/geotags";
        xhttp.open(method, url, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");


        xhttp.onreadystatechange = function () {
            console.log(xhttp.readyState);
            if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {

                console.log(xhttp.response);
                const answer = JSON.parse(JSON.parse(xhttp.response));
                console.log(answer);
                let element = document.createElement("li")
                element.innerHTML = (`${answer.name} ${answer.latitude} ${answer.longitude} ${answer.hashtag}`);
                document.getElementById("discoveryResults").appendChild(element);
                clientTags.push(answer)
            }
        }
        xhttp.send(JSON.stringify(data));

        updateMapWithClientTags(data);
    });

    document.getElementById("searchButton").addEventListener("click", function () {
        let searchWord = document.getElementById("searchterm").value.toLowerCase();
        let filterTags = clientTags.filter((tag) => {
                return tag.name.toLowerCase().includes(searchWord) || tag.hashtag.toLowerCase().includes(searchWord);
            }
        );
        let data = {
            latitude: document.getElementById("taggingLatitude").value,
            longitude: document.getElementById("taggingLongitude").value,
            name: document.getElementById("taggingName").value,
            hashtag: document.getElementById("taggingHashtag").value
        }
        console.log("search");
        document.getElementById("discoveryResults").innerHTML = "";
        for (let i = 0; i < filterTags.length; i++) {
            let element = document.createElement("li");
            element.innerHTML = (`${filterTags[i].name} ${filterTags[i].latitude} ${filterTags[i].longitude} ${filterTags[i].hashtag}`);
            document.getElementById("discoveryResults").appendChild(element);
        }

        updateMapWithSearchTags(filterTags, data);
    });

    function getInitialValues() {
        const xhttp = new XMLHttpRequest(),
            method = "GET",
            url = "http://localhost:3000/api/geotags";
        xhttp.open(method, url, true);
        xhttp.onreadystatechange = function () {
            console.log(xhttp.readyState);
            if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
                const answer = JSON.parse(xhttp.response);
                console.log(answer);
                document.getElementById("discoveryResults").innerHTML = ""

                for (let i = 0; i < answer.geotags.length; i++) {
                    let element = document.createElement("li")
                    element.innerHTML = (`${answer.geotags[i].name} ${answer.geotags[i].latitude} ${answer.geotags[i].longitude} ${answer.geotags[i].hashtag}`);
                    document.getElementById("discoveryResults").appendChild(element);
                }
                clientTags = answer.geotags.slice();
                updateMapWithClientTags();
            }
        }
        xhttp.send();
    }

function updateMapWithClientTags(data) {
    let newMap = document.createElement("img");
    newMap.setAttribute("data-tags", JSON.stringify(clientTags));
    newMap.setAttribute("id","mapView");
    newMap.setAttribute("alt","2 a map with locations");
    newMap.setAttribute("src", mapManager.getMapUrl(data.latitude, data.longitude, clientTags));
    console.log(newMap);
    document.getElementById("mapView").replaceWith(newMap);
}

function updateMapWithSearchTags(searchTags, data) {
    let newMap = document.createElement("img");
    newMap.setAttribute("data-tags", JSON.stringify(searchTags));
    newMap.setAttribute("id","mapView");
    newMap.setAttribute("alt","2 a map with locations");
    newMap.setAttribute("src", mapManager.getMapUrl(data.latitude, data.longitude, searchTags));
    console.log(newMap);
    document.getElementById("mapView").replaceWith(newMap);
}
