// Medication schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const PromSchema = Schema({
	idProm: String,
	data: {type: Schema.Types.Mixed},
	other: {type: Schema.Types.Mixed},
	date: {type: Date, default: Date.now},
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('Prom',PromSchema)
// we need to export the model so that it is accessible in the rest of the app
