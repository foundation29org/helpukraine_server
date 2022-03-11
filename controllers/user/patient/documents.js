// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Document = require('../../../models/document')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')

function getDocuments (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	//Document.find({createdBy: patientId}).sort({ start : 'desc'}).exec(function(err, eventsdb){
		Document.find({"createdBy": patientId}, {"createdBy" : false},(err, eventsdb) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var listEventsdb = [];

		eventsdb.forEach(function(eventdb) {
			listEventsdb.push(eventdb);
		});
		res.status(200).send(listEventsdb)
	});
}

function saveDocument (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	let eventdb = new Document()
	eventdb.name = req.body.name;
	eventdb.description = req.body.description;
	eventdb.url = req.body.url;
	eventdb.dateDoc = req.body.dateDoc;
	eventdb.createdBy = patientId

	// when you save, returns an id in eventdbStored to access that document
	eventdb.save((err, eventdbStored) => {
		if (err) {
			res.status(500).send({message: `Failed to save in the database: ${err} `})
		}
		if(eventdbStored){
			res.status(200).send({message: 'Done'})
		}
	})


}

function updateDocument(req, res){
	let documentId= req.params.documentId;
	let update = req.body

	Document.findByIdAndUpdate(documentId, update, {select: '-createdBy', new: true}, (err,eventdbUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({message: 'Document updated'})

	})
}

function deleteDocument (req, res){
	let documentId=req.params.documentId

	Document.findById(documentId, (err, documentdb) => {
		if (err) return res.status(500).send({message: `Error deleting the document: ${err}`})
		if (documentdb){
			documentdb.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the document: ${err}`})
				res.status(200).send({message: `The document has been deleted`})
			})
		}else{
			 return res.status(404).send({code: 208, message: `Error deleting the document: ${err}`})
		}

	})
}

module.exports = {
	getDocuments,
	saveDocument,
	updateDocument,
	deleteDocument
}
