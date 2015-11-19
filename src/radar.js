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

