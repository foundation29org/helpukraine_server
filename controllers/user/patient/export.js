// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const User = require('../../../models/user')
const Medication = require('../../../models/medication')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')

const Feel = require('../../../models/feel')
const Phenotype = require('../../../models/phenotype')
const Prom = require('../../../models/prom')
const Seizures = require('../../../models/seizures')
const Weight = require('../../../models/weight')
const Height = require('../../../models/height')


const Group = require('../../../models/group')
const { sendEmailInfoPermissions } = require('../../../services/email')

function getData(req, res) {
	let patientId = crypt.decrypt(req.params.patientId);

	var result = {};

	Patient.findById(patientId, { "_id": false}, (err, patient) => {
		//result.push({patient:patient});

		//medication
		Medication.find({ createdBy: patientId }, { "createdBy": false, "_id": false }, (err, medications) => {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			var listMedications = [];
			medications.forEach(function (medication) {
				listMedications.push(medication);
			});
			//result.push({medication:listMedications});
			result["medication"] = listMedications;

			//Phenotype
			Phenotype.findOne({ "createdBy": patientId }, { "createdBy": false, "_id": false }, (err, phenotype) => {
				if (phenotype) {
					//result.push({phenotype:phenotype});
					result["phenotype"] = phenotype;
				}

				//Weight
				Weight.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'asc' }).exec(function (err, weights) {
					var listWeights = [];
					weights.forEach(function (weight) {
						listWeights.push(weight);
					});
					result["weights"] = listWeights;
					//Height
					Height.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'asc' }).exec(function (err, heights) {
						var listHeights = [];
						heights.forEach(function (height) {
							listHeights.push(height);
						});
						result["heights"] = listHeights;
						var userId = patient.createdBy;
						User.findById(userId, { "_id": false, "password": false, "__v": false, "confirmationCode": false, "loginAttempts": false, "confirmed": false, "role": false, "lastLogin": false }, (err, user) => {
							result["settings"] = {lengthunit: user.lengthunit, massunit: user.massunit, lang: user.lang} ;
							//Feel
							Feel.find({ "createdBy": patientId }, { "createdBy": false, "_id": false }, (err, feels) => {
								var listFeels = [];
								feels.forEach(function (feel) {
									listFeels.push(feel);
								});
								//result.push({feels:listFeels});
								result["feel"] = listFeels;

								//Proms
								Prom.find({ "createdBy": patientId }, { "createdBy": false, "_id": false }, (err, proms) => {
									var listProms = [];
									proms.forEach(function (prom) {
										listProms.push(prom);
									});
									//result.push({prom:listProms});
									result["prom"] = listProms;

									//Seizures
									Seizures.find({ createdBy: patientId }, { "createdBy": false, "_id": false }, (err, seizures) => {
										var listSeizures = [];
										seizures.forEach(function (seizure) {
											listSeizures.push(seizure);
										});
										//result.push({seizures:listSeizures});
										result["seizure"] = listSeizures;
										res.status(200).send(result)
									});
								})
							})
						})




					});

				});


			})

		})
	})




	//res.status(200).send(result)
}

async function cronSendData() {
	try {
		var groups = await geGroups();
		var data = await getInfoGroup(groups);
		console.log(data);
	} catch (e) {
		console.error("Error: ", e);
	}
}

function geGroups() {
	return new Promise(resolve => {
		var listGroups = [];
		Group.find({}, function (err, groups) {
			if (groups) {
				groups.forEach(group => {
					listGroups.push(group);
				});
			}
			resolve(listGroups);
		});
	});
}

async function getInfoGroup(groups) {
	return new Promise(async function (resolve, reject) {
		var promises = [];
		if (groups.length > 0) {
			for (var index in groups) {
				promises.push(getPatientInfo(groups[index]));
			}
		} else {
			resolve('No data')
		}
		await Promise.all(promises)
			.then(async function (data) {
				var dataRes = [];
				data.forEach(function (dataPatientsUser) {
					dataPatientsUser.forEach(function (dataPatient) {
						dataRes.push(dataPatient);
					});
				});
				console.log('termina')
				//resolve(dataRes)
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});

	});
}

async function getPatientInfo(group) {
	return new Promise(async function (resolve, reject) {

		var promises2 = [];
		await Patient.find({ "group": group.name }, (err, patientsFound) => {
			for (var indexPatient in patientsFound) {
				if (patientsFound[indexPatient].consentgroup) {
					promises2.push(getAllPatientInfo(patientsFound[indexPatient], indexPatient, group.name));
				}

			}

			Promise.all(promises2)
				.then(function (data) {
					//console.log('datos del paciente:');
					//resolve({ user: user, data: data})
					console.log(data);
					if (data.length > 0) {
						//sendEmailToAdminGroup(data);
						console.log('send email');
					}


					resolve(data)
				})
				.catch(function (err) {
					console.log('Manejar promesa rechazada (' + err + ') aquí.');
					return null;
				});

		});




	});
}


async function getAllPatientInfo(patient, index, group) {
	return new Promise(async function (resolve, reject) {
		//console.log(patient);
		let patientId = patient._id;
		var promises3 = [];
		console.log(patientId);
		promises3.push(getMedications(patientId));
		promises3.push(getPhenotype(patientId));
		promises3.push(getFeel(patientId));
		promises3.push(getProm(patientId));
		promises3.push(getSeizure(patientId));

		await Promise.all(promises3)
			.then(async function (data) {
				/* var resPatientData = [];
				 resPatientData.push({data:patient, name:"patient"});
				 resPatientData.push({info:data})*/
				let patientIdEnc = crypt.encrypt(patientId.toString());
				var patientInfo = {};
				patientInfo['medication'] = data[0];
				patientInfo['phenotype'] = data[1];
				patientInfo['feel'] = data[2];
				patientInfo['prom'] = data[3];
				patientInfo['seizure'] = data[4];
				resolve({ patientId: patientIdEnc, patientInfo: patientInfo, group: group })
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});
	});
}

async function getMedications(patientId) {
	return new Promise(async function (resolve, reject) {
		await Medication.find({ createdBy: patientId }, { "createdBy": false }).exec(function (err, medications) {
			if (err) {
				console.log(err);
				resolve(err)
			}
			//console.log('Medication done.');
			var listMedications = [];
			if (medications) {
				medications.forEach(function (medication) {
					listMedications.push(medication);
				});
			}

			resolve(listMedications);
		})
	});
}

async function getPhenotype(patientId) {
	return new Promise(async function (resolve, reject) {
		await Phenotype.findOne({ "createdBy": patientId }, { "createdBy": false }, async (err, phenotype) => {
			//console.log('Phenotype done.');
			if (phenotype) {
				resolve(phenotype);
			} else {
				resolve([]);
			}
		})
	});
}

async function getFeel(patientId) {
	return new Promise(async function (resolve, reject) {
		await Feel.find({ createdBy: patientId }, { "createdBy": false }).exec(function (err, feels) {
			if (err) {
				console.log(err);
				resolve(err)
			}
			//console.log('Feel done.');
			var listFeels = [];
			if (feels) {
				feels.forEach(function (feel) {
					listFeels.push(feel);
				});
			}

			resolve(listFeels);
		})
	});
}

async function getProm(patientId) {
	return new Promise(async function (resolve, reject) {
		await Prom.find({ createdBy: patientId }, { "createdBy": false }).exec(function (err, proms) {
			if (err) {
				console.log(err);
				resolve(err)
			}
			//console.log('Proms done.');
			var listProms = [];
			if (proms) {
				proms.forEach(function (prom) {
					listProms.push(prom);
				});
			}

			resolve(listProms);
		})
	});
}

async function getSeizure(patientId) {
	return new Promise(async function (resolve, reject) {
		await Seizures.find({ createdBy: patientId }, { "createdBy": false }).exec(function (err, seizures) {
			if (err) {
				console.log(err);
				resolve(err)
			}
			//console.log('Seizures done.');
			var listSeizures = [];
			if (seizures) {
				seizures.forEach(function (seizure) {
					listSeizures.push(seizure);
				});
			}

			resolve(listSeizures);
		})
	});
}

module.exports = {
	getData,
	cronSendData
}
