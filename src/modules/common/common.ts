import * as angular from 'angular';
import 'angular-ui-grid';
import 'angular-translate';
import 'angular-translate-loader-partial';
import { ValidatableFieldDirective, ValidationMessageDirective, ValidationSummaryDirective } from 'angular-typescript-validation';

import 'vendor/toastr/toastr.min.css';

import 'vendor/angular-bootstrap/ui-bootstrap-custom-2.3.0.min.js';
import 'vendor/angular-bootstrap/ui-bootstrap-custom-tpls-2.3.0.min.js';
import 'vendor/angular-bootstrap/ui-bootstrap-custom-2.3.0-csp.css';

import 'vendor/angular-ui-grid/ui-grid.min.css';

import 'vendor/semantic-ui-css-master/semantic.min.js';
import 'vendor/semantic-ui-css-master/semantic.min.css';

import 'semantic-ui-angular';

import './common.scss';

import { CustomUiGridConstants } from 'modules/common/constants/customUiGridConstants';

import { ApiService } from 'modules/common/services/apiService';
import { ModalService } from './services/modalService';
import { NotificationService } from 'modules/common/services/notificationService';
import { ProcessingService } from 'modules/common/services/processingService';
import { ResponseHandlers } from 'modules/common/services/handlers/responseHandlers';
import { ServerValidationService } from 'modules/common/services/serverValidationService';
import { UiGridService } from 'modules/common/services/uiGridService';

import { ConfirmDialog } from 'modules/common/components/confirmDialog/confirmDialog';
import { DatePicker } from 'modules/common/components/datePicker/datePicker';
import { ErrorBlock } from 'modules/common/components/errorBlock/errorBlock';
import { EzGrid } from 'modules/common/components/ezGrid/ezGrid';
import { EzModal } from 'modules/common/components/ezModal/ezModal';
import { SingleLookup } from 'modules/common/components/singleLookup/singleLookup';

/**
 * the common module.
 */
export class Common {

}

angular.module('EZ.Common',
    [
        'semantic-ui',
        'pascalprecht.translate',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        require('angular-drag-drop')])
    .constant('customUiGridConstants', CustomUiGridConstants.Default)
    .component('confirmDialog', new ConfirmDialog())
    .component('datePicker', new DatePicker())
    .component('errorBlock', new ErrorBlock())
    .component('ezGrid', new EzGrid())
    .component('ezModal', new EzModal())
    .component('singleLookup', new SingleLookup())
    .directive('validatableField', ValidatableFieldDirective.factory)
    .directive('validationMessage', ValidationMessageDirective.factory)
    .directive('validationSummary', ValidationSummaryDirective.factory)
    .service('apiService', ApiService)
    .service('modalService', ModalService)
    .service('notificationService', NotificationService)
    .service('processingService', ProcessingService)
    .service('responseHandlers', ResponseHandlers)
    .service('serverValidationService', ServerValidationService)
    .service('uiGridService', UiGridService);