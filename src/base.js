/**
 * Created by zhangjinjie on 15-11-16.
 */

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

