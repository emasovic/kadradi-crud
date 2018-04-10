import React from 'react';
import {Grid, Input, Button } from 'semantic-ui-react';
import css from './styles.scss';
import post from '../fetch/post'

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			s: ''
		}
	}
	componentWillMount() {
		if(localStorage.token) {
			console.log('IMA TOKENA')
			// AKO IMA PROVERAVAMO SA SERVEROM DA LI JE VALIDAN
			const response = post.secure('/checkToken',{});
			if(response.success) {
				localStorage.setItem('token', response.token)
			} else {
				localStorage.removeItem('token')
			}
		}
	}
	render() {
		return(
			<div className={css.wrapper}>
				<div className={css.holder}>
						<Input focus placeholder='Username...' style={{marginRight:'10px'}}/>
						<Input type='password' focus placeholder='Password...' style={{marginRight:'10px'}}/>
						<Button>Submit</Button>
				</div>
			</div>
		)
	}
}
export default Home;
