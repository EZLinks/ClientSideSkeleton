import { UiGridRequest } from 'models/uiGrid/uiGridRequest';

/**
 * the ui grid controller interface.
 */
export abstract class UiGridLookup<T> {
    /**
     * the grid options.
     */
    gridOptions: any;

    /**
     * the filter request.
     */
    filterRequest: UiGridRequest;

    /**
     * check is all data is fetched.
     */
    allDataFetched: boolean;

    /**
     * check if grid request is running.
     */
    isRequestRunning: boolean;

    /**
     * is request error occured.
     */
    isRequestError: boolean;

    /**
     * the filter timeout.
     */
    filterChangedTimeout: any;

    /**
     * the selected item.
     */
    selectedItem: T;

    /**
     * The template for each row.
     */
    rowTemplate: string =
    `<div
        ng-dblclick="grid.appScope.rowDblClick(row)"
        ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"
        class="ui-grid-cell"
        ng-class="{ 'ui-grid-row-header-cell': col.isRowHeader }"
        ui-grid-cell>
    </div>`;

    /**
     * gets the items from api.
     */
    abstract getItemsApi(request: UiGridRequest): Promise<any>;

    /**
     * The event that occurs when a row is double clicked.
     */
    abstract onDoubleClickEvent(selectedItem): void;

    constructor(public $scope) {
        $scope.rowDblClick = (row) => this.onDoubleClickEvent(row.entity);
    }
}
