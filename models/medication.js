// Medication schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const MedicationSchema = Schema({
	drug: Object,
	dose: String,
	date: {type: Date, default: Date.now},
	startDate: {type: Date, default: Date.now},
	endDate: {type: Date, default: null},
	sideEffects: {type: Object, default: null},
	schedule: String,
	otherSchedule: String,
	adverseEffects: Object,
	compassionateUse: {type: String, default: ''},
	notes: {type: String, default: ''},
	freesideEffects: {type: String, default: ''},
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('Medication',MedicationSchema)
// we need to export the model so that it is accessible in the rest of the app
