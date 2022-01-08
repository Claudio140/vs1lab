// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    static nextId = 1;
    constructor(name, latitude, longitude, hashtag) {
        this.id = GeoTag.nextId;
        GeoTag.nextId++;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;

    }


    /*getName() {
        return this.name;
    }
    getLat() {
        return this.latitude;
    }
    getLon() {
        return this.longitude;
    }
    getTag() {
        return this.hashtag;
    }*/


    name;
    latitude;
    longitude;
    hashtag;



    
}



module.exports = GeoTag;
