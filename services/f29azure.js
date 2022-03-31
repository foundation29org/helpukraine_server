'use strict'

const crypt = require('./crypt')
const config = require('../config')
const request = require('request')
const storage = require("@azure/storage-blob")
const accountnameGenomics = config.nameBlob;
const keyGenomics = config.keyGenomics;
const sharedKeyCredentialGenomics = new storage.StorageSharedKeyCredential(accountnameGenomics, keyGenomics);

function getDetectLanguage(req, res) {
  var jsonText = req.body;
  var category = config.translationCategory;
  var translationKey = config.translationKey;
  request.post({ url: 'https://api.cognitive.microsofttranslator.com/detect?api-version=3.0', json: true, headers: { 'Ocp-Apim-Subscription-Key': translationKey }, body: jsonText }, (error, response, body) => {
    if (error) {
      console.error(error)
      res.status(500).send(error)
    }
    if (body == 'Missing authentication token.') {
      res.status(401).send(body)
    } else {
      res.status(200).send(body)
    }

  });
}

function getAzureBlobSasTokenWithContainer(req, res) {
  var containerName = req.params.containerName;

  var startDate = new Date();
  var expiryDate = new Date();
  startDate.setTime(startDate.getTime() - 5 * 60 * 1000);
  expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000);

  var containerSAS = storage.generateBlobSASQueryParameters({
    expiresOn: expiryDate,
    permissions: storage.ContainerSASPermissions.parse("rwdlac"),
    protocol: storage.SASProtocol.Https,
    containerName: containerName,
    startsOn: startDate,
    version: "2017-11-09"

  }, sharedKeyCredentialGenomics).toString();
  res.status(200).send({ containerSAS: containerSAS })
}

module.exports = {
  getDetectLanguage,
  getAzureBlobSasTokenWithContainer
}
