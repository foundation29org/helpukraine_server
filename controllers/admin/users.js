// functions for each call of the api on admin. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Patient = require('../../models/patient')
const crypt = require('../../services/crypt')


/**
 * @api {get} https://health29.org/api/admin/users/ Request list of users of the group.
 * @apiName getUsers
 * @apiPrivate
 * @apiDescription This method request the list of users of the group.
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var param = <group_name>
 *   this.http.get('https://health29.org/api/admin/users/'+param)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of the users of the group ok');
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
 * @apiParam {Object} groupName The name of the group.
 * @apiSuccess {Object[]} Result Returns list objects with the information of the users and patients subscribed to group alerts/notifications.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 * 		{
 * 			"userId": <userId>,
 * 			"userName": <userName>,
 * 			"email": <userEmail>,
 * 			"signupDate": <signupDate>,
 * 			"blockedaccount": <blockedaccount>,
 * 			"patientId":<idencrypt>,
 * 			"patientName": <patientName>,
 * 			"surname": <patientSurname>,
 * 			"death": <boolean death>,
 * 			"notes": <patient notes>
 * 		}
 * 	]
 *
 *
 */

function getUsers (req, res){
	let group = req.params.groupName;
	console.log(group);
	Patient.find({group: group},(err, patients) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		console.log(patients);
		var temppatients = patients;
		var totalPatients = 0;
		var patientsAddded = 0;
		var countpos = 0;
		var listPatients = [];
		if(!patients){
			res.status(200).send(listPatients)
		}else{
			if(patients.length==0){
				res.status(200).send(listPatients)
			}else{
				for(var i = 0; i < patients.length; i++) {
					User.findOne({"_id": patients[i].createdBy},(err, user) => {
						countpos++;
						if(user){
							totalPatients = totalPatients + 1;
								
								var enc = false;
								var patientName = '';
								var surname = '';
								var gender = '';
								var birthDate = '';
								var street = '';
								var postalCode = '';
								var city = '';
								var province = '';
								var lat = '';
								var lng = '';
								var status = '';
								var notes = '';
								var needs = '';
								var country = '';
								var idencrypt = '';
								var idUserDecrypt = user._id.toString();
								var userId = crypt.encrypt(idUserDecrypt);
								for(var j = 0; j < temppatients.length && !enc; j++) {
									if((temppatients[j].createdBy).toString() === (user._id).toString()){
										patientName = temppatients[j].patientName
										surname = temppatients[j].surname
										gender = temppatients[j].gender
										birthDate = temppatients[j].birthDate
										street = temppatients[j].street
										postalCode = temppatients[j].postalCode
										city = temppatients[j].city
										province = temppatients[j].province
										country = temppatients[j].country
										lat = temppatients[j].lat
										lng = temppatients[j].lng
										status = temppatients[j].status
										notes = temppatients[j].notes
										needs = temppatients[j].needs
										var idPatientrDecrypt = temppatients[j]._id.toString();
										var idencrypt= crypt.encrypt(idPatientrDecrypt);
										enc = true;
									}
								}
								listPatients.push({userId: userId, userName: user.userName, email: user.email, phone: user.phone, countryselectedPhoneCode: user.countryselectedPhoneCode, signupDate: user.signupDate, lastLogin: user.lastLogin, blockedaccount: user.blockedaccount, patientId:idencrypt, patientName: patientName, surname: surname, gender: gender, birthDate: birthDate, street: street, postalCode: postalCode, city: city, province: province, country: country, lat: lat, lng: lng, status: status, notes: notes, needs: needs, subgroup: user.subgroup});
								patientsAddded++;
						}else{
							listPatients.push({});
						}
						if(patientsAddded==totalPatients && countpos==patients.length){
							var result = [];
							for(var j = 0; j < listPatients.length; j++) {
								if(listPatients[j].patientId!=undefined){
									result.push(listPatients[j]);
								}
							}
							res.status(200).send(result)
						}
					})
				}
			}
		}



	})

}

/**
 * @api {post} https://health29.org/api/admin/patients/ Set patient dead
 * @apiPrivate
 * @apiName setDeadPatient
 * @apiDescription This method set the value of dead for a patient.
 * @apiGroup Patients
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var patientId = <patientId>
 *   var body = {death: <death_value>}
 *   this.http.post('https://health29.org/api/admin/patients/'+patientId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Set value of dead for patient ok');
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
 * @apiParam {String} patientId The unique identifier for the patient.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'Dead updated',
 * 		}
 *
 */
function setDeadPatient (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	Patient.findByIdAndUpdate(patientId, { death: req.body.death }, {select: '-createdBy', new: true}, (err,patientUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ message: 'Dead updated'})
	})

}

/**
 * @api {post} https://health29.org/api/admin/users/subgroup/ Set subgroup user
 * @apiPrivate
 * @apiName setSubgroupUser
 * @apiDescription This method set the value of subgroup for a user.
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {subgroup: <subgroup_value>}
 *   this.http.post('https://health29.org/api/admin/users/subgroup/'+userId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Set value of subgroup for user ok');
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
 * @apiParam {String} userId The unique identifier for the user.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'Subgroup updated',
 * 		}
 *
 */
function setSubgroupUser (req, res){
	let userId= crypt.decrypt(req.params.userId);
	User.findByIdAndUpdate(userId, { subgroup: req.body.subgroup }, {select: '-createdBy', new: true}, (err,userUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ message: 'Subgroup updated'})
	})

}

/**
 * @api {post} https://health29.org/api/admin/users/state/ Set blockedaccount state for a user
 * @apiPrivate
 * @apiName setStateUser
 * @apiDescription This method set the value of blockedaccount state for a user.
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {blockedaccount: <blockedaccount_value>}
 *   this.http.post('https://health29.org/api/admin/users/state/'+userId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Set value of blockedaccount state for a user ok');
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
 * @apiParam {String} userId The unique identifier for the user.
 * @apiSuccess {Object} Result Returns the user updated
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"email": <user email>,
 * 			"password": <user password encrypted>,
 * 			"role": 'User',
 * 			"group": <group name>,
 * 			"confirmed": true,
 * 			"confirmationCode": <confirmationCode>,
 * 			"signupDate": <signupDate>,
 * 			"lastLogin": <lastLogin>,
 * 			"userName": <userName>,
 * 			"loginAttempts": 0,
 * 			"lang":'en',
 * 			"massunit": 'kg',
 * 			"lengthunit": 'cm',
 * 			"blockedaccount": {type: Boolean, default: false},
 * 			"platform": "H29",
 * 			"subgroup": 0
 * 		}
 *
 *
 */
function setStateUser (req, res){
	let userId= crypt.decrypt(req.params.userId);
	let update = req.body
	User.findByIdAndUpdate(userId, { blockedaccount: req.body.blockedaccount }, {new: true}, (err, userUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ user: userUpdated})
	})

}


module.exports = {
	getUsers,
	setDeadPatient,
	setSubgroupUser,
	setStateUser
}
