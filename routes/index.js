// file that contains the routes of the api
'use strict'

const express = require('express')

const userCtrl = require('../controllers/all/user')
const langCtrl = require('../controllers/all/lang')

const patientCtrl = require('../controllers/user/patient')
const deleteAccountCtrl = require('../controllers/user/delete')

const superAdmninLangCtrl = require('../controllers/superadmin/lang')

const f29apiv2serviceCtrl = require('../services/f29apiv2')
const f29bioserviceCtrl = require('../services/f29bio')
const f29azureserviceCtrl = require('../services/f29azure')

const supportCtrl = require('../controllers/all/support')

const groupCtrl = require('../controllers/all/group')

const openRaitoCtrl = require('../controllers/all/openraito')
const admninUsersCtrl = require('../controllers/admin/users')

const requestCliCtrl = require('../controllers/user/request-clin')

const auth = require('../middlewares/auth')
const roles = require('../middlewares/roles')
const api = express.Router()

// user routes, using the controller user, this controller has methods
//routes for login-logout
api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)

// activarcuenta
api.post('/activateuser', userCtrl.activateUser)
api.post('/sendEmail', userCtrl.sendEmail)

// recuperar password
api.post('/recoverpass', userCtrl.recoverPass)
api.post('/updatepass', userCtrl.updatePass)
api.post('/newpass', auth(roles.All), userCtrl.newPass)

api.get('/users/:userId', auth(roles.All), userCtrl.getUser)
api.get('/users/settings/:userId', auth(roles.All), userCtrl.getSettings)
api.put('/users/:userId', auth(roles.AllLessResearcher), userCtrl.updateUser)
api.delete('/users/:userId', auth(roles.AllLessResearcher), userCtrl.deleteUser)//de momento no se usa
api.get('/users/name/:userId', auth(roles.All), userCtrl.getUserName)
api.get('/users/email/:userId', auth(roles.All), userCtrl.getUserEmail)
api.get('/patient/email/:patientId', auth(roles.All), userCtrl.getPatientEmail)
api.get('/verified/:userId', auth(roles.All), userCtrl.isVerified)
api.put('/users/changeiscaregiver/:userId', auth(roles.AllLessResearcher), userCtrl.changeiscaregiver)
api.put('/users/location/:userId', auth(roles.AllLessResearcher), userCtrl.setPosition)

//delete account
api.post('/deleteaccount/:userId', auth(roles.All), deleteAccountCtrl.deleteAccount)

// patient routes, using the controller patient, this controller has methods
api.get('/patients-all/:userId', auth(roles.All), patientCtrl.getPatientsUser)
api.get('/patients/:patientId', auth(roles.All), patientCtrl.getPatient)
api.put('/patients/:patientId', auth(roles.UserClinical), patientCtrl.updatePatient)
api.put('/patients/changenotes/:patientId', auth(roles.AllLessResearcher), patientCtrl.changenotes)
api.get('/patient/status/:patientId', auth(roles.AdminSuperAdmin), patientCtrl.getStatus)
api.put('/patient/status/:patientId', auth(roles.AdminSuperAdmin), patientCtrl.setStatus)
api.put('/patient/consentgroup/:patientId', auth(roles.All), patientCtrl.consentgroup)
api.get('/patient/consentgroup/:patientId', auth(roles.All), patientCtrl.getConsentGroup)
api.put('/patient/checks/:patientId', auth(roles.All), patientCtrl.setChecks)
api.get('/patient/checks/:patientId', auth(roles.All), patientCtrl.getChecks)
api.put('/patient/drugs/:patientId', auth(roles.All), patientCtrl.saveDrugs)


//superadmin routes, using the controllers of folder Admin, this controller has methods
api.post('/superadmin/lang/:userId', auth(roles.SuperAdmin), superAdmninLangCtrl.updateLangFile)
///no se usa las 2 siguientes
//api.put('/superadmin/langs/:userId', auth, superAdmninLangCtrl.langsToUpdate)
//api.put('/admin/lang/:userId', auth, superAdmninLangCtrl.addlang)
api.put('/superadmin/lang/:userId', auth(roles.SuperAdmin), function(req, res){
  req.setTimeout(0) // no timeout
  superAdmninLangCtrl.addlang(req, res)
})
api.delete('/superadmin/lang/:userIdAndLang', auth(roles.SuperAdmin), superAdmninLangCtrl.deletelang)

// lang routes, using the controller lang, this controller has methods
api.get('/langs/',  langCtrl.getLangs)


//Support
api.post('/support/', auth(roles.UserClinicalSuperAdmin), supportCtrl.sendMsgSupport)
api.post('/homesupport/', supportCtrl.sendMsgLogoutSupport)

api.get('/support/:userId', auth(roles.UserClinicalSuperAdmin), supportCtrl.getUserMsgs)
api.put('/support/:supportId', auth(roles.AdminSuperAdmin), supportCtrl.updateMsg)
api.get('/support/all/:userId', auth(roles.SuperAdmin), supportCtrl.getAllMsgs)
api.post('/support/all/:userId', auth(roles.AdminSuperAdmin), supportCtrl.getAllMsgs)

//services dx29V2API
api.post('/callTextAnalytics', f29apiv2serviceCtrl.callTextAnalytics)

//services f29bio
api.post('/Translation/document/translate', f29bioserviceCtrl.getTranslationDictionary)
api.post('/Translation/document/translate2', f29bioserviceCtrl.getTranslationDictionary2)

//services f29azure
api.post('/getDetectLanguage', auth(roles.All), f29azureserviceCtrl.getDetectLanguage)
api.get('/getAzureBlobSasTokenWithContainer/:containerName', auth(roles.AllLessResearcher), f29azureserviceCtrl.getAzureBlobSasTokenWithContainer)

//groups
api.get('/groupsnames', groupCtrl.getGroupsNames)
api.get('/groupadmin/:groupName', groupCtrl.getGroupAdmin)
api.get('/groups', groupCtrl.getGroups)
api.get('/group/:groupName', auth(roles.All), groupCtrl.getGroup)
api.get('/group/notifications/:userId', auth(roles.Admin), groupCtrl.getNotifications)
api.put('/group/notifications/:userId', auth(roles.Admin), groupCtrl.setNotifications)


// openraito
api.get('/openraito/patient/generalshare/:patientId', auth(roles.UserResearcher), openRaitoCtrl.getGeneralShare)
api.post('/openraito/patient/generalshare/:patientId', auth(roles.OnlyUser), openRaitoCtrl.setGeneralShare)
api.get('/openraito/patient/customshare/:patientId', auth(roles.UserResearcher), openRaitoCtrl.getCustomShare)
api.post('/openraito/patient/customshare/:patientId', auth(roles.OnlyUser), openRaitoCtrl.setCustomShare)
api.get('/openraito/patient/individualshare/:patientId', auth(roles.OnlyUser), openRaitoCtrl.getIndividualShare)
api.post('/openraito/patient/individualshare/:patientId', auth(roles.OnlyUser), openRaitoCtrl.setIndividualShare)


api.get('/admin/users/:groupName', auth(roles.Readers), admninUsersCtrl.getUsers)
api.put('/admin/patients/:patientId', auth(roles.Admin), admninUsersCtrl.setDeadPatient)
api.put('/admin/users/subgroup/:userId', auth(roles.Admin), admninUsersCtrl.setSubgroupUser)
api.put('/admin/users/state/:userId', auth(roles.Admin), admninUsersCtrl.setStateUser)

api.get('/requestclin/:userId', auth(roles.AdminClinical), requestCliCtrl.getRequests)
api.get('/admin/requestclin/:groupName', auth(roles.Admin), requestCliCtrl.getRequestsAdmin)
api.post('/requestclin/:userId', auth(roles.AdminClinical), requestCliCtrl.saveRequest)
api.put('/requestclin/:requestId', auth(roles.AdminClinical), requestCliCtrl.updateRequest)
api.delete('/requestclin/:requestId', auth(roles.AdminClinical), requestCliCtrl.deleteRequest)
api.put('/requestclin/checks/:requestId', auth(roles.All), requestCliCtrl.setChecks)
api.get('/requestclin/checks/:requestId', auth(roles.All), requestCliCtrl.getChecks)
api.put('/requestclin/status/:requestId', auth(roles.AdminSuperAdmin), requestCliCtrl.setStatus)
api.put('/requestclin/changenotes/:requestId', auth(roles.AllLessResearcher), requestCliCtrl.changenotes)
api.get('/requestclin/group/:userId', auth(roles.AdminClinical), requestCliCtrl.getGroupRequest)

/*api.get('/testToken', auth, (req, res) => {
	res.status(200).send(true)
})*/
//ruta privada
api.get('/private', auth(roles.AllLessResearcher), (req, res) => {
	res.status(200).send({ message: 'You have access' })
})

module.exports = api
