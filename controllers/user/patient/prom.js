// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Prom = require('../../../models/prom')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')

function getPromsDates(req, res) {
	let patientId = crypt.decrypt(req.params.patientId);
	var period = 7;
	if (req.body.rangeDate == 'quarter') {
		period = 30;
	} else if (req.body.rangeDate == 'year') {
		period = 60;
	}
	var actualDate = new Date();
	var actualDateTime = actualDate.getTime();

	var pastDate = new Date(actualDate);
	pastDate.setDate(pastDate.getDate() - period);
	var pastDateDateTime = pastDate.getTime();
	//Prom.find({createdBy: patientId}).sort({ start : 'desc'}).exec(function(err, eventsdb){
	Prom.find({ "createdBy": patientId }, { "createdBy": false }, (err, eventsdb) => {
		//Prom.find({"createdBy": patientId, "date":{"$gte": pastDateDateTime, "$lt": actualDateTime}}, {"createdBy" : false},(err, eventsdb) => {
		if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
		var listEventsdb = [];

		eventsdb.forEach(function (eventdb, error) {
			/*if (eventdb.idProm == '7' || eventdb.idProm == '11') {
				if (eventdb.date < actualDateTime && eventdb.date > pastDateDateTime) {
					listEventsdb.push(eventdb);
				}
			} else {
				listEventsdb.push(eventdb);
			}*/
			listEventsdb.push(eventdb);

		});
		var respTask = listEventsdb.length;
		//res.status(200).send((respTask).toString());
		res.status(200).send(listEventsdb)
	});
}

function getProms(req, res) {
	let patientId = crypt.decrypt(req.params.patientId);
	//Prom.find({createdBy: patientId}).sort({ start : 'desc'}).exec(function(err, eventsdb){
	Prom.find({ "createdBy": patientId }, { "createdBy": false }, (err, eventsdb) => {
		if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
		var listEventsdb = [];

		eventsdb.forEach(function (eventdb) {
			listEventsdb.push(eventdb);
		});
		res.status(200).send(listEventsdb)
	});
}


function saveProm(req, res) {
	let patientId = crypt.decrypt(req.params.patientId);
	let eventdb = new Prom()
	eventdb.idProm = req.body.idProm;
	eventdb.data = req.body.data;
	eventdb.other = req.body.other;
	eventdb.createdBy = patientId

	// when you save, returns an id in eventdbStored to access that Prom
	eventdb.save((err, eventdbStored) => {
		if (err) {
			res.status(500).send({ message: `Failed to save in the database: ${err} ` })
		}
		if (eventdbStored) {
			var copyprom = JSON.parse(JSON.stringify(eventdbStored));
			delete copyprom.createdBy;
			res.status(200).send({ message: 'Done', prom: copyprom })
		}
	})
}

async function savesProm(req, res) {
	let patientId = crypt.decrypt(req.params.patientId);
	let proms = req.body;
	try {
		var data = await saveData(proms, patientId);
		return res.status(200).send({ message: 'Exported data', data: data })
	} catch (e) {
		console.error("Error: ", e);
		return res.status(200).send({ message: 'Error', data: e })
	}
}


async function saveData(proms, patientId) {
	return new Promise(async function (resolve, reject) {
		var promises = [];
		if (proms.length > 0) {
			for (var index in proms) {
				if (proms[index].data != null) {
					if (proms[index]._id) {
						promises.push(updateOneProm(proms[index], patientId));
					} else {
						promises.push(saveOneProm(proms[index], patientId));
					}

				}

			}
		} else {
			resolve('No data')
		}
		await Promise.all(promises)
			.then(async function (data) {
				console.log(data);
				console.log('termina')
				resolve('termina')
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});

	});
}


function updateOneProm(prom, patientId) {
	return new Promise(async function (resolve, reject) {
		let promId = prom._id
		let update = prom

		Prom.findByIdAndUpdate(promId, update, { select: '-createdBy', new: true }, (err, promUpdated) => {
			if (err) {
				resolve('fail')
			}
			resolve('done')

		})
	});
}

async function saveOneProm(prom, patientId) {
	return new Promise(async function (resolve, reject) {
		let eventdb = new Prom()
		eventdb.idProm = prom.idProm;
		eventdb.data = prom.data;
		eventdb.other = prom.other;
		eventdb.createdBy = patientId
		// when you save, returns an id in eventdbStored to access that Prom
		eventdb.save((err, eventdbStored) => {
			if (err) {
				resolve('fail')
			}
			if (eventdbStored) {
				var copyprom = JSON.parse(JSON.stringify(eventdbStored));
				delete copyprom.createdBy;
				resolve('done')
			}
		})
	});
}

function updateProm(req, res) {
	let promId = req.params.promId;
	let update = req.body

	Prom.findByIdAndUpdate(promId, update, { select: '-createdBy', new: true }, (err, promUpdated) => {
		if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
		var copyprom = {};
		if (promUpdated) {
			copyprom = JSON.parse(JSON.stringify(promUpdated));
			delete copyprom.createdBy;
		}
		res.status(200).send({ message: 'prom updated', prom: copyprom })

	})
}

function deleteProm(req, res) {
	let promId = req.params.promId

	Prom.findById(promId, (err, promdb) => {
		if (err) return res.status(500).send({ message: `Error deleting the prom: ${err}` })
		if (promdb) {
			promdb.remove(err => {
				if (err) return res.status(500).send({ message: `Error deleting the prom: ${err}` })
				res.status(200).send({ message: `The prom has been deleted` })
			})
		} else {
			return res.status(404).send({ code: 208, message: `Error deleting the prom: ${err}` })
		}

	})
}

module.exports = {
	getPromsDates,
	getProms,
	saveProm,
	savesProm,
	updateProm,
	deleteProm
}
