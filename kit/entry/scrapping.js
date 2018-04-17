import GooglePlaces from 'node-googleplaces';
import PubSub from 'pubsub-js';
import db from '../../db/db';

const googlePlaces = new GooglePlaces('AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ')

let isScraping = false;
let isNewScrap = true;
let lat = 0.0;
let lng = 0.0;
let radius = 1000;
let category = {
    google: 'bakery',
    base: 1
}


async function startScraping(categoryId, latitude, longitue, distance) {
    isScraping = true;
    const categoryFromBase = await db.models.objectCategories.find({ where: { id: categoryId } });
    category.google = categoryFromBase.googleType;
    category.base = categoryId;
    lat = latitude;
    lng = longitue;
    radius = distance;
    scrap();
}

async function scrap(nextPage) {
    if (isScraping) {
        let parameters = {}
        if (nextPage) {
            parameters = {
                location: lat.toString() + ', ' + lng.toString(),
                type: category.google,
                radius: radius,
                next_page_token: nextPage
            }
        } else {
            parameters = {
                location: lat.toString() + ', ' + lng.toString(),
                type: category.google,
                radius: radius
            }
        }
        googlePlaces.nearbySearch(parameters, async (err, res) => {
            await Promise.all(res.body.results.map(item => {
                console.log(item.types)
                PubSub.publish('object_found', { id: item.id, name: item.name, vicinity: item.vicinity, lat: item.geometry.location.lat, lng: item.geometry.location.lng });
            }))
            if (res.body.next_page_token) {
                setTimeout(function(){ scrap(res.body.next_page_token); }, 1000);
            }
        });
    }
}

function stopScraping() {
    isScraping = false;
}

export default {
    startScraping,
    stopScraping
}