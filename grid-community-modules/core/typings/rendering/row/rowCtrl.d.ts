import { UserCompDetails } from "../../components/framework/userComponentFactory";
import { BeanStub } from "../../context/beanStub";
import { Column, ColumnPinnedType } from "../../entities/column";
import { RowStyle } from "../../entities/gridOptions";
import { RowNode } from "../../entities/rowNode";
import { RowPosition } from "../../entities/rowPositionUtils";
import { CellFocusedEvent, RowEvent } from "../../events";
import { RowContainerType } from "../../gridBodyComp/rowContainer/rowContainerCtrl";
import { IFrameworkOverrides } from "../../interfaces/iFrameworkOverrides";
import { Beans } from "../beans";
import { CellCtrl } from "../cell/cellCtrl";
import { ICellRenderer, ICellRendererParams } from "../cellRenderers/iCellRenderer";
declare enum RowType {
    Normal = "Normal",
    FullWidth = "FullWidth",
    FullWidthLoading = "FullWidthLoading",
    FullWidthGroup = "FullWidthGroup",
    FullWidthDetail = "FullWidthDetail"
}
export interface IRowComp {
    setDomOrder(domOrder: boolean): void;
    addOrRemoveCssClass(cssClassName: string, on: boolean): void;
    setCellCtrls(cellCtrls: CellCtrl[], useFlushSync: boolean): void;
    showFullWidth(compDetails: UserCompDetails): void;
    getFullWidthCellRenderer(): ICellRenderer | null | undefined;
    setTop(top: string): void;
    setTransform(transform: string): void;
    setRowIndex(rowIndex: string): void;
    setRowId(rowId: string): void;
    setRowBusinessKey(businessKey: string): void;
    setTabIndex(tabIndex: number): void;
    setUserStyles(styles: RowStyle): void;
    setRole(role: string): void;
}
export declare class RowCtrl extends BeanStub {
    static DOM_DATA_KEY_ROW_CTRL: string;
    private instanceId;
    private readonly rowNode;
    private readonly beans;
    private rowType;
    private leftGui;
    private centerGui;
    private rightGui;
    private fullWidthGui;
    private allRowGuis;
    private firstRowOnPage;
    private lastRowOnPage;
    private active;
    private stoppingRowEdit;
    private editingRow;
    private rowFocused;
    private centerCellCtrls;
    private leftCellCtrls;
    private rightCellCtrls;
    private slideInAnimation;
    private fadeInAnimation;
    private readonly useAnimationFrameForCreate;
    private paginationPage;
    private lastMouseDownOnDragger;
    private rowLevel;
    private readonly printLayout;
    private updateColumnListsPending;
    private businessKeySanitised;
    constructor(rowNode: RowNode, beans: Beans, animateIn: boolean, useAnimationFrameForCreate: boolean, printLayout: boolean);
    private initRowBusinessKey;
    isSticky(): boolean;
    getBeans(): Beans;
    getInstanceId(): string;
    setComp(rowComp: IRowComp, element: HTMLElement, containerType: RowContainerType): void;
    unsetComp(containerType: RowContainerType): void;
    isCacheable(): boolean;
    setCached(cached: boolean): void;
    private initialiseRowComp;
    private executeSlideAndFadeAnimations;
    private addRowDraggerToRow;
    private setupFullWidth;
    isPrintLayout(): boolean;
    getFullWidthCellRenderer(): ICellRenderer<any> | null | undefined;
    getCellElement(column: Column): HTMLElement | null;
    executeProcessRowPostCreateFunc(): void;
    private areAllContainersReady;
    private setRowType;
    private updateColumnLists;
    private createCellCtrls;
    private updateColumnListsImpl;
    private isCellEligibleToBeRemoved;
    private setAnimateFlags;
    isEditing(): boolean;
    stopRowEditing(cancel: boolean): void;
    isFullWidth(): boolean;
    getRowType(): RowType;
    refreshFullWidth(): boolean;
    private addListeners;
    private onColumnMoved;
    private addListenersForCellComps;
    private onRowNodeDataChanged;
    private onRowNodeCellChanged;
    private postProcessCss;
    private onRowNodeHighlightChanged;
    private onRowNodeDraggingChanged;
    private postProcessRowDragging;
    private updateExpandedCss;
    private onDisplayedColumnsChanged;
    private onVirtualColumnsChanged;
    getRowPosition(): RowPosition;
    onKeyboardNavigate(keyboardEvent: KeyboardEvent): void;
    onTabKeyDown(keyboardEvent: KeyboardEvent): void;
    onFullWidthRowFocused(event?: CellFocusedEvent): void;
    refreshCell(cellCtrl: CellCtrl): void;
    private removeCellCtrl;
    onMouseEvent(eventName: string, mouseEvent: MouseEvent): void;
    createRowEvent(type: string, domEvent?: Event): RowEvent;
    private createRowEventWithSource;
    private onRowDblClick;
    private onRowMouseDown;
    onRowClick(mouseEvent: MouseEvent): void;
    setupDetailRowAutoHeight(eDetailGui: HTMLElement): void;
    createFullWidthParams(eRow: HTMLElement, pinned: ColumnPinnedType): ICellRendererParams;
    private addFullWidthRowDragging;
    private onUiLevelChanged;
    private isFirstRowOnPage;
    private isLastRowOnPage;
    private onModelUpdated;
    private refreshFirstAndLastRowStyles;
    stopEditing(cancel?: boolean): void;
    setInlineEditingCss(editing: boolean): void;
    private setEditingRow;
    startRowEditing(key?: string | null, charPress?: string | null, sourceRenderedCell?: CellCtrl | null, event?: KeyboardEvent | null): void;
    getAllCellCtrls(): CellCtrl[];
    private postProcessClassesFromGridOptions;
    private postProcessRowClassRules;
    private setStylesFromGridOptions;
    private getPinnedForContainer;
    private getInitialRowClasses;
    processStylesFromGridOptions(): any;
    private onRowSelected;
    private createAriaLabel;
    isUseAnimationFrameForCreate(): boolean;
    addHoverFunctionality(eRow: HTMLElement): void;
    roundRowTopToBounds(rowTop: number): number;
    protected getFrameworkOverrides(): IFrameworkOverrides;
    private forEachGui;
    private onRowHeightChanged;
    addEventListener(eventType: string, listener: Function): void;
    removeEventListener(eventType: string, listener: Function): void;
    destroyFirstPass(): void;
    private setupRemoveAnimation;
    destroySecondPass(): void;
    private setFocusedClasses;
    private onCellFocused;
    private onCellFocusCleared;
    private onCellFocusChanged;
    private onPaginationChanged;
    private onTopChanged;
    private onPaginationPixelOffsetChanged;
    private applyPaginationOffset;
    setRowTop(pixels: number): void;
    getInitialRowTop(rowContainerType: RowContainerType): string | undefined;
    getInitialTransform(rowContainerType: RowContainerType): string | undefined;
    private getInitialRowTopShared;
    private setRowTopStyle;
    getRowNode(): RowNode;
    getCellCtrl(column: Column): CellCtrl | null;
    private onRowIndexChanged;
    private updateRowIndexes;
    getPinnedLeftRowElement(): HTMLElement;
    getPinnedRightRowElement(): HTMLElement;
    getBodyRowElement(): HTMLElement;
    getFullWidthRowElement(): HTMLElement;
}
export {};
