// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Seizures = require('../../../models/seizures')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')

function getSeizuresDate (req, res){
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
	//Seizures.find({createdBy: patientId}).sort({ start : 'desc'}).exec(function(err, eventsdb){
	Seizures.find({"createdBy": patientId, "start":{"$gte": pastDateDateTime, "$lt": actualDateTime}}, {"createdBy" : false},(err, eventsdb) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var listEventsdb = [];

		eventsdb.forEach(function(eventdb) {
			listEventsdb.push(eventdb);
		});
		res.status(200).send(listEventsdb)
	});
}

function getSeizures (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	//Seizures.find({createdBy: patientId}).sort({ start : 'desc'}).exec(function(err, eventsdb){
	Seizures.find({"createdBy": patientId}, {"createdBy" : false},(err, eventsdb) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var listEventsdb = [];

		eventsdb.forEach(function(eventdb) {
			listEventsdb.push(eventdb);
		});
		res.status(200).send(listEventsdb)
	});
}


function saveSeizure (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	let eventdb = new Seizures()
	eventdb.type = req.body.type
	eventdb.duracion = req.body.duracion
	eventdb.state = req.body.state
	eventdb.notes = req.body.notes
	eventdb.start = req.body.start
	eventdb.GUID = req.body.GUID
	eventdb.createdBy = patientId

	// when you save, returns an id in eventdbStored to access that social-info
	eventdb.save((err, eventdbStored) => {
		if (err) {
			res.status(500).send({message: `Failed to save in the database: ${err} `})
		}
		if(eventdbStored){
			//podría devolver eventdbStored, pero no quiero el field createdBy, asi que hago una busqueda y que no saque ese campo
			Seizures.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, eventdb2) => {
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
				if(!eventdb2) return res.status(202).send({message: `There are no eventdb`})
				res.status(200).send({message: 'Eventdb created', eventdb: eventdb2})
			})
		}


	})


}

function updateSeizure (req, res){
	let seizureId= req.params.seizureId;
	let update = req.body

	Seizures.findByIdAndUpdate(seizureId, update, {select: '-createdBy', new: true}, (err,eventdbUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({message: 'Eventdb updated', eventdb: eventdbUpdated})

	})
}


function deleteSeizure (req, res){
	let seizureId=req.params.seizureId

	Seizures.findById(seizureId, (err, eventdb) => {
		if (err) return res.status(500).send({message: `Error deleting the clinicalTrial: ${err}`})
		if (eventdb){
			eventdb.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the eventdb: ${err}`})
				res.status(200).send({message: `The eventdb has been deleted`})
			})
		}else{
			 return res.status(404).send({code: 208, message: `Error deleting the eventdb: ${err}`})
		}

	})
}

async function saveMassiveSeizure (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	var promises = [];
	if (req.body.length > 0) {
		for (var i = 0; i<(req.body).length;i++){
			var actualseizure = (req.body)[i];
			promises.push(testOneSeizure(actualseizure, patientId));
		}
	}else{
		res.status(200).send({message: 'Eventdb created', eventdb: 'epa'})
	}


	await Promise.all(promises)
			.then(async function (data) {
				console.log(data);
				console.log('termina')
				res.status(200).send({message: 'Eventdb created', eventdb: 'epa'})
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});
	

}

async function testOneSeizure(actualseizure, patientId){
	var functionDone = false;
	await Seizures.findOne({'GUID': actualseizure.GUID, 'createdBy': patientId}, (err, eventdb2) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!eventdb2){
			let eventdb = new Seizures()
			eventdb.type = actualseizure.type
			eventdb.duracion = actualseizure.duracion
			eventdb.state = actualseizure.state
			eventdb.notes = actualseizure.notes
			eventdb.start = actualseizure.start
			eventdb.GUID = actualseizure.GUID
			eventdb.createdBy = patientId
			var res1 = saveOneSeizure(eventdb)
			// when you save, returns an id in eventdbStored to access that social-info
			functionDone = true;
		}else{
			functionDone = true;
		}
	})

	return functionDone
}

async function saveOneSeizure(eventdb){
	var functionDone2 = false;
	await eventdb.save((err, eventdbStored) => {
		if (err) {
			res.status(500).send({message: `Failed to save in the database: ${err} `})
		}
		functionDone2 = true;
	})
	return functionDone2;
}

module.exports = {
	getSeizuresDate,
	getSeizures,
	saveSeizure,
	updateSeizure,
	deleteSeizure,
	saveMassiveSeizure
}
