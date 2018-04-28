import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown, Checkbox, Segment, TextArea, Table } from 'semantic-ui-react';
import SugestInput from './SugestInput'
import Geosuggest from 'react-geosuggest'
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import TableRow from 'semantic-ui-react'

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
      city:"",
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
      workTime: {},
      workTimeArr: [

        {
          name: "Ponedeljak",
          isWorking: false,
          opening: "0900",
          closing: "1700"
        },
        {
          name: "Utorak",
          isWorking: false,
          opening: "0900",
          closing: "1700"
        },
        {
          name: "Sreda",
          isWorking: false,
          opening: "0900",
          closing: "1700"
        },
        {
          name: "Cetvrtak",
          isWorking: false,
          opening: "0900",
          closing: "1700"
        },
        {
          name: "Petak",
          isWorking: false,
          opening: "0900",
          closing: "1700"
        },
        {
          name: "Subota",
          isWorking: false,
          opening: "0900",
          closing: "1700"
        },
        {
          name: "Nedelja",
          isWorking: false,
          opening: "0900",
          closing: "1700"
        }
      ],
      isAlwaysOpened: false,
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
      console.log("RESPONSE",response)
      this.setState({
        cityArr: arr,
        childLocationArr: arr1
      })
    }
  }
  getCityName = () => {
    let index1 = this.state.cityArr.findIndex(x => x.key == this.state.cityId)
    let name = this.state.cityArr[index1].text
    this.setState ({
      city:name
    })
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
        objectLocations: {
          lat: this.state.lat,
          lng: this.state.lng,
          adress:this.state.addres,
          city: this.state.city,
          zipCode:this.state.zipCode,
        },
        workTime:this.state.workTime,
        objectPhones: this.state.phoneArr,
        objectFile: {
          fileUrl: "kica",
          desc: "babababa"
        }
      }
    })
  }
  createWorkTime = () => {
    let pon;
    let uto;
    let sre;
    let cet;
    let pet;
    let sub;
    let ned;
    let workTimeObj;
    let workTimeArr = this.state.workTimeArr.map(item => {
      if (item.name === 'Ponedeljak') {
        if (item.isWorking) {
          pon = {
            opening: item.opening,
            closing: item.closing,
            isWorking: true,
          }
          workTimeObj = { ...workTimeObj, pon }
        } else {
          pon = {
            isWorking: false
          }
          workTimeObj = { ...workTimeObj, pon }
        }
      }
      if (item.name === 'Utorak') {
        if (item.isWorking) {
          uto = {
            opening: item.opening,
            closing: item.closing,
            isWorking: true,
          }
          workTimeObj = { ...workTimeObj, uto }
        } else {
          uto = {
            isWorking: false
          }
          workTimeObj = { ...workTimeObj, uto }
        }
      }
      if (item.name === 'Sreda') {
        if (item.isWorking) {
          sre = {
            opening: item.opening,
            closing: item.closing,
            isWorking: true,
          }
          workTimeObj = { ...workTimeObj, sre }
        } else {
          sre = {
            isWorking: false
          }
          workTimeObj = { ...workTimeObj, sre }
        }
      }
      if (item.name === 'Cetvrtak') {
        if (item.isWorking) {
          cet = {
            opening: item.opening,
            closing: item.closing,
            isWorking: true,
          }
          workTimeObj = { ...workTimeObj, cet }
        } else {
          cet = {
            isWorking: false
          }
          workTimeObj = { ...workTimeObj, cet }
        }
      }
      if (item.name === 'Petak') {
        if (item.isWorking) {
          pet = {
            opening: item.opening,
            closing: item.closing,
            isWorking: true,
          }
          workTimeObj = { ...workTimeObj, pet }
        } else {
          pet = {
            isWorking: false
          }
          workTimeObj = { ...workTimeObj, pet }
        }
      }
      if (item.name === 'Subota') {
        if (item.isWorking) {
          sub = {
            opening: item.opening,
            closing: item.closing,
            isWorking: true,
          }
          workTimeObj = { ...workTimeObj, sub }
        } else {
          sub = {
            isWorking: false
          }
          workTimeObj = { ...workTimeObj, sub }
        }
      }
      if (item.name === 'Nedelja') {
        if (item.isWorking) {
          ned = {
            opening: item.opening,
            closing: item.closing,
            isWorking: true,
          }
          workTimeObj = { ...workTimeObj, ned }
        } else {
          ned = {
            isWorking: false
          }
          workTimeObj = { ...workTimeObj, ned }
        }
      }

    })
    if (this.state.isAlwaysOpened === true) {
      this.setState({ workTime: { isAlwaysOpened: this.state.isAlwaysOpened} })
    } else {
      this.setState({ workTime: workTimeObj })
    }
  }
  validation = (name, categorie, city, cityPart) => {
    this.createWorkTime();
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
      this.getCityName();
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
  clearUserId = () => {
    this.setState({
      personId: null,
      emailArr: []
    })
  }
  editWorkingTime(value, a) {
    let time = value.format('HH:mm');
    let newTime = time.slice(0, 2) + time.slice(3, 5);
    let arr = this.state.workTimeArr;
    arr[a].opening = newTime;
    this.setState({
      workTimeArr: arr,
    })
  }
  editWorkingTimeClose(value, a) {
    let time = value.format('HH:mm');
    let newTime = time.slice(0, 2) + time.slice(3, 5);
    let arr = this.state.workTimeArr;
    arr[a].closing = newTime;
    this.setState({
      workTimeArr: arr,
    })
  }
  isWorkingToggle(a) {
    let isWrk
    if (this.state.workTimeArr[a].isWorking) {
      isWrk = false;
    }
    else {
      isWrk = true;
    }

    let arr = this.state.workTimeArr;
    arr[a].isWorking = isWrk;
    this.setState({
      workTimeArr: arr,
    });
  }
  isAlwaysOpenToggle() {
    if (this.state.isAlwaysOpened) {
      this.setState({
        isAlwaysOpened: false,
      })
    } else {
      this.setState({
        isAlwaysOpened: true,
      })
    }
  }

  render() {
    console.log("STATE", this.state)
    return (
      <div>
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
          <Button icon='minus' onClick={this.clearUserId} /><br />
        </div>
        <div>
          <span>Verified:</span>
          <Checkbox
            toggle name="verified" checked={this.state.checked} onChange={this.toggle} />
        </div> <br />
        <Checkbox checked={this.state.isAlwaysOpened} toggle onClick={() => this.isAlwaysOpenToggle()} />
        <Table compact celled definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Dan:</Table.HeaderCell>
              <Table.HeaderCell>Start</Table.HeaderCell>
              <Table.HeaderCell>End</Table.HeaderCell>
              <Table.HeaderCell>Da li radi?</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {
            this.state.workTimeArr.length ?
              this.state.workTimeArr.map((item, key) => {
                let openning = item.opening.slice(0, 2) + ":" + item.opening.slice(2, 4);
                let closing = item.closing.slice(0, 2) + ":" + item.closing.slice(2, 4);
                return (
                  <Table.Body>
                    <Table.Row >
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        <TimePicker
                          defaultValue={moment(openning, 'HH:mm')}
                          // value={moment(openning)}
                          disabled={!this.state.isAlwaysOpened ? item.isWorking ? false : true : true}
                          showSecond={false}
                          onChange={(value) => this.editWorkingTime(value, key)} />
                      </Table.Cell>
                      <Table.Cell>
                        <TimePicker
                          disabled={!this.state.isAlwaysOpened ? item.isWorking ? false : true : true}
                          defaultValue={moment(closing, 'HH:mm')}
                          onChange={(value) => this.editWorkingTimeClose(value, key)}
                          showSecond={false} />
                      </Table.Cell>
                      <Table.Cell>
                        <Checkbox checked={item.isWorking} disabled={this.state.isAlwaysOpened ? true : false} toggle onClick={() => this.isWorkingToggle(key)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })
              :
              null
          }
          <Button primary onClick={() => this.editWorkingTimeBtn()}>Izmeni</Button>
        </Table>
        <span>Popular beacuse of:</span><br />
        <TextArea autoHeight name='popular' onChange={this.handleInput} style={{ minHeight: '50px', minWidth: '300px' }} placeholder="Popular because of..." /><br />
        <Input label='Image: ' name='image' onChange={this.handleInput} placeholder="Image url..." /><br />

        <Input
          action={<Input name="phoneDesc" placeholder="Description" onChange={this.handleInput} />}
          label='Phone: '
          name='phone'
          placeholder="Number"
          onChange={this.handleInput} />
        <Button icon='plus' onClick={() => this.addNumber(this.state.phone, this.state.phoneDesc)} /><br />

        {this.state.phoneArr.length ? this.state.phoneArr.map((item, index) => {
          return (
            <div>
              <Input
                action={<Input label="Phone Desc" disabled value={item.desc} />}
                label={"Telephone No." + `${index + 1}`}
                disabled
                value={item.number} />
              <Button icon='minus' onClick={() => this.removeNumber(item.id)} /><br />
            </div>
          )
        }
        ) : null}

        <Input label='Web site: ' name='websiteUrl' onChange={this.handleInput} placeholder="Webiste url.." /><br />
        <span>Short Description:</span><br />
        <TextArea autoHeight name='shortDescription' onChange={this.handleInput} style={{ minHeight: '50px', minWidth: '300px' }} placeholder="Short description..." /><br />
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
