var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChartProxy } from "../chartProxy";
import { AreaSeries, CategoryAxis, GroupedCategoryAxis, LineSeries, NumberAxis, TimeAxis } from "ag-charts-community";
import { ChartDataModel } from "../../chartDataModel";
var CartesianChartProxy = /** @class */ (function (_super) {
    __extends(CartesianChartProxy, _super);
    function CartesianChartProxy(params) {
        var _this = _super.call(this, params) || this;
        _this.axisTypeToClassMap = {
            number: NumberAxis,
            category: CategoryAxis,
            groupedCategory: GroupedCategoryAxis,
            time: TimeAxis
        };
        return _this;
    }
    CartesianChartProxy.prototype.updateAxes = function (params) {
        // when grouping recreate chart if the axis is not a 'groupedCategory', otherwise return
        if (params.grouping) {
            if (!(this.axisTypeToClassMap[this.xAxisType] instanceof GroupedCategoryAxis)) {
                this.xAxisType = 'groupedCategory';
                this.recreateChart();
            }
            return;
        }
        // only update axis has changed and recreate the chart, i.e. switching from 'category' to 'time' axis
        var newXAxisType = CartesianChartProxy.isTimeAxis(params) ? 'time' : 'category';
        if (newXAxisType !== this.xAxisType) {
            this.xAxisType = newXAxisType;
            this.recreateChart();
        }
    };
    CartesianChartProxy.prototype.updateLabelRotation = function (categoryId) {
        var chartXAxisLabel = this.chart.axes[0].label;
        if (categoryId === ChartDataModel.DEFAULT_CATEGORY) {
            chartXAxisLabel.rotation = 0;
        }
        else {
            var xAxisOptions = this.getAxesOptions()[this.xAxisType];
            chartXAxisLabel.rotation = xAxisOptions.label.rotation;
        }
        this.chart.layoutPending = true;
    };
    CartesianChartProxy.prototype.getAxesOptions = function () {
        return this.chartOptions[this.standaloneChartType].axes;
    };
    CartesianChartProxy.prototype.processDataForCrossFiltering = function (data, colId, params) {
        var yKey = colId;
        var atLeastOneSelectedPoint = false;
        if (this.crossFiltering) {
            data.forEach(function (d) {
                d[colId + '-total'] = d[colId] + d[colId + '-filtered-out'];
                if (d[colId + '-filtered-out'] > 0) {
                    atLeastOneSelectedPoint = true;
                }
            });
            var lastSelectedChartId = params.getCrossFilteringContext().lastSelectedChartId;
            if (lastSelectedChartId === params.chartId) {
                yKey = colId + '-total';
            }
        }
        return { yKey: yKey, atLeastOneSelectedPoint: atLeastOneSelectedPoint };
    };
    CartesianChartProxy.prototype.updateSeriesForCrossFiltering = function (series, colId, chart, params, atLeastOneSelectedPoint) {
        if (this.crossFiltering) {
            // special custom marker handling to show and hide points
            series.marker.enabled = true;
            series.marker.formatter = function (p) {
                return {
                    fill: p.highlighted ? 'yellow' : p.fill,
                    size: p.highlighted ? 12 : p.datum[colId] > 0 ? 8 : 0,
                };
            };
            chart.tooltip.delay = 500;
            // make line opaque when some points are deselected
            var ctx = params.getCrossFilteringContext();
            var lastSelectionOnThisChart = ctx.lastSelectedChartId === params.chartId;
            var deselectedPoints = lastSelectionOnThisChart && atLeastOneSelectedPoint;
            if (series instanceof AreaSeries) {
                series.fillOpacity = deselectedPoints ? 0.3 : 1;
            }
            if (series instanceof LineSeries) {
                series.strokeOpacity = deselectedPoints ? 0.3 : 1;
            }
            // add node click cross filtering callback to series
            series.addEventListener('nodeClick', this.crossFilterCallback);
        }
    };
    CartesianChartProxy.isTimeAxis = function (params) {
        if (params.category && params.category.chartDataType) {
            return params.category.chartDataType === 'time';
        }
        var testDatum = params.data[0];
        return (testDatum && testDatum[params.category.id]) instanceof Date;
    };
    return CartesianChartProxy;
}(ChartProxy));
export { CartesianChartProxy };
