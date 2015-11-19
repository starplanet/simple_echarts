# simple_echarts
本库开发的目的是简化使用echarts绘制图表的过程, 将用户从echarts的option配置中解放出来, 使用户只用关心自己的数据, 其它
就交给simple_echarts来完成.

它本质上是默认化配置常用图表的option配置, 使用户不用去关心它, 如果用户对默认设置不满意, 则可以使用函数接口的options进行
少量自定义.

## 使用方法

###  文件引入

首先在引入echarts后, 将simple_echarts.min.js引入到<head>标签中:

```html
<script src='echarts-all.js'></script>
<script src='simple_echarts.min.js'></script>
```

### 绘制饼图

`simple_echarts.pie.pieOption(data, legends, options)`

<iframe src='example/pie.html></iframe>






