import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown, TextArea } from 'semantic-ui-react';
import { stat } from 'fs';
import Geosuggest from 'react-geosuggest';

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
      lat: '',
      lng: '',
      verified: '',
      websiteUrl: '',
      city: '',
      streetAddress: '',
      par: [],
      childLocation: [],
      newVal: 0,
      popularBecauseOf: '',
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
    // if (e.target.name === 'address') {
    //   this.setState({
    //     address: e.target.value
    //   })
    // }
    if (e.target.name === 'verified') {
      this.setState({
        verified: e.target.value
      })
    }
    if (e.target.name === 'websiteUrl') {
      this.setState({
        websiteUrl: e.target.value
      })
    }
    if (e.target.name === 'city') {
      this.setState({
        city: e.target.value
      })
    }
    if (e.target.name === 'popularBecauseOf') {
      this.setState({
        popularBecauseOf: e.target.value
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
        websiteUrl: response.objectById.objectInfo.websiteUrl,
        city: response.objectById.objectLocation.city,
        popularBecauseOf: response.objectById.objectInfo.popularBecauseOf
      })
      this.setParentObj(response.objectById.locations);
    } else {
      console.log('stajebreovo')
    }
    console.log('RESPONSE',response)
  }
  setCategoryObj = async (e, { value }) => {
    this.setState({
      objectCategoryId: value
    })
  }

 
  setParentObj = (parrent) => {
    let obArr = [];
    let nekiObj = {
      key: 2,
      value: 2,
      text: "Novi sad",
      parrentLocation: 0,
    }
    for(let child in parrent){
      console.log("PARRENT LOCATION: ", parrent[child].text);
      if(parrent[child].parrentLocation === 0){
        obArr[child] = parrent[child];
      }
    }   
    let newArr = [...obArr,nekiObj];
    this.setState({
      par : newArr,
    });
  }
  setLo = (e, { value }) => {
    let arr = this.state.objToEdit.locations.filter(word => word.parrentLocation == value)
    this.setState({
      childLocation: arr
    })
  }
  // findChildLocation = (parrent, parrentKey) => {
  //   let obb = [];
  //   for (let child in parrent){
  //     if(parrent[child].parrentLocation === parrentKey){
  //       obb[child] = parrent[child];
  //     }
  //   }
  //   this.setState({
  //     childLocation: obb,
  //   });
  // }

    
prepareToEditObject = async () => {
  let {objToEdit} = this.state
  let objectClArr = {};
  let objectLocationArr = {};
  let objectInfoArr = {};
  let objectPhonesArr = [];
  let objectClKeys = Object.keys(objToEdit.objectCl)
  let objectInfoKeys = Object.keys(objToEdit.objectInfo)
  let objectPhonesKeys = Object.keys(objToEdit.objectPhones)
  let objectLocationKeys = Object.keys(objToEdit.objectLocation)
    objectClKeys.map((item) => {
      if (objToEdit.objectCl[item] != this.state[item]) {
        objectClArr = {
          ...objectClArr,
          [item]: this.state[item]
        }
      }
      
    })
    console.log('OBJECT CLpre', objectClArr)
    console.log('OBJECT LOCpre', objectLocationArr)
    
    objectLocationKeys.map((item) => {
      if (objToEdit.objectLocation[item] != this.state[item]) {
       objectLocationArr = {
         ...objectLocationArr,
         [item]: this.state[item]
       }
      }
    })
    objectInfoKeys.map((item) => {
      if (objToEdit.objectInfo[item] != this.state[item]) {
       objectInfoArr = {
         ...objectInfoArr,
         [item]: this.state[item]
       }
      }
    })
    console.log('OBJECT CLposle', objectClArr)
    console.log('OBJECT LOCposle', objectLocationArr)
    console.log('OBJECT infoposle', objectInfoArr)
    
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
  onSuggestSelect = (suggest) => {
    console.log('sug',suggest)
    let street = suggest.description.split(",");
    this.setState({
      address: street[0],
      lat: suggest.location.lat,
      lng: suggest.location.lng,
    })
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
         options={this.state.objToEdit.objectCategoriesArr} 
         onChange={this.setCategoryObj}/><br />
         <Dropdown
          selection 
          onChange={this.setCategoryObj}
          options={this.state.childLocation} /><br />
         <Dropdown
          selection
          value= {this.state.newVal}
          options={this.state.par}
          onChange={this.setLo}
        /><br />
        <Input label='personId: ' name='personId' value={this.state.personId} onChange={this.objectEdit} /><br />
        Short Description :<br />
        <TextArea autoHeight name='shortDescription' value={this.state.shortDescription} onChange={this.objectEdit} style={{minHeight:'50px',minWidth:'300px'}} /><br />
        <Geosuggest initialValue={this.state.address} onSuggestSelect={this.onSuggestSelect}/>
        {/* <Input label='address: ' name='address' value={this.state.address} onChange={this.objectEdit} /><br /> */}
        <Input label='Verified: ' name='verified' value={this.state.verified} onChange={this.objectEdit} /><br />
        <Input label='WebSiteUrl: ' name='websiteUrl' value={this.state.websiteUrl} onChange={this.objectEdit} /><br />
        popularBeacuseOf:<br />
        <TextArea autoHeight  name='popularBecauseOf' value={this.state.popularBecauseOf} onChange={this.objectEdit} style={{minHeight:'50px',minWidth:'300px'}}/><br />
        {/* <Input label='City: ' name='city' value={this.state.city} onChange={this.objectEdit} /><br /> */}
        <Button primary onClick={() => this.prepareToEditObject()}>Save</Button>
      </div>
    )
  }
}
export default EditObject;
