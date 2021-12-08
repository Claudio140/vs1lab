// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTag = require("./geotag");

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

    // TODO: ... your code here ...
    static #geoTags = [];

    static addGeoTag(GeoTag) {
        this.#geoTags.push(GeoTag);
    }

    static removeGeoTag(GeoTag) {
        this.#geoTags.splice(this.#geoTags.indexOf(GeoTag), 1);
    }

    static getNearbyGeoTags(location, radius) {
        let result = [];

        // doesn't find getLat() as function, because "geotag" is not of GeoTag Type.
        this.#geoTags.forEach(function (geotag) {
            let distance = Math.sqrt(Math.pow(geotag.getLat() - location.getLat(), 2) +
                Math.pow(geotag.getLon() - location.getLon(), 2));

            if (distance <= radius) {
                result.push(geotag);
            }
        })

        return result;
    }

    static searchNearbyGeoTags(location, radius, keyword) {
        let result = this.getNearbyGeoTags(location, radius);

        result.forEach(function (geotag) {
            if (!(geotag.getName().includes(keyword) || geotag.getTag().includes(keyword))) {
                result.splice(result.indexOf(geotag), 1);
            }
        })

        return result;
    }

}

module.exports = InMemoryGeoTagStore
