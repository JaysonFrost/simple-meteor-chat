import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { Blaze } from 'meteor/blaze'
import { Link } from 'react-router-dom'
import styles from './styles.sss'
import TextField from 'material-ui/TextField'
import classnames from 'classnames/bind'

const cx = classnames.bind(styles)

export default class AccountUI extends Component {
	
	state = {
		username: '',
		password: '',
		email: '',
		login: true
	}

	loginOrRegister() {
		if (this.state.username && this.state.password) {
			if (this.state.login) {
				Meteor.loginWithPassword(this.state.username, this.state.password, (err) => {
					if(Meteor.user()) {
						this.props.history.push('/')
					} else {
						alert(err)
					}
				})
			} else {
				Accounts.createUser({ email: this.state.email, username: this.state.username, password: this.state.password })
				this.props.history.push('/')
			}
		}
	}

	render() {
		return (
			<div className={styles.accountContainer}>
				<div className={styles.wrapper}>
					{!Meteor.user() ?
						<div className={cx({ regForm: true, regForm_on: !this.state.login })}>
							<div className={cx({ forms: true, forms_on: !this.state.login })}>
								<TextField
									hintText="Username"
									floatingLabelText="Username"
									style={{ width: 'unset' }}
									type="text"
									onChange={(e) => this.setState({
										username: e.target.value
									})}
								/>
								<TextField
									hintText="Email"
									floatingLabelText="Email"
									style={{ width: 'unset' }}
									className={cx({ email: true, email_on: !this.state.login })}
									type="text"
									onChange={(e) => this.setState({
										email: e.target.value
									})}
								/>
								<TextField
									hintText="Password Field"
									floatingLabelText="Password"
									style={{ width: 'unset' }}
									type="password"
									onChange={(e) => this.setState({
										password: e.target.value
									})}
								/>
							</div>
							<div className={styles.button} onClick={this.loginOrRegister.bind(this)}>Get Started</div>
						</div> :
						<div>
							<div className={styles.button} onClick={() => Meteor.logout()}>Sign Out</div>
							<Link to='/'><div className={styles.button}>Back</div></Link>
						</div>
					}
					<div className={styles.create}>
						<div>Not register?</div>
						<div className={styles.account} onClick={() => this.setState({ login: !this.state.login })}>Create account</div>
					</div>
				</div>
			</div>
		)
	}
}