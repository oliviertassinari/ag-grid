
import {RowNode} from "../../entities/rowNode";
import {Utils as _} from "../../utils";
import {GridOptionsWrapper} from "../../gridOptionsWrapper";
import {Context} from "../../context/context";
import {GetNodeChildDetails} from "../../entities/gridOptions";
import {EventService} from "../../eventService";

export class InMemoryNodeManager {

    private static TOP_LEVEL = 0;

    private rootNode: RowNode;
    private gridOptionsWrapper: GridOptionsWrapper;
    private context: Context;
    private eventService: EventService;

    private nextId = 0;

    private getNodeChildDetails: GetNodeChildDetails;
    private doesDataFlower: (data: any) => boolean;
    private suppressParentsInRowNodes: boolean;

    // when user is provide the id's, we also keep a map of ids to row nodes for convenience
    private allNodesMap: {[id:string]: RowNode} = {};

    constructor(rootNode: RowNode, gridOptionsWrapper: GridOptionsWrapper, context: Context, eventService: EventService) {
        this.rootNode = rootNode;
        this.gridOptionsWrapper = gridOptionsWrapper;
        this.context = context;
        this.eventService = eventService;

        this.rootNode.group = true;
        this.rootNode.level = -1;
        this.rootNode.allLeafChildren = [];
        this.rootNode.childrenAfterGroup = [];
        this.rootNode.childrenAfterSort = [];
        this.rootNode.childrenAfterFilter = [];
    }

    public getRowNode(id: string): RowNode {
        return this.allNodesMap[id];
    }

    public setRowData(rowData: any[]): RowNode[] {

        this.rootNode.childrenAfterFilter = null;
        this.rootNode.childrenAfterGroup = null;
        this.rootNode.childrenAfterSort = null;
        this.rootNode.childrenMapped = null;

        this.nextId = 0;
        this.allNodesMap = {};

        if (!rowData) {
            this.rootNode.allLeafChildren = [];
            this.rootNode.childrenAfterGroup = [];
            return;
        }

        // func below doesn't have 'this' pointer, so need to pull out these bits
        this.getNodeChildDetails = this.gridOptionsWrapper.getNodeChildDetailsFunc();
        this.suppressParentsInRowNodes = this.gridOptionsWrapper.isSuppressParentsInRowNodes();
        this.doesDataFlower = this.gridOptionsWrapper.getDoesDataFlowerFunc();

        let rowsAlreadyGrouped = _.exists(this.getNodeChildDetails);

        // kick off recursion
        let result = this.recursiveFunction(rowData, null, InMemoryNodeManager.TOP_LEVEL);

        if (rowsAlreadyGrouped) {
            this.rootNode.childrenAfterGroup = result;
            this.setLeafChildren(this.rootNode);
        } else {
            this.rootNode.allLeafChildren = result;
        }
    }

    private recursiveFunction(rowData: any[], parent: RowNode, level: number): RowNode[] {

        // make sure the rowData is an array and not a string of json - this was a commonly reported problem on the forum
        if (typeof rowData === 'string') {
            console.warn('ag-Grid: rowData must be an array, however you passed in a string. If you are loading JSON, make sure you convert the JSON string to JavaScript objects first');
            return;
        }

        let rowNodes: RowNode[] = [];
        rowData.forEach( (dataItem)=> {
            let node = this.createNode(dataItem, parent, level);

            let nodeChildDetails = this.getNodeChildDetails ? this.getNodeChildDetails(dataItem) : null;
            if (nodeChildDetails && nodeChildDetails.group) {
                node.group = true;
                node.childrenAfterGroup = this.recursiveFunction(nodeChildDetails.children, node, level + 1);
                node.expanded = nodeChildDetails.expanded === true;
                node.field = nodeChildDetails.field;
                node.key = nodeChildDetails.key;
                // pull out all the leaf children and add to our node
                this.setLeafChildren(node);
            }

            rowNodes.push(node);
        });
        return rowNodes;
    }

    private createNode(dataItem: any, parent: RowNode, level: number): RowNode {
        let node = new RowNode();
        this.context.wireBean(node);
        let nodeChildDetails = this.getNodeChildDetails ? this.getNodeChildDetails(dataItem) : null;
        if (nodeChildDetails && nodeChildDetails.group) {
            node.group = true;
            node.childrenAfterGroup = this.recursiveFunction(nodeChildDetails.children, node, level + 1);
            node.expanded = nodeChildDetails.expanded === true;
            node.field = nodeChildDetails.field;
            node.key = nodeChildDetails.key;
            node.canFlower = false;
            // pull out all the leaf children and add to our node
            this.setLeafChildren(node);
        } else {
            node.group = false;
            node.canFlower = this.doesDataFlower ? this.doesDataFlower(dataItem) : false;
            if (node.canFlower) {
                node.expanded = this.isExpanded(level);
            }
        }

        if (parent && !this.suppressParentsInRowNodes) {
            node.parent = parent;
        }
        node.level = level;
        node.setDataAndId(dataItem, this.nextId.toString());

        this.allNodesMap[node.id] = node;

        this.nextId++;

        return node;
    }

    private isExpanded(level: any) {
        let expandByDefault = this.gridOptionsWrapper.getGroupDefaultExpanded();
        if (expandByDefault===-1) {
            return true;
        } else {
            return level < expandByDefault;
        }
    }

    private setLeafChildren(node: RowNode): void {
        node.allLeafChildren = [];
        if (node.childrenAfterGroup) {
            node.childrenAfterGroup.forEach( childAfterGroup => {
                if (childAfterGroup.group) {
                    if (childAfterGroup.allLeafChildren) {
                        childAfterGroup.allLeafChildren.forEach( leafChild => node.allLeafChildren.push(leafChild) );
                    }
                } else {
                    node.allLeafChildren.push(childAfterGroup)
                }
            });
        }
    }

    public insertItemsAtIndex(index: number, rowData: any[]): RowNode[] {
        if (this.isRowsAlreadyGrouped()) { return null; }

        let nodeList = this.rootNode.allLeafChildren;

        if (index > nodeList.length) {
            console.warn(`ag-Grid: invalid index ${index}, max index is ${nodeList.length}`);
            return;
        }

        let newNodes: RowNode[] = [];
        // go through the items backwards, otherwise they get added in reverse order
        for (let i = rowData.length - 1; i >= 0; i--) {
            let data = rowData[i];
            let newNode = this.createNode(data, null, InMemoryNodeManager.TOP_LEVEL);
            _.insertIntoArray(nodeList, newNode, index);
            newNodes.push(newNode);
        }

        return newNodes.length > 0 ? newNodes : null;
    }

    public removeItems(rowNodes: RowNode[]): RowNode[] {
        if (this.isRowsAlreadyGrouped()) { return; }

        let nodeList = this.rootNode.allLeafChildren;

        let removedNodes: RowNode[] = [];
        rowNodes.forEach( rowNode => {
            let indexOfNode = nodeList.indexOf(rowNode);
            if (indexOfNode>=0) {
                rowNode.setSelected(false);
                nodeList.splice(indexOfNode, 1);
                this.allNodesMap[rowNode.id] = undefined;
            }
            removedNodes.push(rowNode);
        });

        return removedNodes.length > 0 ? removedNodes : null;
    }

    public addItems(items: any): RowNode[] {
        let nodeList = this.rootNode.allLeafChildren;
        return this.insertItemsAtIndex(nodeList.length, items);
    }

    public isRowsAlreadyGrouped(): boolean {
        let rowsAlreadyGrouped = _.exists(this.gridOptionsWrapper.getNodeChildDetailsFunc());
        if (rowsAlreadyGrouped) {
            console.warn('ag-Grid: adding and removing rows is not supported when using nodeChildDetailsFunc, ie it is not ' +
                'supported if providing groups');
            return true;
        } else {
            return false;
        }
    }
}