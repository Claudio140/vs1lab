// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */
const tags = require("../models/geotag-examples");
const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 *
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 *
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */
// TODO: extend the following route example if necessary
router.get('/', (req, res) => {

    res.render('index', {taglist: []})
});

router.get("/api/geotags", function (req, res){
    let url = new URL(req.url, 'http://${req.headers.host}');
    if (url.searchParams.has('search') &&
    url.searchParams.has('lat') &&
    url.searchParams.has('lon')) {
        let location = {
            latitude: url.searchParams.get('lat'),
            longitude: url.searchParams.get('lon')
        }
        res.json({geotags: GeoTagStore.searchNearbyGeoTags(location, 100000, url.searchParams.get('search'))});
    }
    console.log(GeoTagStore.getAllGeoTags());
    res.json({geotags: GeoTagStore.getAllGeoTags()});
})

router.post("/api/geotags", function (req, res){
    GeoTagStore.addGeoTag(new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag));
    console.log(GeoTagStore.getAllGeoTags());
    res.json(JSON.stringify(req.body));
})

router.get("/api/geotags/:id", function (req,res) {
    let id = req.params.id;
    let tags = GeoTagStore.getAllGeoTags();
    for (let i = 0; i < tags.length; i++) {
        if(tags[i].id == id){
            res.json(JSON.stringify(tags[i]))
        }
    }
    res.sendStatus(404)
})

router.put("/api/geotags/:id", function (req, res) {
    let id = req.params.id;
    let tags = GeoTagStore.getAllGeoTags();
    for (let i = 0; i < tags.length; i++) {
        if(tags[i].id == id){
            let nextID = GeoTag.nextId;
            let newTag = new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag);
            GeoTag.nextId = nextID;
            newTag.id = tags[i].id;
            tags[i] = newTag
            res.json(JSON.stringify(tags[i]))
        }
    }
    res.sendStatus(404)
})

router.delete("/api/geotags/:id", function (req, res) {
    let id = req.params.id;
    let tags = GeoTagStore.getAllGeoTags();
    //tags = tags.filter(tag => tag.id != id)
    for (let i = 0; i < tags.length; i++) {
        if(tags[i].id == id){
            GeoTagStore.removeGeoTag(tags[i]);
            res.sendStatus(200)
        }
    }
    res.sendStatus(500)
})

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
    //console.log(req.body);
    let tag = new GeoTag(req.body["taggingName"],
        req.body["taggingLatitude"],
        req.body["taggingLongitude"],
        req.body["taggingHashtag"]);
    GeoTagStore.addGeoTag(tag);
    res.render('index', {taglist: GeoTagStore.getNearbyGeoTags(tag, 100000)})
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests carry the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
    console.log(req.body);
    console.log("req.body[searchterm] " + req.body["searchterm"]);
    let queryTag = new GeoTag('Query',
        req.body["searchLatitude"],
        req.body["searchLongitude"],
        '#query');
    res.render('index', {taglist: GeoTagStore.searchNearbyGeoTags(queryTag, 100000, req.body["searchterm"]) })
});

module.exports = router;
