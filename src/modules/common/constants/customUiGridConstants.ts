export class CustomUiGridConstants {
    static get Default(): any {
        return {
            debounceDelay: 400,
            headerCellTemplate: require('ngtemplate!../templates/ui-grid/ui-grid-search-header.html'),
            filterHeaderTemplate: require('ngtemplate!../templates/ui-grid/ui-grid-filter.html'),
            cellTemplate: require('ngtemplate!../templates/ui-grid/ui-grid-centered-cell.html')
        };
    }
}