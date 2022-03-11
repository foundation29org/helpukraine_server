// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Medication = require('../../models/medication')
const User = require('../../models/user')
const Patient = require('../../models/patient')
const crypt = require('../../services/crypt')

const Feel = require('../../models/feel')
const Phenotype = require('../../models/phenotype')
const PhenotypeHistory = require('../../models/phenotype-history')
const Seizures = require('../../models/seizures')
const Weight = require('../../models/weight')
const Height = require('../../models/height')
const Prom = require('../../models/prom')

const f29azureService = require("../../services/f29azure")

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
					var patientIdCrypt=crypt.encrypt(u._id.toString());
					var containerName=patientIdCrypt.substr(1).toString();
					deleteMedication(patientId);
					deleteSeizures(patientId);
					deleteWeight(patientId);
					deleteHeight(patientId);
					deleteFeel(patientId);
					deletePhenotype(patientId);
					deletePhenotypeHistory(patientId);
					deleteProms(patientId);
					deletePatient(res, patientId, containerName, userId);
				});
				//deleteUser(res, userId);
			})
		}else{
			res.status(200).send({message: `fail`})
		}
	})
	

	/*User.findById(userId, (err, user) => {
	})*/
}

function deleteMedication (patientId){
	Medication.find({ 'createdBy': patientId }, (err, medications) => {
		if (err) console.log({message: `Error deleting the medications: ${err}`})
		medications.forEach(function(medication) {
			medication.remove(err => {
				if(err) console.log({message: `Error deleting the medications: ${err}`})
			})
		});
		console.log('delete medications');
	})
}

function deleteSeizures (patientId){
	Seizures.find({ 'createdBy': patientId }, (err, seizures) => {
		if (err) console.log({message: `Error deleting the seizures: ${err}`})
		seizures.forEach(function(seizure) {
			seizure.remove(err => {
				if(err) console.log({message: `Error deleting the seizures: ${err}`})
			})
		});
		console.log('delete seizures');
	})
}

function deleteWeight (patientId){
	Weight.find({ 'createdBy': patientId }, (err, weights) => {
		if (err) console.log({message: `Error deleting the weights: ${err}`})
		weights.forEach(function(weight) {
			weight.remove(err => {
				if(err) console.log({message: `Error deleting the weights: ${err}`})
			})
		});
		console.log('delete weights');
	})
}

function deleteHeight (patientId){
	Height.find({ 'createdBy': patientId }, (err, heights) => {
		if (err) console.log({message: `Error deleting the heights: ${err}`})
		heights.forEach(function(height) {
			height.remove(err => {
				if(err) console.log({message: `Error deleting the heights: ${err}`})
			})
		});
		console.log('delete heights');
	})
}

function deleteFeel (patientId){
	Feel.find({ 'createdBy': patientId }, (err, feels) => {
		if (err) console.log({message: `Error deleting the feels: ${err}`})
		feels.forEach(function(feel) {
			feel.remove(err => {
				if(err) console.log({message: `Error deleting the feels: ${err}`})
			})
		});
		console.log('delete feels');
	})
}

function deletePhenotype (patientId){
	Phenotype.find({ 'createdBy': patientId }, (err, phenotypes) => {
		if (err) console.log({message: `Error deleting the phenotype: ${err}`})
		phenotypes.forEach(function(phenotype) {
			phenotype.remove(err => {
				if(err) console.log({message: `Error deleting the phenotype: ${err}`})
				
			})
		});
		console.log('delete phenotype');
	})
}

function deletePhenotypeHistory (patientId){
	PhenotypeHistory.find({ 'createdBy': patientId }, (err, phenotypeHistories) => {
		if (err) console.log({message: `Error deleting the phenotypeHistory: ${err}`})
			phenotypeHistories.forEach(function(phenotypeHistory) {
				phenotypeHistory.remove(err => {
					if(err) console.log({message: `Error deleting the phenotypeHistory: ${err}`})
				})
			});
		console.log('delete phenotypeHistory');
	})
}

function deleteProms (patientId){
	Prom.find({ 'createdBy': patientId }, (err, proms) => {
		if (err) console.log({message: `Error deleting the proms: ${err}`})
		proms.forEach(function(prom) {
			prom.remove(err => {
				if(err) console.log({message: `Error deleting the proms: ${err}`})
			})
		});
		console.log('delete proms');
	})
}

function deletePatient (res, patientId, containerName, userId){
	Patient.findById(patientId, (err, patient) => {
		if (err) return res.status(500).send({message: `Error deleting the case: ${err}`})
		if(patient){
			patient.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the case: ${err}`})
				f29azureService.deleteContainers(containerName)
				savePatient(userId);
				res.status(200).send({message: `The case has been eliminated`})
			})
		}else{
				f29azureService.deleteContainers(containerName);
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
		let containerName = (idencrypt).substr(1);
		var result = await f29azureService.createContainers(containerName);
		if (result) {
			console.log('Patient created' + patientInfo);
			//res.status(200).send({message: 'Patient created', patientInfo})
		} else {
			deletePatientAndCreateOther(patientStored._id, userId);
		}

	})
}

function deletePatientAndCreateOther(patientId, userId) {

	Patient.findById(patientId, (err, patient) => {
		if (err) return console.log({ message: `Error deleting the patient: ${err}` })
		if (patient) {
			patient.remove(err => {
				savePatient(userId)
			})
		} else {
			savePatient(userId)
		}
	})
}

module.exports = {
	deleteAccount
}
