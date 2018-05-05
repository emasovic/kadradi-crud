import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown, Checkbox, Segment, TextArea, Table, Loader, Message, TransitionablePortal,Header } from 'semantic-ui-react';
import SugestInput from './SugestInput'
import Geosuggest from 'react-geosuggest'
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import TableRow from 'semantic-ui-react'
import css from './AddObject.css'

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
      city: "",
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
      verified: false,
      display: "none",
      getUser: "",
      emailArr: [],
      count: 1,
      zipCode: 0,
      workTime: {},
      loading: false,
      token:'',
      lat:"",
      lng:"",
      address:"",
      addressError:"",
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
      zipCodeError: false,
      open:false,
      confirmText:""
    }
  }
  componentWillMount() {
    this.getObjectCategories();
    this.getLocations();
    this.setState({ loading: true })
  }
  handleInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }
  handleGeoSugest = (value) => {
    this.setState({address:value})
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
    let arr = this.state.phoneArr.push({ desc: desc, number: tel })
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
  getCityName = () => {
    let index1 = this.state.cityArr.findIndex(x => x.key == this.state.cityId)
    let name = this.state.cityArr[index1].text
    this.setState({
      city: name
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
        categories: arr,
        loading: false,
        token: response.token.success
      })
    }
  }
  objectToBase = async (workTime) => {
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
        objectLocation: {
          lat: parseFloat(this.state.lat),
          lng: parseFloat(this.state.lng),
          adress: this.state.address,
          city: this.state.city,
          zipCode: this.state.zipCode,
        },
        workTime,
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
      return workTimeObj = { isAlwaysOpened: true }
    } else {
      return workTimeObj
    }
  }
  validation = (name, categorie, city, cityPart,address) => {
    let validate = false
    if (this.state.name === '') {
      this.setState({ nameError: "Morate uneti ime objekta!" })
    } else {
      this.setState({ nameError: "" })
    }
    if (this.state.objectCategorie === '') {
      this.setState({ objectCategorieError: "Morate izabrati kategoriju!" })
    } else {
      this.setState({ objectCategorieError: " " })
    }
    if (this.state.cityId === '') {
      this.setState({ cityIdError: "Morate izabrati grad!" })
    } else {
      this.setState({ cityIdError: "" })
      this.getCityName();
    }
    if (this.state.cityPart === '') {
      this.setState({ cityPartError: "Morate izabrati opstinu (deo grada)!" })
    } else {
      this.setState({ cityPartError: "" })
    }
    if (this.state.address === '' || this.state.lng === "" || this.state.lat==="") {
      this.setState({ addressError: "Morate uneti adresu sa parametrima Lat i Lng !" })
    } else {
      this.setState({ addressError: "" })
    }
    if (name !== "" && categorie !== "" && city !== "" && cityPart !== "" && address !== "") {
      validate = true
      this.setState({ display: "none" })
    } else {
      validate = false
      this.setState({ display: "inline-block" })
    }
    return validate

  }
  addObject = () => {
    let validate = this.validation(this.state.name, this.state.objectCategorie, this.state.cityId, this.state.cityPart,this.state.address)
    let workTime = this.createWorkTime()
    if (validate) {
      this.objectToBase(workTime);
      setTimeout(function () { location.reload() }, 4000);
      this.setState({
        open:true,
        confirmText:"Objekat uspesno dodat!"
      })
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
  isNumberKey = (event) => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '')
    if (onlyNums == "") {
      event.target.value = ""
    } else {
      this.setState({
        zipCode: parseInt(onlyNums),
        zipCodeError: false
      })
    }
  }
  handleLat = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9.-]/g, '')
      this.setState({
        lat:onlyNums
      })
    }
   
 handleLng = (e) =>{
    const onlyNums = e.target.value.replace(/[^0-9.-]/g, '')
      this.setState({
        lng:onlyNums
      })
    }
  
  render() {
    console.log("STATE", this.state)
    return (
      <div>
        <div>
        <TransitionablePortal
          closeOnTriggerClick
          open={this.state.open}
        >
          <Segment style={{ left: '40%', position: 'fixed', top: '50%', zIndex: 1000 ,width:"500px",height:"auto",textAlign:"center",fontSize:"16px",backgroundColor:"#ed1c24",color:"#ffff"}}>
            <Header style={{color:"#ffff"}}>{this.state.confirmText}</Header>
          </Segment>
        </TransitionablePortal>
        </div>
        {
          this.state.token === false ? 'isteko token' : this.state.loading ? <div style={{ marginTop: "100px" }}><Loader size='large' active inline='centered' /></div> : 
            <div>
              <div className={css.section} >

                <div className={css.header}>
                  <span>OBAVEZNE  INFORMACIJE:</span>
                </div>

                <div className={css.content}>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Ime:</span>
                    <Input name='name' error={this.state.nameError} onChange={this.handleInput} required placeholder="Unesite ime objekta.." />
                  </div>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Kategorija: </span>
                    <Dropdown
                      error={this.state.objectCategorieError}
                      placeholder="Izaberi kategoriju..."
                      name="objectCategorie"
                      selection
                      options={this.state.categories}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Grad: </span>
                    <Dropdown
                      error={this.state.cityIdError}
                      placeholder="Izaberi grad.."
                      name="cityId"
                      selection
                      options={this.state.cityArr}
                      onChange={this.getCityPart}
                    />
                  </div>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Opstina: </span>
                    <Dropdown
                      error={this.state.cityPartError}
                      placeholder="Izaberi opstinu"
                      name="cityPart"
                      selection
                      options={this.state.childLocation}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Vlasnik objekta</span>
                    <Dropdown placeholder='Search for user' name="personId" onChange={this.handleChange} onSearchChange={this.handleUser} search selection options={this.state.emailArr} size='small' noResultsMessage="No users with that email" />
                    <Button icon='minus' onClick={this.clearUserId} />
                  </div>
                </div>
                <div className={css.addressDiv}>
                    <div className={css.elementWraper}>
                    <span className={css.labels}>Adresa: </span>
                    <Geosuggest onChange={this.handleGeoSugest} onSuggestSelect={this.onSuggestSelect} initialValue={this.state.address}  />
                    </div>
                    <div className={css.elementWraper}>
                    <span className={css.labels}>Lat: </span>
                    <Input value={this.state.lat} onChange={this.handleLat} placeholder="Uneti Lat" />
                    </div>
                    <div className={css.elementWraper}>
                    <span className={css.labels}>Lng: </span>
                    <Input value={this.state.lng} onChange={this.handleLng} placeholder="Uneti Lng" />
                  </div>
                  </div>
              </div>
              <div className={css.section} >
                <div className={css.header}>
                  <span>DODATNE  INFORMACIJE:</span>
                </div>
                <div className={css.content}>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Postanski broj: </span>
                    <Input onChange={this.isNumberKey} placeholder="Uneti broj" />
                  </div>
                  <div className={css.elementWraperTogles}>
                    <span className={css.labels}>Proveren:</span>
                    <Checkbox
                      toggle name="verified" checked={this.state.checked} onChange={this.toggle} />
                  </div>
                </div>
                <div className={css.phoneArr}>
                  <span className={css.labels}>Telefon: </span>
                  <Input
                    action={<Input name="phoneDesc" placeholder="Vrsta telefona" onChange={this.handleInput} />}
                    name='phone'
                    placeholder="Broj"
                    onChange={this.handleInput} />
                  <Button icon='plus' onClick={() => this.addNumber(this.state.phone, this.state.phoneDesc)} />

                  {this.state.phoneArr.length ? this.state.phoneArr.map((item, index) => {
                    return (
                      <div >
                        <Input
                          action={<Input label="Vrsta broja" disabled value={item.desc} />}
                          label={"Telefon broj" + `${index + 1}`}
                          disabled
                          value={item.number} />
                        <Button icon='minus' onClick={() => this.removeNumber(item.id)} />
                      </div>
                    )
                  }
                  ) : null}
                </div>
              </div>
              <div className={css.section} >
                <div className={css.header}>
                  <span>RADNO VREME:</span>
                </div>
                <div className={css.elementWraperTogles}>
                  <span className={css.labels}>Uvek otvoreno:</span>
                  <Checkbox checked={this.state.isAlwaysOpened} toggle onClick={() => this.isAlwaysOpenToggle()} />
                </div>
                <Table compact celled definition>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Dan:</Table.HeaderCell>
                      <Table.HeaderCell>Radi od:</Table.HeaderCell>
                      <Table.HeaderCell>Radi do:</Table.HeaderCell>
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
                </Table>
              </div>
              <div className={css.section} >
                <div className={css.header}>
                  <span>OSTALE INFORMACIJE:</span>
                </div>
                <div className={css.content}>
                  <div className={css.elementWraperTextBox}>
                    <span className={css.labels}>Popular zbog:</span>
                    <TextArea autoHeight name='popular' onChange={this.handleInput} style={{ minHeight: '50px', minWidth: '300px' }} placeholder="Zasto je popularan..." /><br />
                  </div>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Slika:</span>
                    <Input name='image' onChange={this.handleInput} placeholder="Url slike..." />
                  </div>
                  <div className={css.elementWraper}>
                    <span className={css.labels}>Web sajt:</span>
                    <Input name='websiteUrl' onChange={this.handleInput} placeholder="Url sajta.." />
                  </div>
                  <div className={css.elementWraperTextBox}>
                    <span className={css.labels}>Kratak opis:</span>
                    <TextArea autoHeight name='shortDescription' onChange={this.handleInput} style={{ minHeight: '50px', minWidth: '300px' }} placeholder="Uneti kratak opis..." />
                  </div>
                </div>
              </div>
              <div className={css.section} style={{ display: `${this.state.display}`, marginLeft: "45px" }}>
                <Message negative style={{ display: `${this.state.display}`, width: "100%" }}>
                  <Message.Header>Nisu popunjena sva obavezna polja:</Message.Header>
                  <ul style={{ listStyleType: "none" }}>
                    <li>{this.state.nameError}</li>
                    <li>{this.state.objectCategorieError}</li>
                    <li>{this.state.cityIdError}</li>
                    <li>{this.state.cityPartError}</li>
                    <li>{this.state.addressError}</li>
                  </ul>

                </Message>

              </div>
              <Button className={css.button} primary onClick={this.addObject}>Dodaj objekat</Button>
            </div>
        }
      </div>
    );
  }
}
export default AddObject;
