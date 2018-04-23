import React from 'react';
import post from '../../fetch/post';
import { Table, Input, Button, Dropdown, Checkbox, TextArea } from 'semantic-ui-react';
import { stat } from 'fs';
import TimePicker from 'rc-time-picker';
import Style from './objectsEdit.css';
import TableRow from 'semantic-ui-react';
import moment from 'moment';
import Geosuggest from 'react-geosuggest';

class EditObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objToEdit: {},
      objectCategoriesArr: [],
      locationId: 0,
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
      newVal: 1,
      testState: '',
      workTime: [],
      workTimeEdit: [],
      phones: [],
      popularBecauseOf: '',
      isAlwaysOpen: false,
      workTime24h: false,
    };
  }
  objectEdit = e => {
    if (e.target.name === 'locationId') {
      this.setState({
        locationId: e.target.value,
      });
    }
    if (e.target.name === 'name') {
      this.setState({
        name: e.target.value,
      });
    }
    if (e.target.name === 'objectCategoryId') {
      this.setState({
        objectCategoryId: e.target.value,
      });
    }
    if (e.target.name === 'personId') {
      this.setState({
        personId: e.target.value,
      });
    }
    if (e.target.name === 'shortDescription') {
      this.setState({
        shortDescription: e.target.value,
      });
    }
    if (e.target.name === 'verified') {
      this.setState({
        verified: e.target.value,
      });
    }
    if (e.target.name === 'websiteUrl') {
      this.setState({
        websiteUrl: e.target.value
      })
    }
    if (e.target.name === 'city') {
      this.setState({
        city: e.target.value,
      });
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
    const objectId = this.props.match.params.id;
    const response = await post.secure('/objectById', {
      objectId,
      token: this.props.token,
    });
    if (response.token.success) {
      console.log("RESPONSE", response.objectById)
      this.setState({
        objToEdit: response.objectById,
        locationId: response.objectById.objectCl.locationId,
        name: response.objectById.objectCl.name,
        objectCategoryId: response.objectById.objectCl.objectCategoryId,
        personId: response.objectById.objectCl.personId,
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
        phones: JSON.parse(JSON.stringify(response.objectById.objectPhones))
      });
      console.log("OVO", this.state.workTime)
      let jsArr = JSON.parse(JSON.stringify(this.state.workTime));
      this.setState({
        workTimeEdit: jsArr,
      })
      this.setParentObj(response.objectById.locations);
      this.setCurrentParrent(response.objectById.locations);
      // console.log('JEL GA IMA OVDE bRE?', response.objectById.locations);
      // console.log('RESPONSE', response);
    } else {
      console.log('stajebreovo');
    }
    console.log('RESPONSE', response);
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
      console.log('PARRENT LOCATION: ', parrent[child].text);

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
    console.log("USAOOOOOOO");
    for (let child in parrent){
      if(parrent[child].locationId === this.state.childLocation){
        let currentParrent = parrent[child].parrentLocation;
        this.setState({
          newVal: currentParrent,
        })
      }   
    }
    for (let i in parrent){
      let arr = parrent.filter(word => word.parrentLocation === this.state.newVal);
      let a = this.state.childLocation;
      this.setState({
        childLocation: arr,
        currentChild: a,
      })
    }   
    console.log("EVO GA CURRRENT", this.state.currentChild);
  }
  changeC = (e,{value}) => {
    this.setState({
      locationId : value,
    })
  }

  setLo = (e, { value }) => {
    let arr = this.state.objToEdit.locations.filter(word => word.parrentLocation == value);
    let arrFirst = this.state.childLocation[0];
    this.setState({
      childLocation: arr,
      newVal: value,
      locationId: arrFirst,
    });
  }
  editWorkingTime(value,a){
    let time = value.format('HH:mm');
    let newTime = time.slice(0,2) + time.slice(3,5);
    console.log("NEW TIMEEE:", newTime);
    console.log(this.state.workTimeEdit[a].open)
    let arr = this.state.workTimeEdit;
    arr[a].open = newTime;
    this.setState({
      workTimeEdit: arr,
    })
  }
  editWorkingTimeClose(value,a){
    let time = value.format('HH:mm');
    let newTime = time.slice(0,2) + time.slice(3,5);
    console.log("NEW TIMEEE:", newTime);
    console.log(this.state.workTimeEdit[a].open)
    
    let arr = this.state.workTimeEdit;
    arr[a].close = newTime;
    this.setState({
      workTimeEdit: arr,
    })
  }
  isWorkingToggle(a){
    let isWrk
    if(this.state.workTimeEdit[a].isWorking){
      isWrk = false;
    }      
    else{
      isWrk = true;
    }

    let arr = this.state.workTimeEdit;
    arr[a].isWorking = isWrk;
    this.setState({
      
      workTimeEdit: arr,
    });
  }
  isAlwaysOpenToggle(){
    if(this.state.isAlwaysOpen){
      this.setState({
        isAlwaysOpen: false,
      })
    }else{
      this.setState({
        isAlwaysOpen: true,
      })
    }
  }
  editWorkingTimeBtn(){
    let obj = {};
    let objTosend = {}
    let newArr = this.state.workTimeEdit;

    this.state.workTime.map(item => {
      let a = this.state.workTime.indexOf(item);
      console.log(this.state.workTimeEdit[a]);
      
      if(this.state.isAlwaysOpen ){
        obj = {
          ...obj,
          isAlwaysOpen: true,
        }
      }else{
        if(item.open !== newArr[a].open || item.close !== newArr[a].close || item.isWorking !== newArr[a].isWorking){
          let name = newArr[a].name;
          obj = {
            ...obj,
            isAlwaysOpen: false,
            [name]:{
             open: newArr[a].open,
             close: newArr[a].close,
             isWorking: newArr[a].isWorking,
            }
          }
        }  
      }    
    })
    console.log("objjjjjjjjjjjj", obj)
  }
  prepareToEditObject = async () => {
    let { objToEdit } = this.state;
    let objectClArr = {};
    let objectLocationArr = {};
    let objectInfoArr = {};  
    let objectPhonesArr = [];
    let objectClKeys = Object.keys(objToEdit.objectCl);
    let objectInfoKeys = Object.keys(objToEdit.objectInfo);
    let objectLocationKeys = Object.keys(objToEdit.objectLocation);
    objectClKeys.map(item => {
      if (objToEdit.objectCl[item] != this.state[item]) {
        objectClArr = {
          ...objectClArr,
          [item]: this.state[item],
        };
      }
    })
    objectLocationKeys.map((item) => {
      if (objToEdit.objectLocation[item] != this.state[item]) {
        objectLocationArr = {
          ...objectLocationArr,
          [item]: this.state[item],
        };
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
  }
  changePhones = (e, id) => {
    let arr = this.state.phones
    if(e.target.name === 'number') {
      arr.map(item => {
        if(item.id == id) {
          item.number = e.target.value
        }
      })
    }else {
      arr.map(item => {
        if(item.id == id) {
          item.desc = e.target.value
        }
      })
    }
    
    this.setState({
      phones: arr
    })
    console.log("ID", id)
    console.log("EVENT", e.target.value)
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
    return (
      <div>
        {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
        <Input label="Name: " name="name" value={this.state.name} onChange={this.objectEdit} /><br />
        <span>Category: </span>
        <Dropdown
          value={this.state.objectCategoryId}
          selection
          onChange={this.setCategoryObj}
          options={this.state.objToEdit.objectCategoriesArr} /><br />
        <span>Community: </span>
        <Dropdown
          selection
          value={this.state.locationId}
          options={this.state.childLocation}
          onChange={this.changeC}  
        /><br />
        <Dropdown
          selection
          value={this.state.newVal}
          options={this.state.par}
          onChange={this.setLo} /><br />
        <Checkbox checked={this.state.isAlwaysOpen} toggle onClick={()=> this.isAlwaysOpenToggle() } />                                
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
                let openning = item.open.slice(0,2) + ":" + item.open.slice(2,4);
                let closing = item.close.slice(0,2) + ":" + item.close.slice(2,4);
                return (
                  <Table.Body>
                    <Table.Row >
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        <TimePicker
                          defaultValue={moment(openning, 'HH:mm')}
                          // value={moment(openning)}
                          disabled={!this.state.isAlwaysOpen ? item.isWorking ? false : true : true}
                          showSecond={false}
                          onChange={(value) => this.editWorkingTime(value, key) } />
                      </Table.Cell>
                      <Table.Cell>
                        <TimePicker
                          disabled={!this.state.isAlwaysOpen ? item.isWorking ? false : true : true}                        
                          defaultValue={moment(closing, 'HH:mm')} 
                          onChange={(value) => this.editWorkingTimeClose(value, key) }                       
                          showSecond={false} />
                      </Table.Cell>
                      <Table.Cell>
                        <Checkbox checked={item.isWorking} disabled={this.state.isAlwaysOpen ? true : false} toggle onClick={()=> this.isWorkingToggle(key) }
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
        {
          this.state.phones.length ?
          this.state.phones.map((item, key) => {
            return(
              <div>
               <Input name='desc' value={item.desc} onChange={(e) => this.changePhones(e, item.id)}/> 
               <Input name='number' value={item.number} onChange={(e) => this.changePhones(e, item.id)}/>
              </div>
            )
          }) : null
        }
        <Button primary onClick={() => this.prepareToEditObject()}>Save</Button>
      </div>
    );
  }
}
export default EditObject;
