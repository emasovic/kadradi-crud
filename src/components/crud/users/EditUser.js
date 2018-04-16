import React from 'react';
import post from '../../fetch/post';
import { Input } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react'

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    // componentWillMount() {
    //     this.getObjectById();
    // }
    render() {
        console.log('KORISNIKI', this.props)
        return (
            <div>
             <Input label={"Edit Name"}/><br/>
             <Input label={"Edit Last Name"}/><br/>
             <Input label={"Edit Email"}/><br/>
             <Button>Save</Button>
            </div>
        )
    }
}
export default EditUser;
