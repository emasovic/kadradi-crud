import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown, Checkbox, Segment,TextArea } from 'semantic-ui-react';
import SugestInput from './SugestInput'
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
      image: "",
      objectLocation: "",
      websiteUrl: "",
      personId: null,
      popular: "",
      phone: "",
      phoneDesc: "",
      phoneArr: [],
      shortDescription: "",
      address: "",
      lat: "",
      lng: "",
      verified: false,
      display: "none",
      getUser: "",
      emailArr: [],
      count: 1,
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

  toggle = (event) => this.setState({ verified: !this.state.verified });

  removeNumber = (index) => {
    let index1 = this.state.phoneArr.findIndex(x => x.id == index)
    let arr = this.state.phoneArr
    arr.splice(index1, 1)
    this.setState({
      phoneArr: arr
    })
  }
  addNumber = (tel, desc) => {
    let arr = this.state.phoneArr.push({ desc: desc, number: tel, id: this.state.count })
    this.setState({
      phoneArr: this.state.phoneArr,
      count: this.state.count + 1
    })
  }
  getLocations = async () => {
    let response = await post.secure('/getAllLocations', {})
    if (response.token.success) {
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
      addObject: {
        objectCl: {
          name: this.state.name,
          shortDescription: this.state.shortDescription,
          verified: this.state.verified,
          locationId: this.state.cityPart,
          personId: this.state.personId,
          objectCategoryId: this.state.objectCategorie
        },
        objectInfo: {
          websiteUrl: this.state.websiteUrl,
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
          lat:this.state.lat,
          lng: this.state.lng,
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
      this.setState({ display: "none" })
    } else {
      validate = false
      this.setState({ display: "inline-block" })
    }
    return validate

  }
  addObject = () => {
    let validate = this.validation(this.state.name, this.state.objectCategorie, this.state.cityId, this.state.cityPart)
    if (validate) {
      this.objectToBase();
    } else {
      console.log(" NE MOZE UPIT", validate)
    }
  }
  onSuggestSelect = (suggest) => {
    let street = suggest.description.split(",");
    this.setState({
      address: street[0],
      lat: suggest.location.lat,
      lng: suggest.location.lng,
    })
  }
  getUser = async (email) => {
    let response = await post.secure('/getUsers', { email })
    if (response.token.success) {
      let arr = response.users.map(item => {
        return (
          {
            key: item.id,
            value: item.id,
            text: item.email + " " + "(" + item.firstName + " " + item.lastName + ")",
          }
        )
      })
      this.setState({ emailArr: arr })
    }
  }
  handleUser = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value, })
    this.getUser(event.target.value);
  }
  clearUserId = () =>{
    this.setState({
      personId:null,
      emailArr:[]
    })
  }

  render() {
    console.log("STATE",this.state)
    return (
      <div>
        {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
        <Input label='Name: ' name='name' error={this.state.nameError} onChange={this.handleInput} required /><br />
        <span>Category: </span>
        <Dropdown
          error={this.state.objectCategorieError}
          placeholder="Select categorie"
          name="objectCategorie"
          selection
          options={this.state.categories}
          onChange={this.handleChange}
        /><br />
        <span>Select city: </span>
        <Dropdown
          error={this.state.cityIdError}
          placeholder="Select city"
          name="cityId"
          selection
          options={this.state.cityArr}
          onChange={this.getCityPart}
        /><br />
        <span>City part: </span>
        <Dropdown
          error={this.state.cityPartError}
          placeholder="City part"
          name="cityPart"
          selection
          options={this.state.childLocation}
          onChange={this.handleChange}
        /><br />
        <span>Adress: </span>
        <Geosuggest initialValue={this.state.address} onSuggestSelect={this.onSuggestSelect} /><br />
        <div>
          <span>Person Id</span>
          <Dropdown placeholder='Search for user' name="personId" onChange={this.handleChange} onSearchChange={this.handleUser} search selection options={this.state.emailArr} size='small' noResultsMessage="No users with that email" />
          <Button icon='minus' onClick={this.clearUserId} /><br/>
        </div>
        <div>
          <span>Verified:</span>
          <Checkbox
            toggle name="verified" checked={this.state.checked}  onChange={this.toggle} />
        </div>
        <span>Popular beacuse of:</span><br/>
        <TextArea autoHeight name='popular'  onChange={this.handleInput} style={{minHeight:'50px',minWidth:'300px'}} placeholder="Popular because of..." /><br />
        <Input label='Image: ' name='image' onChange={this.handleInput} placeholder="Image url..." /><br />

        <Input
          action={<Input name="phoneDesc" placeholder="Description" onChange={this.handleInput} />}
          label='Phone: '
          name='phone'
          placeholder="Number"
          onChange={this.handleInput} />
        <Button icon='plus' onClick={() => this.addNumber(this.state.phone, this.state.phoneDesc)} /><br/>

        {this.state.phoneArr.length ? this.state.phoneArr.map((item, index) => {
          return (
            <div>
              <Input 
                  action={<Input label="Phone Desc" disabled value={item.desc} />}
                  label={"Telephone No."+`${index+1}`} 
                  disabled 
                  value={item.number} />
              <Button icon='minus' onClick={() => this.removeNumber(item.id)} /><br/>
            </div>
          )
        }
        ) : null }

        <Input label='Web site: ' name='websiteUrl' onChange={this.handleInput} placeholder="Webiste url.." /><br />
        <span>Short Description:</span><br/>
        <TextArea autoHeight name='shortDescription'  onChange={this.handleInput} style={{minHeight:'50px',minWidth:'300px'}} placeholder="Short description..." /><br />
        <Button primary onClick={this.addObject}>Add</Button>
        <div>
          <Segment inverted color='red' compact secondary style={{ display: `${this.state.display}` }}>
            <ul>
              <li>{this.state.nameError}</li>
              <li>{this.state.objectCategorieError}</li>
              <li>{this.state.cityIdError}</li>
              <li>{this.state.cityPartError}</li>
            </ul>
          </Segment>
        </div>
      </div>
    )
  }
}
export default AddObject;
