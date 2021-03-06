import React from 'react';
import post from '../../fetch/post';
import { Table, Input, Button, Dropdown, Checkbox, TextArea, Loader, Modal, Header } from 'semantic-ui-react';
import { stat } from 'fs';
import TimePicker from 'rc-time-picker';
import Style from './objectsEdit.css';
import TableRow from 'semantic-ui-react';
import moment from 'moment';
import Geosuggest from 'react-geosuggest';
import FileBase64 from 'react-file-base64';
import AWS from 'aws-sdk'
import css from './AddObject.css'

class EditObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objToEdit: {},
      objectImage: [],
      objectCategoriesArr: [],
      locationId: 0,
      name: '',
      nameError: '',
      objectCategoryId: '',
      objectId : '',
      categoryError: '',
      editObject: {},
      personId: '',
      shortDescription: '',
      address: '',
      addressError: '',
      lat: '',
      lng: '',
      latLngError: '',
      verified: '',
      websiteUrl: '',
      city: '',
      streetAddress: '',
      par: [],
      childLocation: [],
      newVal: 1,
      cityError: '',
      testState: '',
      workTime: [],
      workTimeEdit: [],
      phones: [],
      editedPhones : [],
      popularBecauseOf: '',
      isAlwaysOpen: false,
      isAlwaysOpnenO: false,
      workTime24h: false,
      sendEditObject: {},
      workTimeObj: {},
      test: {},
      loading: false,
      zipCode: '',
      objectImg: '',
      descAdd: '',
      numberAdd: '',
      phonesAdd: [],
      phonesRemove: [],
      count: 1,
      deletedPhones: [],
      token: '',
      file: "",
      newImg: "",
      imgPreview: "",
      emailArr: [],
      user: {},
      currentUser: {},
      confirmText: '',
      data:"",
      editedPhones: [],
      objectFile: {},
      imgDesc: "",
    };
  }
  objectEdit = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  componentWillMount() {
    this.getObjectById();
    this.setState({
      loading: true
    })
    if(this.state.emailArr.length){
      current = this.state.emailArr[0]
      this.setState({
        currentUser: current,
      })
    }
  }
  getObjectById = async () => {
    const objectId = this.props.match.params.id;
    const response = await post.secure('/objectById', {
      objectId,
      token: this.props.token,
    });
    this.setState({
      token: response.token.success
    })
    if (response.token.success) {
      this.setState({
        objToEdit: response.objectById,
        locationId: response.objectById.objectCl.locationId,
        name: response.objectById.objectCl.name,
        objectCategoryId: response.objectById.objectCl.objectCategoryId,
        personId: response.objectById.objectCl.personId,
        objectId: response.objectById.objectCl.id,
        shortDescription: response.objectById.objectCl.shortDescription,
        streetAddress: response.objectById.objectCl.streetAddress,
        childLocation: response.objectById.objectCl.locationId,
        address: response.objectById.objectLocation.address,
        verified: response.objectById.objectCl.verified,
        websiteUrl: response.objectById.objectInfo.websiteUrl,
        popularBecauseOf: response.objectById.objectInfo.popularBecauseOf,
        city: response.objectById.objectLocation.city,
        workTime: response.objectById.objectTimes.objectWorkTimes,
        isAlwaysOpen: response.objectById.objectTimes.isAlwaysOpened,
        isAlwaysOpnenO: response.objectById.objectTimes.isAlwaysOpened,
        objectImage: response.objectById.objectFile,
        test: response.objectById.locations,
        phones: JSON.parse(JSON.stringify(response.objectById.objectPhones)),
        loading: false,
        lat: response.objectById.objectLocation.lat,
        lng: response.objectById.objectLocation.lng,
        zipCode: response.objectById.objectLocation.zipCode,
        imgPreview: response.objectById.objectFile.fileUrl,
        user: response.objectById.owningPerson,
        imgDesc: response.objectById.objectFile.desc

      });
      let jsArr = JSON.parse(JSON.stringify(this.state.workTime));

      this.setState({
        workTimeEdit: jsArr,
        emailArr: [
          {
            key: response.objectById.owningPerson.id,
            text: response.objectById.owningPerson.email,
            value: response.objectById.owningPerson.id,
          }
        ]
      })
      this.setParentObj(response.objectById.locations);
      this.setCurrentParrent(response.objectById.locations)
    } else {
    }
  }
  setCategoryObj = async (e, { value }) => {
    this.setState({
      objectCategoryId: value,
    });
  }
  setParentObj = parrent => {
    let obArr = [];
    let nekiObj = {
      key: 2,
      value: 2,
      text: 'Novi sad',
      parrentLocation: 0,
    };

    for (let child in parrent) {

      if (parrent[child].parrentLocation === 0) {
        obArr[child] = parrent[child];
      }
    }
    let newArr = [...obArr, nekiObj];
    this.setState({
      par: newArr,
    });
  }

  setCurrentParrent = (parrent) => {
    for (let child in parrent) {
      if (parrent[child].locationId === this.state.childLocation) {
        let currentParrent = parrent[child].parrentLocation;
        this.setState({
          newVal: currentParrent,
        })
      }
    }
    for (let i in parrent) {
      let arr = parrent.filter(word => word.parrentLocation === this.state.newVal);
      let a = this.state.childLocation;
      this.setState({
        childLocation: arr,
        currentChild: a,
      })
    }
  }
  changeC = async (e, { value }) => {
    this.setState({
      locationId: value,
    })
  }

  setLo = async (e, { value }) => {
    let arr = this.state.objToEdit.locations.filter(word => word.parrentLocation == value);
    let arrFirst = this.state.childLocation[0];
    this.setState({
      childLocation: arr,
      newVal: value,
      locationId: arrFirst,
    });
    this.test(value);

  }
  test = (val) => {
    for (let i in this.state.par) {
      if (this.state.par[i].key === val) {
        this.setState({
          city: this.state.par[i].text
        })
      }

    }
  }
  editWorkingTime(value, a) {
    let time = value.format('HH:mm');
    let newTime = time.slice(0, 2) + time.slice(3, 5);
    let arr = this.state.workTimeEdit;
    arr[a].open = newTime;
    this.setState({
      workTimeEdit: arr,
    })
  }
  editWorkingTimeClose(value, a) {
    let time = value.format('HH:mm');
    let newTime = time.slice(0, 2) + time.slice(3, 5);

    let arr = this.state.workTimeEdit;
    arr[a].close = newTime;
    this.setState({
      workTimeEdit: arr,
    })
  }
  isWorkingToggle(a) {
    let isWrk
    if (this.state.workTimeEdit[a].isWorking) {
      isWrk = false;
    }
    else {
      isWrk = true;
    }

    let arr = this.state.workTimeEdit;
    arr[a].isWorking = isWrk;
    this.setState({

      workTimeEdit: arr,
    });
  }
  isAlwaysOpenToggle() {
    if (this.state.isAlwaysOpen) {
      this.setState({
        isAlwaysOpen: false,
      })
    } else {
      this.setState({
        isAlwaysOpen: true,
      })
    }
  }
  deletePhone = (index) => {
    let index1 = this.state.phones.findIndex(x => x.id == index)
    let delArr = this.state.deletedPhones
    let arr = this.state.phones
    arr.splice(index1, 1)
    delArr.push(index)
    this.setState({
      deletedPhones: delArr
    })
  }
  isVerify = () => {
    if (this.state.verified === true)
      this.setState({
        verified: false
      })
    if (this.state.verified === false)
      this.setState({
        verified: true
      })
  }
  onSuggestSelect = (suggest) => {
    let street = suggest.description.split(",");
    this.setState({
      address: street[0],
      lat: suggest.location.lat,
      lng: suggest.location.lng,
    })
  }
  handleInputChange = e => {
    this.setState({
      [e.target.name]: [e.target.files[0]]
    });
  };

  handleUpload = async (imgFile) => {
    const file = imgFile;
     AWS.config.update({
      region: 'eu-central-1',
      accessKeyId: "AKIAJWJPWC6HGBPXQ4AQ",
      secretAccessKey: "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", //C
    });
    
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: 'kadradi-slike'}
    });
    let data;
    const albumPhotosKey = encodeURIComponent('photo') + '/';
    const photoKey = albumPhotosKey + file.name;
    let data1 = ""; 
    let rez = s3.upload({
      ContentType: file.type,
      Key: photoKey,
      Body: file,
      ACL: 'public-read'
    }).promise()
    let a = {}
    let img = await rez.then(function(data) {
      // data = await data
      return data
    }).catch(function(err) {
      return false
    });
    if(img === false){
      alert("ERROR! Nesto nije u redu slika nije uspesno uplodovana!");
    }else{
      this.setState({
        imgPreview: img.Location
      })
    }
  };
  getImage = (img) => {
    this.setState({
      imgsFile: img.file,
    })
    this.handleUpload(img.file);
  }
  addPhone = (tel, descript) => {
    let niz = this.state.phonesAdd.push({
      desc: descript,
      number: tel,
      objectInfoId: this.state.objectId
    })
    this.setState({
      phonesAdd: this.state.phonesAdd
    })
  }
  removePhone = (index) => {
    let index1 = this.state.phonesAdd.findIndex(x => x.id == index)
    let arr = this.state.phonesAdd
    arr.splice(index1, 1)
    this.setState({
      phonesAdd: arr
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
  handleChange = (e, { name, value }) => this.setState({ [name]: value }) 
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
  handleGeoSugest = (value) => {
    this.setState({address:value})
  }
  validation = (name, category, location, city, address, lat, lng) => {
    let validate = false;
    if(name === '') {
      this.setState({
        nameError: 'Morate uneti ime objekta!'
      }) 
      } else {
        this.setState({
          nameError: ''
        })
    }
    if(category === '') {
      this.setState({
        categoryError: 'Morate uneti kategoriju objekta!'
      }) 
      } else {
        this.setState({
          categoryError: ''
        })
    }
    if(location === '' || location === undefined) {
      this.setState({
        locationError: 'Morate uneti opstinu objekta!'
      }) 
      } else {
        this.setState({
          locationError: ''
        })
    }
    if(city === '' || city === undefined) {
      this.setState({
        cityError: 'Morate uneti grad!'
      }) 
      } else {
        this.setState({
          cityError: ''
        })
    }
    if((address === ' ' && lat === '' && lng === '') || (address === ' ' && lat === '' || lng === ''))  {
      this.setState({
        addressError: 'Morate uneti Adresu ili Lat i Lng!'
      }) 
      } else {
        this.setState({
          addressError: ''
        })
    }
    if(name !== '' && category !== '' && location !== '' && location !== undefined && city !== '' && city !== undefined && ((address !== ' ' && lat !== '' && lng !== '' ) || (address !== ' ' ) || (lat !== '' && lng !== ''))) {
      validate = true
    } else {
      validate = false
    }
    return validate
  }
  
  prepareToEditObject = async () => {
    let validate = this.validation(this.state.name,this.state.objectCategoryId,this.state.locationId,this.state.newVal,this.state.address,this.state.lat,this.state.lng)
    let { objToEdit } = this.state;
    let objectCl = {};
    let objectWorkTimeArr = {};
    let objectLocation = {};
    let objectInfo = {};
    let objectClKeys = ['name', 'shortDescription', 'verified', 'personId', 'objectCategoryId', 'locationId'];
    let objectInfoKeys = ['websiteUrl', 'popularBecauseOf'];
    let objectLocationKeys = ['lat', 'lng', 'address', 'city', 'zipCode'];
    let workTime = {};
    let newArr = this.state.workTimeEdit;
    let deletePhones = this.state.deletedPhones;
    let objectPhones = this.state.phonesAdd;
    
    objectClKeys.map(item => {
      if (objToEdit.objectCl[item] != this.state[item]) {
        objectCl = {
          ...objectCl,
          [item]: this.state[item],
        };
      }
    })
    objectLocationKeys.map((item) => {
      if (objToEdit.objectLocation[item] != this.state[item]) {
        objectLocation = {
          ...objectLocation,
          [item]: this.state[item],
        };
      }
    })
    objectInfoKeys.map((item) => {
      if (objToEdit.objectInfo[item] != this.state[item]) {
        objectInfo = {
          ...objectInfo,
          [item]: this.state[item]
        }
      }
    })
    this.state.workTime.map(item => {
      let a = this.state.workTime.indexOf(item);
      let flag1 = this.state.isAlwaysOpen;
      let flag2 = this.state.isAlwaysOpnenO;

      if (this.state.isAlwaysOpen) {
        if (this.state.isAlwaysOpen != this.state.isAlwaysOpnenO) {
          workTime = {
            ...workTime,
            isAlwaysOpen: true,
          }
        }
      } else {
        if (item.open !== newArr[a].open || item.close !== newArr[a].close || item.isWorking !== newArr[a].isWorking) {
          let name = newArr[a].name;
          workTime = {
            ...workTime,
            [name]: {
              opening: newArr[a].open,
              closing: newArr[a].close,
              isWorking: newArr[a].isWorking,
            }
          }
          workTime = {
            ...workTime,
            isAlwaysOpen: false,
          }
        }
        if (workTime.length === 0) {
          let name = newArr[a].name;
          workTime = {
            ...workTime,
            [name]: {
              opening: '01',
              closing: '01',
              isWorking: true,
            }
          }
        }
      }
    })

    let objectFile = {};
    if(this.state.imgPreview !== this.state.objectImage.fileUrl){
      let imgUrl = this.state.imgPreview;
      objectFile = {
          ...objectFile,
          fileUrl: imgUrl,
        }
    }

    if(this.state.imgDesc !== this.state.objectImage.desc){
      let desc1 = this.state.imgDesc;
      objectFile = {
          ...objectFile,
          desc: desc1,
        }
    }
    
    if(Object.keys(objectFile).length){
      objectFile = {
        ...objectFile,
        id: this.state.objectImage.id,
        objectClId: this.state.objectId,
      }
      this.setState({
        objectFile: objectFile,
      })
    }
    let wrkTime = this.state.workTimeObj;
    objectWorkTimeArr = {
      ...objectWorkTimeArr,
      workTime
    }
    if(validate) { 
      this.setState({
        sendEditObject: {
          workTime,
          objectCl,
          objectInfo,
          objectLocation,
          deletePhones,
          objectPhones,
          objectFile,
        },
        // confirmText: 'Objekat izmenjen!'
      })
      this.updateObject()
    }

    else {
      this.setState({
        confirmText: ''
      })
    }
  }
  updateObject = async () => {
    let response = await post.secure('/editObject', {
      objectId: this.state.objectId,
      editObject: this.state.sendEditObject
    })
  }
  render() {
    let a;
    return (
      <div>
        {
          this.state.token === false ? 'Potrebno je da se ulogujete ponovo!' : this.state.loading ? <div style={{ marginTop: "100px" }}><Loader size='large' active inline='centered' /></div> :
            <div>
              <div className={Style.section} >
                  <div className={css.header}>
                    <span>OSNOVNE INFORMACIJE:</span>
                  </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginBottom:'30px'}}>
                <span className={css.labels}>Ime:</span>              
                <Input name="name" value={this.state.name} onChange={this.objectEdit} style={{width:'200px'}}/>
                <span className={css.labels}>Kategorija:</span>  
                <Dropdown
                  value={this.state.objectCategoryId}
                  selection
                  onChange={this.setCategoryObj}
                  options={this.state.objToEdit.objectCategoriesArr} />
                <span className={css.labels}>Veb sajt:</span>
                <Input name='websiteUrl' value={this.state.websiteUrl} onChange={this.objectEdit} style={{width:'350px'}}/>
                <span className={css.labels}>Proveren:</span>
                <Checkbox toggle checked={this.state.verified} onClick={() => this.isVerify()} />
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginBottom:'30px'}}>
                <span className={css.labels}>Vlasnik objekta:</span>
                <span>{this.state.user.firstName + ' ' + this.state.user.lastName }</span>
                <span className={css.labels}>Izmeni vlasnika:</span>
                <Dropdown 
                name="personId" 
                onChange={this.handleChange} 
                onSearchChange={this.handleUser} 
                search 
                selection 
                defaultValue={this.state.emailArr.length ? this.state.emailArr[0].text : null}
                options={this.state.emailArr} 
                size='small' 
                noResultsMessage="No users with that email" 
              />
                <span className={css.labels}>Popularan zbog:</span>
                <TextArea autoHeight name='popularBecauseOf' value={this.state.popularBecauseOf} onChange={this.objectEdit} style={{ minHeight: '50px', minWidth: '300px' }} />
                <span className={css.labels}>Kratak opis:</span>
                <TextArea autoHeight name='shortDescription' value={this.state.shortDescription} onChange={this.objectEdit} style={{ minHeight: '50px', minWidth: '300px' }} />
                </div>
              </div>
              <div className={Style.section} >
                <div className={css.header}>
                <span >LOKACIJA: </span>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginBottom:'30px'}}>
                  <span className={css.labels}>Izaberite ulicu:</span>
                  <Geosuggest onChange={this.handleGeoSugest} initialValue={this.state.address} onSuggestSelect={this.onSuggestSelect} />
                  <span className={css.labels}>Lat:</span>
                  <Input name='lat' value={this.state.lat} onChange={this.objectEdit} />
                  <span className={css.labels}>Lng:</span>
                  <Input name='lng' value={this.state.lng} onChange={this.objectEdit} />
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginBottom:'30px'}}>
                <span className={css.labels}>Zip kod:</span>
                  <Input name='zipCode' value={this.state.zipCode} onChange={this.objectEdit} />
                <span className={css.labels}>Opstina: </span>
                <Dropdown
                  selection
                  value={this.state.locationId}
                  options={this.state.childLocation}
                  onChange={this.changeC}
                />
                <span className={css.labels}>Grad:</span>
                <Dropdown
                  selection
                  value={this.state.newVal}
                  options={this.state.par}
                  onChange={this.setLo} />
                  </div>
              </div>
              <div className={Style.section} >
              <div className={css.header}>
                <span >SLIKA: </span>
                </div>
                <FileBase64 multiple={false} onDone={this.getImage.bind(this)} />
                <br />
                <img src={this.state.imgPreview} style={{ height: '250px', width: '250px' }} />
                <br />
                Opis slike:<br />
                <TextArea autoHeight name='imgDesc' value={this.state.imgDesc} onChange={this.objectEdit} style={{ minHeight: '50px', minWidth: '300px' }} /><br />
                <br />
              </div>
              <div className={Style.section}>
              <div className={css.header}>
                <span >RADNO VREME: </span>
                </div>
                <span>Radi 24/7?</span>
                <Checkbox checked={this.state.isAlwaysOpen} toggle onClick={() => this.isAlwaysOpenToggle()} />
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
                    this.state.workTimeEdit.length ?
                      this.state.workTimeEdit.map((item, key) => {
                        let openning = item.open.slice(0, 2) + ":" + item.open.slice(2, 4);
                        let closing = item.close.slice(0, 2) + ":" + item.close.slice(2, 4);
                        return (
                          <Table.Body key={key}>
                            <Table.Row >
                              <Table.Cell>{item.name}</Table.Cell>
                              <Table.Cell>
                                <TimePicker
                                  defaultValue={moment(openning, 'HH:mm')}
                                  // value={moment(openning)}
                                  disabled={!this.state.isAlwaysOpen ? item.isWorking ? false : true : true}
                                  showSecond={false}
                                  onChange={(value) => this.editWorkingTime(value, key)} />
                              </Table.Cell>
                              <Table.Cell>
                                <TimePicker
                                  disabled={!this.state.isAlwaysOpen ? item.isWorking ? false : true : true}
                                  defaultValue={moment(closing, 'HH:mm')}
                                  onChange={(value) => this.editWorkingTimeClose(value, key)}
                                  showSecond={false} />
                              </Table.Cell>
                              <Table.Cell>
                                <Checkbox checked={item.isWorking} disabled={this.state.isAlwaysOpen ? true : false} toggle onClick={() => this.isWorkingToggle(key)}
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
              <div className={Style.section} >
                <div className={css.header}>
                    <span>TELEFONI:</span>
                </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginBottom:'30px'}}>
              {
                this.state.phones.length ?
                  this.state.phones.map((item, key) => {
                    return (
                      <div key={key} style={{display:'inline'}}>
                        <Input name='desc' value={item.desc} onChange={(e) => this.changePhones(e, item.id)} />
                        <Input name='number' value={item.number} onChange={(e) => this.changePhones(e, item.id)} />
                        <Button icon='minus' onClick={() => this.deletePhone(item.id)} />
                      </div>
                    )
                  }) : null
              }
              </div>
              <div>
                <span className={css.labels}>Dodaj novi telefon:</span>
                <Input name='descAdd' placeholder='Opis' onChange={this.objectEdit} />
                <Input name='numberAdd' placeholder='Broj' onChange={this.objectEdit} />
                <Button icon='plus' onClick={() => this.addPhone(this.state.numberAdd, this.state.descAdd)} />
              </div>
              {
                this.state.phonesAdd.length ?
                  this.state.phonesAdd.map((item, index) => {
                    return (
                      <div key={index}>
                        {/* <Number index={index} value={item.number} desc={item.description} /> */}
                        <Input label="Opis" value={item.desc} />
                        <Input label="Broj" value={item.number} />
                        <Button icon='minus' onClick={() => this.removePhone(item.id)} />
                      </div>
                    )
                  }) : null
              }
            </div>
            {/* <div>{this.state.nameError}</div>
            <div>{this.state.categoryError}</div>
            <div>{this.state.locationError}</div>
            <div>{this.state.cityError}</div>
            <div>{this.state.addressError}</div>
            <div>{this.state.confirmText}</div>
            <Button primary onClick={() => this.prepareToEditObject()}>Save</Button> */}
            <Modal trigger={<Button primary onClick={() => this.prepareToEditObject()}>Save</Button>} closeIcon>
              <Modal.Actions>
              <Header icon='archive' content='Da li ste sigurni da zelite da izmenite objekat?' />
              {
                this.state.sendEditObject !== '' && this.state.nameError === '' && this.state.categoryError === '' && this.state.locationError === '' && this.state.cityError === '' && this.state.addressError === '' ? 
                  <Button primary onClick={() => this.prepareToEditObject()}>Save</Button> : 
                  <div>
                    <div>{this.state.nameError}</div>
                    <div>{this.state.categoryError}</div>
                    <div>{this.state.locationError}</div>
                    <div>{this.state.cityError}</div>
                    <div>{this.state.addressError}</div>
                  </div>
              }
              </Modal.Actions>
               </Modal>
            </div>
        }
      </div>
    );
  }
}
export default EditObject;
