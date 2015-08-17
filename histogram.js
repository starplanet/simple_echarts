var simple_echarts = window.simple_echarts || {};

simple_echarts.hist = new function() {
    function get_label(unit) {
        if(unit) {
            if(unit instanceof Array) {
                var labels = new Array();
                for(var i = 0; i < unit.length; i++) {
                    labels.push('{value}' + unit[i]);
                }
                return labels;
            }
            return '{value}' + unit;
        } else {
            return '{value}';
        }
    }

    // 用法:
    // 功能: 绘制直方图, 可绘制多组
    // @param data: data形似{'x': ['1月', '2月' ...], 'y': [[2.0, 4.9 ...], ...]}的数据, x表示横轴分类, y表示数据数组, 每个元素对应一组直方图.
    // @param legends: 图例, 每组直方图对应一个图例;
    // @param options: 字典类型, 可选项
    // { title: 标题, subtitle: 字标题, xunit: x轴单位, yunit: y轴单位, stack: 是否层叠, markLine: 是否输出平均线, markPoint: 是否输出最大值, 最小值点 }
    this.histOption = function(data, legends, options) {
        options = options == null ? {} : options;
        xlabel = get_label(options.xunit);
        ylabel = get_label(options.yunit);
        stack = options.stack == null ? false : options.stack;
        markLine = options.markLine == null ? true: options.markLine;
        markPoint = options.markPoint == null ? true: options.markPoint;

        title = options.title == null ? '' : options.title;
        subtitle = options.subtitle == null ? '' : options.subtitle;

        option = {
            title : {
                text: title,
                subtext: subtitle
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data: legends
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : data['x'],
                    axisLabel: {
                        formatter: xlabel,
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {
                        formatter: ylabel,
                    }
                }
            ],
            series : []
        };

        for(i = 0; i < data['y'].length; i++) {
            serial_option = {
                name: legends[i],
                type: 'bar',
                data: data['y'][i],
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                            position: 'top',
                            formatter: '{b}\n{c}'
                        }
                    }
                },
            };
            if(markPoint) {
                serial_option.markPoint = {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                };
            }
            if(markLine) {
                serial_option.markLine = {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                };
            }
            if(data['y'].length == 1) {
                serial_option.itemStyle.normal.color = function(params) {
                    // build a color map as your need.
                    var colorList = [
                      '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                       '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                       '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                    ];
                    return colorList[params.dataIndex];
                };
            }
            if(stack) {
                serial_option.stack = 'stack';
            }
            option.series.push(serial_option);
        }
        return option;
    }

    // 功能: 绘制带2个纵坐标轴的直方图
    // @param data: data形似{'x': ['1月', '2月' ...], 'y': [[2.0, 4.9 ...], ...]}的数据, x表示横轴分类, y表示数据数组, 每个元素对应一组直方图.
    // @param legends: 图例, 每组直方图对应一个图例;
    // @param options: 字典类型, 可选项
    // {title: 标题, subtitle: 子标题, xunit: x轴单位, yunit: y轴单位}
    this.histAxisOption = function(data, legends, options) {
        options = options == null ? {} : options;
        xlabel = get_label(options.xunit);
        yunit = options.yunit == null ? ['', ''] : options.yunit;
        ylabel = get_label(options.yunit);

        title = options.title == null ? '' : options.title;
        subtitle = options.subtitle == null ? '' : options.subtitle;

        option = {
            title : {
                text: title,
                subtext: subtitle
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data: legends
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : data['x'],
                    axisLabel: {
                        formatter: xlabel,
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {
                        formatter: ylabel[0],
                    }
                },
                {
                    type : 'value',
                    axisLabel: {
                        formatter: ylabel[1],
                    }
                }
            ],
            series : []
        };

        for(i = 0; i < 2; i++) {
            serial_option = {
                name: legends[i],
                type: 'bar',
                data: data['y'][i],
                yAxisIndex: i,
                markPoint: {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{b}\n{c}'
                        }
                    }
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            };
            option.series.push(serial_option);
        }
        return option;
    }
};
