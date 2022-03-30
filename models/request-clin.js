// Patient schema
'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const User = require('./user')

const { conndbaccounts } = require('../db_connect')

const checksSchema = Schema({
	check1: {type: Boolean, default: false},
	check2: {type: Boolean, default: false},
	check3: {type: Boolean, default: false},
	check4: {type: Boolean, default: false}
})

const RequestClinSchema = Schema({
	lat: {type: String, default: ''},
	lng: {type: String, default: ''},
	notes: {type: String, default: ''},
	needsOther: {type: String, default: ''},
	status: {type: String, default: null},
	checks: {type: checksSchema, default: {
		check1: false,
		check2: false,
		check3: false,
		check4: false
	}},
	updateDate: {type: Date, default: Date.now},
	creationDate: {type: Date, default: Date.now},
	group: { type: String, default: null},
	othergroup: {type: String, default: null},
	drugs: {type: Object, default: []},
	createdBy: { type: Schema.Types.ObjectId, ref: "User"}
})

module.exports = conndbaccounts.model('RequestCli',RequestClinSchema)
// we need to export the model so that it is accessible in the rest of the app
