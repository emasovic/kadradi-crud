import GooglePlaces from 'node-googleplaces';
import PubSub from 'pubsub-js';
import db from '../../db/db';

const googlePlaces = new GooglePlaces('AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ')

const access_token = 'AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ';

async function withoutToken(args) {
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+
  args.lat +
  ","+
  args.lng+
  "&radius="+
  args.radius +
  "&types="+
  category.google +
  "&key="+
  access_token

  let zaReturn;

   await fetch(url)
  .then(response => response.text())
  .then(async response => {
    const res = JSON.parse(response);
    zaReturn = res;
  })
  return zaReturn;
}

async function withToken(args) {
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+
  args.lat +
  ","+
  args.lng+
  "&radius="+
  args.radius +
  "&types="+
  category.google +
  "&key="+
  access_token  +
  "&pagetoken="+
  args.nextPage

  let zaReturn;

   await fetch(url)
  .then(response => response.text())
  .then(async response => {
    const res = JSON.parse(response);
    zaReturn = res;
  })
  return zaReturn;
}

let isScraping = false;
let isNewScrap = true;
let lat = 0.0;
let lng = 0.0;
let radius = 1000;
let category = {
  google: 'bakery',
  base: 1
}

let dalje = true;


async function startScraping(categoryId, latitude, longitue, distance) {
  isScraping = true;
  const categoryFromBase = await db.models.objectCategories.find({ where: { id: categoryId } });
  category.google = categoryFromBase.googleType;
  category.base = categoryId;
  lat = latitude;
  lng = longitue;
  radius = distance * 1000;
  PubSub.publish('scrape_info', true)
  scrap();
}

async function idiDalje() {
  dalje = false;
}

async function scrap(nextPage) {
    if(isScraping){
    dalje = true;
    let parameters = {}
    if (nextPage) {
      const screp = await withToken({lat, lng, radius, type: category.google, nextPage})
      await Promise.all(screp.results.map(item => {
        PubSub.publish('object_found', { id: item.id, name: item.name, vicinity: item.vicinity, lat: item.geometry.location.lat, lng: item.geometry.location.lng });
      }))
      if (screp.next_page_token) {
        setTimeout(function () { scrap(screp.next_page_token); }, 2000);
      } else {
        PubSub.publish('scrape_info', false)
      }
    } else {
      const screp = await withoutToken({lat, lng, radius, type: category.google})
      await Promise.all(screp.results.map(item => {
        PubSub.publish('object_found', { id: item.id, name: item.name, vicinity: item.vicinity, lat: item.geometry.location.lat, lng: item.geometry.location.lng });
      }))
      if (screp.next_page_token) {
        setTimeout(function () { scrap(screp.next_page_token); }, 2000);
      } else {
        PubSub.publish('scrape_info', false)
      }
    }
  }
  else {
    PubSub.publish('scrape_info', false)
  }
}

function stopScraping() {
  isScraping = false;
}

export default {
  startScraping,
  stopScraping,
  idiDalje
}