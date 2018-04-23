import React from 'react';
import post from '../../fetch/post';
import { Input } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'

class Number extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div>
                <Input 
                  action={<Input label="Phone Desc" disabled defaultValue={this.props.desc} />}
                  label={"Telephone No."+`${this.props.index+1}`} 
                  disabled 
                  defaultValue={this.props.value} />
                <Button icon='minus' onClick={()=>this.props.removeNumber(this.props.index)} />
            </div>
        )
    }
}
export default Number
