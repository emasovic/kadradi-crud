import React from 'react';
import { Grid, Input, Button } from 'semantic-ui-react';
import css from './styles.scss';
import post from '../fetch/post';
import { connect } from 'react-redux';
import md5 from 'md5';

@connect(state => ({ token: state.token }))

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      failLogin: false,
      popup: false,
    }
  }
  setName = e => {
    this.setState({
      userName: e.target.value,
    })
  }
  setPass = e => {
    this.setState({
      password: e.target.value,
    })
  }
  submitFunction = async () => {
    let name = this.state.userName;
    let pass = md5(this.state.password);
    if (name !== '' && pass !== '') {
      let odgovor = await post.unsecure('/login', {
        username: name,
        password: pass,
      });
      if (odgovor.success) {
        localStorage.setItem('token', odgovor.token)
        this.props.dispatch({
          type: "USER_TOKEN",
          token: odgovor.token,
        })
      } else {
        this.setState({
          failLogin: true,
        })
      }
    }
  }
  render() {
    return (
      <div className={css.wrapper}>
        <div className={css.holder}>
          <div>
            <Input
              onChange={(e) => this.setName(e)}
              focus
              placeholder='Username...'
              style={{ marginRight: '10px' }} />
            <Input
              onChange={(e) => this.setPass(e)}
              type='password'
              focus placeholder='Password...'
              style={{ marginRight: '10px' }} />
            <Button onClick={() => this.submitFunction()}>Submit</Button>
          </div>
          <div style={{ color: "red" }}>
            {
              !this.state.failLogin ? null :
                <p>Username or password is incorect!</p>
            }
          </div>
        </div>
      </div>
    )
  }
}
export default Login;
