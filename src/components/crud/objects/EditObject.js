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
      address: '',
      verified: '',
      webSiteUrl: '',
      city: '',
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
    if (e.target.name === 'address') {
      this.setState({
        address: e.target.value
      })
    }
    if (e.target.name === 'verified') {
      this.setState({
        verified: e.target.value
      })
    }
    if (e.target.name === 'webSiteUrl') {
      this.setState({
        webSiteUrl: e.target.value
      })
    }
    if (e.target.name === 'city') {
      this.setState({
        city: e.target.value
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
        address: response.objectById.objectLocation.address,
        verified: response.objectById.objectCl.verified,
        webSiteUrl: response.objectById.objectInfo.websiteUrl,
        city: response.objectById.objectLocation.city
      })
    }
    console.log('RESPONSE',response)
  }
  setCategoryObj = async (e, { value }) => {
    this.setState({
      objectCategoryId: value
    })
  }

  prepareToEditObject = async () => {
    let {objToEdit} = this.state
    let objectClArr = {};

    let objectLocationArr = {};
    let objectClKeys = Object.keys(objToEdit.objectCl)
    let objectInfoKeys = Object.keys(objToEdit.objectInfo)
    let objectPhones = Object.keys(objToEdit.objectPhones)
    // let objectPhones = Object.keys(objToEdit.objectPhones[0])
    let objectLocationKeys = Object.keys(objToEdit.objectLocation)
    // let objectLocation = Object.keys(objToEdit.objectLocation[0])
    objectClKeys.map((item) => {
      if (objToEdit.objectCl[item] != this.state[item]) {
        console.log('item', item)
        console.log('IZ PROPSA', objToEdit.objectCl[item])
        console.log('IZ STATE', this.state[item])
        objectClArr = {
          ...objectClArr,
          [item]: this.state[item]
        }
      }
      
    })
    console.log('OBJECT CL', objectClArr)
    objectLocationKeys.map((item) => {
      if (objToEdit.objectLocation[item] != this.state[item]) {
       objectLocationArr = {
         ...objectLocationArr,
         [item]: this.state[item]
       }
      }
    })
    console.log('OBJECT LOC', objectLocationArr)
    // console.log('niz', objectClArr)
    // let response = await post.secure('/editObject', {
    //   objectId: objectId,
    //   token: this.props.token,
    //   objectClArr: {},
    //   objectInfoArr: {},
    //   objectLocationArr: {},
    //   objectPhonesArr: [],
    // });
  }

  render() {
  console.log('STATE', this.state)
    return (
      <div>
        {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
        <Input label='Name: ' name='name' value={this.state.name} onChange={this.objectEdit} /><br />
        <Dropdown
         value={this.state.objectCategoryId} 
         selection 
         onChange={this.setCategoryObj}
         options={this.state.objToEdit.objectCategoriesArr} /><br />
         <Dropdown
          value={this.state.locationId} 
          selection 
          onChange={this.setCategoryObj}
          options={this.state.objToEdit.locations} /><br />
         {/* <Dropdown
         selection
          /><br /> */}
        <Input label='personId: ' name='personId' value={this.state.personId} onChange={this.objectEdit} /><br />
        <Input label='shortDescription: ' name='shortDescription' value={this.state.shortDescription} onChange={this.objectEdit} /><br />
        <Input label='streetAddress: ' name='address' value={this.state.address} onChange={this.objectEdit} /><br />
        <Input label='Verified: ' name='verified' value={this.state.verified} onChange={this.objectEdit} /><br />
        <Input label='WebSiteUrl: ' name='webSiteUrl' value={this.state.webSiteUrl} onChange={this.objectEdit} /><br />
        <Input label='City: ' name='city' value={this.state.city} onChange={this.objectEdit} /><br />
        <Button primary onClick={() => this.prepareToEditObject()}>Save</Button>
      </div>
    )
  }
}
export default EditObject;
