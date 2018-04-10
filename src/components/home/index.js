import React from 'react';
import css from './styles.scss';
import post from '../fetch/post';
import { connect } from 'react-redux';
import Login from './login';

@connect(state => ({ token: state.token }))

class Home extends React.Component {
	async componentWillMount() {
		if (localStorage.getItem('token')) {
			const response = await post.secure('/checkToken', {});
			console.log('RESPONSE', response)
      if (response.success) {
				this.props.dispatch({
          type: "USER_TOKEN",
          token: response.token,
        })
      } else {
        localStorage.removeItem('token')
      }
    }
  }
	render() {
		let token = this.props.token.token;
		console.log('TOKEEEEEEEEEEEEEEEEN', localStorage.getItem('token'))
    console.log('OVO JE TOKEN IZ REDUXA', this.props.token.token)
		return (
			<div>
				{
					token === '' ?
					<Login /> :
					'NASTAVITE DA KORISTITE APPLIKACIJU'
				}
			</div>
		)
	}
}
export default Home;
