import * as angular from 'angular';
import * as _ from 'lodash';

import { UiGridRequest, FilterRequest, SortRequest } from 'models/uiGrid/uiGridRequest';
import { UiGridResult } from 'models/uiGrid/uiGridResult';
import { BaseLookupController } from 'modules/util/baseLookupController';

// TODO: Update comments.
export class UiGridService<T> implements IUiGridService<T> {

    //#region Static Properties

    static commonGridOptions = {
        data: [],
        useExternalSorting: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableColumnMenus: false,
        enableFullRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        noUnselect: true,
        rowHeight: 45,
        paginationPageSize: 10,
        minRowsToShow: 10
    };

    static rowTemplate: string =
    `<div
        ng-dblclick="grid.appScope.rowDblClick(row)"
        ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"
        class="ui-grid-cell"
        ng-class="{ 'ui-grid-row-header-cell': col.isRowHeader }"
        ui-grid-cell>
    </div>`;

    //#endregion

    //#region Constructor

    static $inject = ['$timeout'];

    constructor(private $timeout) {
    }

    //#endregion

    //#region Functions

    public initScrollPagedGridOptions(controller: BaseLookupController<T>, columnDefs: Array<T>) {

        let scrollGridOptions = {
            columnDefs: columnDefs,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            onRegisterApi: (gridApi) => {

                this.handleUiGridCallbacks(gridApi, controller,
                    (ctrl, isScrollPaging) => this.doSearch(ctrl, isScrollPaging));
            },
            rowTemplate: UiGridService.rowTemplate,
            enablePaginationControls: false,
            enablePagination: false
        };

        Object.assign(scrollGridOptions, UiGridService.commonGridOptions);

        return scrollGridOptions;
    }

    public initPagedGridOptions(controller: BaseLookupController<T>, columnDefs: Array<T>) {

        let pagedGridOptions = {
            useExternalPagination: true,
            columnDefs: columnDefs,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            enableRowHeaderSelection: false,
            onRegisterApi: (gridApi) => {
                controller.gridApi = gridApi;

                this.handleUiGridCallbacks(gridApi, controller,
                    (ctrl, isScrollPaging) => this.doSearch(ctrl, isScrollPaging));
            },
            rowTemplate: UiGridService.rowTemplate,
            enablePaginationControls: true,
            enablePagination: true,
            paginationPageSizes: [10, 20]
        };

        Object.assign(pagedGridOptions, UiGridService.commonGridOptions);

        return pagedGridOptions;
    }

    public initFilterRequest(gridOptions): UiGridRequest {

        let request = new UiGridRequest();

        request.pageSize = gridOptions.paginationPageSize;
        request.page = 1;
        request.sort = null;
        request.filters = [];

        return request;
    }

    public doSearch(controller: BaseLookupController<T>, isScrollPaging: boolean = false): Promise<any> {

        if (controller.isRequestRunning) { return; }
        if (isScrollPaging && controller.allDataFetched) { return; }

        controller.isRequestError = false;
        controller.allDataFetched = false;
        controller.isRequestRunning = true;
        controller.selectedItem = null;

        return controller.getItems({ request: controller.filterRequest })
            .then((response: UiGridResult<T>) => {
                if (isScrollPaging) {

                    if (response.length === 0) {
                        controller.allDataFetched = true;
                    }

                    controller.gridOptions.data = controller.gridOptions.data.concat(response);

                } else {
                    controller.gridOptions.data = response.data;
                    controller.gridOptions.totalItems = response.totalItems;
                }

            })
            .catch(() => {
                controller.isRequestError = true;
            })
            .then(() => {
                this.$timeout(() => {
                    controller.isRequestRunning = false;
                    this.resizeGrid(controller);
                });
            });
    }

    public destroyGrid(controller: BaseLookupController<T>) {
        controller.gridApi.core.clearAllFilters();
        controller.gridOptions = null;
        controller.filterRequest = null;
        controller.gridApi = null;
        controller.gridColumns = null;
    }

    private handleUiGridCallbacks(gridApi, controller: BaseLookupController<T>,
        callback: (controller: BaseLookupController<T>, isScrollPaging: boolean) => void): void {

        gridApi.core.on.sortChanged(controller.$scope, (grid, sortColumns) => {

            controller.filterRequest.page = 1;

            if (sortColumns.length === 0) {
                controller.filterRequest.sort = null;
            } else {
                controller.filterRequest.sort = {
                    direction: sortColumns[0].sort.direction,
                    memberName: sortColumns[0].field
                };
            }

            this.gridFilterChanged(controller, false, (ctrl, isScrollPaging) => callback(ctrl, isScrollPaging));
        });

        gridApi.pagination.on.paginationChanged(controller.$scope, (newPage, pageSize) => {

            controller.filterRequest.page = newPage;
            controller.filterRequest.pageSize = pageSize;

            this.gridFilterChanged(controller, false, (ctrl, isScrollPaging) => callback(ctrl, isScrollPaging));
        });

        if (controller.gridOptions.enablePagination === false) {

            gridApi.core.on.scrollEnd(controller.$scope, (e) => {

                let viewPort: any = $('.ui-grid-viewport')[0];
                let fullHeight = viewPort.scrollHeight - viewPort.offsetHeight - 1;

                if (viewPort.scrollTop === fullHeight) {

                    controller.filterRequest.page++;

                    this.gridFilterChanged(controller, true, (ctrl, isScrollPaging) => callback(ctrl, isScrollPaging));
                }

            });
        }

        gridApi.core.on.filterChanged(controller.$scope, () => {

            var filters = [];

            controller.filterRequest.page = 1;
            controller.filterRequest.filters = filters;

            gridApi.grid.columns.forEach((column) => {

                if (_.has(column, 'filters[0].term') && _.has(column, 'filters[0].condition')) {

                    if (column.filters[0].term !== null && column.filters[0].term !== undefined) {
                        filters.push({
                            memberName: column.field,
                            value: column.filters[0].term,
                            condition: column.filters[0].condition
                        });
                    }
                }
            });

            gridApi.pagination.seek(1);
            this.gridFilterChanged(controller, false, (ctrl, isScrollPaging) => callback(ctrl, isScrollPaging));
        });

        gridApi.selection.on.rowSelectionChanged(controller.$scope, (row) => {

            if (row && row.entity) {
                controller.selectedItem = row.entity;
            }
        });
    }

    private gridFilterChanged(
        controller: BaseLookupController<T>,
        isScrollPaging: boolean,
        callback: (controller: BaseLookupController<T>, isScrollPaging: boolean) => void): void {

        if (controller.filterChangedTimeout) {
            this.$timeout.cancel(controller.filterChangedTimeout);
        }

        controller.filterChangedTimeout = this.$timeout(() => {
            callback(controller, isScrollPaging);
        }, 400);
    }

    /**
     * Resize the grid according to the number of rows retrieved from the data
     * source. If the number of rows is less than the page size, resize the grid
     * to fit that number of rows.
     *
     * If there are no items to display, resize the grid to allow for the display
     * of an error message inside the grid.
     *
     * @param  {BaseLookupController<T>} controller - The controller.
     */
    private resizeGrid(controller: BaseLookupController<T>) {

        let noItemsElement = $(controller.gridApi.grid.element).find('.noItemsInfoContainer');

        let headerHeight = $(controller.gridApi.grid.element).find('.ui-grid-top-panel').outerHeight();
        let footerHeight = $(controller.gridApi.grid.element).find('.ui-grid-pager-panel').outerHeight();
        let noItemsFoundHeight = noItemsElement.outerHeight();

        let rowsToShow = controller.gridOptions.paginationPageSize;

        if (controller.gridOptions.data && controller.gridOptions.data.length < rowsToShow) {
            rowsToShow = controller.gridOptions.data.length;
        }

        let viewPortHeight = rowsToShow * controller.gridOptions.rowHeight + 1;

        if (rowsToShow === 0) {
            viewPortHeight += noItemsFoundHeight;
            noItemsElement.css('margin-top', `${headerHeight + 2}px`);
        }

        $(controller.gridApi.grid.element).height(viewPortHeight + headerHeight + footerHeight);
    }

    //#endregion
}

/**
 * uigrid service.
 */
export interface IUiGridService<T> {

    /**
     * inits grid options for scroll paging grid.
     */
    initScrollPagedGridOptions(controller: BaseLookupController<T>, columnDefs: Array<any>);

    /**
     * inits grid options for non-scrolling paging grid.
     */
    initPagedGridOptions(controller: BaseLookupController<T>, columnDefs: Array<any>);

    /**
     * inits filter request object for ui-grid
     * @param {Object} gridOptions - grid options object
     * @returns {Object} filter request Obj
     */
    initFilterRequest(gridOptions): UiGridRequest;

    /**
     * makes a call to api to get the data.
     */
    doSearch(controller: BaseLookupController<T>, isScrollPaging: boolean): Promise<any>;

    /**
     * destroys grid variables linked to controller.
     */
    destroyGrid(controller: BaseLookupController<T>): void;
}
