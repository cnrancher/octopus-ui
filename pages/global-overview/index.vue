<script>
/* eslint-disable */
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { Table } from 'element-ui';
import echarts from 'echarts';
import '@/assets/fonts/hyzhuzi/style.scss';
import DashboardProgressBar from '@/components/DashboardProgressBar';

const hexbinData = {
  hexbindemo1: [
    { num: 20, data: 'IP-1-2-1-1-1:20%' },
    { num: 30, data: 'IP-1-3-1-1-1:30%' },
    { num: 40, data: 'IP-1-4-1-1-1:40%' },
    { num: 50, data: 'IP-5-1-1-1-1:50%' },
    { num: 60, data: 'IP-1-6-1-1-1:60%' },
    { num: 66, data: 'IP-1-6-1-1-1:60%' },
    { num: 70, data: 'IP-1-7-1-1-1:70%' },
    { num: 80, data: 'IP-1-8-1-1-1:80%' },
    { num: 90, data: 'IP-9-1-1-1-1:90%' },
    { num: 10, data: 'IP-1-1-1-1-1:10%' },
    { num: 99, data: 'IP-1-1-0-1-1:98%' }
  ],
  hexbindemo2: [
    { num: 10, data: 'IP-1-1-1-1-1:10%' },
    { num: 70, data: 'IP-1-7-1-1-1:70%' },
    { num: 80, data: 'IP-1-8-1-1-1:80%' },
    { num: 30, data: 'IP-1-3-1-1-1:30%' },
    { num: 40, data: 'IP-1-4-1-1-1:40%' },
    { num: 50, data: 'IP-5-1-1-1-1:50%' },
    { num: 60, data: 'IP-1-6-1-1-1:60%' },
    { num: 66, data: 'IP-1-6-1-1-1:60%' },
    { num: 20, data: 'IP-1-2-1-1-1:20%' },
    { num: 90, data: 'IP-9-1-1-1-1:90%' },
    { num: 99, data: 'IP-1-1-0-1-1:98%' }
  ],
  hexbindemo3: [
    { num: 10, data: 'IP-1-1-1-1-1:10%' },
    { num: 20, data: 'IP-1-2-1-1-1:20%' },
    { num: 30, data: 'IP-1-3-1-1-1:30%' },
    { num: 40, data: 'IP-1-4-1-1-1:40%' },
    { num: 50, data: 'IP-5-1-1-1-1:50%' },
    { num: 70, data: 'IP-1-7-1-1-1:70%' },
    { num: 80, data: 'IP-1-8-1-1-1:80%' },
    { num: 60, data: 'IP-1-6-1-1-1:60%' },
    { num: 66, data: 'IP-1-6-1-1-1:60%' },
    { num: 90, data: 'IP-9-1-1-1-1:90%' },
    { num: 99, data: 'IP-1-1-0-1-1:98%' }
  ]
}

const pieData = {
  ec1: '91|CPU|已使用2中的0.2',
  ec2: '65|Memory|已使用7.7GIB中的0.1',
  ec3: '21|Pods|已使用110中的12',
}

const rightGaugeData = {
  rightGauge1: {
    title: '90个',
    color: ['#d4fba4', '#8dc449'],
    values: [80, 20]
  },
  rightGauge2: {
    title: '10个',
    color: ['#f4cccd', '#ee5558'],
    values: [20, 80]
  }
}

function hexbinColorGenerator(count = 0) {
  if (count <= 25) return '#f0f3fb';
  else if (count > 25 && count <= 50) return '#b0bee7';
  else if (count > 50 && count <= 75) return '#4674d3';
  else if (count > 75) return '#39277f';
}

export default {
  components: { 'el-table': Table, 'DashboardProgressBar': DashboardProgressBar },
  data() {
    return {
      screenWidth: document.documentElement.clientWidth,
      gaugeList: [],
      rightGaugeList: [],
      tableData: [
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 2, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 3, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 4, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 5, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 6, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 7, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 8, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 9, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 10, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 11, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 12, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
      ],
      progressList: [
        {
          index: 1, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '91', percent: 91
        },
        {
          index: 2, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '87', percent: 87
        },
        {
          index: 3, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '82', percent: 82
        },
        {
          index: 4, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '75', percent: 75
        },
        {
          index: 5, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '61', percent: 61
        },
        {
          index: 6, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '56', percent: 56
        },
        {
          index: 7, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '48', percent: 48
        },
        {
          index: 8, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '41', percent: 41
        },
        {
          index: 9, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '39', percent: 39
        },
        {
          index: 10, name: 'kube-system/fluenttd-cloud-logging-kubernetes-minion-group', value: '37', percent: 37
        }
      ]
    };

    return {};
  },
  mounted() {
    this.drawHexbin();
    this.drawGauge();
    this.drawRightGauge();
    window.onresize = () => {
      this.screenWidth = document.documentElement.clientWidth;
    }
  },
  methods: {
    formatFontSize(val,initWidth=1920) {
      const nowClientWidth = document.documentElement.clientWidth;
      return val * (nowClientWidth/initWidth)
    },
    drawGauge() {
      const chartContainerNames = ['ec1', 'ec2', 'ec3'];
      chartContainerNames.forEach((ecItem, ecIndex) => {
        const baseOptions = {
        // backgroundColor: '#043654',
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
                  color: [
                    [
                      0.5, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                          offset: 0,
                          color:  '#3861c6'
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
              // 仪表盘详情，用于显示数据。
              detail: {
                show:         true,
                offsetCenter: [0, '-4%'],
                color:        '#423fa9',
                formatter(param) {
                  const params = pieData[ecItem].split('|');
                  return `{percent|${ params[0] }%}\n{type|${params[1]}}\n{describe|${params[2]}}`;
                },
                textStyle: { fontSize: this.formatFontSize(44) },
                rich:      {
                  percent: {
                    fontSize:   this.formatFontSize(40),
                    color:      '#423fa9',
                    fontWeight: 'bold',
                    fontFamily: 'hyzhuzi',
                    height: 60
                  },
                  type: {
                    fontSize: this.formatFontSize(18),
                    color:    '#000',
                    height: 30
                  },
                  describe: {
                    color:    '#375ec4',
                    fontSize: this.formatFontSize(15),
                    height:   20
                  }
                }
              },
              data: []
            }
          ]
        };
        const ecDraw = echarts.init(this.$refs[ecItem]);

        ecDraw.setOption(baseOptions);
        this.gaugeList.push(ecDraw);
        setTimeout(() => {
          ecDraw.resize();
        }, 500);
      });
    },
    drawHexbin() {
      const hexbinContainerNames = ['hexbindemo1', 'hexbindemo2', 'hexbindemo3'];
      const tooltipRef = this.$refs['tooltip'];

      hexbinContainerNames.forEach((demoItem, demoIndex) => {
        const i = 0;
        let j;
        const list = hexbinData[demoItem];
        const d3Node = d3.select(this.$refs[demoItem]);
        const color = d3.scaleSequential(d3.interpolateLab('#8276b8', '#4646b0')).domain([0, 20]);
        // const points = [[20,20], [20,60], [20,100], [40,40], [60,60], [80,100], [40,80], [80,40], [120,40], [120,60], [120,80], [140,40]];
        // const points = [[20,60], [20,100], [60,60], [80,100], [40,80], [120,60], [120,80]];
        const points = [
          [25,50], [70,50], [115,50], [160,50], [205,50], [250,50],
          [48,89], [93,89], [138,89], [183,89], [228,89]
        ];
        const mHexbin = hexbin().size([400, 100]);
        const hexagon = d3Node.selectAll('path')
          .data(mHexbin(points))
          .enter().append('path')
          .attr('d', mHexbin.hexagon(25))
          .attr('transform', d => `translate(${ d.x },${ d.y })`)
          .attr('fill', (d, i) => {
            return hexbinColorGenerator(list[i].num);
          })
          .on('mouseover', (pointsInfo, pointsIndex, pathArray) => {
            // console.log(d3Node.selectAll('path'), d3Node);
            const pathDom = pathArray[pointsIndex];
            const pathDomPosition = pathDom.getBoundingClientRect();
            tooltipRef.style.display = 'block';
            tooltipRef.style.top = pathDomPosition.top -30 + 'px';
            tooltipRef.style.left = pathDomPosition.left - 60 + 'px';
            tooltipRef.innerHTML = list[pointsIndex].data;
            
          })
          .on('mouseout', () => {
            tooltipRef.style.display = 'none';
          });
      });

    },
    drawRightGauge() {
      const rightGaugeNames = ['rightGauge1', 'rightGauge2'];
      rightGaugeNames.forEach((ecItem, ecIndex) => {
        const ecDraw = echarts.init(this.$refs[ecItem]);
        const customOpt = rightGaugeData[ecItem]
        const option = {
          title: {
            text: customOpt.title,
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              color: customOpt.color[1],
              fontSize: '30',
              fontFamily: 'hyzhuzi'
            }
          },
          color: [customOpt.color[0]],
          series: [
            {
              name: 'Line 1',
              type: 'pie',
              clockWise: true,
              radius: ['80%', '96%'],
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              hoverAnimation: false, 
              data: [
                {
                  value: customOpt.values[0],
                  name: '01',
                  itemStyle: {
                    normal: {
                      color: { // 完成的圆环的颜色
                        colorStops: [{
                          offset: 0,
                          color: customOpt.color[1] // 0% 处的颜色
                        }, {
                          offset: 1,
                          color: customOpt.color[1] // 100% 处的颜色
                        }]
                      },
                      label: {
                        show: false
                      },
                      labelLine: {
                        show: false
                      }
                    } 
                  }
                }, 
                {
                  name: '02',
                  value: customOpt.values[1]
                }
              ]
            }
          ]
        };
        ecDraw.setOption(option);
        this.rightGaugeList.push(ecDraw);
        setTimeout(() => {
          ecDraw.resize();
        }, 500);
      });
    }
  },
  watch: {
    screenWidth: function(val) {
      this.gaugeList.forEach(chartsItem => {
        chartsItem.resize();
      });
      this.rightGaugeList.forEach(chartsItem => {
        chartsItem.resize();
      })
    }
  }
};
</script>
<template>
  <div class="wrapper">
    <el-row type="flex">
      <el-col :span="24">
        <h3 class="header-border"><i class="position"></i><span>智慧园区-北京朝阳</span><span>（最后一次备份于2020-03-01 22:22:22）</span></h3>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
      <el-col :span="15" class="content">
        <div class="usage">
          <h3 class="module-title">
            <i class="icon dashboard-source"></i>
            资源使用
          </h3>
          <div class="usage-list">
            <div class="item">
              <h4>每个节点CPU使用率</h4>
              <div class="hexbin-container">
                <svg ref="hexbindemo1"></svg>
              </div>
              <h4>集群整体CPU使用率</h4>
              <div class="pie-container">
                <div ref="ec1"></div>
              </div>
            </div>
            <div class="item">
              <h4>每个节点内存使用率</h4>
              <div class="hexbin-container">
                <svg ref="hexbindemo2"></svg>
              </div>
              <h4>集群整体内存使用率</h4>
              <div class="pie-container">
                <div ref="ec2"></div>
              </div>
            </div>
            <div class="item">
              <h4>每个节点Pod使用率</h4>
              <div class="hexbin-container">
                <svg ref="hexbindemo3"></svg>
              </div>
              <h4>集群整体Pod数量</h4>
              <div class="pie-container">
                <div ref="ec3"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="service">
          <h3 class="module-title">
            <i class="icon dashboard-system"></i>
            系统服务
          </h3>
          <ul>
            <li class="dashboard-icon-tick">
              <i></i>
              <span>Datastore</span>
            </li>
            <li class="dashboard-icon-error">
              <i></i>
              <span>System Controllers</span>
            </li>
            <li class="dashboard-icon-tick">
              <i></i>
              <span>Networking</span>
            </li>
            <li class="dashboard-icon-question">
              <i></i>
              <span>Nodes</span>
            </li>
          </ul>
        </div>
        <div class="event">
          <h3 class="module-title">
            <i class="icon dashboard-set"></i>
            集群事件
          </h3>
          <el-table
            :data="tableData"
            cell-class-name="events-table-td"
            class="events-table"
            height="21vw"
          >
            <el-table-column
              label="名称"
              prop="name"
            />
            <el-table-column
              label="名称"
              prop="name1"
            />
            <el-table-column
              label="名称"
              prop="name2"
            />
            <el-table-column
              label="名称"
              prop="name3"
            />
            <el-table-column
              label="名称"
              prop="name4"
            />
            <el-table-column
              label="名称"
              prop="name5"
            />
          </el-table>
        </div>
      </el-col>
      <el-col class="side" :span="9">
        <div class="iot">
          <h3 class="module-title">
            <i class="icon dashboard-iot"></i>
            IoT设备
          </h3>
          <div class="pie">
            <div class="item">
              <div class="item-content" ref="rightGauge1"></div>
              <p>在线数量</p>
            </div>
            <div class="item">
              <div class="item-content" ref="rightGauge2"></div>
              <p>离线数量</p>
            </div>
          </div>
          <div class="count">
            <div>
              <span>设备总数：</span>
              <span>100</span>
            </div>
            <div>
              <span>在线数量：</span>
              <span>90</span>
            </div>
            <div>
              <span>离线数量：</span>
              <span>10</span>
            </div>
          </div>
        </div>
        <div class="balance">
          <h3 class="module-title">
            <i class="icon dashboard-balance"></i>
            工作负载
          </h3>
          <DashboardProgressBar 
            title="CPU密集型Pod TOP10"
            unit="单位：分钟"
            :list="progressList"
          />
          <DashboardProgressBar 
            title="内存密集型Pod TOP10"
            unit="单位：MiB"
            :list="progressList"
          />
        </div>
      </el-col>
    </el-row>
    <div ref="tooltip" class="dashboard-tooltip"></div>
  </div>
</template>

<style lang="scss">
  @import "~assets/fonts/fzpszhjw/style.scss";
  .wrapper {
    clear: both;
    background-color: #f6f7fb;
    
    .icon {
      display: inline-block;
      height: 25px;
      width: 25px;
      vertical-align: top;
    }
    .header-border {
      min-height: 40px;
      margin: -20px -20px 1vh -20px;
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      padding-left: 2vw;
      line-height: 1.5;
      span {
        font-size: 0.8vw;
        font-weight: bold;
      }
      span:last-child {
        font-size: 0.7vw;
        font-weight: normal;
      }
      .position {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('~assets/images/dashboard-position.png') no-repeat center;
        vertical-align: middle;
      }
    }
    .usage, .service, .event, .balance, .iot {
      padding: 0.83vw;
      border: 1px solid #ddd;
      margin-bottom: 20px;
      border-radius: 5px;
      box-shadow: 1px 1px 4px 1px #ddd;
      background-color: #fff;
    }
    .module-title {
      font-size: 1.25vw;
      margin-bottom: 4px;
      font-family: fzpszhjw;
    }
    
    .content {
      min-height: 800px;
      width: 100%;
      padding-left: 1.2vh;
      display: grid;
      grid-template-rows: repeat(3, auto);
      .dashboard-set {
        background: url('~assets/images/dashboard-set.png') no-repeat center;
      }
      .dashboard-source {
        background: url('~assets/images/dashboard-source.png') no-repeat center;
      }
      .dashboard-system {
        background: url('~assets/images/dashboard-system.png') no-repeat center;
      }
      .pie-container div {
        width: 100%;
        height: 25vh;
        margin: 0 auto;
      }
      .service {
        ul {
          display: grid;
          grid-template-columns: repeat(4, 20%);
          grid-column-gap: 6%;
          margin: 1.45vw 0 1.25vw;
          li {
            list-style: none;
            min-height: 40px;
            background-color: #ddd;
            line-height: 1;
            color: #454545;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            i {
              width: 2vw;
              height: 2vw;
              line-height: 2.6;
              color: #fff;
              display: inline-block;
              vertical-align: middle;
              text-align: center;
              font-style: normal;
              border-top-left-radius: 10px;
              border-bottom-left-radius: 10px;
            }
            span {
              line-height: 1;
              padding-left: 10px;
              font-size: 0.9vw;
              font-weight: bold;
              display: inline-block;
              vertical-align: middle;
            }
          }
          li:last-child {
            margin-right: 0;
          }
          .dashboard-icon-tick {
            border: 1px solid #8dc449;
            i {
              background: url('~assets/images/dashboard-tick.png') no-repeat center #8dc449;
            }
          }
          .dashboard-icon-question {
            border: 1px solid #fac40f;
            i {
              background: url('~assets/images/dashboard-question.png') no-repeat center #fac40f;
            }
          }
          .dashboard-icon-error {
            border: 1px solid #ee5558;
            i {
              background: url('~assets/images/dashboard-fork.png') no-repeat center #ee5558;
            }
          }
        }
      }
      .usage-list {
        display: grid;
        grid-template-columns: repeat(3, 32.5%);
        grid-column-gap: 1.3%;
        .item {
          width: 100%;
          border: 1px solid #ddd;
          padding: 10px 20px 0;
          margin-right: 10px;
          h4 {
            font-size: 0.9vw;
            font-weight: bold;
          }
        }
      }
      .event {
        .events-table {
          width: 100%;
          border: 0;
          border-collapse: collapse;
          height: 26.5vw;
          margin-top: 16px;
          th, td {
            color: #fff;
            line-height: 2.08vw;
            padding: 0;
            font-size: 0.83vw;
            text-align: center;
          }
          thead {
            th {
              background-color: #404aaf;
              font-weight: normal;
            }
          }
          tbody {
            tr:nth-child(odd) {
              background-color: #fff;
            }
            tr:nth-child(even) {
              background-color: #ededed;
            }
            .events-table-td {
              color: #000;
              padding: 0.5vw 0;
            }
          }
        }
      }
    }
    .side {
      height: 100%;
      display: grid;
      grid-template-rows: repeat(3, auto);
      .dashboard-balance {
        background: url('~assets/images/dashboard-balance.png') no-repeat center;
      }
      .dashboard-iot {
        background: url('~assets/images/dashboard-iot.png') no-repeat center;
      }
      .pie {
        display: grid;
        padding-top: 10px;
        grid-template-columns: repeat(2, 50%);
          .item {
          text-align: center;
          .item-content {
            height: 18vh;
            padding-bottom: 10px;
          }
          p {
            font-size: 16px;
          }
        }
      }
      .count {
        display: flex;
        justify-content: space-around;
        padding: 1.1vw 0;

        div {
          display: flex;
          align-items: flex-end;
          box-sizing: border-box;
          border-right: 1px solid #ddd;
          padding-right: 0.4vw;
          span:first-child {
            line-height: 1.5;
            font-size: 0.8vw;
          }
          span:last-child {
            font-size: 1.3vw;
          }
        }
        div:last-child {
          list-style: none;
          border-right: none;
          padding-right: 0;
        }
      }

      .balance {
        border: 1px solid #ddd;
        padding: 0.83vw 0.5vw;
      }
    }
    .dashboard-tooltip {
      font-size: 16px;
      width: auto;
      height: 26px;
      padding: 4px 16px;
      line-height: 1;
      position: absolute; 
      text-align: center;
      background-color: #a9aab4;
      opacity: .8;
      color: #fff;
      display: none;
      z-index: 1000;
    }
  }
  
</style>
