var simple_echarts = window.simple_echarts || {};

simple_echarts.map = new function() {
    function get_max_value(cities) {
        max_val = 0;
        for(var i = 0; i < cities.length; i++) {
            if(cities[i].value > max_val) {
                max_val = cities[i].value;
            }
        }
        return max_val;
    }

    this.basic_map_option = function(pros, cities, top5, geos, range, title, name) {
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
    }

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

    // 用法: dates有值时, pros, cities, top5的值为形如[[ { name: '廊坊', value:193 } ], ..]的数组;
    // dates无值时, pros, cities, top5直接为形如[ { name: '廊坊', value: 193 } ]的数组
    // geos: 为城市坐标, 所有数据共享这个坐标数据
    // 返回: 返回用于创建地图的option
    this.mapOption = function(pros, cities, top5, geos, range, title, dates) {
        if(!dates) {
            return this.basic_map_option(pros, cities, top5, geos, ranges, title, title);
        } else {
            option = new timeline_option();
            for(var i = 0; i < dates.length; i++) {
                basic_option = this.basic_map_option(pros[i], cities[i], top5[i], geos, range, title, dates[i]);
                option.append(dates[i], basic_option);
            }
            return option.option;
        }
    }
};

