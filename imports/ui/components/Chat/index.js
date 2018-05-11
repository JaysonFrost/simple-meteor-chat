import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import styles from './styles.sss'
import classnames from 'classnames/bind'

const cx = classnames.bind(styles)

export default class Chat extends Component {

	constructor(props) {
		super(props)
	}

	componentDidUpdate() {
		this.scrollToBottom()
	}

	componentDidMount() {
		this.scrollToBottom()
	}

	scrollToBottom = () => {
		this.chat.scrollTo(0, this.chat.scrollHeight)
	}
	
	newMessage(e) {
		e.preventDefault()

		const text = ReactDOM.findDOMNode(this.textInput).value.trim()
		ReactDOM.findDOMNode(this.textInput).value = ''
		
		if (text.length) {
			Meteor.call('messages.insert', text, Session.get('friendId'))
		}
		this.scrollToBottom()
	}

	render() {

		const {
			messages,
			friend
		} = this.props

		return (
			<div className={styles.chat}>
				<div className={styles.title}>
					<Link to='/'>
						<div className={styles.arrowWrap}>
							<div className={styles.arrowBack}></div>
						</div>
					</Link>
					{Session.get('friendName')}
				</div>
				<div className={styles.messages} ref={chat => this.chat = chat}>
					<ul>
						{!!messages.length && messages.map(mes => {
							
							const isCurrentUser = Meteor.user()._id === mes.sendBy
							return (
								<li key={mes._id} className={cx({listItem: true, listItem_your: isCurrentUser })}>
									<div className={styles.message}>
										<span>{mes.username}</span>
										{isCurrentUser ? <span className={styles.you}>You</span> : null}
										<div>{mes.text}</div>
									</div>
								</li>
							)
						}
						)}
					</ul>
				</div>
				<form onSubmit={this.newMessage.bind(this)} >
					<input
						ref={e => this.textInput = e}
						type="text"
						placeholder={'Type message...'}
					/>
					<div className={styles.arrow} onClick={this.newMessage.bind(this)}></div>
				</form>
			</div>
		);
	}
}
