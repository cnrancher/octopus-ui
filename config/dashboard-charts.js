
export function rightGaugeConfigGenerator(opts) {
  return {
    title: {
      text:      opts.title,
      x:         'center',
      y:         'center',
      textStyle: {
        fontWeight: 'normal',
        color:      opts.color[1],
        fontSize:   '30',
        fontFamily: 'hyzhuzi'
      }
    },
    color:  [opts.color[0]],
    series: [
      {
        name:      'Line 1',
        type:      'pie',
        clockWise: true,
        radius:    ['80%', '96%'],
        itemStyle: {
          normal: {
            label:     { show: false },
            labelLine: { show: false }
          }
        },
        hoverAnimation: false,
        data:           [
          {
            value:     opts.values[0],
            name:      '01',
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color:  opts.color[1] // 0% 处的颜色
                  }, {
                    offset: 1,
                    color:  opts.color[1] // 100% 处的颜色
                  }]
                },
                label:     { show: false },
                labelLine: { show: false }
              }
            }
          },
          {
            name:  '02',
            value: opts.values[1]
          }
        ]
      }
    ]
  };
}

export function baseGaugeConfigGenerator() {
  return {
    series: [
      {
        name:        '刻度',
        type:        'gauge',
        radius:      '84%',
        center:      ['50%', '58%'],
        splitNumber: 6, // 刻度数量
        startAngle:  225,
        endAngle:    -45,
        axisLine:    {
          show:      true,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(0,0,0,0)']]
          }
        }, // 仪表盘轴线
        axisLabel: {
          show:     false,
          color:    '#423fa9',
          distance: 60
        }, // 刻度标签。
        axisTick: {
          show:        true,
          splitNumber: 10,
          lineStyle:   {
            color: '#423fa9',
            width: 1
          },
          length: -14
        }, // 刻度样式
        splitLine: {
          show:      true,
          length:    -22,
          lineStyle: { color: '#423fa9' }
        }, // 分隔线样式
        detail:  { show: false },
        pointer: { show: false }
      },
      {
        type:        'gauge',
        radius:      '91.5%',
        center:      ['50%', '58%'],
        splitNumber: 0, // 刻度数量
        startAngle:  225,
        endAngle:    -45,
        axisLine:    {
          show:      true,
          lineStyle: {
            width: 10,
            color: []
          }
        },
        // 分隔线样式。
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick:  { show: false },
        pointer:   { show: false },
        title:     {
          show:         true,
          offsetCenter: [0, '20%'], // x, y，单位px
          textStyle:    {
            color:    '#fff',
            fontSize: 20
          }
        },
        data: []
      }
    ]
  };
}
