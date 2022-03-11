// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Weight = require('../../../models/weight')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')


/**
 * @api {get} https://health29.org/api/weight/:patientId Get weight
 * @apiName getWeight
 * @apiDescription This method read Weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/weight/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('weight: '+ res.weight);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId Patient unique ID. More info here:  [Get patientId](#api-Patients-getPatientsUser)
 * @apiSuccess {String} _id Weight unique ID.
 * @apiSuccess {String} value Patient's weight.
 * @apiSuccess {Date} date on which the weight was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"weight":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *     "date":"2018-02-27T17:55:48.261Z"
 *   }
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no weight'}
 * @apiSuccess (Success 202) {String} message If there is no weight for the patient, it will return: "There are no weight"
 */

function getWeight (req, res){
	var period = 7;

	var pastDate = new Date();
	pastDate.setDate(pastDate.getDate() - period);
	var pastDateDateTime = pastDate.getTime();

	let patientId= crypt.decrypt(req.params.patientId);
	Weight.findOne({createdBy: patientId}, {"createdBy" : false }).sort({ date : 'desc'}).exec(function(err, weight){
	//Weight.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, weight) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!weight) return res.status(202).send({message: 'There are no weight'})
		if ((weight.date).getTime() < pastDateDateTime) {
			res.status(200).send({message:'old weight', weight:weight})
		}else{
			res.status(200).send({message:'updated weight', weight:weight})
		}
		
	})
}

/**
 * @api {get} https://health29.org/api/weights/:patientId Get history weight
 * @apiName getHistoryWeight
 * @apiDescription This method read History Weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/weights/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('Get History weight ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId Patient unique ID. More info here:  [Get patientId](#api-Patients-getPatientsUser)
 * @apiSuccess {String} _id Weight unique ID.
 * @apiSuccess {String} value For each weight: Patient's weight.
 * @apiSuccess {Date} date For each weight: on which the weight was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *     "date":"2018-02-27T17:55:48.261Z"
 *   }
 * ]
 *
 */

function getHistoryWeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);

	Weight.find({createdBy: patientId}, {"createdBy" : false }).sort({ date : 'asc'}).exec(function(err, weights){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listWeights = [];

		weights.forEach(function(weight) {
			listWeights.push(weight);
		});
		res.status(200).send(listWeights)
	});

}


/**
 * @api {post} https://health29.org/api/weight/:patientId New weight
 * @apiName saveWeight
 * @apiDescription This method create a weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var weight = {value: "43"};
 *   this.http.post('https://health29.org/api/weight/'+patientId, weight)
 *    .subscribe( (res : any) => {
 *      console.log('weight: '+ res.weight);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId Patient unique ID. More info here:  [Get patientId](#api-Patients-getPatientsUser)
 * @apiParam (body) {Object} value Patient's weight. You set weight
 * @apiSuccess {String} _id Weight unique ID.
 * @apiSuccess {String} value Patient's weight. You get the weight
 * @apiSuccess {String} message If the weight has been created correctly, it returns the message 'Weight created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"weight":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43"
 *   },
 * message: "Weight created"
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no weight'}
 * @apiSuccess (Success 202) {String} message If there is no weight for the patient, it will return: "There are no weight"
 */

function saveWeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	let weight = new Weight()
	weight.value = req.body.value
	weight.createdBy = patientId

	weight.save({"createdBy" : false }, (err, weightStored) => {
		if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
		res.status(200).send({message: 'Weight created', weight: weightStored})
	})

	/*Weight.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, weight2) => {
		if(!weight2){
			// when you save, returns an id in weightStored to access that social-info
			weight.save((err, weightStored) => {
				if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
				res.status(200).send({message: 'Weight created', weight: weightStored})

			})
		}else{
			return res.status(202).send({ message: 'weight exists', weight: weight2})
		}
	})*/

}

/**
 * @api {delete} https://health29.org/api/weight/:heightId Delete weight
 * @apiName deleteWeight
 * @apiDescription This method delete Weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/weight/'+weightId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete weight ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} weightId Weight unique ID.
 * @apiSuccess {String} message If the weight has been deleted correctly, it returns the message 'The weight has been eliminated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		message: "The weight has been eliminated"
 * }
 *
 */
function deleteWeight (req, res){
	let weightId=req.params.weightId

	Weight.findById(weightId, (err, weight) => {
		if (err) return res.status(500).send({message: `Error deleting the weight: ${err}`})
		if(weight){
			weight.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the weight: ${err}`})
				res.status(200).send({message: `The weight has been eliminated`})
			})
		}else{
			 return res.status(202).send({message: 'The weight does not exist'})
		}
	})
}

module.exports = {
	getWeight,
	getHistoryWeight,
	saveWeight,
	deleteWeight
}
