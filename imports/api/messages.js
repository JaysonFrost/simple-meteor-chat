import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

export const Messages = new Mongo.Collection('messages')

if (Meteor.isServer) {
	Meteor.publish('messages', function() {
		const userId = Meteor.user() && Meteor.user()._id
		return Messages.find({ $or: [{ sendBy: userId }, { sendTo: userId }]}, { sort: { createdAt: 1 } })
	})
}

Meteor.methods({
	'messages.insert'(text, friend) {
		check(text, String)

		if (!this.userId) {
			throw new Meteor.Error('not-authorized')
		}
		
		const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
		
		Meteor.users.update(this.userId, {$set: {
			lastMessage: text
		}
		})

		Messages.insert({
			text,
			createdAt: time,
			sendBy: this.userId,
			sendTo: friend,
			chatId: friend + this.userId,
			username: Meteor.users.findOne(this.userId).username
		})
	}

})