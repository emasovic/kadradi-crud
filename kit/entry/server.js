/* eslint-disable no-param-reassign, no-console */

// Server entry point, for Webpack.  This will spawn a Koa web server
// and listen for HTTP requests.  Clients will get a return render of React
// or the file they have requested.

// ----------------------
// IMPORTS

/* Node */

// For pre-pending a `<!DOCTYPE html>` stream to the server response
import { PassThrough } from 'stream';

// HTTP & SSL servers.  We can use `config.enableSSL|disableHTTP()` to enable
// HTTPS and disable plain HTTP respectively, so we'll use Node's core libs
// for building both server types.
import http from 'http';
import https from 'https';

/* NPM */

// Patch global.`fetch` so that Apollo calls to GraphQL work
import 'isomorphic-fetch';

// React UI
import React from 'react';

// React utility to transform JSX to HTML (to send back to the client)
import ReactDOMServer from 'react-dom/server';

// Koa 2 web server.  Handles incoming HTTP requests, and will serve back
// the React render, or any of the static assets being compiled
import Koa from 'koa';

// Apollo tools to connect to a GraphQL server.  We'll grab the
// `ApolloProvider` HOC component, which will inject any 'listening' React
// components with GraphQL data props.  We'll also use `getDataFromTree`
// to await data being ready before rendering back HTML to the client
import { ApolloProvider, getDataFromTree } from 'react-apollo';

// Enforce SSL, if required
import koaSSL from 'koa-sslify';

// Enable cross-origin requests
import koaCors from 'kcors';

// Static file handler
import koaSend from 'koa-send';

// HTTP header hardening
import koaHelmet from 'koa-helmet';

// Koa Router, for handling URL requests
import KoaRouter from 'koa-router';

// High-precision timing, so we can debug response time to serve a request
import ms from 'microseconds';

// React Router HOC for figuring out the exact React hierarchy to display
// based on the URL
import { StaticRouter } from 'react-router';

// <Helmet> component for retrieving <head> section, so we can set page
// title, meta info, etc along with the initial HTML
import Helmet from 'react-helmet';

// Import the Apollo GraphQL server, for Koa
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

// Allow local GraphQL schema querying when using a built-in GraphQL server
import apolloLocalQuery from 'apollo-local-query';

// Import all of the GraphQL lib, for use with our Apollo client connection
import * as graphql from 'graphql';

/* ReactQL */

// App entry point.  This must come first, because app.js will set-up the
// server config that we'll use later
import App from 'src/app';

// Custom redux store creator.  This will allow us to create a store 'outside'
// of Apollo, so we can apply our own reducers and make use of the Redux dev
// tools in the browser
import createNewStore from 'kit/lib/redux';

// Initial view to send back HTML render
import Html from 'kit/views/ssr';

// Grab the shared Apollo Client / network interface instantiation
import { getNetworkInterface, createClient } from 'kit/lib/apollo';

// App settings, which we'll use to customise the server -- must be loaded
// *after* app.js has been called, so the correct settings have been set
import config from 'kit/config';

// Import paths.  We'll use this to figure out where our public folder is
// so we can serve static files
import PATHS from 'config/paths';


//IMPORT POSTGRESQL DATABASE
import db from '../../db/db';
const Op = db.Op;

//SCRAPING
import scrap from './scrapping';
import PubSub from 'pubsub-js';

//IMPORT JSONWEBTOKEN
import jwt from 'jsonwebtoken';


//IMPORT ZA GOOGLE PLACES
import GooglePlaces from 'node-googleplaces';
import { POINT_CONVERSION_HYBRID } from 'constants';
const googlePlaces = new GooglePlaces('AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ')

// ----------------------

// Create a network layer based on settings.  This is an immediate function
// that binds either the `localInterface` function (if there's a built-in
// GraphQL) or `externalInterface` (if we're pointing outside of ReactQL)
const createNeworkInterface = (() => {
  // For a local interface, we want to allow passing in the request's
  // context object, which can then feed through to our GraphQL queries to
  // extract pertinent information and manipulate the response
  function localInterface(context) {
    return apolloLocalQuery.createLocalInterface(
      graphql,
      config.graphQLSchema,
      {
        // Attach the request's context, which certain GraphQL queries might
        // need for accessitng cookies, auth headers, etc.
        context,
      },
    );
  }

  function externalInterface(ctx) {
    return getNetworkInterface(config.graphQLEndpoint, ctx.apollo.networkOptions);
  }

  return config.graphQLServer ? localInterface : externalInterface;
})();

// Static file middleware
export function staticMiddleware() {
  return async function staticMiddlewareHandler(ctx, next) {
    try {
      if (ctx.path !== '/') {
        return await koaSend(
          ctx,
          ctx.path,
          process.env.NODE_ENV === 'production' ? {
            root: PATHS.public,
            immutable: true,
          } : {
              root: PATHS.distDev,
            },
        );
      }
    } catch (e) { /* Errors will fall through */ }
    return next();
  };
}

// Function to create a React handler, per the environment's correct
// manifest files
export function createReactHandler(css = [], scripts = [], chunkManifest = {}) {
  return async function reactHandler(ctx) {
    const routeContext = {};

    // Generate the HTML from our React tree.  We're wrapping the result
    // in `react-router`'s <StaticRouter> which will pull out URL info and
    // store it in our empty `route` object
    const components = (
      <StaticRouter location={ctx.request.url} context={routeContext}>
        <ApolloProvider store={ctx.store} client={ctx.apollo.client}>
          <App />
        </ApolloProvider>
      </StaticRouter>
    );

    // Wait for GraphQL data to be available in our initial render,
    // before dumping HTML back to the client
    await getDataFromTree(components);

    // Handle redirects
    if ([301, 302].includes(routeContext.status)) {
      // 301 = permanent redirect, 302 = temporary
      ctx.status = routeContext.status;

      // Issue the new `Location:` header
      ctx.redirect(routeContext.url);

      // Return early -- no need to set a response body
      return;
    }

    // Handle 404 Not Found
    if (routeContext.status === 404) {
      // By default, just set the status code to 404.  Or, we can use
      // `config.set404Handler()` to pass in a custom handler func that takes
      // the `ctx` and store

      if (config.handler404) {
        config.handler404(ctx);

        // Return early -- no need to set a response body, because that should
        // be taken care of by the custom 404 handler
        return;
      }

      ctx.status = routeContext.status;
    }

    // Create a HTML stream, to send back to the browser
    const htmlStream = new PassThrough();

    // Prefix the doctype, so the browser knows to expect HTML5
    htmlStream.write('<!DOCTYPE html>');

    // Create a stream of the React render. We'll pass in the
    // Helmet component to generate the <head> tag, as well as our Redux
    // store state so that the browser can continue from the server
    const reactStream = ReactDOMServer.renderToNodeStream(
      <Html
        helmet={Helmet.renderStatic()}
        window={{
          webpackManifest: chunkManifest,
          __STATE__: ctx.store.getState(),
        }}
        css={css}
        scripts={scripts}>
        {components}
      </Html>,
    );

    // Pipe the React stream to the HTML output
    reactStream.pipe(htmlStream);

    // Set the return type to `text/html`, and stream the response back to
    // the client
    ctx.type = 'text/html';
    ctx.body = htmlStream;
  };
}

async function fetchObject(placeid) {
  const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeid + '&key=AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ';
  let zaReturn = {};
  await fetch(url)
    .then(response => response.text())
    .then(async response => {
      const res = JSON.parse(response);
      zaReturn = res;
    })
  return zaReturn;
}

async function fetchObjectImage(imageReference) {
  const url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + imageReference + '&key=AIzaSyB5o17Ztzcsqm5UbxzJQ_P0Fi8xtxkk0GE';
  let zaReturn = '';
  await fetch(url)
    .then(response => response.text())
    .then(async response => {
      const res = JSON.parse(response);
      zaReturn = res;
    })
  return zaReturn
}

function verifyToken(token) {
  try {
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const tokenVerify = jwt.verify(token, 'nasasifra');
    let response = {};
    if ((tokenVerify.exp - currentTimeStamp) <= 10) {
      const newToken = jwt.sign({ id: tokenVerify.id, username: tokenVerify.username, email: tokenVerify.email }, 'nasasifra', { expiresIn: 60 * 60 });
      return { success: true, token: newToken };
    } else {
      if (tokenVerify.name === 'TokenExpiredError') {
        return { success: false }
      } else {
        return { success: true, token: token }
      }
    }
  } catch (err) {
    return { success: false };
  }
}

function Deg2Rad(deg) {
  return (deg * Math.PI) / 180;
}

function izracunajDistancu(lat1, lon1, lat2, lon2) {
  const fi1 = Deg2Rad(lat1);
  const fi2 = Deg2Rad(lat2);
  const delta1 = Deg2Rad(lat2 - lat1);
  const delta2 = Deg2Rad(lon2 - lon1);

  const R = 6371e3;
  const a = Math.sin(delta1 / 2) * Math.sin(delta1 / 2) +
    Math.cos(fi1) * Math.cos(fi2) *
    Math.sin(delta2 / 2) * Math.sin(delta2 / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d / 1000;
}
function compare(a, b) {
  if (a.distance < b.distance) {
    return -1;
  }
  if (a.distance > b.distance) {
    return 1;
  }
  return 0;
}

async function fetchObject(placeid) {
  const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeid + '&key=AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ';
  let zaReturn = {};
  await fetch(url)
    .then(response => response.text())
    .then(async response => {
      const res = JSON.parse(response);
      zaReturn = res;
    })
  return zaReturn;
}

// Build the router, based on our app's settings.  This will define which
// Koa route handlers
const router = (new KoaRouter())
  // Set-up a general purpose /ping route to check the server is alive
  .get('/ping', async ctx => {
    ctx.body = 'pong';
  })

  // AUTHENTIFICATION

  .post('/login', async (ctx, next) => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const user = await db.models.admin.find({ where: { username: username, password: password } })
    if (user != null) {
      let token;
      if (ctx.request.body.rememberMe) {
        token = jwt.sign({ id: user.id, username: user.username }, 'nasasifra')
      } else {
        token = jwt.sign({ id: user.id, username: user.username }, 'nasasifra', { expiresIn: 60 * 60 })
      }
      ctx.body = JSON.stringify({ success: true, token: token });
    } else {
      ctx.body = JSON.stringify({ error: 'User not found', success: false });
    }
  })

  .post('/checkToken', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token);
    ctx.body = JSON.stringify({ token: newToken });
  })
  .post('/allCategories', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const categories = await db.models.objectCategories.findAll();
      ctx.body = JSON.stringify({ categories: categories, token: newToken });
    } else {
      ctx.body = JSON.stringify({ categories: [], token: newToken })
    }
  })

  .post('/scrapCategories', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.roken);
    if(newToken.success) {
      const categories = await db.models.objectCategories.findAll(
        {where: {googleType: { [Op.ne]: null } }}
      );
      ctx.body = JSON.stringify({categories, token: newToken})
    } else {
      ctx.body = JSON.stringify({categories: [], token: newToken})
    }
  })

  /*
  ------------------------------
  OVO JE METODA ZA IZLISTAVANJE OBJEKATA IZ KATEGORIJA
  ------------------------------
*/
  .post('/objectsFromCategories', async (ctx, next) => {
    const categoryId = ctx.request.body.categoryId;
    const newToken = verifyToken(ctx.request.body.token);
    const page = ctx.request.body.page;
    const limit = 3;
    const offset = limit * (page - 1)
    const pages = await db.models.objectCl.findAndCountAll({
      where: { objectCategoryId: categoryId }
    });
    const pagesLength = Math.ceil(pages.count / limit);
    if (newToken.success) {
      const objects = await db.models.objectCl.findAll({
        attributes: ['name', 'id'],
        limit: limit,
        offset: offset,
        where: { objectCategoryId: categoryId }
      });
      ctx.body = JSON.stringify({ objects, pagesLength, token: newToken });
    } else {
      ctx.body = JSON.stringify({ objects: [], token: newToken })
    }
  })
  /*
  ------------------------------
  OVO JE METODA ZA IZLISTAVANJE OBJEKATA IZ KATEGORIJA
  ------------------------------
  */
  .post('/getAllLocations', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token);
    if (newToken.success) {
      const locations = await db.models.locations.findAll();
      ctx.body = JSON.stringify({ locations, token: newToken })
    } else {
      ctx.body = JSON.stringify({ locations: [], token: newToken })
    }
  })
  /*
   ------------------------------
   OVO JE METODA ZA DODAVANJE OBJEKATA
   ------------------------------
 */
  .post('/categoriesArray', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token);
    if (newToken.success) {
      const objectCategories = await db.models.objectCategories.findAll({
        attributes: ['nameM', 'id']
      });
      ctx.body = JSON.stringify({ categoriesArray: objectCategories, token: newToken })
    } else {
      ctx.body = JSON.stringify({ categoriesArray: [], token: newToken })
    }
  })
  /*
    ------------------------------
    OVO JE METODA ZA UZIMANJE OBJEKATA PO ID-U
    ------------------------------
  */
  .post('/objectById', async (ctx, next) => {
    const objectId = ctx.request.body.objectId;
    const newToken = verifyToken(ctx.request.body.token);
    if (newToken.success) {
      if (objectId) {
        const objectCl = await db.models.objectCl.find({ where: { id: objectId } });
        const objectCategories = await db.models.objectCategories.findAll({
          attributes: ['nameJ', 'id']
        });
        let locations = await db.models.locations.findAll();
        locations = locations.map(item => {
          return (
            {
              key: item.id,
              value: item.id,
              text: item.name,
              parrentLocation: item.parrentLocation
            }
          )
        })
        // OBJECTNFOID

        const objectInfo = await db.models.objectInfo.find({ where: { objectClId: objectId }});

        const objectPhones = await db.models.objectPhones.findAll({ where: { objectInfoId: objectInfo.id } });

        let objectCategoriesArr = objectCategories.map(item => {
          return (
            {
              key: item.id,
              value: item.id,
              text: item.nameJ
            }
          )
        })
        const objectLocation = await db.models.objectLocation.find({ where: { objectClId: objectId } });
        const objectFile = await db.models.objectFile.find({ attributes: ['id', 'fileUrl', 'desc'], where: { objectClId: objectId } });

        let objectWorkTime = await db.models.objectWorkTime.find({ where: { objectClId: objectId } });
        let pon = {
          isWorking: false,
          name: "Pon",
          open: '0',
          close: '0'
        }
        let uto = {
          isWorking: false,
          name: "Uto",
          open: '0',
          close: '0'
        }
        let sre = {
          isWorking: false,
          name: "Sre",
          open: '0',
          close: '0'
        }
        let cet = {
          isWorking: false,
          name: "Cet",
          open: '0',
          close: '0'
        }
        let pet = {
          isWorking: false,
          name: "Pet",
          open: '0',
          close: '0'
        }
        let sub = {
          isWorking: false,
          name: "Sub",
          open: '0',
          close: '0'
        }
        let ned = {
          isWorking: false,
          name: "Ned",
          open: '0',
          close: '0'
        }
        let isAlwaysOpened = false;
        if (objectWorkTime.isAlwaysOpened) {
          isAlwaysOpened = true;
        }
        if (objectWorkTime.wtMonId !== null) {
          let wtMon = await db.models.wtMon.find({ where: { id: objectWorkTime.wtMonId } });
          pon.isWorking = true;
          pon.open = wtMon.opening;
          pon.close = wtMon.closing;
        }
        if (objectWorkTime.wtTueId !== null) {
          let wtTue = await db.models.wtTue.find({ where: { id: objectWorkTime.wtTueId } });
          uto.isWorking = true;
          uto.open = wtTue.opening;
          uto.close = wtTue.closing;
        }
        if (objectWorkTime.wtWedId !== null) {
          let wtWed = await db.models.wtWed.find({ where: { id: objectWorkTime.wtWedId } });
          sre.isWorking = true;
          sre.open = wtWed.opening;
          sre.close = wtWed.closing;
        }
        if (objectWorkTime.wtThuId !== null) {
          let wtThu = await db.models.wtThu.find({ where: { id: objectWorkTime.wtThuId } });
          cet.isWorking = true;
          cet.open = wtThu.opening;
          cet.close = wtThu.closing;
        }
        if (objectWorkTime.wtFriId !== null) {
          let wtFri = await db.models.wtFri.find({ where: { id: objectWorkTime.wtFriId } });
          pet.isWorking = true;
          pet.open = wtFri.opening;
          pet.close = wtFri.closing;
        }
        if (objectWorkTime.wtSatId !== null) {
          let wtSat = await db.models.wtSat.find({ where: { id: objectWorkTime.wtSatId } });
          sub.isWorking = true;
          sub.open = wtSat.opening;
          sub.close = wtSat.closing;
        }
        if (objectWorkTime.wtSunId !== null) {
          let wtSun = await db.models.wtSun.find({ where: { id: objectWorkTime.wtSunId } });
          ned.isWorking = true;
          ned.open = wtSun.opening;
          ned.close = wtSun.closing;
        }

        const objectWorkTimes = [pon, uto, sre, cet, pet, sub, ned];
        const objectTimes = {
          isAlwaysOpened,
          objectWorkTimes,
        }

        const objectById = { objectCl, objectInfo, objectLocation, objectCategoriesArr, objectPhones, locations, objectTimes, objectFile };
        ctx.body = JSON.stringify({ objectById, token: newToken })
      }
    } else {
      ctx.body = JSON.stringify({ objectById: [], token: newToken })
    }
  })
  
  /*
  ------------------------------
  OVO JE METODA ZA BRISANJE OBJEKATA
  ------------------------------
*/
  .post('/deleteObject', async (ctx, next) => {
    const objectId = ctx.request.body.objectId;
    const newToken = verifyToken(ctx.request.body.token);
    if (newToken.success) {
      const deleteObject = await db.models.objectCl.destroy({ where: { id: objectId } });
      if (deleteObject) {
        ctx.body = JSON.stringify({ deleted: true, token: newToken })
      } else {
        ctx.body = JSON.stringify({ deleted: false, token: newToken })
      }
    } else {
      ctx.body = JSON.stringify({ deleted: false, token: newToken })
    }
  })

  /* 
  //////////////////////////////////
          USER CONTROLL
  //////////////////////////////////
  */

  //sane gej
  /*
    --------------------------
        { page: int! }
    --------------------------
  */
  .post('/allUsers', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const page = ctx.request.body.page;
      const limit = 3;
      const offset = limit * (page - 1);
      const pages = await db.models.person.findAndCountAll();
      const pagesLength = Math.ceil(pages.count / limit);
      const persons = await db.models.person.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email'],
        order: [['lastName', 'ASC']],
        limit: limit,
        offset: offset,
      });
      ctx.body = JSON.stringify({ users: persons, pages: pagesLength, token: newToken });
    } else {
      ctx.body = JSON.stringify({ users: [], token: newToken })
    }
  })

  /*
  -----------------------------
  INFORMACIJE JEDNOG KORISNIKA
  -----------------------------
  */

  .post('/singleUser', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const user = await db.models.person.find({ where: { id: ctx.request.body.userId } });
      ctx.body = JSON.stringify({ user: user, token: newToken })
    } else {
      ctx.body = JSON.stringify({ user: {}, token: newToken })
    }
  })

  /* 
    ------------------------
    OVO JE METODA ZA BRISANJE KORISNIKA
    -------------------------

  */

  .post('/deleteUser', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const userId = ctx.request.body.userId;
      const izbrisi = await db.models.person.destroy({ where: { id: userId } });
      if (izbrisi) {
        ctx.body = JSON.stringify({ deleted: true, token: newToken })
      } else {
        ctx.body = JSON.stringify({ deleted: false, token: newToken })
      }
    } else {
      ctx.body = JSON.stringify({ deleted: false, token: newToken })
    }
  })
     /*
    ------------------------------
    OVO JE METODA ZA IZLISTAVANJE KORISNIKA
    ------------------------------
  */
 .post('/getUsers', async (ctx, next) => {
  const newToken = verifyToken(ctx.request.body.token)
  if (newToken.success) {
    const email = ctx.request.body.email;
    if(email.length > 2) {
      let persons = await db.models.person.findAll({ where: { email: {[Op.iRegexp]: email} }, attributes: ['id', 'email', 'firstName', 'lastName']});
      ctx.body = JSON.stringify({ users: persons, token: newToken })
    } else {
      ctx.body = JSON.stringify({ users: [], token: newToken })
    }
  } else {
    ctx.body = JSON.stringify({ users: [], token: newToken })
  }
})
   /*
    ------------------------------
    OVO JE METODA ZA DODAVANJE OBJEKATA
    ------------------------------
  */
.post('/addObject', async (ctx, next) => {
  const newToken = verifyToken(ctx.request.body.token);

  let addObject = ctx.request.body.addObject;


  let objectClArr = addObject.objectCl;
  let objectInfoArr = addObject.objectInfo;
  let objectLocationArr = addObject.objectLocation;
  let objectPhonesArr = addObject.objectPhones;
  let objectWorkTimeArr = addObject.objectWorkTime;
  let objectFileArr = addObject.objectFile;
  let workTime = addObject.workTime;
  let objectInfoObj = {};
  let objectLocationObj = {};
  let objectFileObj = {};
  let objectWorkTimeObj = {};

  if(newToken.success) {
      // sending all from objectCl in db
      const obId = await db.models.objectCl.create(objectClArr)
      // adding id into objects
      objectInfoObj = {...objectInfoArr, objectClId: obId.id}
      objectLocationObj = {...objectLocationArr, objectClId: obId.id}
      objectFileObj = {...objectFileArr, objectClId: obId.id, objectFileCategoryId: 1}
      objectWorkTimeObj = {...objectWorkTimeArr, objectClId: obId.id}
      // sending all from objectInfo in db
      let infoId = await db.models.objectInfo.create(objectInfoObj);
      // sending all from objectLocation in db
      let locationId = await db.models.objectLocation.create(objectLocationObj);
      // sending all from objectPhones in db
      objectPhonesArr.map(async item => {
        item = {...item, objectInfoId: infoId.id}
        await db.models.objectPhones.create(item);
      })
      // sending all from objectFile in db
      await db.models.objectFile.create(objectFileObj);
      // sending all from objectWorkTime in db
      await db.models.objectWorkTime.create({objectClId: obId.id});

      let workTimeObject = { isAlwaysOpened: false };
      if(workTime.pon) {
        if(workTime.pon.isWorking) {
          let wtMon = await db.models.wtMon.findOrCreate({where: {opening: workTime.pon.opening, closing: workTime.pon.closing}})
          workTimeObject = {...workTimeObject, wtMonId: wtMon[0].id}
        } else {
          workTimeObject = {...workTimeObject, wtMonId: null}
        }
      }
      if(workTime.uto) {
        if(workTime.uto.isWorking) {
          let wtTue = await db.models.wtTue.findOrCreate({where: {opening: workTime.uto.opening, closing: workTime.uto.closing}})
          workTimeObject = {...workTimeObject, wtTueId: wtTue[0].id}
        } else {
          workTimeObject = {...workTimeObject, wtTueId: null}
        }
      }
      if(workTime.sre) {
        if(workTime.sre.isWorking) {
          let wtWed = await db.models.wtWed.findOrCreate({where: {opening: workTime.sre.opening, closing: workTime.sre.closing}})
          workTimeObject = {...workTimeObject, wtWedId: wtWed[0].id}
        } else {
          workTimeObject = {...workTimeObject, wtWedId: null}
        }
      }
      if(workTime.cet) {
        if(workTime.cet.isWorking) {
          let wtThu = await db.models.wtThu.findOrCreate({where: {opening: workTime.cet.opening, closing: workTime.cet.closing}})
          workTimeObject = {...workTimeObject, wtThuId: wtThu[0].id}
        } else {
          workTimeObject = {...workTimeObject, wtThuId: null}
        }
      }
      if(workTime.pet) {
        if(workTime.pet.isWorking) {
          let wtFri = await db.models.wtFri.findOrCreate({where: {opening: workTime.pet.opening, closing: workTime.pet.closing}})
          workTimeObject = {...workTimeObject, wtFriId: wtFri[0].id}
        } else {
          workTimeObject = {...workTimeObject, wtFriId: null}
        }
      }
      if(workTime.sub) {
        if(workTime.sub.isWorking) {
          let wtSat = await db.models.wtSat.findOrCreate({where: {opening: workTime.sub.opening, closing: workTime.sub.closing}})
          workTimeObject = {...workTimeObject, wtSatId: wtSat[0].id}
        } else {
          workTimeObject = {...workTimeObject, wtSatId: null}
        }
      }
      if(workTime.ned) {
        if(workTime.ned.isWorking) {
          let wtSun = await db.models.wtSun.findOrCreate({where: {opening: workTime.ned.opening, closing: workTime.ned.closing}}) 
          workTimeObject = {...workTimeObject, wtSunId: wtSun[0].id}
        } else {
          workTimeObject = {...workTimeObject, wtSunId: null}
        }
      }
      if(workTime.isAlwaysOpened) {
        let obj = { isAlwaysOpened: true, wtMonId: 1, wtTueId: 1, wtWedId: 1, wtThuId: 1, wtFriId: 1, wtSatId: 1, wtSunId: 1 }
        await db.models.objectWorkTime.update(obj, {where: {objectClId: obId.id}})
      } else {
        await db.models.objectWorkTime.update(workTimeObject, {where: {objectClId: obId.id}})
      }
      // let updateObjectCl = {
      //   locationId: locationId.id,
      // }
      // await db.models.objectCl.update(updateObjectCl, {where: {id: obId.id}})
      ctx.body = JSON.stringify({ createdNewObject: true, token: newToken})


      // ctx.body = JSON.stringify({ createdNewObject: false, token: newToken})


  } else {
    ctx.body = JSON.stringify({ createdNewObject: false, token: newToken})
  }
})
///////////////////////////////////
.post('/stefan', async (ctx, next) => {
  const newToken = verifyToken(ctx.request.body.token)
  if(newToken.success) {
    




  ctx.body = JSON.stringify({ stefan: 'car', token: newToken })
  } else {
    ctx.body = JSON.stringify({  token: newToken})
  }
})

///////////////////////////////////
  /*
    ------------------------------
    OVO JE METODA ZA EDITOVANJE OBJEKATA
    ------------------------------
  */
  .post('/editObject', async (ctx, next) => {

    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {

      const editObject = ctx.request.body.editObject;
      const objectId = ctx.request.body.objectId;
      const workTime = editObject.workTime;
      const objectClArr = editObject.objectCl;
      const objectInfoArr = editObject.objectInfo;
      const objectLocationArr = editObject.objectLocation;
      const objectPhonesArr = editObject.objectPhones;

      try {
        let workTimeObject = { isAlwaysOpened: false };
        await db.models.objectWorkTime.findOrCreate({ where: { objectClId: objectId } })

        if (workTime.pon) {
          if (workTime.pon.isWorking) {
            let wtMon = await db.models.wtMon.findOrCreate({ where: { opening: workTime.pon.opening, closing: workTime.pon.closing } })
            workTimeObject = { ...workTimeObject, wtMonId: wtMon[0].id }
          } else {
            workTimeObject = { ...workTimeObject, wtMonId: null }
          }
        }
        if (workTime.uto) {
          if (workTime.uto.isWorking) {
            let wtTue = await db.models.wtTue.findOrCreate({ where: { opening: workTime.uto.opening, closing: workTime.uto.closing } })
            workTimeObject = { ...workTimeObject, wtTueId: wtTue[0].id }
          } else {
            workTimeObject = { ...workTimeObject, wtTueId: null }
          }
        }
        if (workTime.sre) {
          if (workTime.sre.isWorking) {
            let wtWed = await db.models.wtWed.findOrCreate({ where: { opening: workTime.sre.opening, closing: workTime.sre.closing } })
            workTimeObject = { ...workTimeObject, wtWedId: wtWed[0].id }
          } else {
            workTimeObject = { ...workTimeObject, wtWedId: null }
          }
        }
        if (workTime.cet) {
          if (workTime.cet.isWorking) {
            let wtThu = await db.models.wtThu.findOrCreate({ where: { opening: workTime.cet.opening, closing: workTime.cet.closing } })
            workTimeObject = { ...workTimeObject, wtThuId: wtThu[0].id }
          } else {
            workTimeObject = { ...workTimeObject, wtThuId: null }
          }
        }
        if (workTime.pet) {
          if (workTime.pet.isWorking) {
            let wtFri = await db.models.wtFri.findOrCreate({ where: { opening: workTime.pet.opening, closing: workTime.pet.closing } })
            workTimeObject = { ...workTimeObject, wtFriId: wtFri[0].id }
          } else {
            workTimeObject = { ...workTimeObject, wtFriId: null }
          }
        }
        if (workTime.sub) {
          if (workTime.sub.isWorking) {
            let wtSat = await db.models.wtSat.findOrCreate({ where: { opening: workTime.sub.opening, closing: workTime.sub.closing } })
            workTimeObject = { ...workTimeObject, wtSatId: wtSat[0].id }
          } else {
            workTimeObject = { ...workTimeObject, wtSatId: null }
          }
        }
        if (workTime.ned) {
          if (workTime.ned.isWorking) {
            let wtSun = await db.models.wtSun.findOrCreate({ where: { opening: workTime.ned.opening, closing: workTime.ned.closing } })
            workTimeObject = { ...workTimeObject, wtSunId: wtSun[0].id }
          } else {
            workTimeObject = { ...workTimeObject, wtSunId: null }
          }
        }
        if (workTime.isAlwaysOpened) {
          let obj = { isAlwaysOpened: true, wtMonId: 1, wtTueId: 1, wtWedId: 1, wtThuId: 1, wtFriId: 1, wtSatId: 1, wtSunId: 1 }
          await db.models.objectWorkTime.update(obj, { where: { objectClId: objectId } })
        } else {
          await db.models.objectWorkTime.update(workTimeObject, { where: { objectClId: objectId } })
        }

        await db.models.objectCl.update(objectClArr, { where: { id: objectId } })
        await db.models.objectInfo.update(objectInfoArr, { where: { id: objectId } })
        await db.models.objectLocation.update(objectLocationArr, { where: { id: objectId } })
        objectPhonesArr.map(async item => {
          await db.models.objectPhones.update(item, { where: { id: item.id } })
        })
        ctx.body = JSON.stringify({ token: newToken })
      } catch (err) {
        await transaction.rollback();
        ctx.body = JSON.stringify({ update: false, token: newToken })
      }
      ctx.body = JSON.stringify({ token: newToken })
    } else {
      ctx.body = JSON.stringify({ token: newToken })
    }
  })

  /*
    ------------------------------
    OVO JE METODA ZA EDITOVANJE KORISNIKA
    ------------------------------
  */

  .post('/editUser', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      let userArgs = {};
      if (ctx.request.body.firstName) {
        userArgs.firstName = ctx.request.body.firstName;
      }
      if (ctx.request.body.lastName) {
        userArgs.lastName = ctx.request.body.lastName;
      }
      if (ctx.request.body.email) {
        userArgs.email = ctx.request.body.email;
      }
      const userUpdate = await db.models.person.update(userArgs, { where: { id: ctx.request.body.userId } })
      if (userUpdate) {
        ctx.body = JSON.stringify({ updated: true, token: newToken })
      } else {
        ctx.body = JSON.stringify({ updated: false, token: newToken })
      }
    } else {
      ctx.body = JSON.stringify({ updated: false, token: newToken })
    }
  })


  /*
    ////////////////////////////////////
    ZAHTEVI ZA POSEDOVANJE NEKOG OBJEKTA
    ////////////////////////////////////
  */

  .post('/owningRequest', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const requests = await db.models.owningRequest.findAll({
        attributes: ['id', 'personId', 'objectClId']
      })
      let korisnici = [];
      let objekti = [];

      await Promise.all(requests.map(async item => {
        const korisnik = korisnici.find(function (kor) { return kor.id === item.personId })
        const objekat = objekti.find(function (obj) { return obj.id === item.objectClId })
        if (korisnik) {
          item.user = korisnik
        } else {
          const userDb = await db.models.person.find({ where: { id: item.personId }, attributes: ['id', 'firstName', 'lastName', 'email'] })
          if (userDb) {
            item.user = userDb;
            korisnici.push(userDb)
          } else {
            item.user = {}
          }
        }
        if (objekat) {
          item.objekat = objekat
        } else {
          const objekatDb = await db.models.objectCl.find({ where: { id: item.objectClId }, attributes: ['name', 'id'] })
          if (objekatDb) {
            item.objekat = objekatDb
            objekti.push(objekatDb)
          } else {
            item.objekat = {};
          }
        }
      }))
      ctx.body = JSON.stringify({ requests, token: newToken })
    } else {
      ctx.body = JSON.stringify({ requests: [], token: newToken })
    }
  })

  /*
    ------------------------------
    ZA PRIHVATANJE ZAHTEVA POSEDOVANJA
    -------------------------------

    SALJE SE requestId kao parametar
  */

  .post('/acceptOwningRequest', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const request = await db.models.owningRequest.find({ where: { id: ctx.request.body.requestId } })
      if (request != null) {
        const requestDelete = await db.models.owningRequest.destroy({ where: { id: ctx.request.body.requestId } })
        const objectUpdate = await db.models.objectCl.update({ personId: request.personId }, { where: { id: request.objectClId } })
        if (objectUpdate != null) {
          ctx.body = JSON.stringify({ updated: true, token: newToken })
        } else {
          ctx.body = JSON.stringify({ updated: false, token: newToken })
        }
      } else {
        ctx.body = JSON.stringify({ updated: false, token: newToken })
      }
    }
  })

  /*
  ------------------------------------
  ZA ODBIJANJE ZAHTEVA POSEDOVANJA
  ------------------------------------

  SALJE SE requestId kao parametar
  */
  .post('/declineOwningRequest', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const request = await db.models.owningRequest.destroy({ where: { id: ctx.request.body.requestId } })
      if (request != null) {
        ctx.body = JSON.stringify({ deleted: true, token: newToken })
      } else {
        ctx.body = JSON.stringify({ deleted: false, token: newToken })
      }
    } else {
      ctx.body = JSON.stringify({ deleted: false, token: newToken })
    }
  })

  /*
    ////////////////////////////
    /// SCRAPING ////////////
    //////////////////////////
  */

  .post('/mapFetch', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      let objekti = [];
      await fetch('https://kadradi-backend.ml/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'query nearestObjects($lat: Float!, $lng: Float!, $distance: Float!, $categoryId: Int!) { nearestObjects(categoryId: $categoryId, lat: $lat, lng: $lng, distance: $distance) { name, objectLocations { lat, lng} }}',
          variables: { lat: ctx.request.body.lat, lng: ctx.request.body.lng, distance: ctx.request.body.radius, categoryId: ctx.request.body.categoryId }
        },
        ),

      })
        .then(res => res.json())
        .then(res => {
          Promise.all(res.data.nearestObjects.map(item => {
            objekti.push({ name: item.name, lat: item.objectLocations.lat, lng: item.objectLocations.lng })
          }))
        });

      const firstObjects = await db.models.objectSc.findAll({ where: { objectCategoryId: ctx.request.body.categoryId, imported: false } });
      Promise.all(firstObjects.map(item => {
        const distance = izracunajDistancu(ctx.request.body.lat, ctx.request.body.lng, item.lat, item.lng);
        if (distance < ctx.request.body.radius) {
          objekti.push({ name: item.name, lat: item.lat, lng: item.lng })
        }
      }))

      ctx.body = { objects: objekti, token: newToken }
    } else {
      ctx.body = { objects: [], token: newToken }
    }

  })

  .post('/startScraping', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token);
    if (newToken.success) {
      scrap.startScraping(ctx.request.body.categoryId, ctx.request.body.lat, ctx.request.body.lng, ctx.request.body.radius);
      ctx.body = JSON.stringify({ success: true, token: newToken });
    }
    // scrap.startScraping(ctx.request.body.categoryId, ctx.request.body.lat, ctx.request.body.lng, ctx.request.body.radius);
    // ctx.body = "Skrejpujem";
  })

  .post('/idiDalje', async (ctx, next) => {
    scrap.idiDalje();
    ctx.body = "idem Dalje"
  })


  .post('/stopScraping', async (ctx, next) => {
    scrap.stopScraping();
    ctx.body = "SCRAPING JE STAO"
  })

  .post('/scrapedObjects', async (ctx, next) => {
    const categoryId = ctx.request.body.categoryId;
    const newToken = verifyToken(ctx.request.body.token);
    const page = ctx.request.body.page;
    const limit = 10;
    const offset = limit * (page - 1)
    const pages = await db.models.objectSc.findAndCountAll({
      where: { objectCategoryId: categoryId, imported: false }
    });
    const pagesLength = Math.ceil(pages.count / limit);
    if (newToken.success) {
      const objects = await db.models.objectSc.findAll({
        limit: limit,
        offset: offset,
        where: { objectCategoryId: categoryId, imported: false }
      });
      ctx.body = JSON.stringify({ objects, pagesLength, token: newToken });
    } else {
      ctx.body = JSON.stringify({ objects: [], token: newToken })
    }
  })

  .post('/objectDetails', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const objectDetails = await fetchObject(ctx.request.body.placeId);
      if (objectDetails.status == "OK") {
        ctx.body = JSON.stringify({ details: objectDetails, token: newToken })
      }
    } else {
      ctx.body = JSON.stringify({ details: {}, token: newToken })
    }
  })

  .post('/importObjects', async (ctx, next) => {
    const newToken = verifyToken(ctx.request.body.token)
    if (newToken.success) {
      const ids = ctx.request.body.ids;
      const locations = await db.models.locations.findAll(
        {where: {parrentLocation: {[Op.ne]: 0}}}
      );
      let objectCount = 0;
      Promise.all(ids.map(async item => {
        const objectSc = await db.models.objectSc.find({ where: { id: item } })
        const objectInfo = await fetchObject(objectSc.google_id);
        if (objectInfo.status == "OK") {
          let objectClArgs = {
            name: objectSc.name,
            city: objectSc.city,
            streetAddress: objectSc.streetAddres,
            google_id: objectSc.google_id,
            objectCategoryId: objectSc.objectCategoryId
          };

          // PRETRAGA OPŠTINE!!!!!
          Promise.all(locations.map(item => {
            if (objectClArgs.locationId == undefined) {
              Promise.all(objectInfo.result.address_components.map(item2 => {
                if (item.name == item2.long_name) {
                  objectClArgs.locationId = item.id;
                }
              }))
            }
          }))
          //ZAVRŠENA PRETRAGA OPŠTINE!!!!!!!!!!
          const newObject = await db.models.objectCl.create(objectClArgs);
          if (newObject != null) {
            objectCount++;
            //RAZRESAVANJE RADNOG VREMENA OBJEKTA!!!
            const objectWorkTime = db.models.objectWorkTime.create({ objectClId: newObject.id });
            if (objectWorkTime != null) {
              if (objectInfo.result.opening_hours.periods.length > 0) {
                let workingTimeArgs = {};
                Promise.all(objectInfo.result.opening_hours.periods.map(async vreme => {
                  if (vreme.open.day == 1) {
                    const wtMon = await db.models.wtMon.findOrCreate({ where: { opening: vreme.open.time, closing: vreme.close.time } })
                    if (wtMon != null) {
                      workingTimeArgs.wtMonId = wtMon.id
                    }
                  } else if (vreme.open.day == 2) {
                    const wtTue = await db.models.wtTue.findOrCreate({ where: { opening: vreme.open.time, closing: vreme.close.time } })
                    if (wtTue != null) {
                      workingTimeArgs.wtTueId = wtTue.id
                    }
                  } else if (vreme.open.day == 3) {
                    const wtWed = await db.models.wtWed.findOrCreate({ where: { opening: vreme.open.time, closing: vreme.close.time } })
                    if (wtWed != null) {
                      workingTimeArgs.wtWedId = wtWed.id
                    }
                  } else if (vreme.open.day == 4) {
                    const wtThu = await db.models.wtThu.findOrCreate({ where: { opening: vreme.open.time, closing: vreme.close.time } })
                    if (wtThu != null) {
                      workingTimeArgs.wtThuId = wtThu.id
                    }
                  } else if (vreme.open.day == 5) {
                    const wtFri = await db.models.wtFri.findOrCreate({ where: { opening: vreme.open.time, closing: vreme.close.time } })
                    if (wtFri != null) {
                      workingTimeArgs.wtFriId = wtFri.id
                    }
                  } else if (vreme.open.day == 6) {
                    const wtSat = await db.models.wtSat.findOrCreate({ where: { opening: vreme.open.time, closing: vreme.close.time } })
                    if (wtSat != null) {
                      workingTimeArgs.wtSatId = wtSat.id
                    }
                  } else if (vreme.open.day == 7) {
                    const wtSun = await db.models.wtSun.findOrCreate({ where: { opening: vreme.open.time, closing: vreme.close.time } })
                    if (wtSun != null) {
                      workingTimeArgs.wtSunId = wtSun.id
                    }
                  }
                }))
                const wtUpdate = await db.models.objectWorkTime.update(workingTimeArgs, { where: { id: objectWorkTime.id } })
              }

              const objectLocation = await db.models.objectLocation.create({objectClId: newObject.id, lat: objectInfo.lat, lng: objectInfo.lng, address: objectInfo.streetAddres,city: objectInfo.city})
              //ZAVRSENO RAZRESAVANJE RADNOG VREMENA OBJEKTA!!! JEBOTE KURAC
              if (objectInfo.result.photos.length) {
                const profilna = fetchObjectImage(objectInfo.result.photos[0].photo_reference);
                const updateProfilna = await db.models.objectFile.create({ objectClId: newObject.id, objectFileCategoryId: 1 })
              }
              if (objectInfo.result.website) {
                const objectInfo = await db.models.objectInfo.create({ objectClId: newObject.id, websiteUrl: objectInfo.result.website })
              } else {
                const objectInfo = await db.models.objectInfo.create({objectClId: newObject.id})
              }

            } else {
              db.models.objectCl.destroy({ where: { id: newObject.id } })
              objectCount--;
            }
          }
        } else {
          console.log('ISTEKAO JE API');
        }
        db.models.objectSc.update({ imported: true }, { where: { id: item } })
      }))
      ctx.body = JSON.stringify({ objects: objectCount, token: newToken })
    } else {
      ctx.body = JSON.stringify({ objects: 0, token: newToken })
    }
  })

  /*
      ^^^^^^^^^^^^^^^^^^
      ||||||||||||||||||
      SCRAPING
  */

  /* 
  /////////////////////////////
  ///// TEST /////////////////
  */
  .post('/transactionTest', async (ctx, next) => {
    const transakcija = db.transaction(function (t) {
      return db.models.admin.create({
        username: 'fdsxzc',
        password: 'tebra'
      }, { transaction: t }).then(function (user) {
        return db.models.person.create({
          email: 'niggafromdhud',
          firstName: 'Niko',
          lastName: "nikic"
        }, { transaction: t }).then(function (result) {
          console.log(result)
        }).catch(function (err) {
          console.log(err)
        })
      })
    })
  })


  // Favicon.ico.  By default, we'll serve this as a 204 No Content.
  // If /favicon.ico is available as a static file, it'll try that first
  .get('/favicon.ico', async ctx => {
    ctx.status = 204;
  });






// Build the app instance, which we'll use to define middleware for Koa
// as a precursor to handling routes
const app = new Koa()
  // Adds CORS config
  .use(koaCors(config.corsOptions))

  // Error wrapper.  If an error manages to slip through the middleware
  // chain, it will be caught and logged back here
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      // If we have a custom error handler, use that - else simply log a
      // message and return one to the user
      if (typeof config.errorHandler === 'function') {
        config.errorHandler(e, ctx, next);
      } else {
        console.log('Error:', e.message);
        ctx.body = 'There was an error. Please try again later.';
      }
    }
  });

if (config.enableTiming) {
  // It's useful to see how long a request takes to respond.  Add the
  // timing to a HTTP Response header
  app.use(async (ctx, next) => {
    const start = ms.now();
    await next();
    const end = ms.parse(ms.since(start));
    const total = end.microseconds + (end.milliseconds * 1e3) + (end.seconds * 1e6);
    ctx.set('Response-Time', `${total / 1e3}ms`);
  });
}

// Middleware to set the per-request environment, including the Apollo client.
// These can be overriden/added to in userland with `config.addBeforeMiddleware()`
app.use(async (ctx, next) => {
  ctx.apollo = {};
  return next();
});

// Add 'before' middleware that needs to be invoked before the per-request
// Apollo client and Redux store has instantiated
config.beforeMiddleware.forEach(middlewareFunc => app.use(middlewareFunc));

// Create a new Apollo client and Redux store per request.  This will be
// stored on the `ctx` object, making it available for the React handler or
// any subsequent route/middleware
app.use(async (ctx, next) => {
  // Create a new server Apollo client for this request, if we don't already
  // have one
  if (!ctx.apollo.client) {
    ctx.apollo.client = createClient({
      ssrMode: true,
      // Create a network request.  If we're running an internal server, this
      // will be a function that accepts the request's context, to feed through
      // to the GraphQL schema
      networkInterface: createNeworkInterface(ctx),
      ...ctx.apollo.options,
    });
  }

  // Create a new Redux store for this request, if we don't have one
  if (!ctx.store) {
    ctx.store = createNewStore(ctx.apollo.client);
  }

  // Pass to the next middleware in the chain: React, custom middleware, etc
  return next();
});

/* FORCE SSL */

// Middleware to re-write HTTP requests to SSL, if required.
if (config.enableForceSSL) {
  app.use(koaSSL(config.enableForceSSL));
}

// Middleware to add preliminary security for HTTP headers via Koa Helmet
if (config.enableKoaHelmet) {
  app.use(koaHelmet(config.koaHelmetOptions));
}

// Attach custom middleware
config.middleware.forEach(middlewareFunc => app.use(middlewareFunc));

// Attach an internal GraphQL server, if we need one
if (config.graphQLServer) {
  // Attach the GraphQL schema to the server, and hook it up to the endpoint
  // to listen to POST requests
  router.post(
    config.graphQLEndpoint,
    graphqlKoa(context => ({
      // Bind the current request context, so it's accessible within GraphQL
      context,
      // Attach the GraphQL schema
      schema: config.graphQLSchema,
    })),
  );
}

// Do we need the GraphiQL query interface?  This can be used if we have an
// internal GraphQL server, or if we're pointing to an external server.  First,
// we check if `config.graphiql` === `true` to see if we need one...

if (config.graphiQL) {
  // The GraphiQL endpoint default depends on this order of precedence:
  // explicit -> internal GraphQL server endpoint -> /graphql
  let graphiQLEndpoint;

  if (typeof config.graphiQL === 'string') {
    // Since we've explicitly passed a string, we'll use that as the endpoint
    graphiQLEndpoint = config.graphiQL;
  } else if (config.graphQLServer) {
    // If we have an internal GraphQL server, AND we haven't set a string,
    // the default GraphiQL path should be the same as the server endpoint
    graphiQLEndpoint = config.graphQLEndpoint;
  } else {
    // Since we haven't set anything, AND we don't have an internal server,
    // by default we'll use `/graphql` which will work for an external server
    graphiQLEndpoint = '/graphql';
  }

  router.get(
    graphiQLEndpoint,
    graphiqlKoa({
      endpointURL: config.graphQLEndpoint,
    }),
  );
}

// Attach any custom routes we may have set in userland
config.routes.forEach(route => {
  router[route.method](route.route, ...route.handlers);
});

/* BODY PARSING */

// `koa-bodyparser` is used to process POST requests.  Check that it's enabled
// (default) and apply a custom config if we need one
if (config.enableBodyParser) {
  app.use(require('koa-bodyparser')(
    // Pass in any options that may have been set in userland
    config.bodyParserOptions,
  ));
}

/* CUSTOM APP INSTANTIATION */

// Pass the `app` to do anything we need with it in userland. Useful for
// custom instantiation that doesn't fit into the middleware/route functions
if (typeof config.koaAppFunc === 'function') {
  config.koaAppFunc(app);
}

// Listener function that will start http(s) server(s) based on userland
// config and available ports
const listen = () => {
  // Spawn the listeners.
  const servers = [];

  const server1 = http.createServer(app.callback())
  const server2 = https.createServer(config.sslOptions, app.callback())

  // Plain HTTP
  if (config.enableHTTP) {
    let io = require('socket.io')(server1)
    io.on('connection', function (socket) {
      let newObject = PubSub.subscribe('object_found', function (msg, data) {
        io.emit('object_found', data);
      });
      let scrapeInfo = PubSub.subscribe('scrape_info', function (msg, data) {
        io.emit('scrape_info', data)
      })
    });
    servers.push(
      server1.listen(process.env.PORT),
    );
  }

  // SSL -- only enable this if we have an `SSL_PORT` set on the environment
  if (process.env.SSL_PORT) {
    servers.push(
      server2.listen(proces.env.SSL_PORT),
    );
  }

  return servers;
};

// Export everything we need to run the server (in dev or prod)
export default {
  router,
  app,
  listen,
};
