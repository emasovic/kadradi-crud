import React from 'react';
import post from './fetch/post';

class Proba extends React.Component{
  getAllObjCategories = async () => {
    let response = await post.secure('/editObject', {});
    console.log(response)
  }
  getObjById = async () => {
    let response = await post.secure('/objectById', {
      objectId: 1,
    });
    console.log(response)
  }
  render() {
    return(
      <div>
        <button onClick={() => this.getAllObjCategories()} >edit objects</button>
        <button onClick={() => this.getObjById()} >get object by id</button>
      </div>
    )
  }
}
export default Proba;