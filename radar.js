var simple_echarts = window.simple_echarts || {};

simple_echarts.radar = new function() {
    this.radarOption = function(data, legends, indicator, title, subtitle) {
        title = title == null ? '' : title;
        subtitle = subtitle == null ? '' : subtitle;
        var option = {
            title : {
                text: title,
                subtext: subtitle,
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                orient : 'vertical',
                x : 'right',
                y : 'bottom',
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
                    indicator : indicator,
                }
            ],
            calculable : true,
            series : [
                {
                    name: title,
                    type: 'radar',
                    data : [],
                }
            ]
        };
        for(var i = 0; i < data.length; i++) {
            option.series[0].data.push({value: data[i], name: legends[i]});
        }
        return option;
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
        var xcenters = []
        for(var i = 0; i < count; i++) {
            xcenters.push((i + 1) / (count + 1) * 100 + '%');
        }
        return xcenters;
    }

    function get_centers(xcenters, ycenter) {
        var centers = [];
        for(var i = 0; i < xcenters.length; i++) {
            centers.push([xcenters[i], ycenter]);
        }
        return centers;
    }

    // 功能: 绘制多雷达图
    // 用法:
    // data: [[1, 2, 3], [[1, 2, 3], [2, 3, 4]] ...]最多三维数组, 每个元素代表一张雷达图, 每张雷达图可以绘制多个曲线
    // labels: ['颜色', ['线上', '线下']]数组结构与data一致, 表示每个数据曲线的标签
    // indicator: [['红', '黄', '蓝'], ['喜欢', '不喜欢', '中性']...]每张雷达图对应一个indicator, 只是每个方向的标签
    // max_scales: [['5', '5', '5'], ['3', '3', '3']]每张雷达图每个方向需设置一个最大范围
    // centers: [['50%', '50%'], ['50%', '50']]每张雷达图中心点位置坐标x, y
    // radius: '50%'或200 雷达图半径
    this.multiRadarOption = function(data, labels, indicators, max_scales, xcenters, ycenter, radius, title) {
        xcenters = xcenters == null ? default_xcenters(data.length) : xcenters;
        ycenter = ycenter == null ? '50%' : ycenter;
        var centers =  get_centers(xcenters, ycenter);
        radius = radius == null ? '60%' : radius;
        title = title == null ? '' : title;
        legends = get_legends(labels);
        var option = {
            title : {
                text: title,
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                x : 'center',
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
                    serial_option.data.push({'value': data[i][j], 'name': labels[i][j]});
                }
            } else {
                serial_option.data.push({'value': data[i], 'name': labels[i]});
            }
            option.series.push(serial_option);
        }
        console.log(option);
        return option;
    };
};
