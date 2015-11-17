var simple_echarts = window.simple_echarts || {};

simple_echarts.map = new function() {
    function get_max_value(cities) {
        var max_val = 0;
        for(var i = 0; i < cities.length; i++) {
            if(cities[i].value > max_val) {
                max_val = cities[i].value;
            }
        }
        return max_val;
    }

    /**
     * 绘制地图, 以颜色深浅表示省份分布, 以mark point大小标记城市数值分布, 并重点突出top5
     * @param pros: 省份数据, 格式如: [{ name: '北京', value: 100 },...],
     * @param cities: 城市数据, 格式如: [{ name: '海门', value: 9 },...],
     * @param top5: 前5城市数据, 格式如: [{ name: '廊坊', value: 193},...],
     * @param geos: 地理数据, 格式如: { '海门': [121.15, 31.89], },
     * @param range: [10, 200]数值范围, 第一个为最小值, 第二个为最大值,
     * @param options: 可选项
     * {
     *      title: string|标题,
     *      name: string|数据名称,
     * }
     */
    this.basic_map_option = function(pros, cities, top5, geos, range, options) {
        options = options || {};
        var title = null_default(options.title, '');
        var name = null_default(options.name, '');
        var max_val = get_max_value(cities);
        var symbol_size = function(v) {
            v = v / max_val * 10 + 5;
            if(v > 10) {
                v = 10;
            }
            return v;
        };
        var option = {
            title: {
                text: title,
                // subtext: subtitle,
            },
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
                    name: name,
                    type: 'map',
                    mapType: 'china',
                    hoverable: true,
                    roam: 'move',
                    data: pros, // [ { name: '北京', value: 100 }, ],
                    itemStyle: {
                        normal: { label: { show: true }},
                        emphasis: { label: { show: true }}
                    },
                    markPoint: {
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
                        data: cities, // [ { name: '海门', value: 9 }, ]
                    },
                    geoCoord: geos // { '海门': [121.15, 31.89], }
                },
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
                        data: top5,  // [ { name: '廊坊', value: 193}, ]
                    }
                }
            ]
        };
        return option;
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
     * 绘制可带时间轴的地图
     * @param pros: 省份数据, 格式如: [{ name: '北京', value: 100 },...],
     * @param cities: 城市数据, 格式如: [{ name: '海门', value: 9 },...],
     * @param top5: 前5城市数据, 格式如: [{ name: '廊坊', value: 193},...],
     * @param geos: 地理数据, 格式如: { '海门': [121.15, 31.89], },
     * @param range: [10, 200]数值范围, 第一个为最小值, 第二个为最大值,
     * @param options: 可选项
     * {
     *      title: string|标题,
     *      dates: array|日期数组, 如果dates存在, 则pros, cities, top5变为多维数组, 每个元素对应一个日期的数据,
     * }
     */
    this.mapOption = function(pros, cities, top5, geos, range, options) {
        options = options || {};
        var dates = options.dates;
        var title = null_default(options.title, '');
        if(!dates) {
            return this.basic_map_option(pros, cities, top5, geos, range, title, title);
        } else {
            var option = new timeline_option();
            for(var i = 0; i < dates.length; i++) {
                var basic_option = this.basic_map_option(pros[i], cities[i], top5[i], geos, range, title, dates[i]);
                option.append(dates[i], basic_option);
            }
            return option.option;
        }
    };
};

