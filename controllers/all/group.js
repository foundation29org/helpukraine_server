// functions for each call of the api on group. Use the group model

'use strict'

// add the group model
const Group = require('../../models/group')
const crypt = require('../../services/crypt')
const User = require('../../models/user')
const fs = require('fs-extra')
const serviceEmail = require('../../services/email')
const sha512 = require('js-sha512')

/**
 * @api {get} https://health29.org/api/groupsnames/ Get groups names
 * @apiName getGroupsNames
 * @apiDescription This method return the groups of health29. you get a list of groups, and for each one you have the name.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/groupsnames)
 *    .subscribe( (res : any) => {
 *      console.log('groups: '+ res.groups);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "name":"Duchenne Parent Project Netherlands"
 *   },
 *   {
 *     "name":"None"
 *   }
 * ]
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 */
function getGroupsNames (req, res){

  Group.find({}, function(err, groups) {
    var listGroups = [];
    if(groups.length>0){
      groups.forEach(function(group) {
        listGroups.push({name:group.name, _id: group._id, order: group.order, translations: group.translations});
      });
    }


    res.status(200).send(listGroups)
  });
}

/**
 * @api {get} https://health29.org/api/groups/ Get groups
 * @apiName getGroups
 * @apiDescription This method return the groups of health29. you get a list of groups, and for each one you have: name, and the symptoms associated with the group.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/groups)
 *    .subscribe( (res : any) => {
 *      console.log('groups: '+ res.groups);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "name":"Duchenne Parent Project Netherlands",
 *     "data":[
 *       {"id":"HP:0100543","name":"Cognitive impairment"},
 *       {"id":"HP:0002376","name":"Developmental regression"}
 *     ]
 *   },
 *   {
 *     "name":"None",
 *     "data":[]
 *   }
 * ]
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 */
function getGroups (req, res){

  Group.find({}, function(err, groups) {
    var listGroups = [];

    groups.forEach(function(group) {
      listGroups.push(group);
    });

    res.status(200).send(listGroups)
  });
}


/**
 * @api {get} https://health29.org/api/groupadmin/ Get administrator email
 * @apiName getGroupAdmin
 * @apiDescription This method return the email of the administrator of the group.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var groupName = <groupName>
 *   this.http.get('https://health29.org/api/groupadmin/'+groupName)
 *    .subscribe( (res : any) => {
 *      console.log('Get the email of the administrator of the group ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 *
 * @apiParam {String} groupName The name of the group.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "email":<admin email>
 *   }
 */

function getGroupAdmin (req, res){
	let groupName= req.params.groupName;


	Group.findOne({ 'name': groupName }, function (err, group) {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!group) return res.status(202).send({message: `The group does not exist`})
		res.status(200).send({email:group.email})
	})
}

/**
 * @api {get} https://health29.org/api/group/ Get specific group information
 * @apiName getGroup
 * @apiDescription This method return the information of one group of health29.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var groupName = "GroupName"
 *   this.http.get('https://health29.org/api/group/'+groupName)
 *    .subscribe( (res : any) => {
 *      console.log('result Ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} groupName The name of the group of patients. More info here:  [Get groupName](#api-Groups-getGroupsNames)
 * @apiSuccess {String} _id Group unique ID.
 * @apiSuccess {String} email Group admin email address
 * @apiSuccess {String} subscription Type of subscription of the group in Health29
 * @apiSuccess {String} name Group name.
 * @apiSuccess {Object[]} medications Group medications.
 * @apiSuccess {Object[]} phenotype Group symptoms.
 * @apiSuccess {String} defaultLang Group default lang.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	  "_id" : <id>,
 * 	  "email" : <admin_email>,
 * 	  "subscription" : "Premium",
 * 	  "name" : "GroupName",
 *  	"medications" : [ {
 * 		  "drugs" : [
 * 			  {
 * 				  "drugsSideEffects" : [
 * 					  "Cushingoid",
 * 					  "Weight gain",
 * 					  "Growth stunting",
 * 					  "Delayed puberty",
 * 				  	"Mood changes",
 * 				  	"Fungal infections",
 * 			  		"Other dermatologic complications",
 * 				  	"Cataract",
 * 				  	"Adrenal surpression",
 * 				  	"Bone density"
 * 			  	],
 * 			  	"translations" : [
 * 					  {
 * 					  	"name" : "Prednisolone",
 * 					  	"code" : "en"
 * 					  },
 * 					  {
 * 					  	"name" : "Prednisolone",
 * 					  	"code" : "es"
 * 				  	},
 * 				  	{
 * 					  	"name" : "Corticosteroïden - Prednison",
 * 						  "code" : "nl"
 * 					  }
 * 				  ],
 * 				  "name" : "Prednisolone"
 * 			  }
 *      ]
 * 		  "sideEffects" : [
 * 			  {
 * 				  "translationssideEffect" : [
 * 				  	{
 * 						  "name" : "Bone density",
 * 						  "code" : "en"
 * 					  },
 * 					  {
 * 					  	"name" : "Bone density",
 * 						  "code" : "es"
 * 					  },
 * 					  {
 * 						  "name" : "Botdichtheid",
 * 						  "code" : "nl"
 * 					  }
 * 				  ],
 * 				  "name" : "Bone density"
 * 			  }
 * 		  ],
 * 		  "adverseEffects" : [ ]
 * 	  ],
 * 	  "phenotype" : [
 * 		  {
 * 			  "id" : "HP:0001250",
 * 			  "name" : "seizures"
 * 		  }
 * 	  ],
 * 	  "__v" : 0,
 * 	  "defaultLang" : "es"
 * }
 */

function getGroup (req, res){
	let groupName= req.params.groupName;
  //Group.findById(groupName, {"_id" : false }, (err, group) => {
  //Group.find({"name": groupName}, function(err, group) {
  Group.findOne({ 'name': groupName}, (err, group) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!group) return res.status(202).send({message: `The group does not exist`})

		res.status(200).send(group)
	})
}

function getNotifications(req, res){
  let userId= crypt.decrypt(req.params.userId);
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'Admin'){
      let groupName= user.group;
      Group.findOne({ 'name': groupName }, function (err, group) {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(!group) return res.status(202).send({message: `The group does not exist`})
        res.status(200).send({_id: group._id, notifications:group.notifications})
      })
		}else{
			res.status(401).send({message: 'without permission'})
		}

	})
}

function setNotifications(req, res){
  let userId= crypt.decrypt(req.params.userId);
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'Admin'){
      Group.findOneAndUpdate({_id: req.body._id}, {$set:{notifications: req.body.notifications}}, {new: true}, function(err, groupUpdated){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})

        res.status(200).send({message: 'Group updated'})
      })
		}else{
			res.status(401).send({message: 'without permission'})
		}

	})
}


module.exports = {
  getGroupsNames,
	getGroups,
  getGroupAdmin,
	getGroup,
  getNotifications,
  setNotifications
}
