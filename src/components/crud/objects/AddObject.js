import React from 'react';
import post from '../../fetch/post';
import { Input, Button, Dropdown,Checkbox } from 'semantic-ui-react';

class AddObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            objectCategorieId: "",
            person: "",
            image: "",
            objectLocation: {},
            objectInfo: "",
            popular: "",
            phone: "",
            additionalInfo: "",
            verified: false
        }
    }
    handleInput = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }
    handleChange = (e, { name, value }) => this.setState({ [name]: value })
    toggle = () => this.setState({ verified: !this.state.verified })


    render() {
        console.log("ADD OBJECT STATE", this.state)
        return (
            <div>
                {/* <Input label='locationId: ' name='locationId' value={this.state.locationId} onChange={this.objectEdit} /><br /> */}
                <Input label='Name: ' name='name' onChange={this.handleInput} /><br />
                <Dropdown
                    placeholder="Select categorie"
                    name="categories"
                    selection
                    // options={this.state.categoriesArr}
                    onChange={this.handleChange}
                /><br />
                <Dropdown
                    //   value={this.state.locationId} 
                    selection
                //   onChange={this.setCategoryObj}
                //   options={this.state.objToEdit.locations}
                /><br />
                <Dropdown
                    selection
                /><br />
                <Input label='Object location: ' name='objectLocation' onChange={this.handleInput} placeholder="Enter street name" /><br />
                <Input label='Person: ' name='person' onChange={this.handleInput} /><br />
                <Input label='Image: ' name='image' onChange={this.handleInput} placeholder="Image url..." /><br />
                <Input label='Phone: ' name='phone' onChange={this.handleInput} /><br />
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
