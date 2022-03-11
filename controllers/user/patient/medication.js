// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Medication = require('../../../models/medication')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')

function getMedicationsDate (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	var period = 31;
	if(req.body.rangeDate == 'quarter'){
		period = 90;
	}else if(req.body.rangeDate == 'year'){
		period = 365;
	}
	var actualDate = new Date();
	var actualDateTime = actualDate.getTime();

	var pastDate=new Date(actualDate);
    pastDate.setDate(pastDate.getDate() - period);
	var pastDateDateTime = pastDate.getTime();
	
	//Medication.find({createdBy: patientId}, {"createdBy" : false }).sort({ endDate : 'asc'}).exec(function(err, medications){
		Medication.find({"createdBy": patientId, $or:[ {"startDate":{"$gte": pastDateDateTime, "$lt": actualDateTime}}, {"endDate":{"$gte": pastDateDateTime, "$lt": actualDateTime}}, {"endDate":null}]}, {"createdBy" : false},(err, medications) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listMedications = [];

		medications.forEach(function(medication) {
			listMedications.push(medication);
		});
		res.status(200).send(listMedications)
	});
}

/**
 * @api {get} https://health29.org/api/medications/:patientId Get medication list
 * @apiName getMedications
 * @apiDescription This method read Medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/medications/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
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
 * @apiSuccess {String} _id For each medication: Medication unique ID.
 * @apiSuccess {String} dose For each medication: Other medication dose.
 * @apiSuccess {String} drug For each medication: Other medication name.
 * @apiSuccess {String} notes For each medication: Medication notes.
 * @apiSuccess {Date} endDate For each medication: on which the patient ends with other medication.
 * @apiSuccess {Date} startDate For each medication: on which the patient starts with other medication.
 * @apiSuccess {Object} sideEffects For each medication: Medication side Effects.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		}
 * ]
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no medication'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medication"
 */
function getMedications (req, res){
	let patientId= crypt.decrypt(req.params.patientId);

	//Medication.find({createdBy: patientId}, {"createdBy" : false }).sort({ endDate : 'asc'}).exec(function(err, medications){
		Medication.find({"createdBy": patientId}, {"createdBy" : false},(err, medications) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listMedications = [];

		medications.forEach(function(medication) {
			listMedications.push(medication);
		});
		res.status(200).send(listMedications)
	});
}

/**
 * @api {get} https://health29.org/api/medication/:medicationId Get medication
 * @apiName getMedication
 * @apiDescription This method read Medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/medication/'+medicationId)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiSuccess {String} _id Medication unique ID.
 * @apiSuccess {String} dose Other medication dose.
 * @apiSuccess {String} drug  Other medication name.
 * @apiSuccess {String} notes Medication notes.
 * @apiSuccess {Date} endDate on which the patient ends with other medication.
 * @apiSuccess {Date} startDate on which the patient starts with other medication.
 * @apiSuccess {Object} sideEffects Medication side Effects.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		}
 * HTTP/1.1 202 OK
 * {message: 'There are no medication'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medication"
 */
function getMedication (req, res){
	//let medicationId= crypt.decrypt(req.params.medicationId);
	Medication.findOne({"_id": req.params.medicationId}, {"createdBy" : false }, (err, medication) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!medication) return res.status(202).send({message: 'There are no medication'})
		res.status(200).send({medication})
	})
}

/**
 * @api {post} https://health29.org/api/medication/:patientId New medication
 * @apiName saveMedication
 * @apiDescription This method create a medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication ={
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		};
 *   this.http.post('https://health29.org/api/medication/'+patientId, medication)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
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
 * @apiParam (body) {Object} value Patient's medication.
 * @apiSuccess {String} medication Patient's medication.
 * @apiSuccess {String} message If the medication has been created correctly, it returns the message 'Medication created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		"medication":
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		},
 * 		"message": "Medication created"
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no medication'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medication"
 */
function saveMedication (req, res){
	let patientId= crypt.decrypt(req.params.patientId);

	
	Medication.find({"createdBy": patientId, "drug": req.body.drug},(err, medications) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var listMedications = [];
		var failmsg= '';
		var bsd = new Date(req.body.startDate);
		var bed = new Date(req.body.endDate);

		medications.forEach(function(medication) {

			var msd = new Date(medication.startDate);
			var med = new Date(medication.endDate);

			if(!medication.endDate && !req.body.endDate){
				failmsg = 'imposible';
			}
			if(!medication.endDate && req.body.endDate){
					if(msd.getTime() <=bsd.getTime() || msd.getTime() <=bed.getTime() ){
						failmsg = 'imposible';
					}
			}
			if(!req.body.endDate && medication.endDate){
					if(bsd.getTime()<=med.getTime()){
						failmsg = 'imposible';
					}
			}

			if(medication.endDate && req.body.endDate){
				if((med.getTime()>=bsd.getTime() && msd.getTime()<=bed.getTime()) || (med.getTime()>=bsd.getTime() && med.getTime()<=bed.getTime()) || (msd.getTime()<=bed.getTime() && med.getTime()>=bed.getTime())){
					failmsg = 'imposible';
				}
			}
		/*	var result = new Date(req.body.startDate);
		  result.setDate(result.getDate() -1);*/

		});

		if(failmsg != 'imposible'){
			let medication = new Medication()
			medication.drug = req.body.drug
			medication.dose = req.body.dose
			medication.startDate = req.body.startDate
			medication.endDate = req.body.endDate
			medication.sideEffects = req.body.sideEffects
      medication.schedule = req.body.schedule
      medication.otherSchedule = req.body.otherSchedule
			medication.adverseEffects = req.body.adverseEffects
			medication.compassionateUse = req.body.compassionateUse
			medication.notes = req.body.notes
			medication.freesideEffects = req.body.freesideEffects
			medication.createdBy = patientId

			// when you save, returns an id in medicationStored to access that social-info
			medication.save((err, medicationStored) => {
				if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})

				var copymedication = JSON.parse(JSON.stringify(medicationStored));
				delete copymedication.createdBy;
				res.status(200).send({message: 'Dose created', medication: copymedication})

			})
		}else{
				res.status(200).send({message: 'fail', medication: []})
		}


	});


}

/**
 * @api {put} https://health29.org/api/medication/:medicationId Update medication
 * @apiName updateMedication
 * @apiDescription This method update the medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication = {
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *	 };
 *   this.http.put('https://health29.org/api/medication/'+medicationId, medication)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiParam (body) {Object} value Patient's medication.
 * @apiSuccess {String} medication Patient's medication.
 * @apiSuccess {String} message If the medication has been updated correctly, it returns the message 'Medication updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		"medication":
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		},
 * 		"message": "Medication updated"
 * }
 *
 */
function updateMedication (req, res){
	let medicationId= req.params.medicationId;
	let update = req.body

	Medication.findByIdAndUpdate(medicationId, update, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
    var copymedication = {};
    if(medicationUpdated){
      copymedication = JSON.parse(JSON.stringify(medicationUpdated));
  		delete copymedication.createdBy;
    }
		res.status(200).send({message: 'Medication updated', medication: copymedication})

	})
}

/**
 * @api {delete} https://health29.org/api/medication/:medicationId Delete dose of medication
 * @apiName deleteDose
 * @apiDescription This method deletes dose of medication of a patient.
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/medication/'+medicationId)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiSuccess {String} message If the dose has been deleted correctly, it returns the message 'he dose has been eliminated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message" : 'he dose has been eliminated'
 *		}
 *
 * HTTP/1.1 202 OK
 * {message: 'The dose does not exist'}
 * @apiSuccess (Success 202) {String} message If there is no dose for the patient, it will return: "The dose does not exist"
 */
function deleteDose (req, res){
	let medicationId=req.params.medicationId

	Medication.findById(medicationId, (err, medication) => {
		if (err) return res.status(500).send({message: `Error deleting the dose: ${err}`})
		if(medication){
			medication.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the dose: ${err}`})
				res.status(200).send({message: `The dose has been eliminated`})
			})
		}else{
			 return res.status(202).send({message: 'The dose does not exist'})
		}
	})
}

/**
 * @api {get} https://health29.org/api/medications/all/:drugNameAndPatient Get medication list by name
 * @apiName getAllMedicationByNameForPatient
 * @apiDescription This method read Medication of a patient by name of medication
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/medications/all/'+drugName-code-PatientId)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} drugName-code-PatientId Patient unique ID and name of the medication/drug.
 * @apiSuccess {String} _id For each medication: Medication unique ID.
 * @apiSuccess {String} dose For each medication: Other medication dose.
 * @apiSuccess {String} drug For each medication: Other medication name.
 * @apiSuccess {String} notes For each medication: Medication notes.
 * @apiSuccess {Date} endDate For each medication: on which the patient ends with other medication.
 * @apiSuccess {Date} startDate For each medication: on which the patient starts with other medication.
 * @apiSuccess {Object} sideEffects For each medication: Medication side Effects.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		}
 * ]
 *
 * HTTP/1.1 202 OK
 * {message: 'No medications found'}
 * @apiSuccess (Success 202) {String} message If there is no medication with the name provided for the patient, it will return: "TNo medications found"
 */
function getAllMedicationByNameForPatient(req,res){
	var params= req.params.drugNameAndPatient;
	params = params.split("-code-");
	let drugName= params[0];
	let patientId= crypt.decrypt(params[1]);
	Medication.find({createdBy: patientId, drug: drugName}, {"createdBy" : false },(err, medications) => {
		if (err) return res.status(500).send({message: `Error deleting the medication: ${err}`})
		if(medications) return res.status(200).send({medications})
		else if (!medications) res.status(200).send({message: `No medications found`})

	})
}

/**
 * @api {delete} https://health29.org/api//medications/:drugNameAndPatient Delete medication of a patient by name
 * @apiName deleteMedication
 * @apiDescription This method deletes a medication of a patient by name.
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org//medications/'+drugName-code-PatientId)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} drugName-code-PatientId Medication and patient unique ID.
 * @apiSuccess {String} message If the medication has been deleted correctly, it returns the message 'The medication has been eliminated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message" : 'The medication has been eliminated'
 *		}
 *
 */
function deleteMedication (req, res){
	var params= req.params.drugNameAndPatient;
	params = params.split("-code-");
	let drugName= params[0];
	let patientId= crypt.decrypt(params[1]);
	Medication.find({createdBy: patientId, drug: drugName},(err, medications) => {
		if (err) return res.status(500).send({message: `Error deleting the medication: ${err}`})

		var i = 0;

		medications.forEach(function(medication) {
			medication.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the medication: ${err}`})

				i++;
				if(i==medications.length){
						res.status(200).send({message: `The medication has been eliminated`})
				}
			})
		});


	})
}

/**
 * @api {delete} https://health29.org/api/medications/update/:PatientIdAndMedicationId Delete medication input for a patient by identifier and update previous if exists
 * @apiName deleteMedicationByIDAndUpdateStateForThePrevious
 * @apiDescription This method delete medication input for a patient by identifier and update state to current taking for the previous input if exists
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/medications/update/'+PatientId-code-MedicationId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete medication and update previous if exists ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId-code-medicationId Patient and Other medication unique IDs
 * @apiSuccess {String} message If Other medication has been deleted correctly and there is not any medication previous, it returns the message 'The medication has been eliminated and there are not other medications'.
 * 	If Other medication has been deleted correctly and there is a medication previous, it returns the message 'Medication has been eliminated, and previous has been updated to current taking'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "message":"Medication has been eliminated, and previous has been updated to current taking",
 *   }
 */
function deleteMedicationByIDAndUpdateStateForThePrevious(req,res){
	let params = req.params.PatientIdAndMedicationId;
	params = params.split("-code-");
	let patientId = crypt.decrypt(params[0]);
	let medicationId = params[1];

	Medication.findById(medicationId,(err,medicationfound)=>{
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if (medicationfound){
			// Buscar todas las que tengan el mismo medication drug
			let drug = medicationfound.drug;
			Medication.find({drug:drug, createdBy:patientId},(err,othermedication)=>{
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})

				if(othermedication.length>0){
					// No se ha encontrado ninguna otra, solo con la que se está trabajando
					if(othermedication.length==1){
						// Borro la medicacion de entrada segun el Id dado
						medicationfound.remove(err => {
							if(err) return res.status(500).send({message: `Error deleting the medication: ${err}`});
							res.status(200).send({message: `The medication has been eliminated and there are not other medications`})
						});
					}
					// Se han encontrado otras
					else{
						let lastEndDate = othermedication[0].endDate;
						let medicationToUpdate = othermedication[0];

						// Miro cual es la que tiene fecha mas actual
						// Me quedo con la que tiene fecha más actual
						for (var i =0;i<othermedication.length;i++){
							if(othermedication[i].endDate>lastEndDate){
								lastEndDate = othermedication[i].endDate;
								medicationToUpdate = othermedication[i]
							}
						}

						// Borro la medicacion de entrada segun el Id dado
						medicationfound.remove(err => {
							if(err) return res.status(500).send({message: `Error deleting the medication: ${err}`})
							//res.status(200).send({message: `The medication has been eliminated`})
							// Actualizo la medicacion con fecha mas actual a current taking
							medicationToUpdate.endDate=null;
							Medication.findByIdAndUpdate(medicationToUpdate._id, medicationToUpdate, (err,medicationUpdated) => {
								if (err) return res.status(500).send({message: `Error making the request: ${err}`})

								var copymedication = JSON.parse(JSON.stringify(medicationUpdated));
								delete copymedication.createdBy;
								res.status(200).send({message: 'Medication has been eliminated, and previous has been updated to current taking', medication: copymedication})

							})
						})


					}

				}
			})
		}
		else{
			return res.status(200).send({message:'medication not found'})
		}
	})

}

/**
 * @api {put} https://health29.org/api/medication/newdose/:medicationIdAndPatient Update medication dose
 * @apiName newDose
 * @apiDescription This method updates the dose for a medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication ={
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		};
 *   this.http.put('https://health29.org/api/medication/newdose/'+medicationId-code-Patient, medication)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId-code-Patient Medication and Patient unique ID.
 * @apiParam (body) {Object} value Patient's medication.
 * @apiSuccess {String} medication Patient's medication.
 * @apiSuccess {String} message If the dose of medication has been created correctly, it returns the message 'Dose changed'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		"medication":
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		},
 * 		"message": "Dose changed"
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no medication'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medication"
 */
function newDose (req, res){

	var params= req.params.medicationIdAndPatient;
	params = params.split("-code-");
	let medicationId= params[0];


	var result = new Date(req.body.startDate);
  result.setDate(result.getDate() -1);

	Medication.findByIdAndUpdate(medicationId, { endDate: result }, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		let patientId= crypt.decrypt(params[1]);
		let medication = new Medication()
		medication.drug = req.body.drug
		medication.dose = req.body.dose
		medication.startDate = req.body.startDate
		medication.endDate = null;
		medication.sideEffects = req.body.sideEffects
    medication.schedule = req.body.schedule
    medication.otherSchedule = req.body.otherSchedule
		medication.adverseEffects = req.body.adverseEffects
		medication.compassionateUse = req.body.compassionateUse
		medication.notes = req.body.notes
		medication.freesideEffects = req.body.freesideEffects
		medication.createdBy = patientId

		// when you save, returns an id in medicationStored to access that social-info
		medication.save((err, medicationStored) => {
			if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
			var copymedication = JSON.parse(JSON.stringify(medicationStored));
			delete copymedication.createdBy;
			res.status(200).send({message: 'Dose changed', medication: copymedication})

		})

	})
}

/**
 * @api {put} https://health29.org/api/medication/stoptaking/:medicationId Stop taking medication
 * @apiName stoptaking
 * @apiDescription This method updates the end date of a dose for a medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication ={
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			}
 *	 };
 *   this.http.put('https://health29.org/api/medication/stoptaking/'+medicationId, medication)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiParam (body) {Object} value Patient's medication.
 * @apiSuccess {String} medication Patient's medication.
 * @apiSuccess {String} message If the dose of medication has been updated correctly, it returns the message 'stop takin the drug'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		"medication":
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		},
 * 		"message": "stop takin the drug"
 * }
 *
 */
function stoptaking (req, res){

	let medicationId= req.params.medicationId;

	Medication.findByIdAndUpdate(medicationId, { endDate: req.body.startDate }, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

			res.status(200).send({message: 'stop takin the drug', medication: medicationUpdated})

	})
}

/**
 * @api {put} https://health29.org/api/medication/changenotes/:medicationId Change notes of a medication
 * @apiName changenotes
 * @apiDescription This method updates the notes of a dose for a medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication ={"notes":"note1"};
 *   this.http.put('https://health29.org/api/medication/changenotes/'+medicationId, medication)
 *    .subscribe( (res : any) => {
 *      console.log('Change notes ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiParam (body) {Object} value Patient's medication.
 * @apiSuccess {String} medication Patient's medication.
 * @apiSuccess {String} message If the dose of medication has been updated correctly, it returns the message 'stop takin the drug'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		"medication":
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects":{}
 *		},
 * 		"message": "notes changed"
 * }
 *
 */
function changenotes (req, res){

	let medicationId= req.params.medicationId;

	Medication.findByIdAndUpdate(medicationId, { notes: req.body.notes }, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

			res.status(200).send({message: 'notes changed', medication: medicationUpdated})

	})
}

/**
 * @api {put} https://health29.org/api/medication/sideeffect/:medicationId Change side effect of a medication
 * @apiName sideeffect
 * @apiDescription This method updates the side effect of a dose for a medication of a patient
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication ={"sideEffects":["Cushingoid","Weight gain"]};
 *   this.http.put('https://health29.org/api/medication/sideeffect/'+medicationId, medication)
 *    .subscribe( (res : any) => {
 *      console.log('Change side effect ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiParam (body) {Object} value Patient's medication.
 * @apiSuccess {String} medication Patient's medication.
 * @apiSuccess {String} message If the dose of medication has been updated correctly, it returns the message 'stop takin the drug'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		"medication":
 * 		{
 * 			"_id" : <medicationId>,
 * 			"dose" : "32",
 * 			"drug" : "Endocrinology - Metformin",
 * 			"notes":"note1",
 * 			"endDate" : null,
 * 			"startDate" : {
 * 				"$date" : 1610406000000
 * 			},
 * 			"sideEffects": ["Cushingoid","Weight gain"]
 *		},
 * 		"message": "notes changed"
 * }
 *
 */
function sideeffect (req, res){

	let medicationId= req.params.medicationId;
	if(req.body.sideEffects!=null){
		Medication.findByIdAndUpdate(medicationId, { sideEffects: req.body.sideEffects }, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})

				res.status(200).send({message: 'sideEffects changed', medication: medicationUpdated})

		})
	}else{
		Medication.findByIdAndUpdate(medicationId, { freesideEffects: req.body.freesideEffects }, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})

				res.status(200).send({message: 'sideEffects changed', medication: medicationUpdated})

		})
	}

}

module.exports = {
	getMedicationsDate,
	getMedications,
	getMedication,
	saveMedication,
	updateMedication,
	deleteDose,
	getAllMedicationByNameForPatient,
	deleteMedication,
	deleteMedicationByIDAndUpdateStateForThePrevious,
	newDose,
	stoptaking,
	changenotes,
	sideeffect
}
