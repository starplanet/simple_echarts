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
