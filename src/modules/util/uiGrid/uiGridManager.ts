import { ManagerState } from 'enums/managerState';
import { EditorState } from 'enums/editorState';

export abstract class UiGridManager<T> {
    ManagerState = ManagerState;

    static editorLoader: string = 'codeCertificatesEditorLoader';

    public editorState: EditorState;

    public managerState: ManagerState;

    public selectedItem: T;

    get state(): ManagerState {
        return this.managerState;
    }

    /**
     * Needs to be set in a timeout so the page updates accordingly.
     */
    set state(val: ManagerState) {
        this.managerState = val;
    }

    constructor() {
        this.clearSelected();
        this.state = ManagerState.Lookup;
    }

    /*
    * Opens editor to create a new code certificate.
    */
    newItem() {
        this.clearSelected();
        this.editorState = EditorState.Add;
        this.state = ManagerState.Editor;
    }

    /*
    * Callback executes when add/edit editor is closing.
    */
    closeEditor() {
        this.clearSelected();
        this.state = ManagerState.Lookup;
    }

    /**
     * Opens the editor
     */
    openEditor() {
        this.state = ManagerState.Editor;
    }

    /*
    * The method used to get an up-to-date version of the selected item from the server for the editor.
    */
    abstract getItem(): Promise<any>;

    /*
    * Clears selected item.
    */
    clearSelected() {
        this.selectedItem = null;
    }
}
