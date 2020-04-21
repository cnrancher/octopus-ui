<script>
/* eslint-disable */
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { Table } from 'element-ui';
import echarts from 'echarts';
import '@/assets/fonts/hyzhuzi/style.scss';
import ServiceStatusList from '@/components/ServiceStatusList';
import DashboardProgressBar from '@/components/DashboardProgressBar';

function hexbinColorGenerator(count = 0) {
  if (count <= 25) return '#f0f3fb';
  else if (count > 25 && count <= 50) return '#b0bee7';
  else if (count > 50 && count <= 75) return '#4674d3';
  else if (count > 75) return '#39277f';
}

// 1核=1000m，1m=1000*1000n，后台返回的是n为单位的
function formatCPUValue(cpuValue) {
  let value = parseInt(cpuValue, 10);
  if (!value) return 0;
  if (/n/.test(cpuValue)) return value; // n结尾的直接返回
  else if (/m/.test(cpuValue)) return value * 1000 * 1000; // m结尾的换算成为单位的值
  return value * 1000 * 1000 * 1000; // 核数时的返回
}
// 1024，目前后台返回的是ki结尾，需要去掉单位
function formatMemoryValue(memoryValue) {
  return parseInt(memoryValue, 10) || 0;
}

export default {
  components: { 'el-table': Table, 'DashboardProgressBar': DashboardProgressBar, ServiceStatusList: ServiceStatusList },
  data() {
    return {
      screenWidth: document.documentElement.clientWidth,
      gaugeList: [],
      rightGaugeList: [],
      tableData: [],
      serviceList: [
        {
          index: 1, name: 'Datastore', status: 'success'
        },
        {
          index: 2, name: 'System Controllers', status: 'error'
        },
        {
          index: 3, name: 'Networking', status: 'success'
        },
        {
          index: 4, name: 'Nodes', status: 'unknown'
        }
      ],
      iotInfo: {
        total: 0,
        online: 0,
        offline: 0
      },
      hexbinData: [],
      gaugeData: {},
      cpuLoadList: [],
      memoryLoadList: []
    };
  },
  mounted() {
    // this.drawHexbin();
    // this.drawGauge();
    this.drawRightGauge();
    window.onresize = () => {
      this.screenWidth = document.documentElement.clientWidth;
    }
    this.getMetricsIoNodes();
    this.getDeviceInfo();
    this.getPodsLoadInfo();
    this.getEvents();
    this.getSystemServiceStatus();
  },
  methods: {
    formatFontSize(val,initWidth=1920) {
      const nowClientWidth = document.documentElement.clientWidth;
      return val * (nowClientWidth/initWidth)
    },
    drawGauge() {
      const chartContainerNames = ['cpuUsedGauge', 'memoryUsedGauge', 'podsUsedGauge'];
      const { gaugeData } = this;
      chartContainerNames.forEach((ecItem, ecIndex) => {
        const params = gaugeData[ecItem].split('|');
        const rate = parseFloat(params[0]) / 100;
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
                      rate, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
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
      const { hexbinData } = this;
      const hexbinContainerNames = ['cpuUsageHexbin', 'memoryUsageHexbin', 'podsUsageHexbin'];
      const tooltipRef = this.$refs['tooltip'];

      hexbinContainerNames.forEach((demoItem, demoIndex) => {
        const i = 0;
        let j;
        const list = hexbinData[demoIndex];
        const d3Node = d3.select(this.$refs[demoItem]);
        const color = d3.scaleSequential(d3.interpolateLab('#8276b8', '#4646b0')).domain([0, 20]);
        const points = [
          [25,50], [70,50], [115,50], [160,50], [205,50], [250,50],
          [48,89], [93,89], [138,89], [183,89], [228,89]
        ].splice(0, list.length);
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
    drawRightGauge(isRenew) {
      const { online, offline, total } = this.iotInfo;
      const leftNum = Math.round(online / total * 100);
      const rightNum = Math.round(offline / total * 100);

      const rightGaugeOpts = {
        rightGaugeLeft: {
          title: `${online}个`,
          color: ['#d4fba4', '#8dc449'],
          values: [leftNum, 100 - leftNum]
        },
        rightGaugeRight: {
          title: `${offline}个`,
          color: ['#f4cccd', '#ee5558'],
          values: [rightNum, 100 - rightNum]
        }
      }

      const rightGaugeNames = ['rightGaugeLeft', 'rightGaugeRight'];
      rightGaugeNames.forEach((ecItem, ecIndex) => {
        const ecDraw = echarts.init(this.$refs[ecItem]);
        const customOpt = rightGaugeOpts[ecItem]
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
        if (!isRenew) {
          this.rightGaugeList.push(ecDraw);
        }
        setTimeout(() => {
          ecDraw.resize();
        }, 500);
      });
    },
    async getMetricsIoNodes() {
      const { nodesMetricsData, nodesData, podsData } = await this.$store.dispatch('dashboard/getMetricsIoNodes', {
        body: {}
      });
      const nodesMap = {};
      // 数据整合
      nodesData.forEach((nodeItem, nodeIndex) => {
        // 有节点容量capacity和节点可分配资源allocatable
        const { id, status } = nodeItem;
        nodesMap[id] = { status };
      });
      nodesMetricsData.forEach((nodesMetricsItem, nodesMetricsIndex) => {
        const { id, usage } = nodesMetricsItem;
        nodesMap[id] = {
          ...nodesMap[id],
          usage,
          podList: []
        }
      });
      podsData.forEach((podItem, podIndex) => {
        const { spec } = podItem;
        const { nodeName } = spec;
        if (nodesMap[nodeName]) {
          nodesMap[nodeName].podList.push(podItem);
        }
      });

      let clusterCPU = 0;
      let clusterMemory = 0;
      let clusterPods = 0;

      let clusterUsedCPU = 0;
      let clusterUsedMemory = 0;
      let clusterUsedPods = 0;
      // 分别对应CPU，内存和pod
      const hexbinData = [[], [], []];

      // 计算单个节点的CPU，内存和pod使用率
      const dataFormat = Object.keys(nodesMap).map(keyItem => {
        const { usage, status, podList } = nodesMap[keyItem];
        const { cpu, memory, pods } = status.allocatable;
        const cpuUsedRate = (formatCPUValue(usage.cpu, 10) / formatCPUValue(cpu, 10) * 100).toFixed(2);
        const memoryUsedRate = (formatMemoryValue(usage.memory, 10) / formatMemoryValue(memory, 10) * 100).toFixed(2);
        const podsUsedRate = (podList.length / parseInt(pods, 10) * 100).toFixed(2);
        const name = keyItem.toString();
        hexbinData[0].push({
          num: parseFloat(cpuUsedRate),
          data: `${name}:${cpuUsedRate}%`
        });
        hexbinData[1].push({
          num: parseFloat(memoryUsedRate),
          data: `${name}:${memoryUsedRate}%`
        });
        hexbinData[2].push({
          num: parseFloat(podsUsedRate),
          data: `${name}:${podsUsedRate}%`
        });
        // 统计集群总量
        clusterCPU += formatCPUValue(cpu, 10);
        clusterMemory += formatMemoryValue(memory, 10);
        clusterPods += parseInt(pods, 10);

        // 统计集群已使用总量
        clusterUsedCPU += formatCPUValue(usage.cpu, 10);
        clusterUsedMemory += formatMemoryValue(usage.memory, 10);
        clusterUsedPods += podList.length;
        return {
          cpuUsedRate, memoryUsedRate, podsUsedRate,
          name: keyItem.toString()
        }
      });
      const clusterCPUUsedRate = (clusterUsedCPU / clusterCPU * 100).toFixed(2);
      const clusterMemoryUsedRate = (clusterUsedMemory / clusterMemory * 100).toFixed(2);
      const clusterPodsUsedRate = (clusterUsedPods / clusterPods * 100).toFixed(2);
      this.hexbinData = hexbinData;
      this.gaugeData = {
        cpuUsedGauge: `${clusterCPUUsedRate}|CPU|已使用2中的0.2`,
        memoryUsedGauge: `${clusterMemoryUsedRate}|Memory|已使用7.7GIB中的0.1`,
        podsUsedGauge: `${clusterPodsUsedRate}|Pods|已使用110中的12`,
      };
    },
    async getDeviceInfo() {
      const data = await this.$store.dispatch('dashboard/getDeviceInfo', {
        body: {}
      });
      let total = data.length;
      let online = 0;
      let offline = 0;
      data.forEach((deviceItem, deviceIndex) => {
        const state = deviceItem.metadata.state;
        if ('active' === state.name) online++;
      });
      offline = total - online;
      this.iotInfo = { total, online, offline };
    },
    async getPodsLoadInfo() {
      const { nodesData, podsData } = await this.$store.dispatch('dashboard/getPodsLoadInfo', {
        body: {}
      });
      let clusterCPU = 0;
      let clusterMemory = 0;
      nodesData.forEach((nodeItem, nodeIndex) => {
        const { cpu, memory } = nodeItem.status.allocatable;
        clusterCPU += formatCPUValue(cpu);
        clusterMemory += formatMemoryValue(memory);
      })
      const cpuLoadSortList = podsData.map((podItem, podIndex) => {
        const cpu = formatCPUValue(podItem.containers[0].usage.cpu);
        const cpuUsage = parseFloat((cpu / 1000 / 1000).toFixed(2)); // 换算m
        const cpuUsageRate = cpu / clusterCPU * 100;
        return { id: podIndex, name: podItem.id, value: cpuUsage, percent: cpuUsageRate };
      })
      .sort((leftItem, rightItem) => rightItem.value - leftItem.value);
      const memoryLoadSortList = podsData.map((podItem, podIndex) => {
        const memory = formatMemoryValue(podItem.containers[0].usage.memory);
        const memoryUsage = parseFloat((memory / 1024).toFixed(2)); // 换算m
        const memoryUsageRate = memory / clusterMemory * 100;
        return { id: podIndex, name: podItem.id, value: memoryUsage, percent: memoryUsageRate };
      })
      .sort((leftItem, rightItem) => rightItem.value - leftItem.value);

      this.cpuLoadList = cpuLoadSortList.splice(0, 10);
      this.memoryLoadList = memoryLoadSortList.splice(0, 10);
    },
    async getEvents() {
      const data = await this.$store.dispatch('dashboard/getEvents', {
        body: {}
      });
      this.tableData = data.map(eventItem => {
        const { metadata, reason, _type, lastTimestamp, message } = eventItem;
        return {
          namespace: metadata.namespace,
          lastSeen: lastTimestamp,
          type: _type,
          reason,
          object: '',
          message
        }
      });
    },
    async getSystemServiceStatus() {
      const { datastorage, systemControllers, networking, nodes } = await this.$store.dispatch('dashboard/getSystemServiceStatus', {
        body: {}
      });
      const systemServeives = [
        {
          index: 0, name: 'Datastore', status: datastorage.health ? 'success' : 'error'
        }
      ];
      let systemControllersStatus = true;
      let networkingStatus = true;
      let nodesStatus = true;

      systemControllers.forEach((controllerItem, controllerIndex) => {
        const { state } = controllerItem.metadata;
        systemControllersStatus &= 'active' === state.name;
      });
      systemServeives.push({
        index: 1, name: 'System Controllers', status: systemControllersStatus ? 'success' : 'error'
      });

      nodes.forEach((nodeItem, nodeIndex) => {
        networkingStatus &= '' !== nodeItem.metadata.annotations['flannel.alpha.coreos.com/public-ip'];
        nodesStatus &= 'active' === nodeItem.metadata.state.name;
      });

      networking.forEach((networkingItem, networkingIndex) => {
        const { metadata } = networkingItem;
        if (!!~['traefik', 'coredns'].indexOf(metadata.name)) {
          networkingStatus &= 'active' === metadata.state.name;
        }
      });

      systemServeives.push({
        index: 2, name: 'Networking', status: networkingStatus ? 'success' : 'error'
      });
      systemServeives.push({
        index: 3, name: 'Nodes', status: nodesStatus ? 'success' : 'error'
      })
      // {
      //     index: 1, name: 'Datastore', status: 'success'
      //   },
      //   {
      //     index: 2, name: 'System Controllers', status: 'error'
      //   },
      //   {
      //     index: 3, name: 'Networking', status: 'success'
      //   },
      //   {
      //     index: 4, name: 'Nodes', status: 'unknown'
      //   }
      
      this.serviceList = systemServeives;
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
    },
    iotInfo: function(val) {
      this.drawRightGauge(true);
    },
    hexbinData: function() {
      this.drawHexbin();
    },
    gaugeData: function() {
      this.drawGauge();
    }
  }
};
</script>
<template>
  <div class="wrapper">
    <h3 class="header-border"><i class="position"></i><span>智慧园区-北京朝阳</span><span>（最后一次备份于2020-03-01 22:22:22）</span></h3>
    <div class="content">
      <div class="content-main">
        <div class="usage">
          <h3 class="module-title">
            <i class="icon dashboard-source"></i>
            资源使用
          </h3>
          <div class="usage-list">
            <div class="item">
              <h4>每个节点CPU使用率</h4>
              <div class="hexbin-container">
                <svg ref="cpuUsageHexbin"></svg>
              </div>
              <h4>集群整体CPU使用率</h4>
              <div class="pie-container" ref="cpuUsedGauge">
              </div>
            </div>
            <div class="item">
              <h4>每个节点内存使用率</h4>
              <div class="hexbin-container">
                <svg ref="memoryUsageHexbin"></svg>
              </div>
              <h4>集群整体内存使用率</h4>
              <div class="pie-container" ref="memoryUsedGauge">
              </div>
            </div>
            <div class="item">
              <h4>每个节点Pod使用率</h4>
              <div class="hexbin-container">
                <svg ref="podsUsageHexbin"></svg>
              </div>
              <h4>集群整体Pod数量</h4>
              <div class="pie-container" ref="podsUsedGauge">
              </div>
            </div>
          </div>
        </div>
        <div class="service">
          <h3 class="module-title">
            <i class="icon dashboard-system"></i>
            系统服务
          </h3>
          <ServiceStatusList 
            :list="serviceList"
          />
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
              label="NAMESPACE"
              prop="namespace"
              min-width="100px"
            />
            <el-table-column
              label="LAST SEEN"
              prop="lastSeen"
              min-width="100px"
            />
            <el-table-column
              label="TYPE"
              prop="type"
              min-width="100px"
            />
            <el-table-column
              label="REASON"
              prop="reason"
              min-width="100px"
            />
            <el-table-column
              label="OBJECT"
              prop="object"
              min-width="100px"
            />
            <el-table-column
              label="MESSAGE"
              prop="message"
              min-width="100px"
            />
          </el-table>
        </div>
      </div>
      <div class="content-side">
        <div class="iot">
          <h3 class="module-title">
            <i class="icon dashboard-iot"></i>
            IoT设备
          </h3>
          <div class="pie">
            <div class="item">
              <div class="item-content" ref="rightGaugeLeft"></div>
              <p>在线数量</p>
            </div>
            <div class="item">
              <div class="item-content" ref="rightGaugeRight"></div>
              <p>离线数量</p>
            </div>
          </div>
          <div class="count">
            <div>
              <span>设备总数：</span>
              <span>{{ iotInfo.total }}</span>
            </div>
            <div>
              <span>在线数量：</span>
              <span>{{ iotInfo.online }}</span>
            </div>
            <div>
              <span>离线数量：</span>
              <span>{{ iotInfo.offline }}</span>
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
            :list="cpuLoadList"
          />
          <DashboardProgressBar 
            title="内存密集型Pod TOP10"
            unit="单位：MiB"
            :list="memoryLoadList"
          />
        </div>
      </div>
    </div>
    <div ref="tooltip" class="dashboard-tooltip"></div>
  </div>
</template>

<style lang="scss">
  @import "~assets/fonts/fzpszhjw/style.scss";
  .wrapper {
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
        font-size: 16px;
        font-weight: bold;
      }
      span:last-child {
        font-size: 14px;
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
      font-size: 24px;
      margin-bottom: 4px;
      font-family: fzpszhjw;
    }
    .content {
      display: grid;
      // min-width: 1716px;
      grid-template-columns: 70% 28%;
      grid-column-gap: 1.3%;
      .content-main {
        min-height: 800px;
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
        .pie-container {
          width: 100%;
          min-height: 280px;
          margin: 0 auto;
        }
        .usage-list {
          display: grid;
          grid-template-columns: repeat(3, 32.5%);
          grid-column-gap: 1.2%;
          .item {
            border: 1px solid #ddd;
            padding: 10px 20px 0;
            h4 {
              font-size: 17px;
              font-weight: bold;
            }
          }
        }
        .event {
          .events-table {
            width: 99.9%;
            border: 0;
            border-collapse: collapse;
            height: 26.5vw;
            margin-top: 16px;
            th, td {
              color: #fff;
              line-height: 2.08vw;
              padding: 0;
              font-size: 16px;
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
      .content-side {
        height: 100%;
        display: grid;
        min-height: 800px;
        grid-template-rows: repeat(2, auto);
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
              min-height: 210px;
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
              font-size: 18px;
            }
            span:last-child {
              font-size: 26px;
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
