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
        listGroups.push({name:group.name, _id: group._id});
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

/**
 * @api {post} https://health29.org/api/group/ Create new group
 * @apiPrivate
 * @apiName saveGroup
 * @apiDescription This method creates new group. Only for superadmin.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {"name":<GroupName>,"subscription":<subscription>,"email":<Admin_email>,"defaultLang":<code_lang>}
 *   this.http.post('https://health29.org/api/group/'+userId, body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new group Ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId The unique identifier of the user.
 * @apiSuccess {Object} Result Returns an object with information about the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "message":'Group created'
 * }
 */

function saveGroup (req, res){
  let userId= crypt.decrypt(req.params.userId);
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'SuperAdmin'){

      let group = new Group()
      group.name = req.body.name
      group.subscription = req.body.subscription
      group.email = req.body.email
      group.defaultLang = req.body.defaultLang

      User.findOne({ 'email': group.email }, function (err, user2) {
        if (err) return res.status(500).send({ message: `Error searching de new user: ${err}`})
        if (!user2){
          let randomstring = Math.random().toString(36).slice(-12)
          let randompass = Math.random().toString(36).slice(-12)
          let storagepass = sha512(randompass);
          const newuser = new User({
            email: group.email,
            role: 'Admin',
            userName: 'Change the name',
            password: storagepass,
            confirmationCode: randomstring,
            lang: 'en',
            group: group.name,
          })

            Group.findOne({ 'name': group.name }, function (err, group2) {
              if (err) return res.status(500).send({ message: `User created but, error searching the group: ${err}`})
              if (!group2){

                // when you save, returns an id in groupStored to access that group
                group.save((err, groupStored) => {
                  if (err) res.status(500).send({message: `User created but, failed to save group in the database: ${err} `})

                  newuser.save((err) => {
                    if (err) return res.status(500).send({ message: `Error creating the user: ${err}`})

                    serviceEmail.sendMailVerifyEmail(newuser.email, randomstring, newuser.lang, newuser.group)
                      .then(response => {
                        //send the response
                        res.status(200).send({message: 'Group created'})
                        })
                      .catch(response => {
                        //create user, but Failed sending email.
                        //res.status(200).send({ token: serviceAuth.createToken(user),  message: 'Fail sending email'})
                        res.status(200).send({ message: 'Fail sending email'})
                      })

                  })


                })

              }else{
                return res.status(202).send({ message: 'Group exists'})
              }


          })




        }else{
          return res.status(202).send({ message: 'user exists'})
        }
      })

		}else{
			res.status(401).send({message: 'without permission'})
		}

	})

}

/**
 * @api {put} https://health29.org/api/group/ Update group
 * @apiPrivate
 * @apiName updateGroup
 * @apiDescription This method updates group. Only for superadmin.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {"name":<GroupName>,"subscription":<subscription>,"email":<Admin_email>,"defaultLang":<code_lang>}
 *   this.http.put('https://health29.org/api/group/'+userId, body)
 *    .subscribe( (res : any) => {
 *      console.log('Update group Ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId The unique identifier of the user.
 * @apiSuccess {Object} Result Returns an object with information about the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "message":'Group updated'
 * }
 */
function updateGroup (req, res){

  let userId= crypt.decrypt(req.params.userId);
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
    if (err) return res.status(500).send({message: 'Error making the request:'})
    if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

    if(user.role == 'SuperAdmin'){
      Group.findOneAndUpdate({_id: req.body._id}, {$set:{email: req.body.email, subscription:req.body.subscription, defaultLang:req.body.defaultLang}}, {new: true}, function(err, groupUpdated){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})

        res.status(200).send({message: 'Group updated'})
      })

    }else{
        res.status(401).send({message: 'without permission'})
      }

  })

}

/**
 * @api {delete} https://health29.org/api/group/ Delete group
 * @apiPrivate
 * @apiName Selete group
 * @apiDescription This method deletes a group. Only for superadmin.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userId>-code-<groupId>
 *   this.http.delete('https://health29.org/api/group/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete group Ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId-code-groupId The unique identifier of the user and the group.
 * @apiSuccess {Object} Result Returns an object with information about the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "message":'The group has been eliminated'
 * }
 */

function deleteGroup (req, res){

  var params= req.params.userIdAndgroupId;
  params = params.split("-code-");
  let userId= crypt.decrypt(params[0]);
  //añado  {"_id" : false} para que no devuelva el _id
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
    if (err) return res.status(500).send({message: 'Error making the request:'})
    if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

    if(user.role == 'SuperAdmin'){

      let groupId = params[1];
      Group.findOne({ '_id': groupId }, function (err, group) {
    		if (err) return res.status(500).send({message: `Error deleting the group: ${err}`})
    		if(group){
    			group.remove(err => {
    				if(err) return res.status(500).send({message: `Error deleting the group: ${err}`})
            //remove the Admin
            User.findOne({ 'group': group.name, 'role': 'Admin' }, function (err, user) {
          		if (err) return res.status(500).send({message: `Error deleting the user: ${err}`})
          		if (user){
          			user.remove(err => {
          				if(err) return res.status(500).send({message: `Error deleting the user : ${err}`})

                  res.status(200).send({message: `The group has been eliminated`})

          			})
          		}else{
          			 return res.status(202).send({message: 'The user does not exist'})
          		}

          	})

    			})
    		}else{
    			 return res.status(202).send({message: 'The group does not exist'})
    		}
    	})


    }else{
        res.status(401).send({message: 'without permission'})
      }

  })

}


/**
 * @api {get} https://health29.org/api/group/phenotype/:groupName Get phenotype
 * @apiName getPhenotypeGroup
 * @apiDescription This method return the phenotype associated with a group
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/group/phenotype/'+"None")
 *    .subscribe( (res : any) => {
 *      console.log('Phenotype info: '+ res.infoPhenotype.data);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} groupName The name of a group.  More info here:  [Get groupName](doc/#api-Groups-getGroupsNames)
 * @apiSuccess {Object} infoPhenotype The symptoms associated with the group. For each symptom, you get the <a href="https://en.wikipedia.org/wiki/Human_Phenotype_Ontology" target="_blank">HPO</a> and the name
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"infoPhenotype":
 *  {"data":
 *    [
 *      {"name":"Cognitive impairment","id":"HP:0100543"},{"name":"Developmental regression","id":"HP:0002376"}
 *    ]
 *  }
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'The group does not exist'}
 * @apiSuccess (Success 202) {String} message If there is group name, it will return: "The group does not exist"
 */

function getPhenotypeGroup (req, res){
	let groupName= req.params.groupName;
  Group.findOne({ 'name': groupName }, function (err, phenotype) {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!phenotype) return res.status(404).send({code: 208, message: 'The group does not exist'})

    var infoPhenotype = {data:phenotype.phenotype};
		res.status(200).send({infoPhenotype})
	})
}


/**
 * @api {put} https://health29.org/api/group/phenotype/:groupName Update phenotype
 * @apiName UpdatePhenotypeGroup
 * @apiPrivate
 * @apiDescription This method updates a phenotype associated with a group
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {"_id":<groupId>,"phenotype":"[
 *      {"name":"Cognitive impairment","id":"HP:0100543"},{"name":"Developmental regression","id":"HP:0002376"}
 *   ]"}
 *   this.http.put('https://health29.org/group/phenotype/'+userId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Update phenotype ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId The unique identifier of the user.
 * @apiSuccess {Object} Result Returns an object with information about the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {message: 'Phenotype updated'}
 *
 */

function updatePhenotypeGroup (req, res){

  let userId= crypt.decrypt(req.params.userId);
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
    if (err) return res.status(500).send({message: 'Error making the request:'})
    if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

    if(user.role == 'SuperAdmin'){
      let groupId= req.body._id;
      Group.findOneAndUpdate({_id: groupId}, {$set:{phenotype:req.body.phenotype}}, {new: true}, function(err, groupUpdated){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        res.status(200).send({message: 'Phenotype updated'})
      })

    }else{
        res.status(401).send({message: 'without permission'})
      }

  })

}

/**
 * @api {get} https://health29.org/api/group/medications/:groupName Get medications
 * @apiName getMedicationsGroup
 * @apiDescription This method return the medications associated with a group
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/group/medications/'+"None")
 *    .subscribe( (res : any) => {
 *      console.log('Get medications ok ');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} groupName The name of a group.  More info here:  [Get groupName](doc/#api-Groups-getGroupsNames)
 * @apiSuccess {Object} medications An object with the information abour the medications associated with the group of patients.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {"data":
 *    {
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
 * 	  ]
 *  }
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'The group does not exist'}
 * @apiSuccess (Success 202) {String} message If there is group name, it will return: "The group does not exist"
 */

function getMedicationsGroup (req, res){
	let groupId= req.params.groupId;
  Group.findOne({ '_id': groupId }, function (err, group) {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!group) return res.status(404).send({code: 208, message: 'The group does not exist'})

    var medications = {data:group.medications};
		res.status(200).send({medications})
	})
}


/**
 * @api {put} https://health29.org/api/group/medications/:groupName Update medications
 * @apiName UpdateMedicationsGroup
 * @apiPrivate
 * @apiDescription This method updates the medications associated with a group
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body =  {"medications":
 *    {
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
 * 	  ]
 *    }
 *   }
 *   this.http.put('https://health29.org/group/medications/'+userId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Update medications ok ');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId The unique identifier of the user.
 * @apiSuccess {Object} Result An object with the information about the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {message: 'Medications updated'}
 *
 */

function updateMedicationsGroup (req, res){

  let userId= crypt.decrypt(req.params.userId);
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
    if (err) return res.status(500).send({message: 'Error making the request:'})
    if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

    if(user.role == 'SuperAdmin'){

      let groupId= req.body._id;
      Group.findOneAndUpdate({_id: groupId}, {$set:{medications:req.body.medications}}, function(err, groupUpdated){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        res.status(200).send({message: 'Medications updated'})
      })

    }else{
        res.status(401).send({message: 'without permission'})
      }

  })
}



/*function getPromsGroup (req, res){
	let groupName= req.params.groupName;
  Group.findOne({ 'name': groupName }, function (err, group) {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!group) return res.status(404).send({code: 208, message: 'The group does not exist'})

    //var proms = {data:group.proms};
		res.status(200).send(group.proms)
	})
}

function updatePromsGroup (req, res){

  let userId= crypt.decrypt(req.params.userId);
  User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
    if (err) return res.status(500).send({message: 'Error making the request:'})
    if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

    if(user.role == 'SuperAdmin'){

      let groupName= req.body.name;
      Group.findOneAndUpdate({name: groupName}, {$set:{proms:req.body.proms}}, {new: true}, function(err, groupUpdated){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        res.status(200).send({message: 'Proms updated'})
      })

    }else{
        res.status(401).send({message: 'without permission'})
      }

  })

}*/

module.exports = {
  getGroupsNames,
	getGroups,
  getGroupAdmin,
	getGroup,
	saveGroup,
	updateGroup,
	deleteGroup,
  getPhenotypeGroup,
  updatePhenotypeGroup,
  getMedicationsGroup,
  updateMedicationsGroup
}
