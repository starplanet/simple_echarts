var simple_echarts = window.simple_echarts || {};

simple_echarts.line = new function() {
    /**
     * 绘制单条折线图
     * @param xdata: [1, 2, 3...] x轴数值数组
     * @param ydata: [2.0, 4.9, 5.1, ...] y轴数值数组
     * @param options:
     * {
     *      title: string|标题,
     *      xlabel: string|x轴标签,
     *      ylabel: string|y轴标签,
     *      zoom: boolean|是否带x轴缩放插件,
     *      markPoint: boolean|是否标记最大值和最小值点, 默认为true
     *      smooth: boolean|是否平滑曲线, 默认为true
     * }
     */
    this.singleLineOption = function(xdata, ydata, options) {
        options = options || {};
        var xlabel = get_label(options.xlabel);
        var ylabel = get_label(options.ylabel);
        var markPoint = null_default(options.markPoint, true);
        var smooth = null_default(options.smooth, true);

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
                        }
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

        if(options.zoom) {
            option.dataZoom = {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            };
        }
        return option;
    }


    /**
     * 绘制多条折线图
     * @param xdata: [1, 2, 3...] x轴数值数组
     * @param ydata: [[2.0, 4.9, 5.1...]...] 多维数组, 每个元素代表一条折线
     * @param legends: ['通胀率', ...]图例数组
     * @param options: 可选项
     * {
     *      xlabel: string|x轴标签,
     *      ylabel: string|y轴标签,
     *      zoom: boolean|是否带x轴缩放插件, 默认为false
     * }
     */
    this.linesOption = function(xdata, ydata, legends, options) {
        options = options || {};
        var xlabel = get_label(options.xlabel);
        var ylabel = get_label(options.ylabel);
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
                        scale: true,
                    }
                ],
            series: []
        };
        for(var i = 0; i < ydata.length; i++) {
            var serial_option = {
                name: legends[i],
                type: 'line',
                data: ydata[i],
                smooth: true,
            };
            option.series.push(serial_option);
        }
        if(options.zoom) {
            option.dataZoom = {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            };
        }
        return option;
    }
};
