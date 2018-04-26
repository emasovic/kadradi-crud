import React from 'react'
import { Input } from 'semantic-ui-react'

const SugestInput = (props) => (
  <div>
    <Input name="getUser" list='users' onChange={this.props.handleUser} placeholder='Type user email..' />
    <datalist id='Users'>
     {this.props.users.map(users => {
        return <option value={users.email} />
     })}
      {/* <option value='English' />
      <option value='Chinese' />
      <option value='Dutch' /> */}
    </datalist>
  </div>
)

export default SugestInput