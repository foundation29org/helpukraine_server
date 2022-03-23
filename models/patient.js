// Patient schema
'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const User = require('./user')

const { conndbaccounts } = require('../db_connect')


const PatientSchema = Schema({
	patientName: String,
	surname: String,
	birthDate: Date,
	citybirth: String,
	provincebirth: String,
	countrybirth: String,
	street: {type: String, default: null},
	postalCode: {type: String, default: null},
	city: {type: String, default: null},
	province: {type: String, default: null},
	country: {type: String, default: null},
	lat: {type: String, default: ''},
	lng: {type: String, default: ''},
	phone1: {type: String, default: null},
	phone2: {type: String, default: null},
	gender: {type: String, default: null},
	createdBy: { type: Schema.Types.ObjectId, ref: "User"},
	death: Date,
	notes: {type: String, default: ''},
	needs: {type: String, default: ''},
	needsOther: {type: String, default: ''},
	sharing: {type: Object, default: []},
	status: {type: String, default: null},
	lastAccess: {type: Date, default: Date.now},
	creationDate: {type: Date, default: Date.now},
	previousDiagnosis: {type: String, default: null},
	avatar: String,
	group: { type: String, default: null},
	othergroup: {type: String, default: null},
	consentgroup: {type: Boolean, default: false},
	needShelter: {type: Boolean, default: false},
	drugs: {type: Object, default: []}
})

module.exports = conndbaccounts.model('Patient',PatientSchema)
// we need to export the model so that it is accessible in the rest of the app
