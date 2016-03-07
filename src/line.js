var simple_echarts = window.simple_echarts || {};

(function($) {
    $.line = new function() {
        var null_default = $.null_default;
        var get_label = $.get_label;
        console.assert(null_default !== undefined);
        console.assert(get_label !== undefined);
        /**
         * 绘制单条折线图
         * @param xdata: [1, 2, 3...] x轴数值数组
         * @param ydata: [2.0, 4.9, 5.1, ...] y轴数值数组
         * @param options:
         * {
         *      xlabel: string|x轴标签,
         *      ylabel: string|y轴标签,
         *      markPoint: boolean|是否标记最大值和最小值点, 默认为true,
         *      zoom: boolean|是否带x轴缩放插件,
         *      smooth: boolean|是否平滑曲线, 默认为true,
         *      scale: boolean|是否允许y轴坐标浮动, 默认为true,
         * }
         */
        this.singleLineOption = function(xdata, ydata, options) {
            options = options || {};
            var xlabel = get_label(options.xlabel);
            var ylabel = get_label(options.ylabel);
            var markPoint = null_default(options.markPoint, true);
            var smooth = null_default(options.smooth, true);
            var zoom = null_default(options.zoom, true);
            var scale = null_default(options.scale, true);

            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xdata,
                        axisLabel: {
                            formatter: xlabel,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: ylabel,
                        },
                        scale: scale,
                    }
                ],
                series: [
                    {
                        name: options.title || '',
                        type: 'line',
                        data: ydata,
                        smooth: smooth,
                    },
                ]
            };
            if(markPoint) {
                option.series[0].markPoint = {
                    data: [
                        {
                            type: 'max',
                            name: '最大值',
                            symbol: 'star',
                            symbolSize: 8,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '0'
                                        }
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false
                                    }
                                }
                            }
                        },
                        {
                            type: 'min',
                            name: '最小值',
                            symbol: 'star',
                            symbolSize: 8,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '0'
                                        }
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false
                                    }
                                }
                            }
                        }]
                };
            }

            if(zoom) {
                option.dataZoom = {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                };
            }
            return $.set_common_option(option, options);
        };


        /**
         * 绘制多条折线图
         * @param xdata: [1, 2, 3...] x轴数值数组
         * @param ydata: [[2.0, 4.9, 5.1...]...] 多维数组, 每个元素代表一条折线
         * @param legends: ['通胀率', ...]图例数组
         * @param options: 可选项
         * {
         *      xlabel: string|x轴标签,
         *      ylabel: string|y轴标签,
         *      zoom: boolean|是否带x轴缩放插件, 默认为false,
         *      smooth: boolean|是否平滑曲线, 默认为true,
         *      scale: boolean|是否允许y轴坐标浮动, 默认为true,
         * }
         */
        this.linesOption = function(xdata, ydata, legends, options) {
            options = options || {};
            var xlabel = get_label(options.xlabel);
            var ylabel = get_label(options.ylabel);
            var smooth = null_default(options.smooth, true);
            var zoom = null_default(options.zoom, true);
            var scale = null_default(options.scale, true);
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                legend: {
                    data: legends
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xdata,
                        axisLabel: {
                            formatter: xlabel,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: ylabel,
                        },
                        scale: scale,
                    }
                ],
                series: []
            };
            for(var i = 0; i < ydata.length; i++) {
                var serial_option = {
                    name: legends[i],
                    type: 'line',
                    data: ydata[i],
                    smooth: smooth,
                };
                option.series.push(serial_option);
            }
            if(zoom) {
                option.dataZoom = {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                };
            }
            return $.set_common_option(option, options);
        };

        /**
         * 绘制2条折线, 每条折线有自己的纵坐标轴
         * @param xdata: [1, 2, 3...] x轴数值数组
         * @param ydata: [[2.0, 4.9, 5.1...]...] 多维数组, 每个元素代表一条折线
         * @param legends: ['通胀率', ...]图例数组
         * @param options: 可选项
         * {
         *      xlabel: string|x轴标签,
         *      ylabel: string|y轴标签,
         *      smooth: boolean|是否平滑曲线, 默认为true,
         *      zoom: boolean|是否带x轴缩放插件, 默认为true,
         *      scale: boolean|是否允许y轴坐标浮动, 默认为true
         * }
         */
        this.lineAxisOption = function(xdata, ydata, legends, options) {
            options = options || {};
            var xlabel = get_label(options.xlabel);
            var ylabel = null_default(options.ylabel, ['', '']);
            var ylabels = get_label(ylabel);

            var smooth = null_default(options.smooth, true);
            var zoom = null_default(options.zoom, true);
            var scale = null_default(options.scale, true);
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                legend: {
                    data: legends
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xdata,
                        axisLabel: {
                            formatter: xlabel,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: ylabels[0],
                        },
                        scale: scale,
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: ylabels[1],
                        },
                        scale: scale,
                    }
                ],
                series: []
            };
            for(var i = 0; i < 2; i++) {
                var serial_option = {
                    name: legends[i],
                    type: 'line',
                    data: ydata[i],
                    smooth: smooth,
                    yAxisIndex: i,
                };
                option.series.push(serial_option);
            }
            if(zoom) {
                option.dataZoom = {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                };
            }
            return $.set_common_option(option, options);
        };


        /**
         * 绘制多条x轴为时间轴的折线图
         * @param xdata: ['2015-01-01 01:00:00', '2015-01-01 02:00:00', ...] x轴时间字符串数组
         * @param ydata: [[2.0, 4.9, 5.1...]...] 多维数组, 每个元素代表一条折线
         * @param legends: ['通胀率', ...]图例数组
         * @param options: 可选项
         * {
         *      xlabel: string|x轴标签,
         *      ylabel: string|y轴标签,
         *      zoom: boolean|是否带x轴缩放插件, 默认为false,
         *      smooth: boolean|是否平滑曲线, 默认为true,
         *      scale: boolean|是否允许y轴坐标浮动, 默认为true,
         * }
         */
        this.linesTimeOption = function(xdata, ydata, legends, options) {
            options = options || {};
            var ylabel = get_label(options.ylabel);
            var smooth = null_default(options.smooth, true);
            var zoom = null_default(options.zoom, true);
            var scale = null_default(options.scale, true);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        var date = new Date(params.value[0]);
                        var data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
                            ' ' + date.getHours() + ':' + date.getMinutes();
                        return data + '<br/>' + params.value[1];
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                legend: {
                    data: legends
                },
                xAxis: [
                    {
                        type: 'time',
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: ylabel,
                        },
                        scale: scale,
                    }
                ],
                series: []
            };

            function prepare_data(x, y) {
                var d = [];
                for(var i = 0; i < x.length; i++) {
                    d.push([new Date(x[i]), y[i]]);
                }
                return d;
            }

            for(var i = 0; i < ydata.length; i++) {
                var serial_option = {
                    name: legends[i],
                    type: 'line',
                    data: prepare_data(xdata, ydata[i]),
                    smooth: smooth,
                };
                option.series.push(serial_option);
            }
            if(zoom) {
                option.dataZoom = {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                };
            }
            return $.set_common_option(option, options);
        };
    };
})(simple_echarts);
