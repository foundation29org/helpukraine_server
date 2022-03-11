// eventsdb schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const DocumentSchema = Schema({
	name: {type: String, default: ''},
	description: {type: String, default: ''},
	url: {type: String, default: ''},
	dateDoc: {type: Date, default: null},
	date: {type: Date, default: Date.now},
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('Document',DocumentSchema)
// we need to export the model so that it is accessible in the rest of the app
