// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const User = require('../../models/user')
const Patient = require('../../models/patient')
const crypt = require('../../services/crypt')

function deleteAccount (req, res){
	console.log(req.body);
	req.body.email = (req.body.email).toLowerCase();
	User.getAuthenticated(req.body.email, req.body.password, function (err, user, reason) {
		if (err) return res.status(500).send({ message: err })

		// login was successful if we have a user
		if (user) {
			let userId= crypt.decrypt(req.params.userId);
			Patient.find({"createdBy": userId},(err, patients) => {
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		
				patients.forEach(function(u) {
					var patientId = u._id.toString();
					deletePatient(res, patientId, userId);
				});
				//deleteUser(res, userId);
			})
		}else{
			res.status(200).send({message: `fail`})
		}
	})
}


function deletePatient (res, patientId, userId){
	Patient.findById(patientId, (err, patient) => {
		if (err) return res.status(500).send({message: `Error deleting the case: ${err}`})
		if(patient){
			patient.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the case: ${err}`})
				savePatient(userId);
				res.status(200).send({message: `The case has been eliminated`})
			})
		}else{
				savePatient(userId);
				return res.status(202).send({message: 'The case has been eliminated'})
		}
	})
}

function deleteUser (res, userId){
	User.findById(userId, (err, user) => {
		if (err) return res.status(500).send({message: `Error deleting the case: ${err}`})
		if(user){
			user.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the case: ${err}`})
				savePatient(userId);
				res.status(200).send({message: `The case has been eliminated`})
			})
		}else{
			savePatient(userId);
			 return res.status(202).send({message: 'The case has been eliminated'})
		}
	})
}

function savePatient(userId) {
	let patient = new Patient()
	patient.createdBy = userId
	// when you save, returns an id in patientStored to access that patient
	patient.save(async (err, patientStored) => {
		if (err) console.log({ message: `Failed to save in the database: ${err} ` })
		var id = patientStored._id.toString();
		var idencrypt = crypt.encrypt(id);
		var patientInfo = { sub: idencrypt, patientName: patient.patientName, surname: patient.surname, birthDate: patient.birthDate, gender: patient.gender, country: patient.country, previousDiagnosis: patient.previousDiagnosis, avatar: patient.avatar, consentgroup: patient.consentgroup };
		console.log('Patient created' + patientInfo);

	})
}

module.exports = {
	deleteAccount
}
