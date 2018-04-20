import React from 'react';
import post from './fetch/post';

class Proba extends React.Component{
  getAllObjCategories = async () => {
    let response = await post.secure('/editObject', {
      objectId: 1,
      editObject: {
        workTime: {
          isAlwaysOpened: false,
          pon: {
            isWorking: true,
            opening: '5467',
            closing: '5467',
          },
          uto: {
            isWorking: true,
            opening: '9977',
            closing: '9977',
          },
        },
        objectCl: {
          name: 'STEFAN PROBA1',
          shortDescription: 'STEFAN PROBA1',
          verified: true,
          personId: 2,
          objectCategoryId: 6
        },
        objectLocation: {
          lat: 40,
          lng: 20,
          adress: 'marsala tita',
          city: 'beograd',
          zipCode: 11309,
        },
        objectInfo: {
          webSiteUrl: 'kadradi-frontend.ml',
          hasRestaurant: false,
          popularBecauseOf: 'nisam popularan',
        },
        objectPhones: [
          {
            id: 1,
            desc: 'HOOOOOOOOOOOOOT',
            number: '0621887914',
          }
        ]
      },
    });
    console.log(response)
  }
  getObjById = async () => {
    let response = await post.secure('/objectById', {
      objectId: 1,
    });
    console.log(response)
  }
  getAllLocations = async () => {
    let response = await post.secure('/getAllLocations', {});
    console.log(response)
  }
  render() {
    return(
      <div>
        <button onClick={() => this.getAllObjCategories()} >edit objects</button>
        <button onClick={() => this.getObjById()} >get object by id</button>
        <button onClick={() => this.getAllLocations()} >get all locations</button>

      </div>
    )
  }
}
export default Proba;