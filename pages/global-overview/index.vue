<script>
/* eslint-disable */
import { allHash } from '@/utils/promise';
import LoadDeps from '@/mixins/load-deps';
import {
  NODE, PODS, EVENTS, COMPONENTS_STATUS, METRICS, DEVICE_LINKS, K3S
} from '@/config/types';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { Table } from 'element-ui';
import echarts from 'echarts';
import '@/assets/fonts/hyzhuzi/style.scss';
import { rightGaugeConfigGenerator, baseGaugeConfigGenerator } from '@/config/dashboard-charts';
import ServiceStatusList from '@/components/ServiceStatusList';
import DashboardProgressBar from '@/components/DashboardProgressBar';

function hexbinClassNameGenerator(count) {
  if (count <= 30) {
    return 'liner-shallow';
  } else if (count > 30 && count <= 70) {
    return 'liner-middle';
  } else if (count > 70) {
    return 'liner-deep';
  }
}
// 1核=1000m，1m=1000*1000n，后台返回的是n为单位的
function formatCPUValue(cpuValue) {
  let value = parseInt(cpuValue, 10);
  if (!value) {
    return 0;
  }
  if (/n/.test(cpuValue)) {
    return value; // n结尾的直接返回
  } else if (/m/.test(cpuValue)) {
    return value * 1000 * 1000; // m结尾的换算成为单位的值
  } else if (/\u/.test(cpuValue)) {
    return value * 1000 * 10; // 100u=1m
  }
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
  async mounted() {
    window.onresize = () => {
      this.screenWidth = document.documentElement.clientWidth;
    }
    await this.$store.dispatch('dashboard/fetchALl', {
      body: {}
    });
    this.updateMetricsIoNodes();
    this.updateSystemServiceStatus();
    this.updateDeviceInfo();
  },
  computed: {
    nodesData() {
      if (this.$store.getters['deviceLink/hasType']('node')) {
        return this.$store.getters['deviceLink/all']('node');
      } else {
        return this.$store.getters['dashboard/nodes'];
      }
    }, 
    nodesMetricsData() {
      if (this.$store.getters['deviceLink/hasType']('metrics.k8s.io.nodemetrics')) {
        return this.$store.getters['deviceLink/all']('metrics.k8s.io.nodemetrics');
      } else {
        return this.$store.getters['dashboard/nodesMetrics'];
      }
    },
    podsData() {
      if (this.$store.getters['deviceLink/hasType']('pod')) {
        return this.$store.getters['deviceLink/all']('pod');
      } else {
        return this.$store.getters['dashboard/pods'];
      }
    }, 
    devices() {
      if (this.$store.getters['deviceLink/hasType']('edge.cattle.io.devicelink')) {
        return this.$store.getters['deviceLink/all']('edge.cattle.io.devicelink');
      } else {
        return this.$store.getters['dashboard/devices'];
      }
    },
    podsLoadInfo() {
      if (this.$store.getters['deviceLink/hasType']('metrics.k8s.io.podmetrics')) {
        return this.$store.getters['deviceLink/all']('metrics.k8s.io.podmetrics');
      } else {
        return this.$store.getters['dashboard/podsLoadInfo'];
      }
    },
    eventList() {
      if (this.$store.getters['deviceLink/hasType']('event')) {
        return this.$store.getters['deviceLink/all']('event');
      } else {
        return this.$store.getters['dashboard/events'];
      }
    },
    datastorage() {
      return this.$store.getters['dashboard/datastorage'];
    },
    systemControllers() {
      if (this.$store.getters['deviceLink/hasType']('componentstatus')) {
        return this.$store.getters['deviceLink/all']('componentstatus');
      } else {
        return this.$store.getters['dashboard/systemControllers'];
      }
    },
    networking() {
      if (this.$store.getters['deviceLink/hasType']('k3s.cattle.io.addon')) {
        return this.$store.getters['deviceLink/all']('k3s.cattle.io.addon');
      } else {
        return this.$store.getters['dashboard/networking'];
      }
    }
  },
  methods: {
    formatFontSize(val, initWidth = 1920) {
      const nowClientWidth = document.documentElement.clientWidth;
      return val * (nowClientWidth/initWidth)
    },
    getDataFromStore(type) {
      return this.$store.getters['deviceLink/hasType'](type) ? this.$store.getters['deviceLink/all'](type) : [];
    },
    drawGauge(gaugeData) {
      const chartContainerNames = ['cpuUsedGauge', 'memoryUsedGauge', 'podsUsedGauge'];
      chartContainerNames.forEach((ecItem, ecIndex) => {
        const params = gaugeData[ecItem].split('|');
        const rate = parseFloat(params[0]) / 100;
        const baseOptions = baseGaugeConfigGenerator();
        baseOptions.series[1].axisLine.lineStyle.color = [
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
        ];
        baseOptions.series[1].detail = {
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
        };
        const ecDraw = echarts.init(this.$refs[ecItem]);
        ecDraw.setOption(baseOptions);
        this.gaugeList.push(ecDraw);
        setTimeout(() => {
          ecDraw.resize();
        }, 500);
      });
    },
    drawHexbin(hexbinData) {
      const hexbinContainerNames = ['cpuUsageHexbin', 'memoryUsageHexbin', 'podsUsageHexbin'];
      const tooltipRef = this.$refs['tooltip'];

      hexbinContainerNames.forEach((demoItem, demoIndex) => {
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
          .attr('class', (d, i) => {
            return hexbinClassNameGenerator(list[i].num);
          })
          .attr('d', mHexbin.hexagon(25))
          .attr('transform', d => `translate(${ d.x },${ d.y })`)
          .attr('stroke', '#fff')
          .attr('stroke-width', '1')
          .attr('filter', 'url(#blurFilter)')
          .attr('fill', (d, i) => {
            return `url(#${hexbinClassNameGenerator(list[i].num)})`;
          })
          .on('mouseover', (pointsInfo, pointsIndex, pathArray) => {
            const pathDom = pathArray[pointsIndex];
            const pathDomPosition = pathDom.getBoundingClientRect();
            tooltipRef.style.display = 'block';
            tooltipRef.style.top = pathDomPosition.top -30 + 'px';
            tooltipRef.style.left = pathDomPosition.left - 60 + 'px';
            tooltipRef.innerHTML = list[pointsIndex].data;
            pathDom.setAttribute('transform', `scale(1.2) translate(${ pointsInfo.x * 0.8 },${ pointsInfo.y * 0.8 })`);
            setTimeout(() => {
              d3.select(this.$refs[demoItem]).append('path')
              .attr('d', mHexbin.hexagon(25))
              .attr('transform', `scale(1.2) translate(${ pointsInfo.x * 0.8 },${ pointsInfo.y * 0.8 })`)
              .attr('stroke', '#fff')
              .attr('stroke-width', '2')
              .attr('fill', (d, i) => {
                return `url(#${hexbinClassNameGenerator(list[pointsIndex].num)})`;
              })
              .on('mouseout', (hoverPointsInfo, pointsIndex, pathArray) => {
                d3.select(pathArray[0]).remove();
                pathDom.setAttribute('transform', `scale(1) translate(${ pointsInfo.x },${ pointsInfo.y })`);
                tooltipRef.style.display = 'none';
              });
            }, 0);
          });
      });

    },
    drawRightGauge(iotInfo) {
      const { online, offline, total } = iotInfo;
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
        const option = rightGaugeConfigGenerator(customOpt);
        ecDraw.setOption(option);
        this.rightGaugeList.push(ecDraw);
        setTimeout(() => {
          ecDraw.resize();
        }, 500);
      });
    },
    updateMetricsIoNodes() {
      const { nodesMetricsData, nodesData, podsData } = this;
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
          nodesMap[nodeName]?.podList.push(podItem);
        }
      });

      let clusterCPU = 0;
      let clusterCPUCore = 0;
      let clusterMemory = 0;
      let clusterMemoryG = 0;
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
        const cpuUsedRate = (formatCPUValue(usage.cpu, 10) / formatCPUValue(cpu, 10) * 100).toFixed(1);
        const memoryUsedRate = (formatMemoryValue(usage.memory, 10) / formatMemoryValue(memory, 10) * 100).toFixed(1);
        const podsUsedRate = (podList.length / parseInt(pods, 10) * 100).toFixed(1);
        const name = keyItem.toString();
        hexbinData[0].push({
          num: parseFloat(cpuUsedRate),
          data: `${name}: ${cpuUsedRate}%`
        });
        hexbinData[1].push({
          num: parseFloat(memoryUsedRate),
          data: `${name}: ${memoryUsedRate}%`
        });
        hexbinData[2].push({
          num: parseFloat(podsUsedRate),
          data: `${name}: ${podsUsedRate}%`
        });
        // 统计集群总量
        clusterCPU += formatCPUValue(cpu, 10);
        clusterMemory += formatMemoryValue(memory, 10);
        clusterPods += parseInt(pods, 10);
        clusterCPUCore += parseInt(cpu, 10);
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

      this.drawHexbin(hexbinData);
      this.drawGauge({
        cpuUsedGauge: `${clusterCPUUsedRate}|CPU|已使用${clusterCPUCore}中的${(clusterUsedCPU / 1000000000).toFixed(2)}`,
        memoryUsedGauge: `${clusterMemoryUsedRate}|Memory|已使用${(clusterMemory / 1024 / 1024).toFixed(1)}GIB中的${(clusterUsedMemory / 1024 / 1024).toFixed(1)}`,
        podsUsedGauge: `${clusterPodsUsedRate}|Pods|已使用${clusterPods}中的${clusterUsedPods}`
      });
    },
    updateDeviceInfo() {
      const { devices } = this;
      let total = devices.length;
      let online = 0;
      let offline = 0;
      devices.forEach((deviceItem, deviceIndex) => {
        const state = deviceItem.metadata.state;
        if ('active' === state.name) online++;
      });
      offline = total - online;
      this.iotInfo = { total, online, offline };
      this.drawRightGauge({ total, online, offline });
    },
    updatePodsLoadInfo() {
      const { nodesData, podsLoadInfo } = this;
      let maxCpuLoad = 0;
      let maxMemoryLoad = 0;
      const cpuLoadList = podsLoadInfo.map((podItem, podIndex) => {
        const cpu = formatCPUValue(podItem.containers[0].usage.cpu);
        const cpuUsage = parseFloat((cpu / 1000 / 1000).toFixed(2)); // 换算m
        return { id: podIndex, name: podItem.id, value: cpuUsage };
      })
      .sort((leftItem, rightItem) => rightItem.value - leftItem.value)
      .splice(0, 10)
      .map((item, itemIndex) => {
        let percent = 0;
        if (0 === itemIndex) {
          percent = 100;
          maxCpuLoad = item.value;
        } else {
          percent = item.value / maxCpuLoad * 100;
        }
        return { ...item, value: item.value.toFixed(1), percent };
      });
      const memoryLoadList = podsLoadInfo.map((podItem, podIndex) => {
        const memory = formatMemoryValue(podItem.containers[0].usage.memory);
        const memoryUsage = parseFloat((memory / 1024).toFixed(2)); // 换算m
        return { id: podIndex, name: podItem.id, value: memoryUsage };
      })
      .sort((leftItem, rightItem) => rightItem.value - leftItem.value)
      .splice(0, 10)
      .map((item, itemIndex) => {
        let percent = 0;
        if (0 === itemIndex) {
          percent = 100;
          maxMemoryLoad = item.value;
        } else {
          percent = item.value / maxMemoryLoad * 100;
        }
        return { ...item, value: item.value.toFixed(1), percent };
      });

      this.$set(this.$data, 'cpuLoadList', cpuLoadList);
      this.$set(this.$data, 'memoryLoadList', memoryLoadList);
    },
    updateEventsData() {
      const { eventList } = this;
      this.tableData = eventList.map(eventItem => {
        const { metadata, message } = eventItem;
        const { fields } = metadata;
        return {
          namespace: metadata.namespace,
          lastSeen: fields[0],
          type: fields[1],
          reason: fields[2],
          object: fields[3],
          message
        }
      });
    },
    updateSystemServiceStatus() {
      const { datastorage, systemControllers, networking, nodesData } = this;
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

      nodesData.forEach((nodeItem, nodeIndex) => {
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
    nodesData: {
      handler(val) {
        this.updateMetricsIoNodes();
        this.updateSystemServiceStatus();
      },
      deep: true
    },
    podsData: {
      handler(val) {
        this.updateMetricsIoNodes();
      },
      deep: true
    },
    nodesMetricsData: {
      handler(val) {
        this.updateMetricsIoNodes();
      },
      deep: true
    },
    eventList: {
      handler(val) {
        this.updateEventsData();
      },
      deep: true,
      immediate: true
    },
    devices: {
      handler(val) {
        this.updateDeviceInfo();
      },
      deep: true
    },
    podsLoadInfo: {
      handler(val) {
        this.updatePodsLoadInfo();
      },
      deep: true,
      immediate: true
    },
    datastorage: {
      handler(val) {
        this.updateSystemServiceStatus();
      },
      deep: true,
      immediate: true
    },
    systemControllers: {
      handler(val) {
        this.updateSystemServiceStatus();
      },
      deep: true,
      immediate: true
    },
    networking: {
      handler(val) {
        this.updateSystemServiceStatus();
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<template>
  <div class="wrapper">
    <h3 class="header-border"><i class="position icon iconfont icon-position"></i><span>智慧园区-北京朝阳</span><span>（最后一次备份于2020-03-01 22:22:22）</span></h3>
    <div class="content">
      <div class="content-main">
        <div class="usage">
          <h3 class="module-title">
            <i class="icon iconfont icon-source"></i>
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
            <i class="icon iconfont icon-system"></i>
            系统服务
          </h3>
          <ServiceStatusList 
            :list="serviceList"
          />
        </div>
        <div class="event">
          <h3 class="module-title">
            <i class="icon iconfont icon-set"></i>
            集群事件
          </h3>
          <el-table
            :data="tableData"
            cell-class-name="events-table-td"
            class="events-table"
            height="410px"
          >
            <el-table-column
              label="命名空间"
              prop="namespace"
            />
            <el-table-column
              label="事件时间"
              prop="lastSeen"
            />
            <el-table-column
              label="类型"
              prop="type"
            />
            <el-table-column
              label="原因"
              prop="reason"
            />
            <el-table-column
              label="资源对象"
              prop="object"
              min-width="150"
            />
            <el-table-column
              label="事件消息"
              prop="message"
              min-width="220"
            />
          </el-table>
        </div>
      </div>
      <div class="content-side">
        <div class="iot">
          <h3 class="module-title">
            <i class="icon iconfont icon-iot-management"></i>
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
            <i class="icon iconfont icon-workload"></i>
            工作负载
          </h3>
          <DashboardProgressBar 
            title="CPU密集型Pod TOP10"
            unit="单位：M"
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
    <svg class="liner">
      <defs>
        <linearGradient id="liner-deep" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3fa1ff"/>
          <stop offset="100%" stop-color="#2d2894"/>
        </linearGradient>
        <linearGradient id="liner-middle" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#56a7f2"/>
          <stop offset="100%" stop-color="#7b9dfc"/>
        </linearGradient>
        <linearGradient id="liner-shallow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#bde7fe"/>
          <stop offset="100%" stop-color="#c7cdfa"/>
        </linearGradient>
        <filter id="blurFilter" x="0" y="0">
          <feOffset result="offOut" in="SourceAlpha" dx="0" dy="1" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style lang="scss">
  @import "~assets/fonts/fzpszhjw/style.scss";
  .wrapper {
    background-color: #f6f7fb;
    min-width: 1440px;
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
        vertical-align: baseline;
      }
    }
    .usage, .service, .event, .balance, .iot {
      padding: 20px;
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
      display: flex;
      justify-content: space-between;
      width: 100%;
      .content-main {
        min-height: 800px;
        width: 71%;
        display: grid;
        grid-template-rows: repeat(3, auto);
        .icon {
          font-size: 25px;
        }
        .pie-container {
          width: 100%;
          min-height: 280px;
          margin: 0 auto;
        }
        .usage-list {
          display: grid;
          grid-template-columns: repeat(3, 32.5%);
          grid-column-gap: 1.4%;
          .item {
            border: 1px solid #ddd;
            padding: 10px 10px 0;
            h4 {
              font-size: 17px;
              font-weight: bold;
            }
            path {
              transition: all .3s ease-in-out; 
              opacity: .7
            }
            path:hover {
              cursor: pointer;
              opacity: 1;
            }
          }
        }
        .event {
          width: 100%;
          overflow: auto;
          .events-table {
            width: 99.9%;
            border: 0;
            border-collapse: collapse;
            height: 26.5vw;
            margin-top: 16px;
            th, td {
              color: #fff;
              line-height: 36px;
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
        width: 28%;
        display: grid;
        min-height: 800px;
        grid-template-rows: repeat(2, auto);
        .icon {
          font-size: 25px;
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
          padding: 21px 0;

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
          padding: 16px 10px;
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
    .liner {
      width: 0;
      height: 0;
    }
  }
  
</style>
