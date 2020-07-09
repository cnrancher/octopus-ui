import echarts from 'echarts';
import { formatFontSize } from '@/utils/units';

export function rightGaugeConfigGenerator(opts) {
  return {
    title: {
      text:      `{num|${ opts.displayNum }}{unit|个}`,
      subtext:   '设备总数',
      x:         'center',
      y:         'center',
      textStyle: {
        fontWeight: 'normal',
        color:      opts.color[1],
        fontSize:   '36',
        fontFamily: 'prompt-light',
        lineHeight:  30,
        rich:       {
          num: {
            fontSize: 36,
            color:    opts.defaultTextColor,
          },
          unit: {
            align:         'right',
            color:         opts.defaultTextColor,
            verticalAlign: 'bottom',
          },
        },
      },
      subtextStyle: {
        fontSize: 16,
        color:    '#454545',
      }
    },
    legend: {
      orient:  'vertical',
      top:     'center',
      itemGap: 20,
      right:   0,
    },
    series: [
      {
        type:      'pie',
        clockWise: true,
        radius:    ['80%', '96%'],
        itemStyle: {
          normal: {
            color:       opts.color[0],
            shadowColor: opts.color[0],
            shadowBlur:  0,
            label:       { show: false },
            labelLine:   { show: false }
          }
        },
        hoverAnimation: false,
        data:           [
          {
            name:      '离线数量',
            value:     opts.offline,
            itemStyle: {
              normal:   { color: opts.color[1] },
              emphasis: { color: opts.color[1] }
            }
          },
          {
            value:     opts.online,
            name:      '在线数量',
          },
        ]
      }
    ]
  };
}

export function baseGaugeConfigGenerator(rate) {
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
            color: [[
              rate, new echarts.graphic.LinearGradient(0, rate > 0.5 ? 0 : 1, rate > 0.5 ? 1 : 0, 0, [
                {
                  offset: 0.1,
                  color:  '#33ccff'
                },
                {
                  offset: 0.6,
                  color:  '#0066ff'
                },
                {
                  offset: 1,
                  color:  '#423fa9'
                }
              ])
            ],
            [
              1, 'rgba(65,62,84,0)'
            ]]
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
        data:   [],
        detail:  {
          show:         true,
          offsetCenter: [0, '-4%'],
          color:        '#423fa9',
          formatter(params) {
            return `{percent|${ params.percent }%}\n{type|${ params.type }}\n{describe|已使用${ params.total }${ params.unit }中的${ params.usage }${ params.unit }}`;
          },
          textStyle: { fontSize: formatFontSize(44) },
          rich:      {
            percent: {
              fontSize:   formatFontSize(42),
              color:      '#423fa9',
              fontFamily: 'prompt-light',
              height:     60
            },
            type: {
              fontSize: formatFontSize(18),
              color:    '#000',
              height:   30
            },
            describe: {
              color:    '#178fff',
              fontSize: formatFontSize(15),
              height:   20
            }
          }
        },
      }
    ]
  };
}
