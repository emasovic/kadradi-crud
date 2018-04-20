import React from 'react';
import post from '../../fetch/post';
import { Table, Input, Button, Dropdown, Checkbox } from 'semantic-ui-react';
import { stat } from 'fs';
import TimePicker from 'rc-time-picker';
import Style from './objectsEdit.css';
import TableRow from 'semantic-ui-react';
import moment from 'moment';

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
      streetAddress: '',
      par: [],
      childLocation: [],
      newVal: 1,
      testState: '',
      workTime: [],
      workTimeEdit: [],
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
    if (e.target.name === 'address') {
      this.setState({
        address: e.target.value,
      });
    }
    if (e.target.name === 'verified') {
      this.setState({
        verified: e.target.value,
      });
    }
    if (e.target.name === 'webSiteUrl') {
      this.setState({
        webSiteUrl: e.target.value,
      });
    }
    if (e.target.name === 'city') {
      this.setState({
        city: e.target.value,
      });
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
        webSiteUrl: response.objectById.objectInfo.websiteUrl,
        city: response.objectById.objectLocation.city,
        workTime: response.objectById.objectWorkTime,
      });
      let jsArr = JSON.parse(JSON.stringify(this.state.workTime));
      this.setState({
        workTimeEdit: jsArr,
      })
      this.setParentObj(response.objectById.locations);
      console.log('JEL GA IMA OVDE bRE?', response.objectById.locations);
      console.log('RESPONSE', response);
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
    const obArr = [];
    const nekiObj = {
      key: 2,
      value: 2,
      text: 'Novi sad',
      parrentLocation: 0,
    };
    for (const child in parrent) {
      console.log('PARRENT LOCATION: ', parrent[child].text);
      if (parrent[child].parrentLocation === 0) {
        obArr[child] = parrent[child];
      }
    }
    const newArr = [...obArr, nekiObj];
    this.setState({
      par: newArr,
    });
  }
  setLo = (e, { value }) => {
    const arr = this.state.objToEdit.locations.filter(word => word.parrentLocation == value);
    this.setState({
      childLocation: arr,
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

  editWorkingTimeBtn(){
    let obj = {};
    let objTosend = {}
    let newArr = this.state.workTimeEdit;

    this.state.workTime.map(item => {

      let a = this.state.workTime.indexOf(item);
      console.log(this.state.workTimeEdit[a]);

      if(item.open !== newArr[a].open || item.close !== newArr[a].close){
        let name = newArr[a].name;
        obj = {
          ...obj,
          [name]:{
           open: newArr.open,
           close: newArr.close, 
          }
        }
      }      
    })
    console.log("objjjjjjjjjjjj", obj)
  }

  prepareToEditObject = async () => {
    const { objToEdit } = this.state;
    let objectClArr = {};
    let objectLocationArr = {};
    const objectClKeys = Object.keys(objToEdit.objectCl);
    const objectInfoKeys = Object.keys(objToEdit.objectInfo);
    const objectPhones = Object.keys(objToEdit.objectPhones);
    // let objectPhones = Object.keys(objToEdit.objectPhones[0])
    const objectLocationKeys = Object.keys(objToEdit.objectLocation);
    // let objectLocation = Object.keys(objToEdit.objectLocation[0])
    objectClKeys.map(item => {
      if (objToEdit.objectCl[item] != this.state[item]) {
        console.log('item', item);
        console.log('IZ PROPSA', objToEdit.objectCl[item]);
        console.log('IZ STATE', this.state[item]);
        objectClArr = {
          ...objectClArr,
          [item]: this.state[item],
        };
      }
    });
    console.log('OBJECT CL', objectClArr);
    objectLocationKeys.map(item => {
      if (objToEdit.objectLocation[item] != this.state[item]) {
        objectLocationArr = {
          ...objectLocationArr,
          [item]: this.state[item],
        };
      }
    });
    console.log('OBJECT LOC', objectLocationArr);
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
    console.log('STEJT ', this.state);
    // console.log('STRIPTIZETA', this.state.objectCategoriesArr);
    // console.log('LOCATION TEST', this.state.objToEdit);
    // console.log('STATE PAR: ', this.state.par);
    // console.log('STATE PAR NAME: ', this.state.par);
    // console.log("VALUE", this.state.newVal);
    // console.log("PUNTO CUKAM!", this.state.childLocation);
    // console.log('CHILD', this.state.objectCategoryId);
    // console.log('STATE', this.state);
    return (
      <div>
        {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
        <Input label="Name: " name="name" value={this.state.name} onChange={this.objectEdit} /><br />
        <Dropdown
          value={this.state.objectCategoryId}
          selection
          onChange={this.setCategoryObj}
          options={this.state.objToEdit.objectCategoriesArr} /><br />
        <Dropdown
          selection
          value={6}
          onChange={this.setCategoryObj}
          options={this.state.childLocation} /><br />
        <Dropdown
          selection
          options={this.state.par}
          onChange={this.setLo} /><br />

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
                console.log("MOMENT",moment(openning, 'HH:mm'));
                return (
                  <Table.Body>
                    <Table.Row >
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        <TimePicker
                          defaultValue={moment(openning, 'HH:mm')}
                          // value={moment(openning)}
                          showSecond={false}
                          onChange={(value) => this.editWorkingTime(value, key) } />
                      </Table.Cell>
                      <Table.Cell>
                        <TimePicker
                          defaultValue={moment(closing, 'HH:mm')} 
                          onChange={(value) => this.editWorkingTimeClose(value, key) }                       
                          showSecond={false} />
                      </Table.Cell>
                      <Table.Cell>
                        <Checkbox />
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

        <Input label="personId: " name="personId" value={this.state.personId} onChange={this.objectEdit} /><br />
        <Input label="shortDescription: " name="shortDescription" value={this.state.shortDescription} onChange={this.objectEdit} /><br />
        <Input label="streetAddress: " name="address" value={this.state.address} onChange={this.objectEdit} /><br />
        <Input label="Verified: " name="verified" value={this.state.verified} onChange={this.objectEdit} /><br />
        <Input label="WebSiteUrl: " name="webSiteUrl" value={this.state.webSiteUrl} onChange={this.objectEdit} /><br />
        <Input label="City: " name="city" value={this.state.city} onChange={this.objectEdit} /><br />
        <Button primary onClick={() => this.prepareToEditObject()}>Save</Button>
      </div>
    );
  }
}
export default EditObject;
