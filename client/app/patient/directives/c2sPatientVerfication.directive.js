/**
 * Created by Feruz.Abdella on 3/23/2016.
 */

(function () {
    'use strict';

    angular
        .module('app.patient')
        .directive('c2sPatientVerification', c2sPatientVerification);

    function c2sPatientVerification() {
        var directive = {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/patient/directives/patientVerification.html',
            controllerAs: 'patientVerificationVm',
            bindToController: {
                verificationinfo: '=',
                patientdata: '='
            },
            controller: PatientVerificationController
        };
        return directive;

        /* @ngInject */
        function PatientVerificationController(notificationService, patientService) {
            var vm = this;
            vm.patient = vm.patientdata;
            vm.verificationEmail = setEmail();
            vm.show = showVerifcationBox();
            vm.sendEmail = sendEmail;
            vm.isAccountAlreadyVerified = isAccountVerified;

            verifyPatient();

            function verifyPatient() {
                if (angular.isDefined(vm.patientdata) && angular.isDefined(vm.patientdata.id)) {
                    patientService.getVerifcationInfo(vm.patient.id,
                        function success(response) {
                            vm.verification = response;
                            vm.accountStatus = getStatus();
                            vm.sendEmailButtonText = isVerificationCodeSent() ? "Resend Email" : "Send Email";
                            vm.accountStatus = getStatus();
                        }, function error() {
                            vm.accountStatus = getStatus();
                            vm.sendEmailButtonText = isVerificationCodeSent() ? "Resend Email" : "Send Email";
                            console.error("Patient is not verified, please verify patient...");
                        });
                } else {
                    vm.sendEmailButtonText = isVerificationCodeSent() ? "Resend Email" : "Send Email";
                    vm.accountStatus = getStatus();
                    console.warn("No patient id available to get verification info...");
                }
            }

            function sendEmail() {
                patientService.sendVerificationEmail(vm.patient.id,
                    function success() {
                        notificationService.success('email sent successfully');
                        verifyPatient();
                    }, function error() {
                        notificationService.error('Failed to send email, please try again later...');
                    });
            }

            function setEmail() {
                if (!isPatientNotCreated()) {
                    return vm.patient.email;
                }
                return '';
            }

            function getStatus() {
                var status = 'Account Not Yet Activated.';
                if (angular.isDefined(vm.verification)) {
                    var verificationCodeSent = angular.isDefined(vm.verification.verificationCode);
                    if (isAccountVerified()) {
                        status = 'Account Created.';
                    }
                    else if (verificationCodeSent) {
                        status = 'Activation Email Sent.';
                    }
                }
                return status;
            }

            function isAccountVerified() {
                return (angular.isDefined(vm.verification) && vm.verification.verified);
            }

            function isVerificationCodeSent() {
                return (angular.isDefined(vm.verification)) && ( angular.isDefined(vm.verification.verificationCode));
            }

            function isPatientNotCreated() {
                return angular.isUndefined(vm.patient) || (angular.isUndefined(vm.patient.id));
            }

            function showVerifcationBox() {
                return !isPatientNotCreated();
            }
        }
    }
})();