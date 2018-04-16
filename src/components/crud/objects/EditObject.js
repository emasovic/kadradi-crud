import React from 'react';
import post from '../../fetch/post';
import { Input } from 'semantic-ui-react';

class EditObject extends React.Component{
  constructor(props) {
    super(props);
      this.state =  {
        city: '',
        id: null,
        location: null,
        
      }
  }

  componentWillMount() {
    this.getObjectById();
  }
  getObjectById = async () => {
    let objectId = this.props.match.params.id;
    let response = await post.secure('/objectById', {
      objectId: objectId,
      token: this.props.token
    });
    if (response.token.success) {
      console.log('RESPONSE', response)
    } else {
      console.log('stajebreovo')
    }
  }
  render() {
    console.log('props', this.props)
    return(
			<div>
				<Input />
			</div>
    )
  }
}
export default EditObject;
