import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown } from 'semantic-ui-react';

class EditObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objToEdit: {},
      objectCategoriesArr: [],
      locationId: '',
      name: '',
      objectCategoryId: '',
      personId: '',
      shortDescription: '',
      streetAddress: '',

    }
  }
  objectEdit = (e) => {
    if (e.target.name === 'locationId') {
      this.setState({
        locationId: e.target.value,
      })
    }
    if (e.target.name === 'name') {
      this.setState({
        name: e.target.value,
      })
    }
    if (e.target.name === 'objectCategoryId') {
      this.setState({
        objectCategoryId: e.target.value,
      })
    }
    if (e.target.name === 'personId') {
      this.setState({
        personId: e.target.value
      })
    }
    if (e.target.name === 'shortDescription') {
      this.setState({
        shortDescription: e.target.value
      })
    }
    if (e.target.name === 'streetAddress') {
      this.setState({
        streetAddress: e.target.value
      })
    }
  }
  componentWillMount() {
    this.getObjectById();
  }
  getObjectById = async () => {
    let objectId = this.props.match.params.id;
    let response = await post.secure('/objectById', {
      objectId: objectId,
      token: this.props.token
    });
    if (response.token.success) {
      this.setState({
        objToEdit: response.objectById,
        locationId: response.objectById.objectCl.locationId,
        name: response.objectById.objectCl.name,
        objectCategoryId: response.objectById.objectCl.objectCategoryId,
        personId: response.objectById.objectCl.personId,
        shortDescription: response.objectById.objectCl.shortDescription,
        streetAddress: response.objectById.objectCl.streetAddress,
      })
      console.log('RESPONSE', response)
    } else {
      console.log('stajebreovo')
    }
  }
  setCategoryObj = async (e, { value }) => {
    this.setState({
      objectCategoryId: value
    })
  }

  prepareToEditObject = () => {
    let {objToEdit} = this.state
    let objectArr = [];
    // let arr = Object.keys(this.state)
    // console.log("AREJ", arr)
    let objectClKeys = Object.keys(objToEdit.objectCl)
    let objectInfo = Object.keys(objToEdit.objectInfo)
    let objectPhones = Object.keys(objToEdit.objectPhones[0])
    let objectLocation = Object.keys(objToEdit.objectLocation[0])
    console.log("objectLOC", objectClKeys)
    objectClKeys.map((item, key) => {
      if (objectCl[item] != this.state[item]) {
        let obj = {
          key: key,
          name: item,
          value: this.state[item],
        }
        objectArr.push(obj)
      }
    })
    console.log('niz', objectArr)
  }

  render() {
    console.log("STEJT ", this.state)
    console.log('STRIPTIZETA', this.state.objectCategoriesArr)
    console.log("LOC", this.state.objToEdit.locations)
    return (
      <div>
        {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
        <Input label='Name: ' name='name' value={this.state.name} onChange={this.objectEdit} /><br />
        <Dropdown
         value={this.state.objectCategoryId} 
         selection 
         options={this.state.objToEdit.objectCategoriesArr} 
         onChange={this.setCategoryObj}/><br />
         <Dropdown
          value={this.state.locationId} 
          selection 
          options={this.state.objToEdit.locations}
          onChange={this.setCategoryObj} /><br />
         <Dropdown
         selection
          /><br />
        <Input label='personId: ' name='personId' value={this.state.personId} onChange={this.objectEdit} /><br />
        <Input label='shortDescription: ' name='shortDescription' value={this.state.shortDescription} onChange={this.objectEdit} /><br />
        <Input label='streetAdress: ' name='streetAddress'  onChange={this.objectEdit} /><br />
        <Button primary onClick={() => this.prepareToEditObject()}>Save</Button>
      </div>
    )
  }
}
export default EditObject;
