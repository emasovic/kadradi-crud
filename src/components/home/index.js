import React from 'react';
import css from './styles.scss';
import post from '../fetch/post';
import { connect } from 'react-redux';
import Login from './login';
import Crud from '../crud/index';
import PubSub from 'pubsub-js';

@connect(state => ({ token: state.token }))

class Home extends React.Component {
	async componentWillMount() {
		if (localStorage.getItem('token')) {
			console.log('usao u mount')
			post.secure('/checkToken', {});
		}
	}
	render() {
		let ovajProps = this.props;
		let tokenManipulate = function (msg, data) {
			if (data.success) {
				console.log("Evo ga tebra")
				ovajProps.dispatch({
					type: "USER_TOKEN",
					token: data.token,
				})
			} else {
				console.log("SAD NIJE BRT")
				ovajProps.dispatch({
					type: "USER_TOKEN",
					token: "",
				})
			}
		}
		let ovoJeToken = PubSub.subscribe('TOKEN', tokenManipulate)
		let token = this.props.token.token;
		return (
			<div>
				{
					token === '' ?
						<Login /> :
						<Crud />
				}
			</div>
		)
	}
}
export default Home;
