import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';     

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('allUsers', function () {
    return Meteor.users.find({})
  })
}