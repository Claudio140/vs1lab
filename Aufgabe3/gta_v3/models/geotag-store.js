// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {

    static #geoTags = GeoTagExamples.tagList;

    static addGeoTag(GeoTag) {
        this.#geoTags.push(GeoTag);
    }

    static removeGeoTag(GeoTag) {
        this.#geoTags.splice(this.#geoTags.indexOf(GeoTag), 1);
    }

    static getNearbyGeoTags(location, radius) {
        let result = [];

        this.#geoTags.forEach(function (GeoTag) {
            /*let distance = Math.sqrt(Math.pow(GeoTag.latitude - location.latitude, 2) +
                Math.pow(GeoTag.longitude - location.longitude, 2));*/
            let dx = 71.5 * (GeoTag.longitude - location.longitude);
            let dy = 111.3 * (GeoTag.latitude - location.latitude);
            let distance = Math.sqrt(dx * dx + dy * dy);
            //console.log("distance " + distance);

            if (distance <= radius) {
                result.push(GeoTag);
            }
        })

        return result;
    }

    static searchNearbyGeoTags(location, radius, keyword) {
        let nearby = [];
        nearby = this.getNearbyGeoTags(location, radius);
        let returnval = [];

        nearby.forEach(function (GeoTag, index) {
            let gtname = GeoTag.name;
            let gttag = GeoTag.hashtag;
            let keywordStr = keyword;
            /*
            console.log("gtname " + gtname);
            console.log("gttag " + gttag);
            console.log("keywordStr " + keywordStr);
            console.log("index " + index);
            */
            if ( (gtname.includes(keywordStr) || gttag.includes(keywordStr)) ) {
                returnval.push(GeoTag);
            }
        })

        return returnval;
    }

}

module.exports = InMemoryGeoTagStore
