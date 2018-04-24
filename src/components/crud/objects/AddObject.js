import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown, Checkbox, Segment } from 'semantic-ui-react';
import Number from './Number'
import Geosuggest from 'react-geosuggest';

class AddObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameError: "",
      objectCategorie: "",
      objectCategorieError: "",
      categories: [],
      cityArr: [],
      childLocationArr: [],
      childLocation: [],
      cityId: "",
      cityIdError: "",
      cityPart: "",
      cityPartError: "",
      person: null,
      image: "",
      objectLocation:"",
      objectInfo: "",
      popular: "",
      phone: "",
      phoneDesc: "",
      phoneArr: [],
      additionalInfo: "",
      address:"",
      lat:"",
      lng: "",
      verified: false,
      display:"none"
    }
  }
  componentWillMount() {
    this.getObjectCategories();
    this.getLocations();
  }
  handleInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }
  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  toggle = (event) =>  this.setState({ verified: !this.state.verified });

  removeNumber = (index) => {
    this.state.phoneArr.splice(index, 1)
    this.setState({
      phoneArr: this.state.phoneArr
    })
  }
  addNumber = (tel, desc) => {
    this.state.phoneArr.push({ desc: desc, number: tel })
    this.setState({
      phoneArr: this.state.phoneArr
    })
  }
  getLocations = async () => {
    let response = await post.secure('/getAllLocations', {})
    if (response.token.success) {
      console.log("LOCATIONS", response)
      let arr = []
      let arr1 = []
      let obj = response.locations.map(item => {
        if (item.parrentLocation === 0) {
          return arr.push({
            key: item.id,
            text: item.name,
            value: item.id,
            parrentLocation: item.parrentLocation
          })
        }
        if (item.parrentLocation !== 0) {
          return arr1.push({
            key: item.id,
            text: item.name,
            value: item.id,
            parrentLocation: item.parrentLocation
          })
        }
      })

      this.setState({
        cityArr: arr,
        childLocationArr: arr1
      })
    }
    console.log("RESPONSE",response)
  }
  getCityPart = (e, { value }) => {
    let arr = this.state.childLocationArr.filter(id => id.parrentLocation == value)
    this.setState({
      childLocation: arr,
      cityId: value
    })
  }
  getObjectCategories = async () => {
    let response = await post.secure('/categoriesArray', {})
    console.log("CATEGORIES", response)
    if (response.token.success) {
      let arr = []
      let obj = response.categoriesArray.map(item => {
        return arr.push({
          key: item.id,
          text: item.nameM,
          value: item.id
        })
      })
      this.setState({
        categories: arr
      })
    }
  }
  objectToBase = async () => {
    // if(response.token.success){
    //   console.log("POSLATO KA BAZI",response)
    // }
    let response = await post.secure('/addObject', { 
      addObject:{
        objectCl: {
          name:this.state.name,
          shortDescription:this.state.additionalInfo,
          verified:this.state.verified,
          locationId:this.state.cityPart,
          personId:this.state.person,
          objectCategoryId: this.state.objectCategorie
        },
        objectInfo: {
          websiteUrl: this.state.objectInfo,
          popularBecauseOf: this.state.popular,
        },
        // kad je always open true ne salje ostale dane 
        workTime: {
          isAlwaysOpened: true,
          pon: {
            isWorking: true,
            opening: "1200",
            closing: "1400"
          },
          uto: {
            isWorking: true,
            opening: "1200",
            closing: "1400"
          },  
          sre: {
            isWorking: true,
            opening: "1200",
            closing: "1400"
          },
          cet: {
            isWorking: true,
            opening: "1200",
            closing: "1400"
          },
          pet: {
            isWorking: true,
            opening: "1200",
            closing: "1400"
          },
          sub: {
            isWorking: true,
            opening: "1200",
            closing: "1400"
          }, 
          ned: {
            isWorking: true,
            opening: "1200",
            closing: "1400"
          },
        },
        objectLocations: {
          lat: 33.5,
          lng: 14.5,
          adress: this.state.address,
          city: "Unknown",
          zipCode: 2131231,
        },
        objectPhones: this.state.phoneArr,
        objectFile: {
        fileUrl: "kica",
        desc: "babababa"
        }
      }
    }) 
    console.log("RESPONSE",response)
  }
  validation = (name, categorie, city, cityPart) => {
    let validate = false
    if (this.state.name === '') {
      this.setState({ nameError: "Must enter object name!" })
    } else {
      this.setState({ nameError: "" })
    }
    if (this.state.objectCategorie === '') {
      this.setState({ objectCategorieError: "Must choose object categorie!" })
    } else {
      this.setState({ objectCategorieError: " " })
    }
    if (this.state.cityId === '') {
      this.setState({ cityIdError: "Must choose city!" })
    } else {
      this.setState({ cityIdError: "" })
    }
    if (this.state.cityPart === '') {
      this.setState({ cityPartError: "Must choose city part" })
    } else {
      this.setState({ cityPartError: "" })
    }
    if (name !== "" && categorie !== "" && city !== "" && cityPart !== "") {
      validate = true
      this.setState({display:"none"})
    } else {
      validate = false
      this.setState({display:"inline-block"})
    }
    console.log("VALIDATE", validate)
    return validate

  }
  addObject = () => {
    let validate = this.validation(this.state.name, this.state.objectCategorie, this.state.cityId, this.state.cityPart)
    if (validate) {
      this.objectToBase();
      console.log("MOZE UPIT", validate)
    } else {
      console.log(" NE MOZE UPIT", validate)
    }
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
    console.log("ADD OBJECT STATE", this.state)
    return (
      <div>
        {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
        <Input label='Name: ' name='name' error={this.state.nameError} onChange={this.handleInput} required /><br />
        <Dropdown
          error={this.state.objectCategorieError}
          placeholder="Select categorie"
          name="objectCategorie"
          selection
          options={this.state.categories}
          onChange={this.handleChange}
        /><br />
        <Dropdown
          error={this.state.cityIdError}
          placeholder="Select city"
          name="cityId"
          selection
          options={this.state.cityArr}
          onChange={this.getCityPart}
        /><br />
        <Dropdown
          error={this.state.cityPartError}
          placeholder="City part"
          name="cityPart"
          selection
          options={this.state.childLocation}
          onChange={this.handleChange}
        /><br />
        <Geosuggest initialValue={this.state.address} onSuggestSelect={this.onSuggestSelect}/><br />
        <Input label='Person: ' name='person' onChange={this.handleInput} /><br />
        <Input label='Image: ' name='image' onChange={this.handleInput} placeholder="Image url..." /><br />
        <div>
          <Input
            action={<Input name="phoneDesc" placeholder="Description" onChange={this.handleInput} />}
            label='Phone: '
            name='phone'
            placeholder="Number"
            onChange={this.handleInput} />
          <Button icon='plus' onClick={() => this.addNumber(this.state.phone, this.state.phoneDesc)} />
          {this.state.phoneArr.length ?
            this.state.phoneArr.map((item, index) => {
              return <Number index={index} removeNumber={this.removeNumber} value={item.number} desc={this.state.phoneDesc} />
            }) : null
          }
        </div>
        <Input label='Object Info: ' name='objectInfo' onChange={this.handleInput} placeholder="Webiste url.." /><br />
        <Input label='Popular because of: ' name='popular' onChange={this.handleInput} placeholder="Why is this object popular..." /><br />
        <Input label='Additional info: ' name='additionalInfo' onChange={this.handleInput} placeholder="Add some info..." /><br />
        <Checkbox
          name="verified" 
          checked={this.state.checked}
          label='Verified'
          onChange={this.toggle}
        />
        <Segment inverted color='red' compact secondary style={{display:`${this.state.display}`}}>
          <ul>
            <li>{this.state.nameError}</li>
            <li>{this.state.objectCategorieError}</li>
            <li>{this.state.cityIdError}</li>
            <li>{this.state.cityPartError}</li>
          </ul>
         </Segment>
        <Button primary onClick={this.addObject}>Add</Button>
      </div>
    )
  }
}
export default AddObject;
