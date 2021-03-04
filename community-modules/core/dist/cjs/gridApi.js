/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / React / AngularJS / Web Components
 * @version v25.1.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gridOptionsWrapper_1 = require("./gridOptionsWrapper");
var constants_1 = require("./constants/constants");
var context_1 = require("./context/context");
var iExcelCreator_1 = require("./interfaces/iExcelCreator");
var moduleNames_1 = require("./modules/moduleNames");
var iClientSideRowModel_1 = require("./interfaces/iClientSideRowModel");
var moduleRegistry_1 = require("./modules/moduleRegistry");
var object_1 = require("./utils/object");
var generic_1 = require("./utils/generic");
var string_1 = require("./utils/string");
var function_1 = require("./utils/function");
var GridApi = /** @class */ (function () {
    function GridApi() {
        this.detailGridInfoMap = {};
        this.destroyCalled = false;
    }
    GridApi.prototype.registerGridComp = function (gridPanel) {
        this.gridPanel = gridPanel;
    };
    GridApi.prototype.registerGridCore = function (gridCore) {
        this.gridCore = gridCore;
    };
    GridApi.prototype.registerHeaderRootComp = function (headerRootComp) {
        this.headerRootComp = headerRootComp;
    };
    GridApi.prototype.init = function () {
        switch (this.rowModel.getType()) {
            case constants_1.Constants.ROW_MODEL_TYPE_CLIENT_SIDE:
                this.clientSideRowModel = this.rowModel;
                break;
            case constants_1.Constants.ROW_MODEL_TYPE_INFINITE:
                this.infiniteRowModel = this.rowModel;
                break;
            case constants_1.Constants.ROW_MODEL_TYPE_SERVER_SIDE:
                this.serverSideRowModel = this.rowModel;
                break;
        }
    };
    /** Used internally by grid. Not intended to be used by the client. Interface may change between releases. */
    GridApi.prototype.__getAlignedGridService = function () {
        return this.alignedGridsService;
    };
    GridApi.prototype.addDetailGridInfo = function (id, gridInfo) {
        this.detailGridInfoMap[id] = gridInfo;
    };
    GridApi.prototype.removeDetailGridInfo = function (id) {
        this.detailGridInfoMap[id] = undefined;
    };
    GridApi.prototype.getDetailGridInfo = function (id) {
        return this.detailGridInfoMap[id];
    };
    GridApi.prototype.forEachDetailGridInfo = function (callback) {
        var index = 0;
        object_1.iterateObject(this.detailGridInfoMap, function (id, gridInfo) {
            // check for undefined, as old references will still be lying around
            if (generic_1.exists(gridInfo)) {
                callback(gridInfo, index);
                index++;
            }
        });
    };
    GridApi.prototype.getDataAsCsv = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.CsvExportModule, 'api.getDataAsCsv')) {
            return this.csvCreator.getDataAsCsv(params);
        }
    };
    GridApi.prototype.exportDataAsCsv = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.CsvExportModule, 'api.exportDataAsCSv')) {
            this.csvCreator.exportDataAsCsv(params);
        }
    };
    GridApi.prototype.getDataAsExcel = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.ExcelExportModule, 'api.getDataAsExcel')) {
            var exportMode = (params && params.exportMode) || 'xlsx';
            if (this.excelCreator.getFactoryMode(exportMode) === iExcelCreator_1.ExcelFactoryMode.MULTI_SHEET) {
                console.warn('AG Grid: The Excel Exporter is currently on Multi Sheet mode. End that operation by calling `api.getMultipleSheetAsExcel()` or `api.exportMultipleSheetsAsExcel()`');
                return;
            }
            return this.excelCreator.getDataAsExcel(params);
        }
    };
    GridApi.prototype.exportDataAsExcel = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.ExcelExportModule, 'api.exportDataAsExcel')) {
            var exportMode = (params && params.exportMode) || 'xlsx';
            if (this.excelCreator.getFactoryMode(exportMode) === iExcelCreator_1.ExcelFactoryMode.MULTI_SHEET) {
                console.warn('AG Grid: The Excel Exporter is currently on Multi Sheet mode. End that operation by calling `api.getMultipleSheetAsExcel()` or `api.exportMultipleSheetsAsExcel()`');
                return;
            }
            this.excelCreator.exportDataAsExcel(params);
        }
    };
    GridApi.prototype.getGridRawDataForExcel = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.ExcelExportModule, 'api.getGridRawDataForExcel')) {
            var exportMode = (params && params.exportMode) || 'xlsx';
            this.excelCreator.setFactoryMode(iExcelCreator_1.ExcelFactoryMode.MULTI_SHEET, exportMode);
            return this.excelCreator.getGridRawDataForExcel(params);
        }
    };
    GridApi.prototype.getMultipleSheetsAsExcel = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.ExcelExportModule, 'api.getMultipleSheetsAsExcel')) {
            return this.excelCreator.getMultipleSheetsAsExcel(params);
        }
    };
    GridApi.prototype.exportMultipleSheetsAsExcel = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.ExcelExportModule, 'api.exportMultipleSheetsAsExcel')) {
            return this.excelCreator.exportMultipleSheetsAsExcel(params);
        }
    };
    /** @deprecated */
    GridApi.prototype.setEnterpriseDatasource = function (datasource) {
        console.warn("ag-grid: since version 18.x, api.setEnterpriseDatasource() should be replaced with api.setServerSideDatasource()");
        this.setServerSideDatasource(datasource);
    };
    GridApi.prototype.setGridAriaProperty = function (property, value) {
        if (!property) {
            return;
        }
        var eGrid = this.gridPanel.getGui();
        var ariaProperty = "aria-" + property;
        if (value === null) {
            eGrid.removeAttribute(ariaProperty);
        }
        else {
            eGrid.setAttribute(ariaProperty, value);
        }
    };
    GridApi.prototype.setServerSideDatasource = function (datasource) {
        if (this.serverSideRowModel) {
            // should really have an IEnterpriseRowModel interface, so we are not casting to any
            this.serverSideRowModel.setDatasource(datasource);
        }
        else {
            console.warn("AG Grid: you can only use an enterprise datasource when gridOptions.rowModelType is '" + constants_1.Constants.ROW_MODEL_TYPE_SERVER_SIDE + "'");
        }
    };
    GridApi.prototype.setDatasource = function (datasource) {
        if (this.gridOptionsWrapper.isRowModelInfinite()) {
            this.rowModel.setDatasource(datasource);
        }
        else {
            console.warn("AG Grid: you can only use a datasource when gridOptions.rowModelType is '" + constants_1.Constants.ROW_MODEL_TYPE_INFINITE + "'");
        }
    };
    GridApi.prototype.setViewportDatasource = function (viewportDatasource) {
        if (this.gridOptionsWrapper.isRowModelViewport()) {
            // this is bad coding, because it's using an interface that's exposed in the enterprise.
            // really we should create an interface in the core for viewportDatasource and let
            // the enterprise implement it, rather than casting to 'any' here
            this.rowModel.setViewportDatasource(viewportDatasource);
        }
        else {
            console.warn("AG Grid: you can only use a viewport datasource when gridOptions.rowModelType is '" + constants_1.Constants.ROW_MODEL_TYPE_VIEWPORT + "'");
        }
    };
    GridApi.prototype.setRowData = function (rowData) {
        if (this.gridOptionsWrapper.isRowModelDefault()) {
            if (this.gridOptionsWrapper.isImmutableData()) {
                var transactionAndMap = this.immutableService.createTransactionForRowData(rowData);
                if (!transactionAndMap) {
                    return;
                }
                var transaction = transactionAndMap[0], orderIdMap = transactionAndMap[1];
                var nodeTransaction = this.clientSideRowModel.updateRowData(transaction, orderIdMap);
                // need to force updating of full width rows - note this wouldn't be necessary the full width cell comp listened
                // to the data change event on the row node and refreshed itself.
                if (nodeTransaction) {
                    this.rowRenderer.refreshFullWidthRows(nodeTransaction.update);
                }
            }
            else {
                this.selectionController.reset();
                this.clientSideRowModel.setRowData(rowData);
            }
        }
        else {
            console.warn('cannot call setRowData unless using normal row model');
        }
    };
    /** @deprecated */
    GridApi.prototype.setFloatingTopRowData = function (rows) {
        console.warn('AG Grid: since v12, api.setFloatingTopRowData() is now api.setPinnedTopRowData()');
        this.setPinnedTopRowData(rows);
    };
    /** @deprecated */
    GridApi.prototype.setFloatingBottomRowData = function (rows) {
        console.warn('AG Grid: since v12, api.setFloatingBottomRowData() is now api.setPinnedBottomRowData()');
        this.setPinnedBottomRowData(rows);
    };
    /** @deprecated */
    GridApi.prototype.getFloatingTopRowCount = function () {
        console.warn('AG Grid: since v12, api.getFloatingTopRowCount() is now api.getPinnedTopRowCount()');
        return this.getPinnedTopRowCount();
    };
    /** @deprecated */
    GridApi.prototype.getFloatingBottomRowCount = function () {
        console.warn('AG Grid: since v12, api.getFloatingBottomRowCount() is now api.getPinnedBottomRowCount()');
        return this.getPinnedBottomRowCount();
    };
    /** @deprecated */
    GridApi.prototype.getFloatingTopRow = function (index) {
        console.warn('AG Grid: since v12, api.getFloatingTopRow() is now api.getPinnedTopRow()');
        return this.getPinnedTopRow(index);
    };
    /** @deprecated */
    GridApi.prototype.getFloatingBottomRow = function (index) {
        console.warn('AG Grid: since v12, api.getFloatingBottomRow() is now api.getPinnedBottomRow()');
        return this.getPinnedBottomRow(index);
    };
    GridApi.prototype.setPinnedTopRowData = function (rows) {
        this.pinnedRowModel.setPinnedTopRowData(rows);
    };
    GridApi.prototype.setPinnedBottomRowData = function (rows) {
        this.pinnedRowModel.setPinnedBottomRowData(rows);
    };
    GridApi.prototype.getPinnedTopRowCount = function () {
        return this.pinnedRowModel.getPinnedTopRowCount();
    };
    GridApi.prototype.getPinnedBottomRowCount = function () {
        return this.pinnedRowModel.getPinnedBottomRowCount();
    };
    GridApi.prototype.getPinnedTopRow = function (index) {
        return this.pinnedRowModel.getPinnedTopRow(index);
    };
    GridApi.prototype.getPinnedBottomRow = function (index) {
        return this.pinnedRowModel.getPinnedBottomRow(index);
    };
    GridApi.prototype.setColumnDefs = function (colDefs, source) {
        if (source === void 0) { source = "api"; }
        this.columnController.setColumnDefs(colDefs, source);
    };
    GridApi.prototype.setAutoGroupColumnDef = function (colDef, source) {
        if (source === void 0) { source = "api"; }
        this.gridOptionsWrapper.setProperty('autoGroupColumnDef', colDef, true);
    };
    GridApi.prototype.expireValueCache = function () {
        this.valueCache.expire();
    };
    GridApi.prototype.getVerticalPixelRange = function () {
        return this.gridPanel.getVScrollPosition();
    };
    GridApi.prototype.getHorizontalPixelRange = function () {
        return this.gridPanel.getHScrollPosition();
    };
    GridApi.prototype.setAlwaysShowHorizontalScroll = function (show) {
        this.gridOptionsWrapper.setProperty('alwaysShowHorizontalScroll', show);
    };
    GridApi.prototype.setAlwaysShowVerticalScroll = function (show) {
        this.gridOptionsWrapper.setProperty('alwaysShowVerticalScroll', show);
    };
    GridApi.prototype.refreshToolPanel = function () {
        this.gridCore.refreshSideBar();
    };
    GridApi.prototype.refreshCells = function (params) {
        if (params === void 0) { params = {}; }
        if (Array.isArray(params)) {
            // the old version of refreshCells() took an array of rowNodes for the first argument
            console.warn('since AG Grid v11.1, refreshCells() now takes parameters, please see the documentation.');
            return;
        }
        this.rowRenderer.refreshCells(params);
    };
    GridApi.prototype.flashCells = function (params) {
        if (params === void 0) { params = {}; }
        this.rowRenderer.flashCells(params);
    };
    GridApi.prototype.redrawRows = function (params) {
        if (params === void 0) { params = {}; }
        if (params && params.rowNodes) {
            this.rowRenderer.redrawRows(params.rowNodes);
        }
        else {
            this.rowRenderer.redrawAfterModelUpdate();
        }
    };
    GridApi.prototype.timeFullRedraw = function (count) {
        if (count === void 0) { count = 1; }
        var iterationCount = 0;
        var totalProcessing = 0;
        var totalReflow = 0;
        var that = this;
        doOneIteration();
        function doOneIteration() {
            var start = (new Date()).getTime();
            that.rowRenderer.redrawAfterModelUpdate();
            var endProcessing = (new Date()).getTime();
            window.setTimeout(function () {
                var endReflow = (new Date()).getTime();
                var durationProcessing = endProcessing - start;
                var durationReflow = endReflow - endProcessing;
                // tslint:disable-next-line
                console.log('duration:  processing = ' + durationProcessing + 'ms, reflow = ' + durationReflow + 'ms');
                iterationCount++;
                totalProcessing += durationProcessing;
                totalReflow += durationReflow;
                if (iterationCount < count) {
                    // wait for 1s between tests
                    window.setTimeout(doOneIteration, 1000);
                }
                else {
                    finish();
                }
            }, 0);
        }
        function finish() {
            // tslint:disable-next-line
            console.log('tests complete. iteration count = ' + iterationCount);
            // tslint:disable-next-line
            console.log('average processing = ' + (totalProcessing / iterationCount) + 'ms');
            // tslint:disable-next-line
            console.log('average reflow = ' + (totalReflow / iterationCount) + 'ms');
        }
    };
    /** @deprecated */
    GridApi.prototype.refreshView = function () {
        console.warn('AG Grid: since v11.1, refreshView() is deprecated, please call refreshCells() or redrawRows() instead');
        this.redrawRows();
    };
    /** @deprecated */
    GridApi.prototype.refreshRows = function (rowNodes) {
        console.warn('since AG Grid v11.1, refreshRows() is deprecated, please use refreshCells({rowNodes: rows}) or redrawRows({rowNodes: rows}) instead');
        this.refreshCells({ rowNodes: rowNodes });
    };
    /** @deprecated */
    GridApi.prototype.rowDataChanged = function (rows) {
        console.warn('AG Grid: rowDataChanged is deprecated, either call refreshView() to refresh everything, or call rowNode.setRowData(newData) to set value on a particular node');
        this.redrawRows();
    };
    /** @deprecated */
    GridApi.prototype.softRefreshView = function () {
        console.error('AG Grid: since v16, softRefreshView() is no longer supported. Please check the documentation on how to refresh.');
    };
    /** @deprecated */
    GridApi.prototype.refreshGroupRows = function () {
        console.warn('AG Grid: since v11.1, refreshGroupRows() is no longer supported, call refreshCells() instead. ' +
            'Because refreshCells() now does dirty checking, it will only refresh cells that have changed, so it should ' +
            'not be necessary to only refresh the group rows.');
        this.refreshCells();
    };
    GridApi.prototype.setFunctionsReadOnly = function (readOnly) {
        this.gridOptionsWrapper.setProperty('functionsReadOnly', readOnly);
    };
    GridApi.prototype.refreshHeader = function () {
        this.headerRootComp.refreshHeader();
        this.gridPanel.setHeaderAndFloatingHeights();
    };
    GridApi.prototype.isAnyFilterPresent = function () {
        return this.filterManager.isAnyFilterPresent();
    };
    /** @deprecated */
    GridApi.prototype.isAdvancedFilterPresent = function () {
        console.warn('AG Grid: isAdvancedFilterPresent() is deprecated, please use isColumnFilterPresent()');
        return this.isColumnFilterPresent();
    };
    GridApi.prototype.isColumnFilterPresent = function () {
        return this.filterManager.isAdvancedFilterPresent();
    };
    GridApi.prototype.isQuickFilterPresent = function () {
        return this.filterManager.isQuickFilterPresent();
    };
    GridApi.prototype.getModel = function () {
        return this.rowModel;
    };
    GridApi.prototype.setRowNodeExpanded = function (rowNode, expanded) {
        if (rowNode) {
            rowNode.setExpanded(expanded);
        }
    };
    GridApi.prototype.onGroupExpandedOrCollapsed = function (deprecated_refreshFromIndex) {
        if (generic_1.missing(this.clientSideRowModel)) {
            console.warn('AG Grid: cannot call onGroupExpandedOrCollapsed unless using normal row model');
        }
        if (generic_1.exists(deprecated_refreshFromIndex)) {
            console.warn('AG Grid: api.onGroupExpandedOrCollapsed - refreshFromIndex parameter is no longer used, the grid will refresh all rows');
        }
        // we don't really want the user calling this if only one rowNode was expanded, instead they should be
        // calling rowNode.setExpanded(boolean) - this way we do a 'keepRenderedRows=false' so that the whole
        // grid gets refreshed again - otherwise the row with the rowNodes that were changed won't get updated,
        // and thus the expand icon in the group cell won't get 'opened' or 'closed'.
        this.clientSideRowModel.refreshModel({ step: iClientSideRowModel_1.ClientSideRowModelSteps.MAP });
    };
    GridApi.prototype.refreshInMemoryRowModel = function (step) {
        console.warn("ag-grid: since version 18.x, api.refreshInMemoryRowModel() should be replaced with api.refreshClientSideRowModel()");
        this.refreshClientSideRowModel(step);
    };
    GridApi.prototype.refreshClientSideRowModel = function (step) {
        if (generic_1.missing(this.clientSideRowModel)) {
            console.warn('cannot call refreshClientSideRowModel unless using normal row model');
        }
        var paramsStep = iClientSideRowModel_1.ClientSideRowModelSteps.EVERYTHING;
        var stepsMapped = {
            group: iClientSideRowModel_1.ClientSideRowModelSteps.EVERYTHING,
            filter: iClientSideRowModel_1.ClientSideRowModelSteps.FILTER,
            map: iClientSideRowModel_1.ClientSideRowModelSteps.MAP,
            aggregate: iClientSideRowModel_1.ClientSideRowModelSteps.AGGREGATE,
            sort: iClientSideRowModel_1.ClientSideRowModelSteps.SORT,
            pivot: iClientSideRowModel_1.ClientSideRowModelSteps.PIVOT
        };
        if (generic_1.exists(step)) {
            paramsStep = stepsMapped[step];
        }
        if (generic_1.missing(paramsStep)) {
            console.error("AG Grid: invalid step " + step + ", available steps are " + Object.keys(stepsMapped).join(', '));
            return;
        }
        var modelParams = {
            step: paramsStep,
            keepRenderedRows: true,
            animate: true,
            keepEditingRows: true
        };
        this.clientSideRowModel.refreshModel(modelParams);
    };
    GridApi.prototype.isAnimationFrameQueueEmpty = function () {
        return this.animationFrameService.isQueueEmpty();
    };
    GridApi.prototype.getRowNode = function (id) {
        return this.rowModel.getRowNode(id);
    };
    GridApi.prototype.getSizesForCurrentTheme = function () {
        return {
            rowHeight: this.gridOptionsWrapper.getRowHeightAsNumber(),
            headerHeight: this.gridOptionsWrapper.getHeaderHeight()
        };
    };
    GridApi.prototype.expandAll = function () {
        if (this.clientSideRowModel) {
            this.clientSideRowModel.expandOrCollapseAll(true);
        }
        else if (this.serverSideRowModel) {
            this.serverSideRowModel.expandAll(true);
        }
        else {
            console.warn('AG Grid: expandAll only works with Client Side Row Model and Server Side Row Model');
        }
    };
    GridApi.prototype.collapseAll = function () {
        if (this.clientSideRowModel) {
            this.clientSideRowModel.expandOrCollapseAll(false);
        }
        else if (this.serverSideRowModel) {
            this.serverSideRowModel.expandAll(false);
        }
        else {
            console.warn('AG Grid: collapseAll only works with Client Side Row Model and Server Side Row Model');
        }
    };
    GridApi.prototype.getToolPanelInstance = function (id) {
        return this.gridCore.getToolPanelInstance(id);
    };
    GridApi.prototype.addVirtualRowListener = function (eventName, rowIndex, callback) {
        if (typeof eventName !== 'string') {
            console.warn('AG Grid: addVirtualRowListener is deprecated, please use addRenderedRowListener.');
        }
        this.addRenderedRowListener(eventName, rowIndex, callback);
    };
    GridApi.prototype.addRenderedRowListener = function (eventName, rowIndex, callback) {
        if (eventName === 'virtualRowSelected') {
            console.warn("AG Grid: event virtualRowSelected is deprecated, to register for individual row\n                selection events, add a listener directly to the row node.");
        }
        this.rowRenderer.addRenderedRowListener(eventName, rowIndex, callback);
    };
    GridApi.prototype.setQuickFilter = function (newFilter) {
        this.filterManager.setQuickFilter(newFilter);
    };
    GridApi.prototype.selectIndex = function (index, tryMulti, suppressEvents) {
        console.warn('AG Grid: do not use api for selection, call node.setSelected(value) instead');
        if (suppressEvents) {
            console.warn('AG Grid: suppressEvents is no longer supported, stop listening for the event if you no longer want it');
        }
        this.selectionController.selectIndex(index, tryMulti);
    };
    GridApi.prototype.deselectIndex = function (index, suppressEvents) {
        if (suppressEvents === void 0) { suppressEvents = false; }
        console.warn('AG Grid: do not use api for selection, call node.setSelected(value) instead');
        if (suppressEvents) {
            console.warn('AG Grid: suppressEvents is no longer supported, stop listening for the event if you no longer want it');
        }
        this.selectionController.deselectIndex(index);
    };
    GridApi.prototype.selectNode = function (node, tryMulti, suppressEvents) {
        if (tryMulti === void 0) { tryMulti = false; }
        if (suppressEvents === void 0) { suppressEvents = false; }
        console.warn('AG Grid: API for selection is deprecated, call node.setSelected(value) instead');
        if (suppressEvents) {
            console.warn('AG Grid: suppressEvents is no longer supported, stop listening for the event if you no longer want it');
        }
        node.setSelectedParams({ newValue: true, clearSelection: !tryMulti });
    };
    GridApi.prototype.deselectNode = function (node, suppressEvents) {
        if (suppressEvents === void 0) { suppressEvents = false; }
        console.warn('AG Grid: API for selection is deprecated, call node.setSelected(value) instead');
        if (suppressEvents) {
            console.warn('AG Grid: suppressEvents is no longer supported, stop listening for the event if you no longer want it');
        }
        node.setSelectedParams({ newValue: false });
    };
    GridApi.prototype.selectAll = function () {
        this.selectionController.selectAllRowNodes();
    };
    GridApi.prototype.deselectAll = function () {
        this.selectionController.deselectAllRowNodes();
    };
    GridApi.prototype.selectAllFiltered = function () {
        this.selectionController.selectAllRowNodes(true);
    };
    GridApi.prototype.deselectAllFiltered = function () {
        this.selectionController.deselectAllRowNodes(true);
    };
    GridApi.prototype.recomputeAggregates = function () {
        if (generic_1.missing(this.clientSideRowModel)) {
            console.warn('cannot call recomputeAggregates unless using normal row model');
        }
        console.warn("recomputeAggregates is deprecated, please call api.refreshClientSideRowModel('aggregate') instead");
        this.clientSideRowModel.refreshModel({ step: iClientSideRowModel_1.ClientSideRowModelSteps.AGGREGATE });
    };
    GridApi.prototype.sizeColumnsToFit = function () {
        this.gridPanel.sizeColumnsToFit();
    };
    GridApi.prototype.showLoadingOverlay = function () {
        this.gridPanel.showLoadingOverlay();
    };
    GridApi.prototype.showNoRowsOverlay = function () {
        this.gridPanel.showNoRowsOverlay();
    };
    GridApi.prototype.hideOverlay = function () {
        this.gridPanel.hideOverlay();
    };
    GridApi.prototype.isNodeSelected = function (node) {
        console.warn('AG Grid: no need to call api.isNodeSelected(), just call node.isSelected() instead');
        return node.isSelected();
    };
    GridApi.prototype.getSelectedNodesById = function () {
        console.error('AG Grid: since version 3.4, getSelectedNodesById no longer exists, use getSelectedNodes() instead');
        return null;
    };
    GridApi.prototype.getSelectedNodes = function () {
        return this.selectionController.getSelectedNodes();
    };
    GridApi.prototype.getSelectedRows = function () {
        return this.selectionController.getSelectedRows();
    };
    GridApi.prototype.getBestCostNodeSelection = function () {
        return this.selectionController.getBestCostNodeSelection();
    };
    GridApi.prototype.getRenderedNodes = function () {
        return this.rowRenderer.getRenderedNodes();
    };
    GridApi.prototype.ensureColIndexVisible = function (index) {
        console.warn('AG Grid: ensureColIndexVisible(index) no longer supported, use ensureColumnVisible(colKey) instead.');
    };
    GridApi.prototype.ensureColumnVisible = function (key) {
        this.gridPanel.ensureColumnVisible(key);
    };
    // Valid values for position are bottom, middle and top
    GridApi.prototype.ensureIndexVisible = function (index, position) {
        this.gridPanel.ensureIndexVisible(index, position);
    };
    // Valid values for position are bottom, middle and top
    GridApi.prototype.ensureNodeVisible = function (comparator, position) {
        this.gridCore.ensureNodeVisible(comparator, position);
    };
    GridApi.prototype.forEachLeafNode = function (callback) {
        if (generic_1.missing(this.clientSideRowModel)) {
            console.warn('cannot call forEachNode unless using normal row model');
        }
        this.clientSideRowModel.forEachLeafNode(callback);
    };
    GridApi.prototype.forEachNode = function (callback) {
        this.rowModel.forEachNode(callback);
    };
    GridApi.prototype.forEachNodeAfterFilter = function (callback) {
        if (generic_1.missing(this.clientSideRowModel)) {
            console.warn('cannot call forEachNodeAfterFilter unless using normal row model');
        }
        this.clientSideRowModel.forEachNodeAfterFilter(callback);
    };
    GridApi.prototype.forEachNodeAfterFilterAndSort = function (callback) {
        if (generic_1.missing(this.clientSideRowModel)) {
            console.warn('cannot call forEachNodeAfterFilterAndSort unless using normal row model');
        }
        this.clientSideRowModel.forEachNodeAfterFilterAndSort(callback);
    };
    GridApi.prototype.getFilterApiForColDef = function (colDef) {
        console.warn('ag-grid API method getFilterApiForColDef deprecated, use getFilterInstance instead');
        return this.getFilterInstance(colDef);
    };
    GridApi.prototype.getFilterInstance = function (key, callback) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            var filterPromise = this.filterManager.getFilterComponent(column, 'NO_UI');
            var currentValue = filterPromise && filterPromise.resolveNow(null, function (filterComp) { return filterComp; });
            if (callback) {
                if (currentValue) {
                    setTimeout(callback, 0, currentValue);
                }
                else if (filterPromise) {
                    filterPromise.then(callback);
                }
            }
            return currentValue;
        }
    };
    GridApi.prototype.getFilterApi = function (key) {
        console.warn('AG Grid: getFilterApi is deprecated, use getFilterInstance instead');
        return this.getFilterInstance(key);
    };
    GridApi.prototype.destroyFilter = function (key) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return this.filterManager.destroyFilter(column, "filterDestroyed");
        }
    };
    GridApi.prototype.getStatusPanel = function (key) {
        if (this.statusBarService) {
            return this.statusBarService.getStatusPanel(key);
        }
    };
    GridApi.prototype.getColumnDef = function (key) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return column.getColDef();
        }
        return null;
    };
    GridApi.prototype.getColumnDefs = function () { return this.columnController.getColumnDefs(); };
    GridApi.prototype.onFilterChanged = function () {
        this.filterManager.onFilterChanged();
    };
    GridApi.prototype.onSortChanged = function () {
        this.sortController.onSortChanged();
    };
    GridApi.prototype.setSortModel = function (sortModel, source) {
        if (source === void 0) { source = "api"; }
        console.warn('AG Grid: as of version 24.0.0, setSortModel() is deprecated, sort information is now part of Column State. Please use columnApi.applyColumnState() instead.');
        var columnState = [];
        if (sortModel) {
            sortModel.forEach(function (item, index) {
                columnState.push({
                    colId: item.colId,
                    sort: item.sort,
                    sortIndex: index
                });
            });
        }
        this.columnController.applyColumnState({ state: columnState, defaultState: { sort: null } });
    };
    GridApi.prototype.getSortModel = function () {
        console.warn('AG Grid: as of version 24.0.0, getSortModel() is deprecated, sort information is now part of Column State. Please use columnApi.getColumnState() instead.');
        var columnState = this.columnController.getColumnState();
        var filteredStates = columnState.filter(function (item) { return item.sort != null; });
        var indexes = {};
        filteredStates.forEach(function (state) {
            var id = state.colId;
            var sortIndex = state.sortIndex;
            indexes[id] = sortIndex;
        });
        var res = filteredStates.map(function (s) {
            return { colId: s.colId, sort: s.sort };
        });
        res.sort(function (a, b) { return indexes[a.colId] - indexes[b.colId]; });
        return res;
    };
    GridApi.prototype.setFilterModel = function (model) {
        this.filterManager.setFilterModel(model);
    };
    GridApi.prototype.getFilterModel = function () {
        return this.filterManager.getFilterModel();
    };
    GridApi.prototype.getFocusedCell = function () {
        return this.focusController.getFocusedCell();
    };
    GridApi.prototype.clearFocusedCell = function () {
        return this.focusController.clearFocusedCell();
    };
    GridApi.prototype.setFocusedCell = function (rowIndex, colKey, floating) {
        this.focusController.setFocusedCell(rowIndex, colKey, floating, true);
    };
    GridApi.prototype.setSuppressRowDrag = function (value) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_SUPPRESS_ROW_DRAG, value);
    };
    GridApi.prototype.setSuppressMoveWhenRowDragging = function (value) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_SUPPRESS_MOVE_WHEN_ROW_DRAG, value);
    };
    GridApi.prototype.setSuppressRowClickSelection = function (value) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_SUPPRESS_ROW_CLICK_SELECTION, value);
    };
    GridApi.prototype.addRowDropZone = function (params) {
        this.gridPanel.getRowDragFeature().addRowDropZone(params);
    };
    GridApi.prototype.removeRowDropZone = function (params) {
        var activeDropTarget = this.dragAndDropService.findExternalZone(params);
        if (activeDropTarget) {
            this.dragAndDropService.removeDropTarget(activeDropTarget);
        }
    };
    GridApi.prototype.getRowDropZoneParams = function (events) {
        return this.gridPanel.getRowDragFeature().getRowDropZone(events);
    };
    GridApi.prototype.setHeaderHeight = function (headerHeight) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_HEADER_HEIGHT, headerHeight);
        this.doLayout();
    };
    GridApi.prototype.setDomLayout = function (domLayout) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_DOM_LAYOUT, domLayout);
    };
    GridApi.prototype.setEnableCellTextSelection = function (selectable) {
        this.gridPanel.setCellTextSelection(selectable);
    };
    GridApi.prototype.setFillHandleDirection = function (direction) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_FILL_HANDLE_DIRECTION, direction);
    };
    GridApi.prototype.setGroupHeaderHeight = function (headerHeight) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_GROUP_HEADER_HEIGHT, headerHeight);
        this.doLayout();
    };
    GridApi.prototype.setFloatingFiltersHeight = function (headerHeight) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_FLOATING_FILTERS_HEIGHT, headerHeight);
        this.doLayout();
    };
    GridApi.prototype.setPivotGroupHeaderHeight = function (headerHeight) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_PIVOT_GROUP_HEADER_HEIGHT, headerHeight);
        this.doLayout();
    };
    GridApi.prototype.setPivotHeaderHeight = function (headerHeight) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_PIVOT_HEADER_HEIGHT, headerHeight);
        this.doLayout();
    };
    GridApi.prototype.isSideBarVisible = function () {
        return this.gridCore.isSideBarVisible();
    };
    GridApi.prototype.setSideBarVisible = function (show) {
        this.gridCore.setSideBarVisible(show);
    };
    GridApi.prototype.setSideBarPosition = function (position) {
        this.gridCore.setSideBarPosition(position);
    };
    GridApi.prototype.openToolPanel = function (key) {
        this.gridCore.openToolPanel(key);
    };
    GridApi.prototype.closeToolPanel = function () {
        this.gridCore.closeToolPanel();
    };
    GridApi.prototype.getOpenedToolPanel = function () {
        return this.gridCore.getOpenedToolPanel();
    };
    GridApi.prototype.getSideBar = function () {
        return this.gridCore.getSideBar();
    };
    GridApi.prototype.setSideBar = function (def) {
        return this.gridCore.setSideBar(def);
    };
    GridApi.prototype.setSuppressClipboardPaste = function (value) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_SUPPRESS_CLIPBOARD_PASTE, value);
    };
    GridApi.prototype.isToolPanelShowing = function () {
        return this.gridCore.isToolPanelShowing();
    };
    GridApi.prototype.doLayout = function () {
        this.gridPanel.checkViewportAndScrolls();
    };
    GridApi.prototype.resetRowHeights = function () {
        if (generic_1.exists(this.clientSideRowModel)) {
            this.clientSideRowModel.resetRowHeights();
        }
    };
    GridApi.prototype.setGroupRemoveSingleChildren = function (value) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_GROUP_REMOVE_SINGLE_CHILDREN, value);
    };
    GridApi.prototype.setGroupRemoveLowestSingleChildren = function (value) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_GROUP_REMOVE_LOWEST_SINGLE_CHILDREN, value);
    };
    GridApi.prototype.onRowHeightChanged = function () {
        if (this.clientSideRowModel) {
            this.clientSideRowModel.onRowHeightChanged();
        }
        else if (this.serverSideRowModel) {
            this.serverSideRowModel.onRowHeightChanged();
        }
    };
    GridApi.prototype.getValue = function (colKey, rowNode) {
        var column = this.columnController.getPrimaryColumn(colKey);
        if (generic_1.missing(column)) {
            column = this.columnController.getGridColumn(colKey);
        }
        if (generic_1.missing(column)) {
            return null;
        }
        return this.valueService.getValue(column, rowNode);
    };
    GridApi.prototype.addEventListener = function (eventType, listener) {
        var async = this.gridOptionsWrapper.useAsyncEvents();
        this.eventService.addEventListener(eventType, listener, async);
    };
    GridApi.prototype.addGlobalListener = function (listener) {
        var async = this.gridOptionsWrapper.useAsyncEvents();
        this.eventService.addGlobalListener(listener, async);
    };
    GridApi.prototype.removeEventListener = function (eventType, listener) {
        var async = this.gridOptionsWrapper.useAsyncEvents();
        this.eventService.removeEventListener(eventType, listener, async);
    };
    GridApi.prototype.removeGlobalListener = function (listener) {
        var async = this.gridOptionsWrapper.useAsyncEvents();
        this.eventService.removeGlobalListener(listener, async);
    };
    GridApi.prototype.dispatchEvent = function (event) {
        this.eventService.dispatchEvent(event);
    };
    GridApi.prototype.destroy = function () {
        // this is needed as GridAPI is a bean, and GridAPI.destroy() is called as part
        // of context.destroy(). so we need to stop the infinite loop.
        if (this.destroyCalled) {
            return;
        }
        this.destroyCalled = true;
        // destroy the UI first (as they use the services)
        this.context.destroyBean(this.gridCore);
        // destroy the services
        this.context.destroy();
    };
    GridApi.prototype.cleanDownReferencesToAvoidMemoryLeakInCaseApplicationIsKeepingReferenceToDestroyedGrid = function () {
        // some users were raising support issues with regards memory leaks. the problem was the customers applications
        // were keeping references to the API. trying to educate them all would be difficult, easier to just remove
        // all references in teh API so at least the core grid can be garbage collected.
        //
        // wait about 100ms before clearing down the references, in case user has some cleanup to do,
        // and needs to deference the API first
        setTimeout(object_1.removeAllReferences.bind(window, this, 'Grid API'), 100);
    };
    GridApi.prototype.warnIfDestroyed = function (methodName) {
        if (this.destroyCalled) {
            console.warn("AG Grid: Grid API method " + methodName + " was called on a grid that was destroyed.");
        }
        return this.destroyCalled;
    };
    GridApi.prototype.resetQuickFilter = function () {
        if (this.warnIfDestroyed('resetQuickFilter')) {
            return;
        }
        this.rowModel.forEachNode(function (node) { return node.quickFilterAggregateText = null; });
    };
    GridApi.prototype.getRangeSelections = function () {
        console.warn("AG Grid: in v20.1.x, api.getRangeSelections() is gone, please use getCellRanges() instead.\n        We had to change how cell selections works a small bit to allow charting to integrate. The return type of\n        getCellRanges() is a bit different, please check the AG Grid documentation.");
        return null;
    };
    GridApi.prototype.getCellRanges = function () {
        if (this.rangeController) {
            return this.rangeController.getCellRanges();
        }
        console.warn('AG Grid: cell range selection is only available in AG Grid Enterprise');
        return null;
    };
    GridApi.prototype.camelCaseToHumanReadable = function (camelCase) {
        return string_1.camelCaseToHumanText(camelCase);
    };
    GridApi.prototype.addRangeSelection = function (deprecatedNoLongerUsed) {
        console.warn('AG Grid: As of version 21.x, range selection changed slightly to allow charting integration. Please call api.addCellRange() instead of api.addRangeSelection()');
    };
    GridApi.prototype.addCellRange = function (params) {
        if (!this.rangeController) {
            console.warn('AG Grid: cell range selection is only available in AG Grid Enterprise');
        }
        this.rangeController.addCellRange(params);
    };
    GridApi.prototype.clearRangeSelection = function () {
        if (!this.rangeController) {
            console.warn('AG Grid: cell range selection is only available in AG Grid Enterprise');
        }
        this.rangeController.removeAllCellRanges();
    };
    GridApi.prototype.undoCellEditing = function () {
        this.undoRedoService.undo();
    };
    GridApi.prototype.redoCellEditing = function () {
        this.undoRedoService.redo();
    };
    GridApi.prototype.getCurrentUndoSize = function () {
        return this.undoRedoService.getCurrentUndoStackSize();
    };
    GridApi.prototype.getCurrentRedoSize = function () {
        return this.undoRedoService.getCurrentRedoStackSize();
    };
    GridApi.prototype.getChartModels = function () {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.RangeSelectionModule, 'api.getChartModels') &&
            moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.GridChartsModule, 'api.getChartModels')) {
            return this.chartService.getChartModels();
        }
    };
    GridApi.prototype.createRangeChart = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.RangeSelectionModule, 'api.createRangeChart') &&
            moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.GridChartsModule, 'api.createRangeChart')) {
            return this.chartService.createRangeChart(params);
        }
    };
    GridApi.prototype.createCrossFilterChart = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.RangeSelectionModule, 'api.createCrossFilterChart') &&
            moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.GridChartsModule, 'api.createCrossFilterChart')) {
            return this.chartService.createCrossFilterChart(params);
        }
    };
    GridApi.prototype.restoreChart = function (chartModel, chartContainer) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.RangeSelectionModule, 'api.restoreChart') &&
            moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.GridChartsModule, 'api.restoreChart')) {
            return this.chartService.restoreChart(chartModel, chartContainer);
        }
    };
    GridApi.prototype.createPivotChart = function (params) {
        if (moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.RangeSelectionModule, 'api.createPivotChart') &&
            moduleRegistry_1.ModuleRegistry.assertRegistered(moduleNames_1.ModuleNames.GridChartsModule, 'api.createPivotChart')) {
            return this.chartService.createPivotChart(params);
        }
    };
    GridApi.prototype.copySelectedRowsToClipboard = function (includeHeader, columnKeys) {
        if (!this.clipboardService) {
            console.warn('AG Grid: clipboard is only available in AG Grid Enterprise');
        }
        this.clipboardService.copySelectedRowsToClipboard(includeHeader, columnKeys);
    };
    GridApi.prototype.copySelectedRangeToClipboard = function (includeHeader) {
        if (!this.clipboardService) {
            console.warn('AG Grid: clipboard is only available in AG Grid Enterprise');
        }
        this.clipboardService.copySelectedRangeToClipboard(includeHeader);
    };
    GridApi.prototype.copySelectedRangeDown = function () {
        if (!this.clipboardService) {
            console.warn('AG Grid: clipboard is only available in AG Grid Enterprise');
        }
        this.clipboardService.copyRangeDown();
    };
    GridApi.prototype.showColumnMenuAfterButtonClick = function (colKey, buttonElement) {
        // use grid column so works with pivot mode
        var column = this.columnController.getGridColumn(colKey);
        this.menuFactory.showMenuAfterButtonClick(column, buttonElement);
    };
    GridApi.prototype.showColumnMenuAfterMouseClick = function (colKey, mouseEvent) {
        // use grid column so works with pivot mode
        var column = this.columnController.getGridColumn(colKey);
        if (!column) {
            column = this.columnController.getPrimaryColumn(colKey);
        }
        if (!column) {
            console.error("AG Grid: column '" + colKey + "' not found");
            return;
        }
        this.menuFactory.showMenuAfterMouseEvent(column, mouseEvent);
    };
    GridApi.prototype.hidePopupMenu = function () {
        // hide the context menu if in enterprise
        if (this.contextMenuFactory) {
            this.contextMenuFactory.hideActiveMenu();
        }
        // and hide the column menu always
        this.menuFactory.hideActiveMenu();
    };
    GridApi.prototype.setPopupParent = function (ePopupParent) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_POPUP_PARENT, ePopupParent);
    };
    GridApi.prototype.tabToNextCell = function () {
        return this.rowRenderer.tabToNextCell(false);
    };
    GridApi.prototype.tabToPreviousCell = function () {
        return this.rowRenderer.tabToNextCell(true);
    };
    GridApi.prototype.getCellRendererInstances = function (params) {
        if (params === void 0) { params = {}; }
        return this.rowRenderer.getCellRendererInstances(params);
    };
    GridApi.prototype.getCellEditorInstances = function (params) {
        if (params === void 0) { params = {}; }
        return this.rowRenderer.getCellEditorInstances(params);
    };
    GridApi.prototype.getEditingCells = function () {
        return this.rowRenderer.getEditingCells();
    };
    GridApi.prototype.stopEditing = function (cancel) {
        if (cancel === void 0) { cancel = false; }
        this.rowRenderer.stopEditing(cancel);
    };
    GridApi.prototype.startEditingCell = function (params) {
        var column = this.columnController.getGridColumn(params.colKey);
        if (!column) {
            console.warn("AG Grid: no column found for " + params.colKey);
            return;
        }
        var cellPosition = {
            rowIndex: params.rowIndex,
            rowPinned: params.rowPinned,
            column: column
        };
        var notPinned = generic_1.missing(params.rowPinned);
        if (notPinned) {
            this.gridPanel.ensureIndexVisible(params.rowIndex);
        }
        this.rowRenderer.startEditingCell(cellPosition, params.keyPress, params.charPress);
    };
    GridApi.prototype.addAggFunc = function (key, aggFunc) {
        if (this.aggFuncService) {
            this.aggFuncService.addAggFunc(key, aggFunc);
        }
    };
    GridApi.prototype.addAggFuncs = function (aggFuncs) {
        if (this.aggFuncService) {
            this.aggFuncService.addAggFuncs(aggFuncs);
        }
    };
    GridApi.prototype.clearAggFuncs = function () {
        if (this.aggFuncService) {
            this.aggFuncService.clear();
        }
    };
    GridApi.prototype.applyServerSideTransaction = function (transaction) {
        if (!this.serverSideTransactionManager) {
            console.warn('AG Grid: Cannot apply Server Side Transaction if not using the Server Side Row Model.');
            return;
        }
        return this.serverSideTransactionManager.applyTransaction(transaction);
    };
    GridApi.prototype.applyServerSideTransactionAsync = function (transaction, callback) {
        if (!this.serverSideTransactionManager) {
            console.warn('AG Grid: Cannot apply Server Side Transaction if not using the Server Side Row Model.');
            return;
        }
        return this.serverSideTransactionManager.applyTransactionAsync(transaction, callback);
    };
    GridApi.prototype.retryServerSideLoads = function () {
        if (!this.serverSideRowModel) {
            console.warn('AG Grid: API retryServerSideLoads() can only be used when using Server-Side Row Model.');
            return;
        }
        this.serverSideRowModel.retryLoads();
    };
    GridApi.prototype.flushServerSideAsyncTransactions = function () {
        if (!this.serverSideTransactionManager) {
            console.warn('AG Grid: Cannot flush Server Side Transaction if not using the Server Side Row Model.');
            return;
        }
        return this.serverSideTransactionManager.flushAsyncTransactions();
    };
    GridApi.prototype.applyTransaction = function (rowDataTransaction) {
        if (!this.clientSideRowModel) {
            console.error('AG Grid: updateRowData() only works with ClientSideRowModel. Working with InfiniteRowModel was deprecated in v23.1 and removed in v24.1');
            return;
        }
        var res = this.clientSideRowModel.updateRowData(rowDataTransaction);
        // refresh all the full width rows
        this.rowRenderer.refreshFullWidthRows(res.update);
        // do change detection for all present cells
        if (!this.gridOptionsWrapper.isSuppressChangeDetection()) {
            this.rowRenderer.refreshCells();
        }
        return res;
    };
    /** @deprecated */
    GridApi.prototype.updateRowData = function (rowDataTransaction) {
        var message = 'AG Grid: as of v23.1, grid API updateRowData(transaction) is now called applyTransaction(transaction). updateRowData is deprecated and will be removed in a future major release.';
        function_1.doOnce(function () { return console.warn(message); }, 'updateRowData deprecated');
        return this.applyTransaction(rowDataTransaction);
    };
    GridApi.prototype.applyTransactionAsync = function (rowDataTransaction, callback) {
        if (!this.clientSideRowModel) {
            console.error('AG Grid: api.applyTransactionAsync() only works with ClientSideRowModel.');
            return;
        }
        this.clientSideRowModel.batchUpdateRowData(rowDataTransaction, callback);
    };
    GridApi.prototype.flushAsyncTransactions = function () {
        if (!this.clientSideRowModel) {
            console.error('AG Grid: api.applyTransactionAsync() only works with ClientSideRowModel.');
            return;
        }
        this.clientSideRowModel.flushAsyncTransactions();
    };
    /** @deprecated */
    GridApi.prototype.batchUpdateRowData = function (rowDataTransaction, callback) {
        var message = 'AG Grid: as of v23.1, grid API batchUpdateRowData(transaction, callback) is now called applyTransactionAsync(transaction, callback). batchUpdateRowData is deprecated and will be removed in a future major release.';
        function_1.doOnce(function () { return console.warn(message); }, 'batchUpdateRowData deprecated');
        this.applyTransactionAsync(rowDataTransaction, callback);
    };
    GridApi.prototype.insertItemsAtIndex = function (index, items, skipRefresh) {
        if (skipRefresh === void 0) { skipRefresh = false; }
        console.warn('AG Grid: insertItemsAtIndex() is deprecated, use updateRowData(transaction) instead.');
        this.updateRowData({ add: items, addIndex: index, update: null, remove: null });
    };
    GridApi.prototype.removeItems = function (rowNodes, skipRefresh) {
        if (skipRefresh === void 0) { skipRefresh = false; }
        console.warn('AG Grid: removeItems() is deprecated, use updateRowData(transaction) instead.');
        var dataToRemove = rowNodes.map(function (rowNode) { return rowNode.data; });
        this.updateRowData({ add: null, addIndex: null, update: null, remove: dataToRemove });
    };
    GridApi.prototype.addItems = function (items, skipRefresh) {
        if (skipRefresh === void 0) { skipRefresh = false; }
        console.warn('AG Grid: addItems() is deprecated, use updateRowData(transaction) instead.');
        this.updateRowData({ add: items, addIndex: null, update: null, remove: null });
    };
    GridApi.prototype.refreshVirtualPageCache = function () {
        console.warn('AG Grid: refreshVirtualPageCache() is now called refreshInfiniteCache(), please call refreshInfiniteCache() instead');
        this.refreshInfiniteCache();
    };
    GridApi.prototype.refreshInfinitePageCache = function () {
        console.warn('AG Grid: refreshInfinitePageCache() is now called refreshInfiniteCache(), please call refreshInfiniteCache() instead');
        this.refreshInfiniteCache();
    };
    GridApi.prototype.refreshInfiniteCache = function () {
        if (this.infiniteRowModel) {
            this.infiniteRowModel.refreshCache();
        }
        else {
            console.warn("AG Grid: api.refreshInfiniteCache is only available when rowModelType='infinite'.");
        }
    };
    GridApi.prototype.purgeVirtualPageCache = function () {
        console.warn('AG Grid: purgeVirtualPageCache() is now called purgeInfiniteCache(), please call purgeInfiniteCache() instead');
        this.purgeInfinitePageCache();
    };
    GridApi.prototype.purgeInfinitePageCache = function () {
        console.warn('AG Grid: purgeInfinitePageCache() is now called purgeInfiniteCache(), please call purgeInfiniteCache() instead');
        this.purgeInfiniteCache();
    };
    GridApi.prototype.purgeInfiniteCache = function () {
        if (this.infiniteRowModel) {
            this.infiniteRowModel.purgeCache();
        }
        else {
            console.warn("AG Grid: api.purgeInfiniteCache is only available when rowModelType='infinite'.");
        }
    };
    /** @deprecated */
    GridApi.prototype.purgeEnterpriseCache = function (route) {
        console.warn("ag-grid: since version 18.x, api.purgeEnterpriseCache() should be replaced with api.purgeServerSideCache()");
        this.purgeServerSideCache(route);
    };
    /** @deprecated */
    GridApi.prototype.purgeServerSideCache = function (route) {
        if (route === void 0) { route = []; }
        if (this.serverSideRowModel) {
            console.warn("AG Grid: since v25.0, api.purgeServerSideCache is deprecated. Please use api.refreshServerSideStore({purge: true}) instead.");
            this.refreshServerSideStore({
                route: route,
                purge: true
            });
        }
        else {
            console.warn("AG Grid: api.purgeServerSideCache is only available when rowModelType='serverSide'.");
        }
    };
    GridApi.prototype.refreshServerSideStore = function (params) {
        if (this.serverSideRowModel) {
            this.serverSideRowModel.refreshStore(params);
        }
        else {
            console.warn("AG Grid: api.refreshServerSideStore is only available when rowModelType='serverSide'.");
        }
    };
    GridApi.prototype.getServerSideStoreState = function () {
        if (this.serverSideRowModel) {
            return this.serverSideRowModel.getStoreState();
        }
        else {
            console.warn("AG Grid: api.getServerSideStoreState is only available when rowModelType='serverSide'.");
            return [];
        }
    };
    GridApi.prototype.getVirtualRowCount = function () {
        console.warn('AG Grid: getVirtualRowCount() is now called getInfiniteRowCount(), please call getInfiniteRowCount() instead');
        return this.getInfiniteRowCount();
    };
    GridApi.prototype.getInfiniteRowCount = function () {
        if (this.infiniteRowModel) {
            return this.infiniteRowModel.getRowCount();
        }
        else {
            console.warn("AG Grid: api.getVirtualRowCount is only available when rowModelType='virtual'.");
        }
    };
    GridApi.prototype.isMaxRowFound = function () {
        console.warn("AG Grid: api.isLastRowIndexKnown is deprecated, please use api.isLastRowIndexKnown()");
        return this.isLastRowIndexKnown();
    };
    GridApi.prototype.isLastRowIndexKnown = function () {
        if (this.infiniteRowModel) {
            return this.infiniteRowModel.isLastRowIndexKnown();
        }
        else {
            console.warn("AG Grid: api.isMaxRowFound is only available when rowModelType='virtual'.");
        }
    };
    GridApi.prototype.setVirtualRowCount = function (rowCount, maxRowFound) {
        console.warn('AG Grid: setVirtualRowCount() is now called setInfiniteRowCount(), please call setInfiniteRowCount() instead');
        this.setRowCount(rowCount, maxRowFound);
    };
    GridApi.prototype.setInfiniteRowCount = function (rowCount, maxRowFound) {
        console.warn('AG Grid: setInfiniteRowCount() is now called setRowCount(), please call setRowCount() instead');
        this.setRowCount(rowCount, maxRowFound);
    };
    GridApi.prototype.setRowCount = function (rowCount, maxRowFound) {
        if (this.infiniteRowModel) {
            this.infiniteRowModel.setRowCount(rowCount, maxRowFound);
        }
        else {
            console.warn("AG Grid: api.setRowCount is only available for Infinite Row Model.");
        }
    };
    GridApi.prototype.getVirtualPageState = function () {
        console.warn('AG Grid: getVirtualPageState() is now called getCacheBlockState(), please call getCacheBlockState() instead');
        return this.getCacheBlockState();
    };
    GridApi.prototype.getInfinitePageState = function () {
        console.warn('AG Grid: getInfinitePageState() is now called getCacheBlockState(), please call getCacheBlockState() instead');
        return this.getCacheBlockState();
    };
    GridApi.prototype.getCacheBlockState = function () {
        return this.rowNodeBlockLoader.getBlockState();
    };
    GridApi.prototype.checkGridSize = function () {
        this.gridPanel.setHeaderAndFloatingHeights();
    };
    GridApi.prototype.getFirstRenderedRow = function () {
        console.warn('in AG Grid v12, getFirstRenderedRow() was renamed to getFirstDisplayedRow()');
        return this.getFirstDisplayedRow();
    };
    GridApi.prototype.getFirstDisplayedRow = function () {
        return this.rowRenderer.getFirstVirtualRenderedRow();
    };
    GridApi.prototype.getLastRenderedRow = function () {
        console.warn('in AG Grid v12, getLastRenderedRow() was renamed to getLastDisplayedRow()');
        return this.getLastDisplayedRow();
    };
    GridApi.prototype.getLastDisplayedRow = function () {
        return this.rowRenderer.getLastVirtualRenderedRow();
    };
    GridApi.prototype.getDisplayedRowAtIndex = function (index) {
        return this.rowModel.getRow(index);
    };
    GridApi.prototype.getDisplayedRowCount = function () {
        return this.rowModel.getRowCount();
    };
    GridApi.prototype.paginationIsLastPageFound = function () {
        return this.paginationProxy.isLastPageFound();
    };
    GridApi.prototype.paginationGetPageSize = function () {
        return this.paginationProxy.getPageSize();
    };
    GridApi.prototype.paginationSetPageSize = function (size) {
        this.gridOptionsWrapper.setProperty('paginationPageSize', size);
    };
    GridApi.prototype.paginationGetCurrentPage = function () {
        return this.paginationProxy.getCurrentPage();
    };
    GridApi.prototype.paginationGetTotalPages = function () {
        return this.paginationProxy.getTotalPages();
    };
    GridApi.prototype.paginationGetRowCount = function () {
        return this.paginationProxy.getMasterRowCount();
    };
    GridApi.prototype.paginationGoToNextPage = function () {
        this.paginationProxy.goToNextPage();
    };
    GridApi.prototype.paginationGoToPreviousPage = function () {
        this.paginationProxy.goToPreviousPage();
    };
    GridApi.prototype.paginationGoToFirstPage = function () {
        this.paginationProxy.goToFirstPage();
    };
    GridApi.prototype.paginationGoToLastPage = function () {
        this.paginationProxy.goToLastPage();
    };
    GridApi.prototype.paginationGoToPage = function (page) {
        this.paginationProxy.goToPage(page);
    };
    __decorate([
        context_1.Optional('immutableService')
    ], GridApi.prototype, "immutableService", void 0);
    __decorate([
        context_1.Optional('csvCreator')
    ], GridApi.prototype, "csvCreator", void 0);
    __decorate([
        context_1.Optional('excelCreator')
    ], GridApi.prototype, "excelCreator", void 0);
    __decorate([
        context_1.Autowired('rowRenderer')
    ], GridApi.prototype, "rowRenderer", void 0);
    __decorate([
        context_1.Autowired('filterManager')
    ], GridApi.prototype, "filterManager", void 0);
    __decorate([
        context_1.Autowired('columnController')
    ], GridApi.prototype, "columnController", void 0);
    __decorate([
        context_1.Autowired('selectionController')
    ], GridApi.prototype, "selectionController", void 0);
    __decorate([
        context_1.Autowired('gridOptionsWrapper')
    ], GridApi.prototype, "gridOptionsWrapper", void 0);
    __decorate([
        context_1.Autowired('valueService')
    ], GridApi.prototype, "valueService", void 0);
    __decorate([
        context_1.Autowired('alignedGridsService')
    ], GridApi.prototype, "alignedGridsService", void 0);
    __decorate([
        context_1.Autowired('eventService')
    ], GridApi.prototype, "eventService", void 0);
    __decorate([
        context_1.Autowired('pinnedRowModel')
    ], GridApi.prototype, "pinnedRowModel", void 0);
    __decorate([
        context_1.Autowired('context')
    ], GridApi.prototype, "context", void 0);
    __decorate([
        context_1.Autowired('rowModel')
    ], GridApi.prototype, "rowModel", void 0);
    __decorate([
        context_1.Autowired('sortController')
    ], GridApi.prototype, "sortController", void 0);
    __decorate([
        context_1.Autowired('paginationProxy')
    ], GridApi.prototype, "paginationProxy", void 0);
    __decorate([
        context_1.Autowired('focusController')
    ], GridApi.prototype, "focusController", void 0);
    __decorate([
        context_1.Autowired('dragAndDropService')
    ], GridApi.prototype, "dragAndDropService", void 0);
    __decorate([
        context_1.Optional('rangeController')
    ], GridApi.prototype, "rangeController", void 0);
    __decorate([
        context_1.Optional('clipboardService')
    ], GridApi.prototype, "clipboardService", void 0);
    __decorate([
        context_1.Optional('aggFuncService')
    ], GridApi.prototype, "aggFuncService", void 0);
    __decorate([
        context_1.Autowired('menuFactory')
    ], GridApi.prototype, "menuFactory", void 0);
    __decorate([
        context_1.Optional('contextMenuFactory')
    ], GridApi.prototype, "contextMenuFactory", void 0);
    __decorate([
        context_1.Autowired('valueCache')
    ], GridApi.prototype, "valueCache", void 0);
    __decorate([
        context_1.Autowired('animationFrameService')
    ], GridApi.prototype, "animationFrameService", void 0);
    __decorate([
        context_1.Optional('statusBarService')
    ], GridApi.prototype, "statusBarService", void 0);
    __decorate([
        context_1.Optional('chartService')
    ], GridApi.prototype, "chartService", void 0);
    __decorate([
        context_1.Optional('undoRedoService')
    ], GridApi.prototype, "undoRedoService", void 0);
    __decorate([
        context_1.Optional('rowNodeBlockLoader')
    ], GridApi.prototype, "rowNodeBlockLoader", void 0);
    __decorate([
        context_1.Optional('ssrmTransactionManager')
    ], GridApi.prototype, "serverSideTransactionManager", void 0);
    __decorate([
        context_1.PostConstruct
    ], GridApi.prototype, "init", null);
    __decorate([
        context_1.PreDestroy
    ], GridApi.prototype, "cleanDownReferencesToAvoidMemoryLeakInCaseApplicationIsKeepingReferenceToDestroyedGrid", null);
    GridApi = __decorate([
        context_1.Bean('gridApi')
    ], GridApi);
    return GridApi;
}());
exports.GridApi = GridApi;

//# sourceMappingURL=gridApi.js.map
