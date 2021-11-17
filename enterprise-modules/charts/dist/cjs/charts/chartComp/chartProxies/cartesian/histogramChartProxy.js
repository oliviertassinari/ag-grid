"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ag_charts_community_1 = require("ag-charts-community");
var cartesianChartProxy_1 = require("./cartesianChartProxy");
var object_1 = require("../../object");
var HistogramChartProxy = /** @class */ (function (_super) {
    __extends(HistogramChartProxy, _super);
    function HistogramChartProxy(params) {
        var _this = _super.call(this, params) || this;
        _this.xAxisType = 'number';
        _this.yAxisType = 'number';
        _this.recreateChart();
        return _this;
    }
    HistogramChartProxy.prototype.createChart = function () {
        return ag_charts_community_1.AgChart.create({
            container: this.chartProxyParams.parentElement,
            theme: this.chartTheme,
            axes: this.getAxes(),
            series: [__assign(__assign({}, this.chartOptions[this.standaloneChartType].series), { type: 'histogram' })]
        });
    };
    HistogramChartProxy.prototype.update = function (params) {
        var xField = params.fields[0];
        var chart = this.chart;
        var series = chart.series[0];
        series.data = params.data;
        series.xKey = xField.colId;
        series.xName = xField.displayName;
        // for now, only constant width is supported via integrated charts
        series.areaPlot = false;
        series.fill = this.chartTheme.palette.fills[0];
        series.stroke = this.chartTheme.palette.strokes[0];
    };
    HistogramChartProxy.prototype.getAxes = function () {
        var axisOptions = this.getAxesOptions();
        return [
            __assign(__assign({}, object_1.deepMerge(axisOptions[this.xAxisType], axisOptions[this.xAxisType].bottom)), { type: this.xAxisType, position: ag_charts_community_1.ChartAxisPosition.Bottom }),
            __assign(__assign({}, object_1.deepMerge(axisOptions[this.yAxisType], axisOptions[this.yAxisType].left)), { type: this.yAxisType, position: ag_charts_community_1.ChartAxisPosition.Left }),
        ];
    };
    return HistogramChartProxy;
}(cartesianChartProxy_1.CartesianChartProxy));
exports.HistogramChartProxy = HistogramChartProxy;
//# sourceMappingURL=histogramChartProxy.js.map