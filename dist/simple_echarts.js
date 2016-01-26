/*! simple_echarts - v0.0.2 - 2016-01-26
* Copyright (c) 2016 ; Licensed  */
var simple_echarts = window.simple_echarts || {};

(function($){
    $.get_label = function(unit) {
        if(unit) {
            if(unit instanceof Array) {
                var labels = [];
                for(var i = 0; i < unit.length; i++) {
                    labels.push('{value}' + unit[i]);
                }
                return labels;
            }
            return '{value}' + unit;
        } else {
            return '{value}';
        }
    };

    $.null_default = function(v, d) {
        return v == null ? d : v;
    };

    $.set_common_option = function(chart_option, options) {
        chart_option.title = $.null_default(chart_option.title, {});
        chart_option.title.text = $.null_default(options.title, $.null_default(chart_option.title.text, ''));
        chart_option.title.subtext = $.null_default(options.subtitle,
            $.null_default(chart_option.title.subtext, ''));
        chart_option.title.x = $.null_default(options.title_x, $.null_default(chart_option.title.x, 'center'));
        chart_option.title.y = $.null_default(options.title_y, $.null_default(chart_option.title.y, 'top'));

        if(chart_option.legend) {
            chart_option.legend.orient = $.null_default(options.legend_orient,
                $.null_default(chart_option.legend.orient, 'horizontal'));
            chart_option.legend.x = $.null_default(options.legend_x, $.null_default(chart_option.legend.x, 'left'));
            chart_option.legend.y = $.null_default(options.legend_y, $.null_default(chart_option.legend.y, 'top'));
        }
        return chart_option;
    };

    $.resize = function(chart) {
        if(window.addEventListener) {
            window.addEventListener('resize', function() { chart.resize(); }, false);
        } else {
            window.attachEvent('onresize', function() { chart.resize(); }, false);
        }
    };
})(simple_echarts);


var simple_echarts = window.simple_echarts || {};

(function($) {
    $.hist = new function() {
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
         }
         */
        this.histOption = function(xdata, ydata, legends, options) {
            options = null_default(options, {});
            var xlabel = get_label(options.xlabel);
            var ylabel = get_label(options.ylabel);
            var stack = null_default(options.stack, false);
            var markLine = null_default(options.markLine, true);
            var markPoint = null_default(options.markPoint, true);

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
                        return colorList[params.dataIndex % colorList.length];
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
        this.histAxisOption = function(xdata, ydata, legends, options) {
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
        this.histPieOption = function(xdata, ydata, legends, options) {
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
        this.multiBarOption = function(xdata, ydata, legends, options) {
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
        this.barOption = function(xdata, ydata, legends, options) {
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
    };
})(simple_echarts);

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
    };
})(simple_echarts);

var simple_echarts = window.simple_echarts || {};

(function($) {
    $.map = new function() {
        var $this = this;
        function get_max_value(cities) {
            var max_val = 0;
            for(var i = 0; i < cities.length; i++) {
                if(cities[i].value > max_val) {
                    max_val = cities[i].value;
                }
            }
            return max_val;
        }

        function get_array_range(data_array) {
            var min = Number.MAX_VALUE;
            var max = 0;
            for(var i = 0; i < data_array.length; i++) {
                if(data_array[i].value < min) {
                    min = data_array[i].value;
                }

                if(data_array[i].value > max) {
                    max = data_array[i].value;
                }
            }
            return [min, max];
        }

        function get_range(data) {
            if(data.pros) {
                return get_array_range(data.pros);
            }

            if(data.cities) {
                return get_array_range(data.cities);
            }

            if(data.top5) {
                return get_array_range(data.top5);
            }
        }

        /**
         * 绘制地图, 用颜色深度标识不同省份数值, 用点的大小标识城市数值, 用动态效果标识top5.
         * @param data:
         * {
         *      pros: 省份数值数组, 格式[{name: '河北', value: 100} ...], 必填项,
         *      cities: 城市数值数组, 格式与省份相同, 可选项,
         *      top5: 前5名城市数组, 格式与省份相同, 可选项,
         * }
         * @param geos: 地理坐标数组, { '海门': [121.15, 31.89], ...}
         * @param options: 可选项
         * {
         *      range: array|[min, max], 数值范围,
         *      english: boolean|是否显示为英文地图, 默认为false
         * }
         */
        $this.basicMapOption = function(data, geos, options) {
            options = options || {};
            var range = options.range || get_range(data);
            var symbol_size = null;
            if(data.cities) {
                var max_val = get_max_value(data.cities);
                symbol_size = function(v) {
                    v = v / max_val * 10 + 5;
                    if(v > 10) {
                        v = 10;
                    }
                    return v;
                };
            }

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}:{c}'
                },
                dataRange: {
                    min: range[0],
                    max: range[1],
                    calculable: true,
                    color: ['maroon', 'purple', 'red', 'orange', 'yellow', 'lightgreen']
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                roamController: {
                    show: true,
                    x: 'right',
                    mapTypeControl: {
                        'china': true
                    }
                },
                series: [
                    {
                        name: options.title || '',
                        type: 'map',
                        mapType: 'china',
                        hoverable: true,
                        roam: 'move',
                        data: [],
                        itemStyle: {
                            normal: { label: { show: true }},
                            emphasis: { label: { show: true }}
                        },
                        geoCoord: geos // { '海门': [121.15, 31.89], }
                    },
                ]
            };
            if(options.english) {
                option.series[0].nameMap = {
                    '北京': 'Beijing',
                    '天津': 'Tianjing',
                    '河北': 'Hebei',
                    '山西': 'Shanxi',
                    '宁夏': 'Ningxia',
                    '陕西': 'Shaanxi',
                    '河南': 'Henan',
                    '湖北': 'Hubei',
                    '安徽': 'Anhui',
                    '江苏': 'Jiangsu',
                    '山东': 'Shandong',
                    '上海': 'Shanghai',
                    '浙江': 'Zhejiang',
                    '江西': 'Jiangxi',
                    '福建': 'Fujian',
                    '台湾': 'Taiwan',
                    '南海诸岛': 'South China Sea',
                    '广东': 'Guangdong',
                    '广西': 'Guangxi',
                    '海南': 'Hainan',
                    '澳门': 'Macao',
                    '香港': 'Hongkong',
                    '云南': 'Yunnan',
                    '贵州': 'Guizhou',
                    '湖南': 'Hunan',
                    '重庆': 'Chongqing',
                    '四川': 'Sichuan',
                    '新疆': 'Xingjiang',
                    '西藏': 'Tibet',
                    '青海': 'Qinghai',
                    '甘肃': 'Gansu',
                    '内蒙古': 'Neimenggu',
                    '黑龙江': 'Heilongjiang',
                    '吉林': 'Jilin',
                    '辽宁': 'Liaoning',
                };
            }

            if(data.pros) {
                option.series[0].data = data.pros;
            }

            if(data.cities) {
                option.series[0].markPoint = {
                    symbolSize: symbol_size,
                    itemStyle: {
                        normal: {
                            borderColor: '#87cefa',
                            borderWidth: 1,
                            label: {
                                show: false
                            }
                        },
                        emphasis: {
                            borderColor: '#1e90ff',
                            borderWidth: 5,
                            label: {
                                show: false
                            }
                        }
                    },
                    data: data.cities, // [ { name: '海门', value: 9 }, ]
                };
            }

            if(data.top5) {
                option.series.push(
                    {
                        name: 'Top5',
                        type: 'map',
                        data: [],
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: symbol_size,
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: { show: true}
                                }
                            },
                            data: data.top5,  // [ { name: '廊坊', value: 193}, ]
                        }
                    }
                );
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

        function get_data_by_index(data, i) {
            var res = {};
            if(data.pros) {
                res.pros = data.pros[i];
            }
            if(data.cities) {
                res.cities = data.cities[i];
            }
            if(data.top5) {
                res.top5 = data.top5[i];
            }
            return res;
        }

        /**
         * 绘制带时间轴的地图
         * @param data:
         * {
         *      pros: 省份数值数组, 格式[{name: '河北', value: 100} ...], 必填项,
         *      cities: 城市数值数组, 格式与省份相同, 可选项,
         *      top5: 前5名城市数组, 格式与省份相同, 可选项,
         * }
         * @param geos: 地理坐标数组, { '海门': [121.15, 31.89], ...}
         * @param dates: dates无值时, pros, cities, top5直接为形如[ { name: '廊坊', value: 193 } ]的数组;
         *      dates有值时, pros, cities, top5的值为形如[[ { name: '廊坊', value:193 }... ], ..]的多维数组;
         * @param options: 可选项
         * {
         *      range: array|[min, max], 数值范围
         * }
         */
        $this.mapOption = function(data, geos, dates, options) {
            if(!dates) {
                return $this.basicMapOption(data, geos, options);
            } else {
                var option = new timeline_option();
                for(var i = 0; i < dates.length; i++) {
                    options.name = dates[i];
                    var basic_option = $this.basicMapOption(get_data_by_index(data, i), geos, options);
                    option.append(dates[i], basic_option);
                }
                return option.option;
            }
        };
    };
})(simple_echarts);

var simple_echarts = window.simple_echarts || {};

(function($) {
    $.pie = new function() {
        var null_default = $.null_default;
        var get_label = $.get_label;
        console.assert(null_default !== undefined);
        console.assert(get_label !== undefined);

        function pie_data(data, legends) {
            var pdata = [];
            for(var i = 0; i < data.length; i++) {
                pdata.push({'name': legends[i], 'value': data[i]});
            }
            return pdata;
        }

        /**
         * 绘制饼图
         * @param data: [10, 20, ...] 数值数组
         * @param legends: 每个数值对应的图例名称
         * @param options: 可选项
         */
        this.pieOption = function(data, legends, options) {
            options = options || {};
            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    data:legends
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                series : [
                    {
                        name: null_default(options.title, ''),
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: pie_data(data, legends)
                    }
                ]
            };
            return $.set_common_option(option, options);
        };

        function default_xcenters(count) {
            var interval = 100 / (count + 1);
            var xcenters = [];
            for(var i = 0; i < count; i++) {
                xcenters.push((i + 1) * interval + '%');
            }
            return xcenters;
        }

        function get_centers(xcenters, ycenter) {
            var centers = [];
            for(var i = 0; i < xcenters.length; i++) {
                if(ycenter instanceof Array) {
                    centers.push([xcenters[i], ycenter[i]]);
                } else {
                    centers.push([xcenters[i], ycenter]);
                }
            }
            return centers;
        }

        /**
         * 绘制环形图, 可绘制多张
         * @param data: [[1, 2, 3], [4, 5, 6]]每张图对应一个元素, 每个元素可包含多个值;
         * @param legends: ['春', '夏']图例数组
         * @param labels: [['凉鞋', '高跟', '低跟'], ['凉鞋', '高跟', '低跟']]数组形式与data一致, 表示每个值对应的标签;
         * @param options: 可选项
         * {
         *      xcenters: array|各环形图中心x轴坐标数组,
         *      ycenter: string or array|各环形图中心y轴坐标位置,
         *      radius: array|环形图半径数组, 第一个值为内径, 第二个值为外径,
         * }
         */
        this.ringOption = function(data, legends, labels, options) {
            options = options || {};
            options.radius = null_default(options.radius, ['40%', '55%']);
            var xcenters = null_default(options.xcenters, default_xcenters(data.length));
            var ycenter = null_default(options.ycenter, '50%');
            var centers = get_centers(xcenters, ycenter);
            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    data:legends
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                series : []
            };

            for(var i = 0; i < data.length; i++) {
                var serial_option = {
                    type: 'pie',
                    radius: options.radius,
                    center: centers[i],
                    data: pie_data(data[i], labels[i])
                };
                option.series.push(serial_option);
            }
            return $.set_common_option(option, options);
        };

        /**
         * 绘制维恩图
         * @param data: [30, 50, 10] 数值数组, 第一个和第二个值为两类数值, 第3个为两类重合度数值
         * @param labels: ['线上', '线下', '重合'] 标签数组
         * @param options: 可选项
         */
        this.vennOption = function(data, labels, options) {
            options = options || {};
            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}: {c}"
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
                calculable : false,
                series : [
                    {
                        type:'venn',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontFamily: 'Arial, Verdana, sans-serif',
                                        fontSize: 16,
                                        fontStyle: 'italic',
                                        fontWeight: 'bolder'
                                    }
                                },
                                labelLine: {
                                    show: false,
                                    length: 10,
                                    lineStyle: {
                                        // color: 各异,
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            emphasis: {
                                color: '#cc99cc',
                                borderWidth: 3,
                                borderColor: '#996699'
                            }
                        },
                        data: pie_data(data, labels)
                    }
                ]
            };
            return $.set_common_option(option, options);
        };

        /**
         * 绘制嵌套饼图
         * @param data: [[1, 2, 3], [4, 5, 6]]每张图对应一个元素, 每个元素可包含多个值;
         * @param legends: ['春', '夏']图例数组
         * @param labels: [['凉鞋', '高跟', '低跟'], ['凉鞋', '高跟', '低跟']]数组形式与data一致, 表示每个值对应的标签;
         * @param options: 可选项
         * {
         *      name: 数据来源名称
         * }
         */
        this.pieEmbeddedOption = function(data, legends, labels, options) {
            options = options || {};
            var name = null_default(options.name, '');
            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    data:legends
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                series : [
                    {
                        name: name,
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, 70],

                        // for funnel
                        x: '20%',
                        width: '40%',
                        funnelAlign: 'right',
                        max: 1548,

                        itemStyle: {
                            normal: {
                                label: {
                                    position: 'inner'
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        data: pie_data(data[0], labels[0])
                    },
                    {
                        name: name,
                        type: 'pie',
                        radius: [100, 140],

                        // for funnel
                        x: '60%',
                        width: '35%',
                        funnelAlign: 'left',
                        max: 1048,

                        data: pie_data(data[1], labels[1])
                    }
                ]
            };

            return $.set_common_option(option, options);
        };
    };
})(simple_echarts);

var simple_echarts = window.simple_echarts || {};

(function($) {
    $.radar = new function() {
        var null_default = $.null_default;
        var get_label = $.get_label;
        console.assert(null_default !== undefined);
        console.assert(get_label !== undefined);

        function get_indicator(indicator, max_sale) {
            var indicator_obj = [];
            for(var i = 0; i < indicator.length; i++) {
                indicator_obj.push({text: indicator[i], max: max_sale[i]});
            }
            return indicator_obj;
        }
        /**
         * 绘制单雷达图, 一张雷达图上可叠加多组数据
         * @param data: [[10, 8, 8, 5], [9, 9, 8, 7]] 多维数组, 每个元素对应雷达图中一条曲线
         * @param legends: ['A', 'B']  每条曲线图例名称
         * @param indicator: ['英语', '数学', '语文', '理综'] 雷达图每个方向上标签
         * @param max_scale: [10, 10, 10, 10] 雷达图每个方向上的最大值
         * @param options: 可选项
         * {
         *      radius: string|雷达图半径大小, 百分数或像素大小,
         * }
         */
        this.radarOption = function(data, legends, indicator, max_scale, options) {
            options = options || {};
            var radius = null_default(options.radius, '60%');
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
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
                polar : [
                    {
                        indicator : get_indicator(indicator, max_scale),
                        radius: radius,
                    }
                ],
                calculable : true,
                series : [
                    {
                        name: null_default(options.title, ''),
                        type: 'radar',
                        data : [],
                    }
                ]
            };
            for(var i = 0; i < data.length; i++) {
                option.series[0].data.push({value: data[i], name: legends[i]});
            }
            return $.set_common_option(option, options);
        };

        function get_legends(labels) {
            var legends = [];
            for(var i = 0; i < labels.length; i++) {
                if(labels[i] instanceof Array) {
                    for(var j = 0; j < labels[i].length; j++) {
                        legends.push(labels[i][j]);
                    }
                } else {
                    legends.push(labels[i]);
                }
            }
            var set = {};
            var res = [];
            for(var j = 0; j < legends.length; j++) {
                if(!set[legends[j]]) {
                    res.push(legends[j]);
                    set[legends[j]] = true;
                }
            }
            return res;
        }

        function default_xcenters(count) {
            var xcenters = [];
            for(var i = 0; i < count; i++) {
                xcenters.push((i + 1) / (count + 1) * 100 + '%');
            }
            return xcenters;
        }

        function get_centers(xcenters, ycenter) {
            var centers = [];
            for(var i = 0; i < xcenters.length; i++) {
                if(ycenter instanceof Array) {
                    centers.push([xcenters[i], ycenter[i]]);
                } else {
                    centers.push([xcenters[i], ycenter]);
                }
            }
            return centers;
        }

        /**
         * 绘制多雷达图
         * @param data: [[1, 2, 3], [[1, 2, 3], [2, 3, 4]] ...]最多三维数组, 每个元素代表一张雷达图, 每张雷达图可以绘制多个曲线
         * @param legends: ['颜色', ['线上', '线下']]数组结构与data一致, 表示每个数据曲线的图例名称
         * @param indicators: [['红', '黄', '蓝'], ['喜欢', '不喜欢', '中性']...]每张雷达图对应一个indicator, 只是每个方向的标签
         * @param max_scales: [['5', '5', '5'], ['3', '3', '3']]每张雷达图每个方向需设置一个最大范围,
         * @param options:
         * {
         *      xcenters: array|['30%', '60%']每张雷达图中心x轴坐标位置,
         *      ycenter: string or array|每张雷达图中心y轴坐标位置,
         *      radius: string|雷达图半径大小, 百分数或像素大小,
         * }
         */
        this.multiRadarOption = function(data, legends, indicators, max_scales, options) {
            options = options || {};
            var xcenters = null_default(options.xcenters, default_xcenters(data.length));
            var ycenter = null_default(options.ycenter, '50%');
            var centers =  get_centers(xcenters, ycenter);
            var radius = null_default(options.radius, '60%');
            var new_legends = get_legends(legends);
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data: new_legends,
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
                calculable : true,
                polar : [],
                series : [],
            };
            for(var i = 0; i < indicators.length; i++) {
                var indicator = [];
                for(var j = 0; j < indicators[i].length; j++) {
                    indicator.push({'text': indicators[i][j], max: max_scales[i][j]});
                }
                option.polar.push({'indicator': indicator, center: centers[i], radius: radius});
            }
            for(var i = 0; i < data.length; i++) {
                var serial_option = {
                    type: 'radar',
                    polarIndex: i,
                    data: [],
                };
                if(data[i][0] instanceof Array) {
                    for(var j = 0; j < data[i].length; j++) {
                        serial_option.data.push({'value': data[i][j], 'name': legends[i][j]});
                    }
                } else {
                    serial_option.data.push({'value': data[i], 'name': legends[i]});
                }
                option.series.push(serial_option);
            }
            return $.set_common_option(option, options);
        };
    };
})(simple_echarts);


var simple_echarts = window.simple_echarts || {};

(function($) {
    $.wcloud = new function() {
        function createRandomItemStyle() {
            return {
                normal: {
                    color: 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')'
                }
            };
        }

        function randomValue(scale) {
            return Math.round(Math.random() * scale);
        }

        function scaleYdata(ydata, len, scale) {
            for(var i = ydata.length; i < len; i++) {
                ydata.push(randomValue(scale));
            }
        }

        /**
         *
         * @param xdata: 字符串数组
         * @param ydata: 与字符串关联的权重数组, 如果未与xdata一一对应, 缺失的部分将自动填充随机值
         * @param options: 可选项
         */
        this.wcloudOption = function(xdata, ydata, options) {
            options = options || {};
            var tooltip = $.null_default(options.tooltip, false);
            var rotation = $.null_default(options.rotation, [0, 45, 90, -45]);
            var minSize = $.null_default(options.minSize, 20);
            var scale = $.null_default(options.scale, 100);
            var size = $.null_default(options.size, ['80%', '80%']);
            ydata = ydata || [];

            scaleYdata(ydata, xdata.length, scale);
            console.log(ydata);

            var option = {
                tooltip: {
                    show: tooltip,
                },
                series: [{
                    name: options.title || '',
                    type: 'wordCloud',
                    size: size,
                    textRotation : rotation,
                    textPadding: 0,
                    autoSize: {
                        enable: true,
                        minSize: minSize,
                    },
                    data: []
                }]
            };

            for(var i = 0; i < xdata.length; i++) {
                var data_option = {
                    name: xdata[i],
                    value: ydata[i],
                    itemStyle: createRandomItemStyle()
                };
                option.series[0].data.push(data_option);
            }
            return $.set_common_option(option, options);
        };
    };
})(simple_echarts);
