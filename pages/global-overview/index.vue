<script>
/* eslint-disable */
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { Table } from 'element-ui';
import echarts from 'echarts';
const height = 150;
const width = 300;

export default {
  components: { 'el-table': Table },
  data() {
    // console.log(binData(data));

    // return {
    //   width,
    //   height,
    //   binData: binData(data)
    // };

    return {};
  },
  computed: {
    tableData() {
      return [
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
        {
          id: 1, name: '名称', name1: '名称', name2: '名称', name3: '名称', name4: '名称', name5: '名称'
        },
      ];
    }
  },
  mounted() {
    this.drawHexbin();
    this.drawGauge();
  },
  methods: {
    drawGauge() {
      const chartContainerNames = ['ec1', 'ec2', 'ec3'];
      const baseOptions = {
        // backgroundColor: '#043654',
        series: [
          {
            name:        '刻度',
            type:        'gauge',
            radius:      '80%',
            center:      ['50%', '55%'],
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
              distance: 30
            }, // 刻度标签。
            axisTick: {
              show:        true,
              splitNumber: 10,
              lineStyle:   {
                color: '#423fa9',
                width: 2
              },
              length: -18
            }, // 刻度样式
            splitLine: {
              show:      true,
              length:    -30,
              lineStyle: { color: '#423fa9' }
            }, // 分隔线样式
            detail:  { show: false },
            pointer: { show: false }
          },
          {
            type:        'gauge',
            radius:      '90%',
            center:      ['50%', '55%'],
            splitNumber: 0, // 刻度数量
            startAngle:  225,
            endAngle:    -45,
            axisLine:    {
              show:      true,
              lineStyle: {
                width: 15,
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
              offsetCenter: [0, '26%'], // x, y，单位px
              textStyle:    {
                color:    '#fff',
                fontSize: 20
              }
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show:         true,
              offsetCenter: [0, 0],
              color:        '#423fa9',
              formatter(params) {
                return `{percent|${ params }}\n{type|cpu}\n{describe|已使用2中的0.2}`;
              },
              textStyle: { fontSize: 44 },
              rich:      {
                percent: {
                  fontSize:   40,
                  color:      '#423fa9',
                  fontWeight: 'bold'
                },
                type: {
                  fontSize: 18,
                  color:    '#000'
                },
                describe: {
                  color:    '#375ec4',
                  fontSize: 16,
                  height:   20
                }
              }
            },
            data: [
              { value: 50.26 }
            ]
          }
        ]
      };

      chartContainerNames.forEach((ecItem, ecIndex) => {
        const ecDraw = echarts.init(this.$refs[ecItem]);

        ecDraw.setOption(baseOptions);
      });
    },
    drawHexbin() {
      const hexbinContainerNames = ['hexbindemo1', 'hexbindemo2', 'hexbindemo3'];
      const n = 20;
      const k = 20;

      hexbinContainerNames.forEach((demoItem, demoIndex) => {
        const i = 0;
        let j;
        const d3Node = d3.select(this.$refs[demoItem]);
        const rx = d3.randomNormal(width / 2, 80);
        const ry = d3.randomNormal(height / 2, 80);

        // eslint-disable-next-line prefer-const
        let points = d3.range(n).map(() => ([rx(), ry()]));

        const color = d3.scaleSequential(d3.interpolateLab('#8276b8', '#4646b0')).domain([0, 20]);
        const nPoints = [[20,20], [20,60], [20,100], [40,40], [60,60], [80,100], [40,80], [80,40], [120,40], [120,60], [120,80], [140,40]];
        const mHexbin = hexbin().radius(20).extent([[0, 0], [width, height]]);
        console.log(points);
        const hexagon = d3Node.selectAll('path')
          .data(mHexbin(nPoints))
          .enter().append('path')
          .attr('d', mHexbin.hexagon(19.5))
          .attr('transform', d => `translate(${ d.x },${ d.y })`)
          .attr('fill', d => color(d.length));
      });

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
      <el-col :span="16" class="content">
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
              <h4>每个节点CPU使用率</h4>
              <div class="hexbin-container">
                <svg ref="hexbindemo2"></svg>
              </div>
              <h4>集群整体CPU使用率</h4>
              <div class="pie-container">
                <div ref="ec2"></div>
              </div>
            </div>
            <div class="item">
              <h4>每个节点CPU使用率</h4>
              <div class="hexbin-container">
                <svg ref="hexbindemo3"></svg>
              </div>
              <h4>集群整体CPU使用率</h4>
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
              <i>&radic;</i>
              <span>Datastore</span>
            </li>
            <li class="dashboard-icon-error">
              <i>X</i>
              <span>System Controllers</span>
            </li>
            <li class="dashboard-icon-tick">
              <i>&radic;</i>
              <span>Networking</span>
            </li>
            <li class="dashboard-icon-question">
              <i>?</i>
              <span>Nodes</span>
            </li>
          </ul>
        </div>
        <div class="event">
          <h3 class="module-title">
            <i class="icon dashboard-set"></i>
            集群事件
          </h3>
          <table>
            <thead>
              <th>名称</th>
              <th>名称</th>
              <th>名称</th>
              <th>名称</th>
              <th>名称</th>
              <th>名称</th>
              <th>名称</th>
              <th>名称</th>
            </thead>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <!-- <el-table
            :data="tableData"
            :header-row-class-name="event-table"
          >
            <el-table-column
              prop="id"
              label="ID"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="name1"
              label="姓名"
            />
            <el-table-column
              prop="name2"
              label="姓名"
            />
            <el-table-column
              prop="name3"
              label="姓名"
            />
            <el-table-column
              prop="name4"
              label="姓名"
            />
            <el-table-column
              prop="name5"
              label="姓名"
            />
          </el-table> -->
        </div>
      </el-col>
      <el-col class="side" :span="8">
        <div class="iot">
          <h3 class="module-title">
            <i class="icon dashboard-iot"></i>
            IoT设备
          </h3>
          <div class="pie">
            <div class="item">
              <div class="item-content">
                <el-progress :percentage="25" :width="180" type="circle"></el-progress>
              </div>
              <p>在线数量</p>
            </div>
            <div class="item">
              <div class="item-content">
                <el-progress :percentage="75" :width="180" type="circle"></el-progress>
              </div>
              <p>离线数量</p>
            </div>
          </div>
          <div class="count">
            <div>
              <span>设备总数：</span>
              <span>10</span>
            </div>
            <div>
              <span>在线数量：</span>
              <span>10</span>
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
          <div class="item">
            <p class="item-title">
              <span>CPU密集型Pod TOP10</span>
              <span>单位：分钟</span>
            </p>
            <ul class="bar-wrapper">
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 9.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  10
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 19%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  20
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 28.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  30
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 38%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  40
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 47.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  50
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 57%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  60
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 66.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  70
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 76%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  80
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 85.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  90
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 95%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  100
                </div>
              </li>
            </ul>
          </div>
          <div class="item">
            <p class="item-title">
              <span>CPU密集型Pod TOP10</span>
              <span>单位：分钟</span>
            </p>
            <ul class="bar-wrapper">
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 9.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  10
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 19%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  20
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 28.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  30
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 38%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  40
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 47.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  50
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 57%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  60
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 66.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  70
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 76%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  80
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 85.5%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  90
                </div>
              </li>
              <li>
                <div class="bar-container"></div>
                <div class="progress-bar" style="width: 95%"></div>
                <div class="progress-bar-text">
                  kube-system/fluenttd-cloud-logging-kubernetes-minion-group
                </div>
                <div class="bar-text">
                  100
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    
    
  </div>
</template>

<style lang="scss">
  .wrapper {
    clear: both;
    .icon {
      display: inline-block;
      height: 25px;
      width: 25px;
      vertical-align: text-top;
    }
    h3 {
      min-height: 40px;
      margin-bottom: 20px;
      span:first-child {
        font-size: 16px;
      }
      span:last-child {
        font-size: 14px;
      }
      .position {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('~assets/images/dashboard-position.png') no-repeat center;
      }
    }
    .usage, .service, .event, .balance, .iot {
      padding: 10px;
      border: 1px solid #eee;
      margin-bottom: 20px;
      border-radius: 5px;
    }
    .module-title {
      font-size: 24px;
      margin-bottom: 0;
    }
    
    .header-border {
      border-bottom: 1px solid #ddd;
    }
    .content {
      min-height: 800px;
      width: 100%;
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
        width: 80%;
        height: 20vh;
        margin: 0 auto;
      }
      .service {
        ul {
          display: grid;
          grid-template-columns: repeat(4, 20%);
          grid-column-gap: 6%;
          li {
            list-style: none;
            min-height: 40px;
            background-color: #ddd;
            line-height: 1;
            color: #454545;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            i {
              width: 40px;
              height: 40px;
              line-height: 2.6;
              color: #fff;
              display: inline-block;
              vertical-align: middle;
              text-align: center;
              background: url('~assets/images/dashboard-monitor.png') no-repeat center;
            }
            span {
              line-height: 1;
              padding-left: 10px;
              font-size: 16px;
              display: inline-block;
            }
          }
          li:last-child {
            margin-right: 0;
          }
          .dashboard-icon-tick {
            border: 1px solid #8dc449;
            i {
              background-color: #8dc449;
            }
          }
          .dashboard-icon-question {
            border: 1px solid #fac40f;
            i {
              background-color: #fac40f;
            }
          }
          .dashboard-icon-error {
            border: 1px solid #ee5558;
            i {
              background-color: #ee5558;
            }
          }
        }
      }
      .usage-list {
        display: grid;
        grid-template-columns: repeat(3, 32%);
        grid-column-gap: 1.3%;
        // margin-top: 10px;
        .item {
          width: 100%;
          border: 1px solid #eee;
          padding: 10px 20px 0;
          margin-right: 10px;
          h4 {
            font-size: 18px;
          }
        }
      }
      table {
        width: 100%;
        border: 0;
        border-collapse: collapse;
        margin-top: 16px;
        thead {
          background-color: #404aaf;
        }
        th, td {
          color: #fff;
          line-height: 40px;
          padding: 0;
        }
        tr:nth-child(odd) {
          background-color: #fff;
        }
        tr:nth-child(even) {
          background-color: #ededed;
        }
      }
    }
    .side {
      min-height: 800px;
      .dashboard-balance {
        background: url('~assets/images/dashboard-balance.png') no-repeat center;
      }
      .dashboard-iot {
        background: url('~assets/images/dashboard-iot.png') no-repeat center;
      }
      .pie {
        display: grid;
        grid-template-columns: repeat(2, 50%);
          .item {
          text-align: center;
          .item-content {
            height: auto;
            padding-bottom: 10px;
          }
          p {
            font-size: 16px;
          }
        }
      }
      .count {
        display: grid;
        grid-template-columns: repeat(3, 33.3%);
        div {
          display: grid;
          grid-template-columns: 75% 25%;
          border-right: 1px solid #ddd;
          padding-right: 5px;
          span:first-child {
            line-height: 1.5;
            text-align: right;
            font-size: 18px;
          }
          span:last-child {
            font-size: 24px;
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
        padding: 10px;
        .item {
          margin-bottom: 20px;
          width: 100%;
          .item-title {
            color: #fff;
            background: #404aaf;
            padding: 5px 10px 5px 20px;
            span:last-child {
              float: right;
              font-size: 12px;
            }
          }
        }
        .bar-wrapper {
          padding: 10px;
          border: 1px solid #ddd;
          margin-top: 0;
          li {
            list-style: none;
            width: 100%;
            height: 12px;
            padding-right: 20px;
            position: relative;
            margin: 0 0 20px;
            .bar-container{
              height: 100%;
              width: 95%;
              background-color: #0f1ca0;
              opacity: 0.2;
              border-radius: 20px;
              position: absolute;
              top: 0;
              left: 0;
              /* justify-content: space-between; */
            }
            .progress-bar {
              height: 100%;
              border-radius: 20px;
              background-color: #2048ce;
              background-image: linear-gradient(90deg, #2048ce, #161e73);
              width: 27%;
              opacity: 1;
              position: absolute;
              top: 0;
              left: 0;
            }
            .progress-bar-text {
              height: 100%;
              width: 100%;
              padding-left: 5px;
              position: absolute;
              top: 0;
              left: 0;
              font-size: 12px;
              color: #fff;
            }
            .bar-text {
              position: absolute;
              width: 24px;
              right: -2%;
              text-align: center;
              font-weight: bold;
              color: #1245d9;
            }
          }
          li:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  
</style>
