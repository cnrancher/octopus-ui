<script>
import echarts from 'echarts';
import VStack from '@/components/Layout/Stack/VStack';

/**
 * A detailed view of how much a resource is being consumed.
 */
export default {
  components: { VStack },
  props:      {
    /**
     * The name of the resource to be displayed.
     */
    resourceName: {
      type:     String,
      required: true
    },
    /**
     * The total amount of the resource (both used and unused amount).
     */
    capacity: {
      type:     Number,
      required: true
    },
    /**
     * The amount of the resource that is currently in use.
     */
    used: {
      type:     Number,
      required: true
    },
    /**
     * The units that should be displayed when referencing amounts of the resource.
     */
    units:           {
      type:     String,
      default:  ''
    },
    /**
     * A method which can be used to format the *capacity* and *used* numbers for display.
     */
    numberFormatter: {
      type:    Function,
      default: value => Number.isInteger(value) ? value : value.toFixed(2)
    }
  },
  data() {
    return {
      chartObj: null,
      hasDraw:  false
    };
  },
  computed: {
    displayUnits() {
      return this.units
        ? ` ${ this.units }`
        : '';
    },
    percentageBarValue() {
      if (!this.used || !this.capacity) {
        return 0;
      }

      return (this.used * 100) / this.capacity;
    },
    amountTemplateValues() {
      return {
        used:  this.numberFormatter(this.used || 0),
        total: this.numberFormatter(this.capacity || 0),
        unit:  this.displayUnits
      };
    }
  },
  watch: {
    used() {
      this.draw();
    },
    capacity() {
      this.draw();
    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    formatFontSize(val, initWidth = 1920) {
      const nowClientWidth = document.documentElement.clientWidth;

      return val * (nowClientWidth / initWidth);
    },
    draw() {
      if (this.hasDraw && this.chartObj) {
        this.chartObj.resize();
      }
      const rate = this.percentageBarValue / 100;
      const params = this.amountTemplateValues;
      const outer = this;

      const baseOptions = {
        series: [
          {
            name:        'gauge_sub',
            type:        'gauge',
            radius:      '91.5%',
            center:      ['50%', '58%'],
            splitNumber: 0, // 刻度数量
            startAngle:  225,
            endAngle:    -45,
            axisLine:    {
              show:      true,
              lineStyle: {
                width: 8,
                color: [[1, '#e4e9f9']]
              }
            },
            splitLine: { show: false },
            axisLabel: { show: false },
            axisTick:  { show: false },
            pointer:   { show: false },
            title:     { show: false },
            detail:    { show: false },
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
                width: 8,
                color: [
                  [
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
                  ]
                ]
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
            detail: {
              show:         true,
              offsetCenter: [0, '-5%'],
              color:        '#423fa9',
              formatter(param) {
                // return `{percent|${ params[0] }%}\n{type|${ params[1] }}\n{describe|${ params[2] }}`;
                return `{percent|${ outer.percentageBarValue.toFixed(1) }%}\n{type|${ outer.resourceName }}\n{describe|${ outer.t('node.detail.glance.consumptionGauge.amount', params) }}`;
              },
              textStyle: { fontSize: this.formatFontSize(16) },
              rich:      {
                percent: {
                  fontSize:   this.formatFontSize(40),
                  color:      '#423fa9',
                  fontWeight: 'bold',
                  // fontFamily: 'hyzhuzi',
                  height:     40
                },
                type: {
                  fontSize: this.formatFontSize(18),
                  color:    '#000',
                  height:   24
                },
                describe: {
                  color:    '#35bfe3',
                  fontSize: this.formatFontSize(15),
                  height:   18
                }
              }
            }
          }
        ]
      };

      const ecDraw = echarts.init(this.$refs['gauge']);

      ecDraw.setOption(baseOptions);
      // this.gaugeList.push(ecDraw);
      this.hasDraw = true;
      this.chartObj = ecDraw;
      setTimeout(() => {
        ecDraw.resize();
      }, 500);
    }
  }
};
</script>

<template>
  <VStack class="consumption-gauge" :show-dividers="true">
    <div ref="gauge" class="percentage-bar-container"></div>
  </VStack>
</template>

<style lang="scss">
.consumption-gauge {
  $divider-spacing: 20px;
  min-height: 300px;
  width: 100%;
  padding-right: $divider-spacing;

  &:last-child {
    padding-right: 0;
  }

  & > :last-child {
    padding-top: $divider-spacing;
    height: 25%;
  }

  .consumption {
    margin-bottom: 50px;
  }

  .amount {
      color: var(--link-text);
  }

  .percentage-bar-container {
    padding-bottom: 8px;
    height: 90%;
    text-align: center;

    .percentage-bar {
      display: inline-grid;
      grid-template-rows: [one] auto [two] auto;

      .bar {
        grid-row: one;
        .tick {
          margin-right: 5px;
          width: 4px;
          font-size: 1.7em;
        }
      }

      .percentage {
        margin-top: 20px;
        width: 100%;
        grid-row: two;
        font-size: 45px;
        font-weight: 100;
        text-align: center;
      }
    }
  }

}
</style>
