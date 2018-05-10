import React from 'react';
import post from './fetch/post';

class Proba extends React.Component{
  getAllObjCategories = async () => {
    let response = await post.secure('/editObject', {
      objectId: 1,
      editObject: {
        // workTime: {
        //   isAlwaysOpened: false,
        //   ned: {
        //     isWorking: true,
        //     opening: '0050',
        //     closing: '0101',
        //   },
        // },
        // objectCl: {
        //   name: 'STEFAN',
        //   shortDescription: 'STEFAN PROBA1',
        //   verified: true,
        //   personId: 2,
        //   objectCategoryId: 6,
        // },
        // objectLocation: {
        //   lat: 40,
        //   lng: 20,
        //   adress: 'marsala tita',
        //   city: 'beograd',
        //   zipCode: 11309,
        // },
        // objectInfo: {
        //   webSiteUrl: 'kadradi-frontend.ml',
        //   hasRestaurant: false,
        //   popularBecauseOf: 'nisam popularan',
        // },
        objectFile: {
          id: 17,
          objectClId: 9,
          fileUrl: 'STA',
          desc: 'KURAC'
        },
        // objectPhones: [
        //   {
        //     objectInfoId: 1,
        //     desc: 'HAHAHA',
        //     number: '3333333'            
        //   },
        //   {
        //     objectInfoId: 1,
        //     desc: 'AHAHAHHAHAHAH',
        //     number: '4444444'            
        //   },
        // ],
        // deletePhones: [1]
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
  addObject = async () => {
    let response = await post.secure('/addObject', {
      addObject: {
        workTime: {
          isAlwaysOpened: false,
          pon: {
            isWorking: true,
            opening: '0030',
            closing: '0010',
          },
          uto: {
            isWorking: true,
            opening: '0535',
            closing: '1045',
          },
        },
        objectCl: {
          name: 'ELVIS',
          shortDescription: 'PRISLI',
          verified: true,
          personId: 1,
          objectCategoryId: 6,
          locationId: 2,
        },
        objectLocation: {
          lat: 40,
          lng: 20,
          address: 'Kaludjeraja',
          city: 'beograd',
          zipCode: 11305,
        },
        objectInfo: {
          websiteUrl: 'honesty.ml',
          hasRestaurant: false,
          popularBecauseOf: 'nisam popularan',
        },
        objectFile: {
          fileUrl: 'sadasdasd',
          desc: 'asdasdasdadsa',
        },
        objectPhones: [
          {
            desc: 'lalalal',
            number: '111111111',
          },
          {
            desc: 'nanananl',
            number: '222222222222',
          },
        ]
      },
    });
  }
  stefan = async () => {
    let response = await post.secure('/stefan', {
      stefan: 'lala'
    });
    
  }
  getUsers = async (e) => {
    let response = await post.secure('/getUsers', {
      email: e.target.value
    });
    console.log('RES', response)
  }
  render() {
    return(
      <div>
        <button onClick={() => this.getAllObjCategories()} >edit objects</button>
        <button onClick={() => this.getObjById()} >get object by id</button>
        <button onClick={() => this.getAllLocations()} >get all locations</button>
        <button onClick={() => this.addObject()} >add object</button>
        <button onClick={() => this.stefan()} >SteFAN</button>
        <input onChange={(e) => this.getUsers(e)} placeholder='User email' />
      </div>
    )
  }
}
export default Proba;