import React from 'react';
import post from '../fetch/post';

class EditObject extends React.Component{

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
				edit page
			</div>
    )
  }
}
export default EditObject;
