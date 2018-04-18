import React from 'react';
import post from './fetch/post';

class Proba extends React.Component{
  getAllObjCategories = async () => {
    let response = await post.secure('/editObject', {});
    console.log(response)
  }
  render() {
    return(
      <div>
        <button onClick={() => this.getAllObjCategories()} >dont press!!!</button>
      </div>
    )
  }
}
export default Proba;