'use strict'

const { TRANSPORTER_OPTIONS, client_server, blobAccessToken } = require('../config')
const nodemailer = require('nodemailer')
var hbs = require('nodemailer-express-handlebars')

var options = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'views/email/',
         defaultLayout : 'template'
     },
     viewPath: 'views/email/',
     extName: '.hbs'
 };

 var transporter = nodemailer.createTransport(TRANSPORTER_OPTIONS);
 transporter.use('compile', hbs(options));

function sendMailVerifyEmail (email, randomstring, lang, group){

  var subjectlang='Relief Ukraine - Activate the account';
  if(lang=='es'){
    subjectlang='Relief Ukraine - Activa la cuenta';
  }else if(lang=='uk'){
    subjectlang='Relief Ukraine - Активуйте обліковий запис';
  }
  const decoded = new Promise((resolve, reject) => {
    var urlImg = 'https://reliefukraine.net/assets/img/logo-reliefukraine.png';
    var maillistbcc = [
      TRANSPORTER_OPTIONS.auth.user
    ];

    var mailOptions = {
      to: email,
      from: TRANSPORTER_OPTIONS.auth.user,
      bcc: maillistbcc,
      subject: subjectlang,
      template: 'verify_email/_'+lang,
      context: {
        client_server : client_server,
        email : email,
        key : randomstring,
        urlImg: urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        sendMailFailSend(email)
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendMailFailSend (email){
    var maillistbcc = [
      TRANSPORTER_OPTIONS.auth.user
    ];

    var emailToFinal = 'support@foundation29.org'
    var mailOptions = {
      to: emailToFinal,
      from: TRANSPORTER_OPTIONS.auth.user,
      bcc: maillistbcc,
      subject: 'Message for support. Fail email Relief Ukraine: '+ email,
      template: 'mail_support/fail',
      context: {
        email : email
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('send ok');
      }
    });

  
}

function sendMailRecoverPass (email, randomstring, lang){
  var subjectlang='Relief Ukraine - Account Recovery';
  if(lang=='es'){
    subjectlang='Relief Ukraine - Recuperación de la cuenta';
  }else if(lang=='uk'){
    subjectlang='Relief Ukraine - Відновлення облікового запису';
  }
  const decoded = new Promise((resolve, reject) => {
    var urlImg = 'https://reliefukraine.net/assets/img/logo-reliefukraine.png';

    var maillistbcc = [
      TRANSPORTER_OPTIONS.auth.user,
    ];

    var mailOptions = {
      to: email,
      from: TRANSPORTER_OPTIONS.auth.user,
      bcc: maillistbcc,
      subject: subjectlang,
      template: 'recover_pass/_'+lang,
      context: {
        client_server : client_server,
        email : email,
        key : randomstring,
        urlImg: urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        sendMailFailSend(email)
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendMailSupport (email, lang, role, supportStored, emailTo){
  const decoded = new Promise((resolve, reject) => {
    var urlImg = 'https://reliefukraine.net/assets/img/logo-reliefukraine.png';
    var attachments = [];
    if(supportStored.files.length>0){
      supportStored.files.forEach(function(file) {
        
        var urlpath = blobAccessToken.blobAccountUrl+'filessupport/'+file+blobAccessToken.sasToken;
        console.log(urlpath);
        attachments.push({filename: file, path: urlpath});
      });
    }
    var maillistbcc = [
      TRANSPORTER_OPTIONS.auth.user
    ];

    var emailToFinal = 'support@foundation29.org'
    if(emailTo!=null){
      emailToFinal = emailTo;
    }

    var mailOptions = {
      to: emailToFinal,
      from: TRANSPORTER_OPTIONS.auth.user,
      bcc: maillistbcc,
      subject: 'Message for support. Relief Ukraine Id: '+ supportStored._id,
      template: 'mail_support/_en',
      context: {
        email : email,
        lang : lang,
        info: supportStored
      },
      attachments: attachments
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        sendMailFailSend(email)
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendMailChangeStatus (email, lang, group, statusInfo){
  var subjectlang='Relief Ukraine - Information about your case progress';
  if(lang=='es'){
    subjectlang='Relief Ukraine - Información sobre el progreso de su caso';
  }else if(lang=='uk'){
    subjectlang='Relief Ukraine - Інформація про хід справи';
  }

  const decoded = new Promise((resolve, reject) => {
    var urlImg = 'https://reliefukraine.net/assets/img/logo-reliefukraine.png';
    var maillistbcc = [
      TRANSPORTER_OPTIONS.auth.user
    ];

    var mailOptions = {
      to: email,
      from: TRANSPORTER_OPTIONS.auth.user,
      bcc: maillistbcc,
      subject: subjectlang,
      template: 'status/_'+lang,
      context: {
        client_server : client_server,
        status : statusInfo,
        group : group,
        urlImg: urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        sendMailFailSend(email)
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendNotificationNewUser (email, emailUser){
  var subjectlang='Relief Ukraine - A new user has signed up.';

  const decoded = new Promise((resolve, reject) => {
    var urlImg = 'https://reliefukraine.net/assets/img/logo-reliefukraine.png';
    var maillistbcc = [
      TRANSPORTER_OPTIONS.auth.user
    ];

    var mailOptions = {
      to: email,
      from: TRANSPORTER_OPTIONS.auth.user,
      bcc: maillistbcc,
      subject: subjectlang,
      template: 'notification_new_user/_en',
      context: {
        emailUser : emailUser,
        urlImg: urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        sendMailFailSend(email)
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendNotificationUpdateUser (email, emailUser){
  var subjectlang='Relief Ukraine - A user has modified their data.';

  const decoded = new Promise((resolve, reject) => {
    var urlImg = 'https://reliefukraine.net/assets/img/logo-reliefukraine.png';
    var maillistbcc = [
      TRANSPORTER_OPTIONS.auth.user
    ];

    var mailOptions = {
      to: email,
      from: TRANSPORTER_OPTIONS.auth.user,
      bcc: maillistbcc,
      subject: subjectlang,
      template: 'notification_update_user/_en',
      context: {
        emailUser : emailUser,
        urlImg: urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        sendMailFailSend(email)
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        resolve("ok")
      }
    });

  });
  return decoded
}

module.exports = {
	sendMailVerifyEmail,
  sendMailRecoverPass,
  sendMailSupport,
  sendMailChangeStatus,
  sendNotificationNewUser,
  sendNotificationUpdateUser
}
