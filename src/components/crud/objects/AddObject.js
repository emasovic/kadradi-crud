import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown, Checkbox } from 'semantic-ui-react';
import Number from './Number'

class AddObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            nameError:false,
            objectCategorie:"",
            objectCategorieError:false,
            categories: [],
            cityArr: [],
            childLocationArr: [],
            childLocation: [],
            cityId: "",
            cityIdError:false,
            cityPart: "",
            cityPartError:false,
            person: "",
            image: "",
            objectLocation: {},
            objectInfo: "",
            popular: "",
            phone: "",
            phoneDesc: "",
            phoneArr: [],
            additionalInfo: "",
            verified: false
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

    toggle = () => this.setState({ verified: !this.state.verified });

    removeNumber = (index) => {
        this.state.phoneArr.splice(index, 1)
        this.setState({
            phoneArr: this.state.phoneArr
        })
    }
    addNumber = (tel, desc) => {
        this.state.phoneArr.push({ description: desc, number: tel })
        this.setState({
            phoneArr: this.state.phoneArr
        })
    }
    getLocations = async () => {
        let response = await post.secure('/getAllLocations', {})
        if (response.token.success) {
            console.log("LOCATIONS",response)
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
    getCityPart = (e,{value}) => {
        let arr = this.state.childLocationArr.filter( id => id.parrentLocation == value)
        this.setState({
          childLocation: arr
        })
      }
    getObjectCategories = async () => {
        let response = await post.secure('/categoriesArray', {})
        console.log("CATEGORIES",response)
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

    render() {
        console.log("ADD OBJECT STATE", this.state)
        return (
            <div>
                {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
                <Input label='Name: ' name='name' error={this.state.nameError} onChange={this.handleInput} required/><br />
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
                <Input label='Object location: ' name='objectLocation' onChange={this.handleInput} placeholder="Enter street name" /><br />
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
                    checked={this.state.checked}
                    label='Verified'
                    onChange={this.toggle}
                />
                <Button primary>Add</Button>
            </div>
        )
    }
}
export default AddObject;
