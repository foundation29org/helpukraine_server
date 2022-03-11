// eventsdb schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const SeizuresSchema = Schema({
	notes: {type: String, default: ''},
	duracion: {type: Number, default: 0},
	type: {type: String, default: null},
	start: {type: Date, default: null},
	state: {type: String, default: ''},
	GUID: {type: String, default: ''},
	date: {type: Date, default: Date.now},
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('Seizures',SeizuresSchema)
// we need to export the model so that it is accessible in the rest of the app
