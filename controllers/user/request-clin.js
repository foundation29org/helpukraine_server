// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const RequestClin = require('../../models/request-clin')
const crypt = require('../../services/crypt')
const User = require('../../models/user')
const serviceEmail = require('../../services/email')

function getRequests (req, res){
	let userId= crypt.decrypt(req.params.userId);
	RequestClin.find({"createdBy": userId}, {"createdBy" : false},(err, eventsdb) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var listEventsdb = [];

		eventsdb.forEach(function(eventdb) {
			listEventsdb.push(eventdb);
		});
		res.status(200).send(listEventsdb)
	});
}

function getRequestsAdmin (req, res){
	let group = req.params.groupName;
	console.log(group);
	RequestClin.find({group: group},(err, patients) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		
		
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
				var temppatients = patients;
				for(var i = 0; i < patients.length; i++) {
					temppatients[i].found = false;
					User.findOne({"_id": patients[i].createdBy},(err, user) => {
						countpos++;
						if(user){
							totalPatients = totalPatients + 1;
								
								var enc = false;
								var lat = '';
								var lng = '';
								var status = '';
								var needShelter = '';
								var notes = '';
								var needsOther = '';
								var othergroup = '';
								var drugs = [];
								var idencrypt = '';
								var idUserDecrypt = user._id.toString();
								var userId = crypt.encrypt(idUserDecrypt);
								for(var j = 0; j < temppatients.length && !enc; j++) {
									if((temppatients[j].createdBy).toString() === (user._id).toString() && (!temppatients[j].found)){
										temppatients[j].found = true;
										console.log('coincide');
										console.log(temppatients[j].lat);
										lat = temppatients[j].lat
										lng = temppatients[j].lng
										status = temppatients[j].status
										othergroup = temppatients[j].othergroup
										needShelter = temppatients[j].needShelter
										notes = temppatients[j].notes
										needsOther = temppatients[j].needsOther
										drugs = temppatients[j].drugs
										var idPatientrDecrypt = temppatients[j]._id.toString();
										var idencrypt= crypt.encrypt(idPatientrDecrypt);
										enc = true;
									}
								}
								var userName = user.userName+' '+user.lastName;
								listPatients.push({userId: userId, userName: userName, email: user.email, lang: user.lang,phone: user.phone, countryPhoneCode: user.countryselectedPhoneCode, signupDate: user.signupDate, lastLogin: user.lastLogin, blockedaccount: user.blockedaccount, iscaregiver: user.iscaregiver, patientId:idencrypt, lat: lat, lng: lng, status: status, othergroup: othergroup, needShelter: needShelter, notes: notes, needsOther: needsOther, drugs: drugs, subgroup: user.subgroup});
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


function saveRequest (req, res){
	let userId= crypt.decrypt(req.params.userId);
	let eventdb = new RequestClin()
	eventdb.lat = req.body.lat
	eventdb.lng = req.body.lng
	eventdb.notes = req.body.notes
	eventdb.needsOther = req.body.needsOther
	eventdb.status = req.body.status
	eventdb.updateDate = req.body.updateDate
	eventdb.group = req.body.group
	eventdb.othergroup = req.body.othergroup
	eventdb.drugs = req.body.drugs
	eventdb.createdBy = userId

	// when you save, returns an id in eventdbStored to access that social-info
	eventdb.save((err, eventdbStored) => {
		if (err) {
			res.status(500).send({message: `Failed to save in the database: ${err} `})
		}
		if(eventdbStored){
			res.status(200).send({message: 'Eventdb created'});
			//podría devolver eventdbStored, pero no quiero el field createdBy, asi que hago una busqueda y que no saque ese campo
			/*Seizures.findOne({"createdBy": userId}, {"createdBy" : false }, (err, eventdb2) => {
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
				if(!eventdb2) return res.status(202).send({message: `There are no eventdb`})
				res.status(200).send({message: 'Eventdb created', eventdb: eventdb2})
			})*/
		}


	})


}

function updateRequest (req, res){
	let requestId= req.params.requestId;
	let update = req.body
	update.updateDate = Date.now();
	RequestClin.findByIdAndUpdate(requestId, update, {select: '-createdBy', new: true}, (err,eventdbUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({message: 'Request updated', eventdb: eventdbUpdated})

	})
}


function deleteRequest (req, res){
	let requestId=req.params.requestId

	RequestClin.findById(requestId, (err, eventdb) => {
		if (err) return res.status(500).send({message: `Error deleting the request: ${err}`})
		if (eventdb){
			eventdb.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the request: ${err}`})
				res.status(200).send({message: `The request has been deleted`})
			})
		}else{
			 return res.status(404).send({code: 208, message: `Error deleting the request: ${err}`})
		}

	})
}

function setChecks (req, res){

	let requestId= req.params.requestId;

	RequestClin.findByIdAndUpdate(requestId, { checks: req.body.checks }, {select: '-createdBy', new: true}, (err,patientUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

			res.status(200).send({message: 'checks changed'})

	})
}

function getChecks (req, res){

	let requestId= req.params.requestId;

	RequestClin.findById(requestId, {"_id" : false , "createdBy" : false }, (err,patient) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			res.status(200).send({checks: patient.checks})

	})
}

function setStatus (req, res){
	let requestId= crypt.decrypt(req.params.requestId);
	serviceEmail.sendMailChangeStatus(req.body.email, req.body.lang, req.body.group, req.body.statusInfo)
					.then(response => {
						console.log('Email sent' )
					})
					.catch(response => {
						console.log('Fail sending email' )
					})

	RequestClin.findByIdAndUpdate(requestId, { status: req.body.status }, {new: true}, (err,patientUpdated) => {
		if(patientUpdated){
			return res.status(200).send({message: 'Updated'})
		}else{
			console.log(err);
			return res.status(200).send({message: 'error'})
		}
	})
}

function changenotes (req, res){

	let requestId= crypt.decrypt(req.params.requestId);//crypt.decrypt(req.params.patientId);

	RequestClin.findByIdAndUpdate(requestId, { notes: req.body.notes }, {select: '-createdBy', new: true}, (err,patientUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

			res.status(200).send({message: 'notes changed'})

	})
}

function getGroupRequest (req, res){
	let userId= crypt.decrypt(req.params.userId);
	RequestClin.findOne({"createdBy": userId}, {"createdBy" : false},(err, eventsdb) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(eventsdb){
			res.status(200).send({groupId: eventsdb.group})
		}else{
			res.status(200).send({groupId: '622f83174c824c0dec16c78b'})
		}
		
	});
}


module.exports = {
	getRequests,
	getRequestsAdmin,
	saveRequest,
	updateRequest,
	deleteRequest,
	setChecks,
	getChecks,
	setStatus,
	changenotes,
	getGroupRequest
}
