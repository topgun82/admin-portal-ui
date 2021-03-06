﻿(function () {

    'use strict';

    angular
        .module("app.data")
        .factory('patientService', patientService);

    /* @ngInject */
    function patientService($resource, configService) {
        var registrationResource = $resource(configService.getRegistrationApiBaseUrl() + "/patients");
        var basePhrURL = configService.getPhrApiBaseUrl();
        var basePatientUserURL = configService.getPatientUserApiBaseUrl();
        var basePhrPatientURL = basePhrURL + "/patients";
        var stateResource = $resource(basePhrURL + "/statecodes");

        var patientSearchResource = $resource(basePhrPatientURL + "/search/:token", {token: '@token'});
        var patientProfileResource = $resource(basePhrPatientURL + "/:patientId/profile", {patientId: '@patientId'});
        var patientIdentifierResource = $resource(basePhrPatientURL + "/:patientId/patientIdentifier", {patientId: '@patientId'});
        var patientProfileUpdateResource = $resource(basePhrPatientURL + "/:patientId", {patientId: '@patientId'}, {'update': {method: 'PUT'}});
        var patientUserResource = $resource(basePatientUserURL + "/creations");
        var patientListResource = $resource(basePhrPatientURL + "/pageNumber",
            {pageNumber: '@pageNumber'},
            {
                'query': {
                    method: 'GET',
                    params: {pageNumber: '@pageNumber'}
                }
            }
        );

        var service = {};

        service.createPatient = createPatient;
        service.updatePatient = updatePatient;
        service.getPatients = getPatients;
        service.getPatient = getPatient;
        service.getPatientIdentifier = getPatientIdentifier;
        service.getVerifcationInfo = getVerificationInfo;
        service.sendVerificationEmail = sendVerificationEmail;
        service.searchPatient = searchPatient;
        service.getStates = getStates;

        return service;

        function createPatient(patient, success, error) {
            registrationResource.save(patient, success, error);
        }

        function updatePatient(patient, success, error) {
            patientProfileUpdateResource.update({patientId: patient.id}, patient, success, error);
        }

        function getPatients(page, success, error) {
            function adjustPageOnSuccessResponse(response) {
                if (angular.isDefined(response.currentPage) && angular.isNumber(response.currentPage)) {
                    response.currentPage += 1;
                }
                (success || angular.identity)(response);
            }

            return patientListResource.query({pageNumber: page - 1}, adjustPageOnSuccessResponse, error);
        }

        function getPatient(patientId, success, error) {
            return patientProfileResource.get({patientId: patientId}, success, error);
        }

        function getPatientIdentifier(patientId, success, error) {
            return patientIdentifierResource.get({patientId: patientId}, success, error);
        }

        function getVerificationInfo(patientId, success, error) {
            return patientUserResource.get({patientId: patientId}, success, error);
        }

        function sendVerificationEmail(patientId, success, error) {
            var patient = {"patientId": patientId};
            patientUserResource.save(patient, success, error);
        }

        function searchPatient(searchText, success, error) {
            patientSearchResource.query({"token": searchText}, success, error);
        }

        function getStates(success, error) {
            return stateResource.query(success, error);
        }
    }
})();