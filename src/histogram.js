var simple_echarts = window.simple_echarts || {};

(function($) {
    $.hist = new function() {
        var $this = this;
        var null_default = $.null_default;
        var get_label = $.get_label;
        console.assert(null_default !== undefined);
        console.assert(get_label !== undefined);
        /**
         * 功能: 绘制直方图, 可绘制多组
         * @param xdata: ['1月', '2月', ...]  横轴分类数组
         * @param ydata: [[2.0, 4.9, ...]...] 多维数组, 每个元素代表一组y值数组
         * @param legends: 图例, 每组直方图对应一个图例;
         * @param options: 字典类型, 可选项
         {
            xlabel: string|x轴标签,
            ylabel: string|y轴标签,
            stack: boolean|是否层叠, 默认false
            markLine: boolean|是否输出平均线, 默认true
            markPoint: boolean|是否输出最大值, 最小值点, 默认true
            colorList: array|颜色列表
         }
         */
        $this.histOption = function(xdata, ydata, legends, options) {
            options = null_default(options, {});
            var xlabel = get_label(options.xlabel);
            var ylabel = get_label(options.ylabel);
            var stack = null_default(options.stack, false);
            var markLine = null_default(options.markLine, true);
            var markPoint = null_default(options.markPoint, true);
            var colorList = null_default(options.colorList, null);

            console.log(colorList);
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    x: 'left',
                    y: 'top',
                    orient: 'horizontal',
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
                            rotate: options.xaxislabel_rotate || 0,
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

            var color_callback = function(params) {
                // build a color map as your need.
                if(!colorList) {
                    colorList = [
                        '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                    ];
                }
                return colorList[params.seriesIndex % colorList.length];
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
                serial_option.itemStyle.normal.color = color_callback;
                if(stack) {
                    serial_option.stack = 'stack';
                }
                option.series.push(serial_option);
            }
            return $.set_common_option(option, options);
        };

        /**
         * 功能: 绘制带2个纵坐标轴的直方图
         * @param xdata: ['1月', '2月', ...]  横轴分类数组
         * @param ydata: [[2.0, 4.9, ...], [2.0, 4.9, ...]] 二维数组, 代表2组直方图, 第一个直方图使用左边的y轴, 第二个使用右边y轴
         * @param legends: 图例, 每组直方图对应一个图例;
         * @param options: 字典类型, 可选项
         * {
         *      xlabel: string|x轴标签,
         *      ylabel: array|y轴标签, 包含2个字符串元素的数组, 分别对应第一个和第二个数值单位
         *      markLine: boolean|是否输出平均线, 默认true
         *      markPoint: boolean|是否输出最大值, 最小值点, 默认true
         * }
         */
        $this.histAxisOption = function(xdata, ydata, legends, options) {
            options = options == null ? {} : options;
            var xlabel = get_label(options.xlabel);
            var ylabel = null_default(options.ylabel, ['', '']);
            var ylabel = get_label(ylabel);
            var markPoint = null_default(options.markPoint, true);
            var markLine = null_default(options.markLine, true);
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    x: 'left',
                    y: 'top',
                    orient: 'horizontal',
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
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            }
                        }
                    }
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
                option.series.push(serial_option);
            }
            return $.set_common_option(option, options);
        };

        /**
         * 绘制直方图嵌饼图
         * @param xdata: ['1月', '2月' ...] x轴分类数组
         * @param ydata: [[2.0, 4.9 ...], ...] y轴多维数组, 每个元素对应一组直方图
         * @param legends: ['2014', '2015', ...] 图例数组, 每组直方图对应一个图例
         * @param options: 可选项
         * {
         *      stack: boolean|是否层叠, 默认为false,
         *      markLine: boolean|是否输出均值线, 默认为true,
         *      markPoint: boolean|是否输出标记点, 默认为true,
         *      pie_center: array|饼图中心点[x, y]坐标, 默认为[160, 100]
         *      pie_radius: array|饼图半径大小[内径, 外径], 默认为[0, 50]
         *      pie: object|{'data': array, 'label': []}对象, 用于自定义绘制饼图, 默认data取ydata[0], label取xdata
         * }
         */
        $this.histPieOption = function(xdata, ydata, legends, options) {
            function pie_data(data, legends) {
                var pdata = [];
                for(var i = 0; i < data.length; i++) {
                    pdata.push({'name': legends[i], 'value': data[i]});
                }
                return pdata;
            }

            options = options == null ? {} : options;
            var xlabel = get_label(options.xlabel);
            var ylabel = get_label(options.ylabel);
            var stack = null_default(options.stack, false);
            var markLine = null_default(options.markLine, true);
            var markPoint = null_default(options.markPoint, true);
            var pie_center = null_default(options.pie_center, [160, 100]);
            var pie_radius = null_default(options.pie_radius, [0, 50]);
            var pie = null_default(options.pie, {'data': ydata[0], 'label': xdata});

            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    'x': 'left',
                    'y': 'top',
                    'orient': 'horizontal',
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
                series : [
                    {
                        type:'pie',
                        tooltip : {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        center: pie_center,
                        radius : pie_radius,
                        itemStyle :　{
                            normal : {
                                labelLine : {
                                    length : 20
                                }
                            }
                        },
                        data: pie_data(pie.data, pie.label),
                    }
                ]
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
            return $.set_common_option(option, options);
        };

        /**
         * 绘制多维条形图
         * @param xdata: ['1月', '2月' ...] x轴分类数组
         * @param ydata: [[2.0, 4.9 ...], ...] y轴多维数组, 每个元素对应一组条形图
         * @param legends: ['2014', '2015', ...] 图例数组, 每组条形图对应一个图例
         * @param options: 可选项
         * {
         *      legend_itemGap: integer|图例间隔, 默认120px,
         *      padding: integer|条形图内边距, 默认100,
         *      margin_x: integer|y轴左边距
         * }
         */
        $this.multiBarOption = function(xdata, ydata, legends, options) {
            options = options || {};
            var legend_itemGap = null_default(options.legend_itemGap, 120);
            var padding = null_default(options.padding, 100);
            var margin_x = null_default(options.margin_x, null);

            function invert_data(data) {
                var res = [];
                for(var i = 0; i < data.length; i++) {
                    res.push(padding - data[i]);
                }
                return res;
            }

            var placeHoledStyle = {
                normal:{
                    barBorderColor:'rgba(0,0,0,0)',
                    color:'rgba(0,0,0,0)'
                },
                emphasis:{
                    barBorderColor:'rgba(0,0,0,0)',
                    color:'rgba(0,0,0,0)'
                }
            };
            var dataStyle = {
                normal: {
                    label : {
                        show: true,
                        position: 'insideLeft',
                        formatter: '{c}%'
                    }
                }
            };
            var option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter : '{b}<br/>{a0}:{c0}%<br/>{a2}:{c2}%<br/>{a4}:{c4}%<br/>{a6}:{c6}%'
                },
                legend: {
                    itemGap : legend_itemGap,
                    x: 'center',
                    y: 55,
                    orient: 'horizontal',
                    data: legends,
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                grid: {
                    y: 80,
                    y2: 30
                },
                xAxis : [
                    {
                        type : 'value',
                        position: 'top',
                        splitLine: {show: false},
                        axisLabel: {show: false}
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        splitLine: {show: false},
                        data : xdata,
                    }
                ],
                series : []
            };
            if(margin_x != null) {
                option.grid.x = margin_x;
            }
            for(var i = 0; i < ydata.length; i++) {
                var serial_option = {
                    name: legends[i],
                    type: 'bar',
                    data: ydata[i],
                    stack: '总量',
                    itemStyle: dataStyle,
                };
                option.series.push(serial_option);
                var holed_serial_option = {
                    name: legends[i],
                    type: 'bar',
                    data: invert_data(ydata[i]),
                    stack: '总量',
                    itemStyle: placeHoledStyle,
                };
                option.series.push(holed_serial_option);
            }
            return $.set_common_option(option, options);
        };

        /**
         * 绘制条形图
         * @param xdata: ['1月', '2月' ...] x轴分类数组
         * @param ydata: [[2.0, 4.9 ...], ...] y轴多维数组, 每个元素对应一组条形图
         * @param legends: ['2014', '2015', ...] 图例数组, 每组条形图对应一个图例
         * @param options
         */
        $this.barOption = function(xdata, ydata, legends, options) {
            options = options || {};
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    x: 'left',
                    y: 'top',
                    orient: 'horizontal',
                    data: legends,
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                        boundaryGap : [0, 0.01]
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : xdata,
                    }
                ],
                series : [],
            };
            for(var i = 0; i < ydata.length; i++) {
                var serial_option = {
                    name: legends[i],
                    type: 'bar',
                    data: ydata[i],
                };
                option.series.push(serial_option);
            }
            return $.set_common_option(option, options);
        };

        function timeline_option() {
            this.option = {
                timeline: {
                    data: [
                        // '2014-11-01', '2014-12-01', '2015-01-01'
                    ],
                    autoPlay: true,
                    playInterval: 2000
                },
                options: []
            };
        }

        timeline_option.prototype.append = function(date, option) {
            this.option.timeline.data.push(date);
            this.option.options.push(option);
            return;
        };

        /**
         * 功能: 绘制直方图, 可绘制多组
         * @param xdatas: [['1月', '2月', ...], ['1月', '2月', ...]]  横轴分类数组
         * @param ydatas: [[[2.0, 4.9, ...]...],[[2.0, 4.9, ...]...]] 多维数组, 每个元素代表一组y值数组
         * @param legends: 图例, 每组直方图对应一个图例;
         * @param dates: dates无值时, xdata, ydata与histOption相同; dates有值时, xdata为二维数组, 每个数组对应一个图形的x轴,
         * ydatas为三维数组, 每个元素为一个图形的y轴数据, legends为二维数组, 每个对应一个图例.
         * @param options: 字典类型, 可选项
         {
            xlabel: string|x轴标签,
            ylabel: string|y轴标签,
            stack: boolean|是否层叠, 默认false
            markLine: boolean|是否输出平均线, 默认true
            markPoint: boolean|是否输出最大值, 最小值点, 默认true
            colorList: array|颜色列表
         }
         */
        $this.histTimelineOption = function(xdatas, ydatas, legends, dates, options) {
            if(!dates) {
                return $this.histOption(xdatas, ydatas, legends, options);
            } else {
                var option = new timeline_option();
                for(var i = 0; i < dates.length; i++) {
                    options.name = dates[i];
                    var tmp_legends = legends;
                    var tmp_xdata = xdatas;
                    if(legends[0] instanceof Array) {
                        tmp_legends = legends[i];
                    }
                    if(xdatas[0] instanceof Array) {
                        tmp_xdata = xdatas[i];
                    }
                    var basic_option = $this.histOption(tmp_xdata, ydatas[i], tmp_legends, options);
                    option.append(dates[i], basic_option);
                }
                return option.option;
            }
        };
    };
})(simple_echarts);
