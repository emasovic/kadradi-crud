import React from 'react';
import post from '../../fetch/post';
import { Input } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react'

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            singleUser:{},
            firstName:"",
            lastName:"",
            email:""
        }
    }
    componentWillMount() {
        this.getSingleUser();
    }
    getSingleUser = async () => {
        let response = await post.secure('/singleUser',{userId:this.props.match.params.id})
        if (response.token.success) {
            this.setState({
              singleUser:{
                  userId:response.user.id,
                  firstName:response.user.firstName,
                  lastName:response.user.lastName,
                  email:response.user.email
              },
              firstName:response.user.firstName,
              lastName:response.user.lastName,
              email:response.user.email
            })
        }
    }
    handleInput = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
      }
    editUser = async () => {
     let singleUser = this.state.singleUser
     if(this.state.firstName.toLowerCase() !== singleUser.firstName.toLowerCase() || this.state.lastName.toLowerCase() !== singleUser.lastName.toLowerCase()){
         await post.secure('/editUser', {
            userId:this.props.match.params.id,
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            email:this.state.email
            
        })
    }else{
        console.log("NEMA IZMENA")
    }
}
        render() {
            console.log('KORISNIKI STATE',this.state)
            return (
                <div>
                    <Input label={"Edit Name"} value={this.state.firstName} onChange={this.handleInput} name={"firstName"}/><br />
                    <Input label={"Edit Last Name"} value={this.state.lastName} onChange={this.handleInput} name={"lastName"}/><br />
                    <Input label={"Edit Email"} value={this.state.email} onChange={this.handleInput} name={"email"}/><br />
                    <Button onClick={this.editUser}>Save</Button>
                </div>
            )
        }
    }
 export default EditUser;
