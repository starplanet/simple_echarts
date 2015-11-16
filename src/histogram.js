var simple_echarts = window.simple_echarts || {};

simple_echarts.hist = new function() {
    /**
     * 功能: 绘制直方图, 可绘制多组
     * @param xdata: ['1月', '2月', ...]  横轴分类数组
     * @param ydata: [[2.0, 4.9, ...]...] 多维数组, 每个元素代表一组y值数组
     * @param legends: 图例, 每组直方图对应一个图例;
     * @param options: 字典类型, 可选项
         {
            title: string|标题,
            subtitle: string|字标题,
            xunit: string|x轴单位,
            yunit: string|y轴单位,
            stack: boolean|是否层叠, 默认false
            markLine: boolean|是否输出平均线, 默认true
            markPoint: boolean|是否输出最大值, 最小值点, 默认true
         }
     */
    this.histOption = function(xdata, ydata, legends, options) {
        options = options == null ? {} : options;
        var xlabel = get_label(options.xunit);
        var ylabel = get_label(options.yunit);
        var stack = null_default(options.stack, false);
        var markLine = null_default(options.markLine, true);
        var markPoint = null_default(options.markPoint, true);
        var title = null_default(options.title, '');
        var subtitle = null_default(options.subtitle, '');

        var option = {
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
                    data : xdata,
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

        for(var i = 0; i < ydata.length; i++) {
            var serial_option = {
                name: legends[i],
                type: 'bar',
                data: ydata[i],
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
            if(ydata.length == 1) {
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

    /**
     * 功能: 绘制带2个纵坐标轴的直方图
     * @param xdata: ['1月', '2月', ...]  横轴分类数组
     * @param ydata: [[2.0, 4.9, ...], [2.0, 4.9, ...]] 二维数组, 代表2组直方图, 第一个直方图使用左边的y轴, 第二个使用右边y轴
     * @param legends: 图例, 每组直方图对应一个图例;
     * @param options: 字典类型, 可选项
     * {
     *      title: string|标题,
     *      subtitle: string|子标题,
     *      xunit: string|x轴单位,
     *      yunit: array|y轴单位, 包含2个字符串元素的数组, 分别对应第一个和第二个数值单位
     * }
     */
    this.histAxisOption = function(xdata, ydata, legends, options) {
        options = options == null ? {} : options;
        var xlabel = get_label(options.xunit);
        var yunit = null_default(options.yunit, ['', '']);
        var ylabel = get_label(yunit);
        var title = null_default(options.title, '');
        var subtitle = null_default(options.subtitle, '');

        var option = {
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
                    data : xdata,
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

        for(var i = 0; i < 2; i++) {
            var serial_option = {
                name: legends[i],
                type: 'bar',
                data: ydata[i],
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
