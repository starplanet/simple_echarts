var simple_echarts = window.simple_echarts || {};

simple_echarts.line = new function() {
    function get_label(label) {
        if(label) {
            return '{value}' + label;
        } else {
            return '{value}';
        }
    }

    this.singleLineOption = function(xdata, ydata, title, xlabel, ylabel, zoom, markPoint, smooth) {
        xlabel = get_label(xlabel);
        ylabel = get_label(ylabel);

        // 向后兼容
        markPoint = markPoint == null ? true : markPoint;
        smooth = smooth == null ? false : smooth;

        option = {
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
                        name: title,
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
        return option;
    }


    // 用法: xdata为x轴标签数组, ydata为形如[[1,2...], [1, 3...]]数组, legends为对应曲线标签
    this.linesOption = function(xdata, ydata, legends, title, xlabel, ylabel, zoom) {
        xlabel = get_label(xlabel);
        ylabel = get_label(ylabel);
        option = {
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
                        }
                    }
                ],
            series: []
        };
        for(i = 0; i < ydata.length; i++) {
            serial_option = {
                name: legends[i],
                type: 'line',
                data: ydata[i],
                smooth: true,
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
        return option;
    }
};
