/**
 * Created by zhangjinjie on 15-11-16.
 */

var simple_echarts = window.simple_echarts || {};

simple_echarts.get_label = function(unit) {
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

simple_echarts.null_default = function(v, d) {
    return v == null ? d : v;
};

