﻿(function () {
    'use strict';
    angular.module('app',
        [
            /* Shared modules*/
            'app.core',
            'templates-app',
            'app.security',
            'app.config',

            /*
             * Feature areas
             */
            'app.home',
            'app.layout',
            'app.patient',
            'app.account',
            'app.patientMedicalDocument',
            'app.error'
        ]);
})();