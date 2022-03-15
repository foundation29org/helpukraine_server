// file that contains the routes of the api
'use strict'

const express = require('express')

const userCtrl = require('../controllers/all/user')
const langCtrl = require('../controllers/all/lang')

const patientCtrl = require('../controllers/user/patient')

const exportCtrl = require('../controllers/user/patient/export')
const deleteAccountCtrl = require('../controllers/user/delete')

const phenotypeCtrl = require('../controllers/user/patient/phenotype')

const superAdmninLangCtrl = require('../controllers/superadmin/lang')
const superadmninUsersClinicalCtrl = require('../controllers/superadmin/users-clinical')

const hpoServiceCtrl = require('../services/hpo-info')
const f29ncrserviceCtrl = require('../services/f29ncr')
const f29apiv2serviceCtrl = require('../services/f29apiv2')
const f29bioserviceCtrl = require('../services/f29bio')
const f29azureserviceCtrl = require('../services/f29azure')
const f29gatewayCtrl = require('../services/f29gateway')
const f29patientgroupsCtrl = require('../services/f29patientGroups')
const sendEmailCtrl = require('../services/sendEmails')
const wikiCtrl = require('../services/wikipedia')
const openAIserviceCtrl = require('../services/openai')

const diagnosisCtrl = require('../controllers/clinical/diagnosis')
const diagnosisCasesCtrl = require('../controllers/clinical/diagnosis-clinical')

const supportCtrl = require('../controllers/all/support')

const shareOrInviteCtrl = require('../controllers/all/share')

const captchaServiceCtrl = require('../services/captcha')

const feedbackDevCtrl = require('../controllers/all/feedback_dev')
const seizuresCtrl = require('../controllers/user/patient/seizures')
const groupCtrl = require('../controllers/all/group')
const medicationCtrl = require('../controllers/user/patient/medication')

const feelCtrl = require('../controllers/user/patient/feel')
const promCtrl = require('../controllers/user/patient/prom')

const docsCtrl = require('../controllers/user/patient/documents')

const weightCtrl = require('../controllers/user/patient/weight')
const heightCtrl = require('../controllers/user/patient/height')

const openRaitoCtrl = require('../controllers/all/openraito')
const admninUsersCtrl = require('../controllers/admin/users')

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
api.get('/gpt3/:userId', auth(roles.All), userCtrl.getGpt3Permision)
api.post('/gpt3/:userId', auth(roles.All), userCtrl.setGpt3Permision)
api.get('/gpt3/numcalls/:userId', auth(roles.All), userCtrl.setNumCallsGpt3)
api.get('/verified/:userId', auth(roles.All), userCtrl.isVerified)

//export data
api.get('/exportdata/:patientId', auth(roles.All), exportCtrl.getData)
api.get('/crondatagroups', auth(roles.SuperAdmin), exportCtrl.cronSendData)

//delete account
api.post('/deleteaccount/:userId', auth(roles.All), deleteAccountCtrl.deleteAccount)

// patient routes, using the controller patient, this controller has methods
api.get('/patients-all/:userId', auth(roles.All), patientCtrl.getPatientsUser)
api.get('/patients/:patientId', auth(roles.All), patientCtrl.getPatient)
api.post('/patients/:userId', auth(roles.UserClinical), patientCtrl.savePatient)
api.put('/patients/:patientId', auth(roles.UserClinical), patientCtrl.updatePatient)
api.delete('/patients/:patientId', auth(roles.UserClinical), patientCtrl.deletePatient)//de momento no se usa
api.put('/patients/changenotes/:patientId', auth(roles.AllLessResearcher), patientCtrl.changenotes)
api.put('/case/changename/:patientId', auth(roles.UserClinical), patientCtrl.changecasename)
api.put('/case/changesharedname/:patientId', auth(roles.OnlyClinical), patientCtrl.changesharedcasename)
api.get('/case/updateLastAccess/:patientId', auth(roles.OnlyClinical), patientCtrl.updateLastAccess)
api.get('/patient/status/:patientId', auth(roles.AdminSuperAdmin), patientCtrl.getStatus)
api.put('/patient/status/:patientId', auth(roles.AdminSuperAdmin), patientCtrl.setStatus)
api.put('/patient/consentgroup/:patientId', auth(roles.All), patientCtrl.consentgroup)
api.get('/patient/consentgroup/:patientId', auth(roles.All), patientCtrl.getConsentGroup)
api.put('/patient/checks/:patientId', auth(roles.All), patientCtrl.setChecks)
api.get('/patient/checks/:patientId', auth(roles.All), patientCtrl.getChecks)
api.put('/patient/birthdate/:patientId', auth(roles.All), patientCtrl.setBirthDate)
api.put('/patient/drugs/:patientId', auth(roles.All), patientCtrl.saveDrugs)

// phenotypeinfo routes, using the controller socialinfo, this controller has methods
api.get('/phenotypes/:patientId', auth(roles.All), phenotypeCtrl.getPhenotype)
api.post('/phenotypes/:patientId', auth(roles.UserClinicalSuperAdmin), phenotypeCtrl.savePhenotype)
api.put('/phenotypes/:phenotypeId', auth(roles.UserClinicalSuperAdmin), phenotypeCtrl.updatePhenotype)
api.delete('/phenotypes/:phenotypeId', auth(roles.UserClinicalSuperAdmin), phenotypeCtrl.deletePhenotype)//de momento no se usa
api.get('/phenotypes/history/:patientId', auth(roles.All), phenotypeCtrl.getPhenotypeHistory)//de momento no se usa
api.delete('/phenotypes/history/:phenotypeId', auth(roles.UserClinicalSuperAdmin), phenotypeCtrl.deletePhenotypeHistoryRecord)//de momento no se usa

api.put('/symptoms/changesharewithcommunity/:phenotypeId', auth(roles.UserClinicalSuperAdmin), phenotypeCtrl.setShareWithCommunity)
api.get('/symptoms/permissions/:patientId', auth(roles.UserClinicalSuperAdmin), phenotypeCtrl.getPermissionsPhenotype)

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

//api.get('/superadmin/users/', auth(roles.SuperAdmin), superadmninUsersClinicalCtrl.getUsers) //no se usa
//api.get('/superadmin/infopatients/:userId', auth, superadmninUsersClinicalCtrl.getInfoPatients) //no se usa

// lang routes, using the controller lang, this controller has methods
api.get('/langs/',  langCtrl.getLangs)

//api.get('/hpoinfoservice', hpoServiceCtrl.getHposInfo) // no se usa


//diagnóstico

// diagnosis routes, using the controller diagnosis, this controller has methods
api.get('/diagnosis/:patientId', auth(roles.All), diagnosisCtrl.getDiagnosis)
api.post('/diagnosis/:patientId', auth(roles.UserClinicalSuperAdmin), diagnosisCtrl.saveDiagnosis)
api.put('/diagnosis/:diagnosisId', auth(roles.UserClinicalSuperAdmin), diagnosisCtrl.updateDiagnosis)
api.delete('/diagnosis/:diagnosisId', auth(roles.UserClinicalSuperAdmin), diagnosisCtrl.deleteDiagnosis)//de momento no se usa
api.put('/diagnosis/filters/:diagnosisId', auth(roles.ClinicalSuperAdmin), diagnosisCtrl.updateFilters)
api.put('/diagnosis/relatedconditions/:diagnosisId', auth(roles.ClinicalSuperAdmin), diagnosisCtrl.updateRelatedconditions)
api.put('/diagnosis/hasvcf/:diagnosisId', auth(roles.UserClinicalSuperAdmin), diagnosisCtrl.updateHasVCF)

api.get('/case/:userId', auth(roles.ClinicalSuperAdmin), diagnosisCasesCtrl.getPatientsInfo)
api.get('/sharedcase/:userId', auth(roles.UserClinicalSuperAdmin), diagnosisCasesCtrl.getSharedPatientsInfo)
api.delete('/case/:patientId', auth(roles.ClinicalSuperAdmin), diagnosisCasesCtrl.deleteCase)
api.get('/case/archive/:patientId', auth(roles.OnlyClinical), diagnosisCasesCtrl.setCaseArchived)
api.get('/case/restore/:patientId', auth(roles.OnlyClinical), diagnosisCasesCtrl.setCaseRestored)

//Support
api.post('/support/', auth(roles.UserClinicalSuperAdmin), supportCtrl.sendMsgSupport)
api.post('/homesupport/', supportCtrl.sendMsgLogoutSupport)

api.get('/support/:userId', auth(roles.UserClinicalSuperAdmin), supportCtrl.getUserMsgs)
api.put('/support/:supportId', auth(roles.AdminSuperAdmin), supportCtrl.updateMsg)
api.get('/support/all/:userId', auth(roles.SuperAdmin), supportCtrl.getAllMsgs)
api.post('/support/all/:userId', auth(roles.AdminSuperAdmin), supportCtrl.getAllMsgs)

api.post('/shareorinvite/', auth(roles.UserClinicalSuperAdmin), shareOrInviteCtrl.shareOrInviteWith)
api.post('/resendshareorinvite/', auth(roles.UserClinicalSuperAdmin), shareOrInviteCtrl.resendShareOrInviteWith)
//api.get('/sharingaccounts/:patientId', auth, shareOrInviteCtrl.getDataFromSharingAccounts) //no se usa
api.post('/revokepermission/:patientId', auth(roles.UserClinicalSuperAdmin), shareOrInviteCtrl.revokepermission)
api.post('/rejectpermission/:patientId', auth(roles.UserClinicalSuperAdmin), shareOrInviteCtrl.rejectpermission)
api.post('/setpermission/:patientId', auth(roles.UserClinicalSuperAdmin), shareOrInviteCtrl.setPermissions)
api.post('/sharingaccountsclinical/:userId', auth(roles.UserClinicalSuperAdmin), shareOrInviteCtrl.getDataFromSharingAccountsListPatients)
api.post('/updatepermissions/', shareOrInviteCtrl.updatepermissions)
api.post('/updateshowSwalIntro/:patientId', auth(roles.ClinicalSuperAdmin), shareOrInviteCtrl.updateshowSwalIntro)


api.get('/verifyingcaptcha/:token', captchaServiceCtrl.verifyingcaptcha) // no se usa

//services f29ncr
api.post('/annotate_batch/', f29ncrserviceCtrl.getAnnotate_batch)
//api.post('/annotate_batch/', auth(roles.UserClinicalSuperAdmin), f29ncrserviceCtrl.getAnnotate_batch)

//services dx29V2API
api.post('/callTextAnalytics', f29apiv2serviceCtrl.callTextAnalytics)

//services f29bio
api.post('/Translation/document/translate', f29bioserviceCtrl.getTranslationDictionary)
//api.post('/Translation/document/translate', auth(roles.UserClinicalSuperAdmin), f29bioserviceCtrl.getTranslationDictionary)

//services f29azure
api.post('/getDetectLanguage', f29azureserviceCtrl.getDetectLanguage)
//api.post('/getDetectLanguage', auth(roles.UserClinicalSuperAdmin), f29azureserviceCtrl.getDetectLanguage)

api.post('/sendEmailResultsUndiagnosed', sendEmailCtrl.sendResultsUndiagnosed)
api.post('/sendEmailResultsDiagnosed', sendEmailCtrl.sendResultsDiagnosed)
api.post('/sendEmailRevolution', sendEmailCtrl.sendRevolution)


api.post('/getTranslationDictionary', auth(roles.UserClinicalSuperAdmin), f29azureserviceCtrl.getTranslationDictionary)
api.get('/getAzureBlobSasTokenWithContainer/:containerName', auth(roles.AllLessResearcher), f29azureserviceCtrl.getAzureBlobSasTokenWithContainer)

//service feedback
api.post('/feedbackdev', auth(roles.UserClinicalSuperAdmin), feedbackDevCtrl.sendMsgDev)

//gateway
api.post('/gateway/Diagnosis/calculate/:lang', f29gatewayCtrl.calculateDiagnosis)
api.post('/gateway/search/disease/', f29gatewayCtrl.searchDiseases)
api.post('/gateway/search/symptoms/', f29gatewayCtrl.searchSymptoms)

//wikipedia
api.post('/wikiSearch', wikiCtrl.callwikiSearch)
api.post('/wiki', wikiCtrl.callwiki)

//patientGroups
api.get('/patientgroups/:idDisease', f29patientgroupsCtrl.getPatientGroups)


// seizuresCtrl routes, using the controller seizures, this controller has methods
api.post('/seizures/dates/:patientId', auth(roles.UserResearcher), seizuresCtrl.getSeizuresDate)
api.get('/seizures/:patientId', auth(roles.UserResearcher), seizuresCtrl.getSeizures)
api.post('/seizures/:patientId', auth(roles.OnlyUser), seizuresCtrl.saveSeizure)
api.put('/seizures/:seizureId', auth(roles.OnlyUser), seizuresCtrl.updateSeizure)
api.delete('/seizures/:seizureId', auth(roles.OnlyUser), seizuresCtrl.deleteSeizure)
api.post('/massiveseizures/:patientId', auth(roles.OnlyUser), seizuresCtrl.saveMassiveSeizure)

//groups
api.get('/groupsnames', groupCtrl.getGroupsNames)
api.get('/groupadmin/:groupName', groupCtrl.getGroupAdmin)
api.get('/groups', groupCtrl.getGroups)
api.get('/group/:groupName', auth(roles.All), groupCtrl.getGroup)
api.get('/group/phenotype/:groupName', auth(roles.All), groupCtrl.getPhenotypeGroup)
api.get('/group/medications/:groupId', groupCtrl.getMedicationsGroup)

//medications
api.post('/medications/dates/:patientId', auth(roles.UserResearcher), medicationCtrl.getMedicationsDate)
api.get('/medications/:patientId', auth(roles.UserResearcher), medicationCtrl.getMedications)
api.get('/medication/:medicationId', auth(roles.UserResearcher), medicationCtrl.getMedication)
api.post('/medication/:patientId', auth(roles.OnlyUser), medicationCtrl.saveMedication)
api.put('/medication/:medicationId', auth(roles.OnlyUser), medicationCtrl.updateMedication)
api.delete('/medication/:medicationId', auth(roles.OnlyUser), medicationCtrl.deleteDose)
api.delete('/medications/:drugNameAndPatient', auth(roles.OnlyUser), medicationCtrl.deleteMedication)
api.get('/medications/all/:drugNameAndPatient', auth(roles.UserResearcher), medicationCtrl.getAllMedicationByNameForPatient)

api.delete('/medications/update/:PatientIdAndMedicationId', auth(roles.OnlyUser), medicationCtrl.deleteMedicationByIDAndUpdateStateForThePrevious)
api.put('/medication/newdose/:medicationIdAndPatient', auth(roles.OnlyUser), medicationCtrl.newDose)
api.put('/medication/stoptaking/:medicationId', auth(roles.OnlyUser), medicationCtrl.stoptaking)
api.put('/medication/changenotes/:medicationId', auth(roles.OnlyUser), medicationCtrl.changenotes)
api.put('/medication/sideeffect/:medicationId', auth(roles.OnlyUser), medicationCtrl.sideeffect)

// seizuresCtrl routes, using the controller seizures, this controller has methods
api.post('/feels/dates/:patientId', auth(roles.UserResearcher), feelCtrl.getFeelsDates)
api.get('/feels/:patientId', auth(roles.UserResearcher), feelCtrl.getFeels)
api.post('/feel/:patientId', auth(roles.OnlyUser), feelCtrl.saveFeel)
api.delete('/feel/:feelId', auth(roles.OnlyUser), feelCtrl.deleteFeel)

//proms
api.post('/prom/dates/:patientId', auth(roles.UserResearcher), promCtrl.getPromsDates)
api.get('/prom/:patientId', auth(roles.UserResearcher), promCtrl.getProms)
api.post('/prom/:patientId', auth(roles.OnlyUser), promCtrl.saveProm)
api.post('/proms/:patientId', auth(roles.OnlyUser), promCtrl.savesProm)
api.put('/prom/:promId', auth(roles.OnlyUser), promCtrl.updateProm)
api.delete('/prom/:promId', auth(roles.OnlyUser), promCtrl.deleteProm)

// seizuresCtrl routes, using the controller seizures, this controller has methods
api.get('/documents/:patientId', auth(roles.UserResearcher), docsCtrl.getDocuments)
api.post('/document/:patientId', auth(roles.OnlyUser), docsCtrl.saveDocument)
api.put('/document/:documentId', auth(roles.OnlyUser), docsCtrl.updateDocument)
api.delete('/document/:documentId', auth(roles.OnlyUser), docsCtrl.deleteDocument)

// weightinfo routes, using the controller socialinfo, this controller has methods
api.get('/weight/:patientId', auth(roles.UserResearcher), weightCtrl.getWeight)
api.get('/weights/:patientId', auth(roles.UserResearcher), weightCtrl.getHistoryWeight)
api.post('/weight/:patientId', auth(roles.OnlyUser), weightCtrl.saveWeight)
api.delete('/weight/:weightId', auth(roles.OnlyUser), weightCtrl.deleteWeight)//de momento no se usa

// heighteinfo routes, using the controller socialinfo, this controller has methods
api.get('/height/:patientId', auth(roles.UserResearcher), heightCtrl.getHeight)
api.get('/heights/:patientId', auth(roles.UserResearcher), heightCtrl.getHistoryHeight)
api.post('/height/:patientId', auth(roles.OnlyUser), heightCtrl.saveHeight)
api.delete('/height/:heightId', auth(roles.OnlyUser), heightCtrl.deleteHeight)//de momento no se usa

//services OPENAI
api.post('/callopenai', auth(roles.OnlyUser), openAIserviceCtrl.callOpenAi)

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

/*api.get('/testToken', auth, (req, res) => {
	res.status(200).send(true)
})*/
//ruta privada
api.get('/private', auth(roles.AllLessResearcher), (req, res) => {
	res.status(200).send({ message: 'You have access' })
})

module.exports = api
