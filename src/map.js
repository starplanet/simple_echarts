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
