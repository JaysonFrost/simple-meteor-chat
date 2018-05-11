import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, withRouter, Redirect } from 'react-router'
import { withTracker } from 'meteor/react-meteor-data'
import { Messages } from '../../../api/messages.js'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Tracker } from 'meteor/tracker'
import Chat from '../../components/Chat'
import UserList from '../../components/UserList'
import AccountUi from '../AccountUi'
import styles from './styles.sss'

class App extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
			messages: {}
		}
	}

	componentWillReceiveProps() {
		if (Meteor.user()) {
			const locname = this.props.location.pathname.split('').splice(6, this.props.location.pathname.length - 1).join('')
			Session.set('friendId', locname)
			Session.set('userId', Meteor.user()._id)
			const friend = Meteor.users.find({ _id: locname }).fetch()[0]
			Session.set('friendName', friend && friend.username)
		}
	}

	render() {
		console.log(Meteor.user(), Meteor.loggingIn())
		return (
			<Switch>
				<Route path={'/account'} component={AccountUi} />
				<Route path={'/'} exact render={() => {
					if (!Meteor.user() && !Meteor.loggingIn()) {
						return <Redirect to='/account' />
					}
					return (
						<div className={styles.home}>
							<UserList
								users={this.props.users}
								changeUser={this.changeUser}
								user={this.props.user}
							/>
						</div>
					)
				}} />
				<Route path={'/chat/:id'} render={() => (
					<div className={styles.home}>
						<Chat
							messages={this.props.messages}
						/>
					</div>
				)} />
			</Switch>
		)
	}
}

export default withRouter(withTracker(() => {
	Meteor.subscribe('allUsers')
	Meteor.subscribe('messages')
	
	const userId = Session.get('userId')
	const friendId = Session.get('friendId')

	const chatIdOne = userId + friendId
	const chatIdTwo = friendId + userId

	return {
		users: Meteor.users.find({}, {fields: {"services": 0}}).fetch(),
		user: Meteor.user(),
		messages: Messages.find({chatId: { $in: [chatIdOne, chatIdTwo] }}).fetch()
	}
})(App))