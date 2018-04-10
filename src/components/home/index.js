import React from 'react';
import {Grid, Input, Button } from 'semantic-ui-react';
import css from './styles.scss';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			s: ''
		}
	}
	componentWillMount() {
		localStorage.setItem('myCat', 'Tom');

	}
	render() {
		let cat = localStorage.getItem("myCat");
		console.log('macka', cat)
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
