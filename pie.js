var simple_echarts = window.simple_echarts || {};

simple_echarts.pie = new function() {
    function pie_data(data, legends) {
        pdata = [];
        for(i = 0; i < data.length; i++) {
            pdata.push({'name': legends[i], 'value': data[i]});
        }
        return pdata;
    }

    // 用法: data为值数组, legends为对应的标签数组
    this.pieOption = function(data, legends, title, subtitle) {
        option = {
            title : {
                text: title,
                subtext: subtitle,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
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
                    name:title,
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: pie_data(data, legends)
                }
            ]
        };
        return option;
    };

    function default_xcenters(count) {
        var interval = 100 / (count + 1);
        var xcenters = [];
        for(var i = 0; i < count; i++) {
            xcenters.push((i + 1) * interval + '%');
        }
        return xcenters;
    }

    function default_ycenters(count) {
        var ycenters = [];
        for(var i = 0; i< count; i++) {
            ycenters.push('50%');
        }
        return ycenters;
    }

    // 用法:
    // 功能: 绘制环形图, 可绘制多张环形图
    // @param data: [[1, 2, 3], [4, 5, 6]]每张图对应一个元素, 每个元素可包含多个值;
    // @param legends: 图例数组;
    // @param labels: 数组形式与data一致, 表示每个值对应的标签;
    // @param options: 字典类型, 额外选项, 可选项包括:
    // {title: 标题, subtitle: 副标题, xcenters: 图中心x轴坐标数组, ycenters: 图中心y轴坐标数组, radius: 半径数组}
    this.ringOption = function(data, legends, labels, options) {
        options = options == null ? {} : options;
        if(options.radius == null) {
            options.radius = ['40%', '55%'];
        }

        if(options.xcenters == null) {
            options.xcenters = default_xcenters(data.length);
        }

        if(options.ycenters == null) {
            options.ycenters = default_ycenters(data.length);
        }

        option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
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

        if(options.title) {
            option.title = {
                text: options.title,
                subtext: options.subtitle == null ? '' : options.subtitle,
                x: 'center'
            }
        }
        for(var i = 0; i < data.length; i++) {
            var serial_option = {
                type: 'pie',
                radius: options.radius,
                center: [options.xcenters[i], options.ycenters[i]],
                data: pie_data(data[i], labels[i])
            }
            option.series.push(serial_option);
        }
        console.log(option);
        return option;
    };

    this.vennOption = function(data, labels, options) {
        options = options == null ? {} : options;
        option = {
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
        if(options.title) {
            option.title = {
                text: options.title,
                subtext: options.subtitle == null ? '' : options.subtitle,
            }
        }
        return option;
    };
};
