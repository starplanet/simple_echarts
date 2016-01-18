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
