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
                <Input label={"Tel no.1"}  placeholder="Neki telefon" />
                <Button icon='minus' onClick={this.props.removeNumber} />
            </div>
        )
    }
}
export default Number
