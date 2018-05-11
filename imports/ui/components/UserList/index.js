import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { Messages } from '../../../api/messages.js'
import { Link } from 'react-router-dom'
import styles from './styles.sss'

export default class UserList extends Component {

	changeUser = (friend) => {
		Session.set('friendId', friend._id)
		Session.set('friendName', friend.username)
	}

	render() {

		const {
			users
		} = this.props

		return (
			<div className={styles.userList}>
				<Link to={'/account'}>
					<div>
						<div className={styles.menu}></div>
						<div className={styles.chatTitle}>Chats</div>
					</div>
				</Link>
				<div className={styles.list}>
					<ul>
						{users && this.props.user && users.filter(user => user._id !== this.props.user._id).map(user => {
							
							const chatIdOne = Session.get('userId') + user._id
							const chatIdTwo = user._id + Session.get('userId')

							const messagePreview = Messages.find({chatId: { $in: [chatIdOne, chatIdTwo] }}).fetch()

							const lastMes = !!messagePreview.length && messagePreview[messagePreview.length - 1]

							const lastMesText = Meteor.user()._id === lastMes.sendBy ? `Вы: ${Meteor.user().lastMessage}` : lastMes.text
							const lastMesTime = lastMes.createdAt

							return (
								<li onClick={() => this.changeUser(user)} key={user._id}>
									<Link to={`/chat/${user._id}`}>
										<div className={styles.userBlock}>
											<span>{user.username}</span>
											<span className={styles.preview}>{lastMesText}</span>
											<span className={styles.time}>{lastMesTime}</span>
										</div>
									</Link>
									<div className={styles.separator}></div>
								</li>
							)
						})
						}
					</ul>
				</div>
			</div>
		)
	}
}