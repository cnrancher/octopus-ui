<script>
import * as d3 from 'd3';
import echarts from 'echarts';
import { hexbin } from 'd3-hexbin';
import { rightGaugeConfigGenerator, baseGaugeConfigGenerator } from '@/config/dashboard-charts';
import { allSettled } from '@/utils/promise';
import { formatMemoryValue, parseSi } from '@/utils/units';
import LoadDeps from '@/mixins/load-deps';
import ServiceStatusList from '@/components/ServiceStatusList';
import DashboardWorkload from '@/components/DashboardWorkload';
import {
  NODE, POD, EVENT, COMPONENTSTATUS, METRIC, K3S, DEVICE_LINK, SETTING
} from '@/config/types';
import DashboardEvents from '@/components/DashboardEvents';
import { DESCENDING } from '@/config/query-params';

function hexbinClassNameGenerator(count) {
  if (count <= 30) {
    return 'liner-shallow';
  } else if (count > 30 && count <= 70) {
    return 'liner-middle';
  } else if (count > 70) {
    return 'liner-deep';
  }
}
const ServiceList = [
  {
    name: 'Datastore',
    icon: 'icon-datastore'
  },
  {
    name: 'System Controllers',
    icon: 'icon-system-controllers'
  },
  {
    name: 'Networking',
    icon: 'icon-networking'
  },
  {
    name: 'Nodes',
    icon: 'icon-nodes'
  }
];

function getSystemStatus(item, status) {
  return {
    ...item,
    status: status === false ? 'error' : 'success' // make sure default success
  };
}

export default {
  components: {
    ServiceStatusList,
    DashboardEvents,
    DashboardWorkload
  },

  mixins: [LoadDeps],

  async fetch() {
    const hash = await allSettled({
      event:              this.$store.dispatch('management/findAll', { type: EVENT }),
      nodesMetricsData:   this.$store.dispatch('management/findAll', { type: METRIC.NODE }),
      podsData:           this.$store.dispatch('management/findAll', { type: POD }),
      setting:            this.$store.dispatch('management/findAll', { type: SETTING }),
      nodes:              this.$store.dispatch('management/findAll', { type: NODE }),
      devices:            this.$store.dispatch('management/findAll', { type: DEVICE_LINK }),
      systemControllers:  this.$store.dispatch('management/findAll', { type: COMPONENTSTATUS }),
      networking:         this.$store.dispatch('management/findAll', { type: K3S.ADDON }),
      datastorage:        this.$store.dispatch('management/request', { url: '/v2-public/health/datastorage', method: 'get' }),
    });

    this.allSetting = hash.setting;
    this.events = hash.event;
    this.nodesData = hash.nodes;
    this.devices = hash.devices;
    this.podsData = hash.podsData;
    this.networking = hash.networking;
    this.datastorage = hash.datastorage;
    this.nodesMetricsData = hash.nodesMetricsData;
    this.systemControllers = hash.systemControllers;
  },

  data() {
    return {
      screenWidth:      document.documentElement.clientWidth,
      flag:             true,
      gaugeList:        [],
      rightGaugeList:   [],
      tableData:        [],
      iotInfo:          {
        total:   0,
        online:  0,
        offline: 0
      },
      allSetting:           [],
      hexbinData:        [],
      gaugeData:         {},
      events:            [],
      nodesMetricsData:  [],
      nodesData:         [],
      podsData:          [],
      devices:           [],
      datastorage:       [],
      systemControllers: [],
      networking:        [],
      clusterName:       ''
    };
  },

  computed: {
    serviceList() {
      const {
        datastorage, systemControllers, networking, nodesData
      } = this;
      const systemServeives = [];

      systemServeives.push(getSystemStatus(ServiceList[0], datastorage.health));

      let systemControllersStatus = true;
      let networkingStatus = true;
      let nodesStatus = true;

      systemControllers.forEach((controllerItem, controllerIndex) => {
        const { state } = controllerItem.metadata;

        systemControllersStatus &= state.name === 'active';
      });

      systemServeives.push(getSystemStatus(ServiceList[1], systemControllersStatus));

      nodesData.forEach((nodeItem, nodeIndex) => {
        networkingStatus &= nodeItem.metadata.annotations['flannel.alpha.coreos.com/public-ip'] !== '';
        nodesStatus &= nodeItem.metadata.state.name === 'active';
      });

      networking.forEach((networkingItem, networkingIndex) => {
        const { metadata } = networkingItem;

        if (!!~['traefik', 'coredns'].indexOf(metadata.name)) {
          networkingStatus &= metadata.state.name === 'active';
        }
      });

      systemServeives.push(getSystemStatus(ServiceList[2], networkingStatus));
      systemServeives.push(getSystemStatus(ServiceList[3], nodesStatus));

      return systemServeives;
    }
  },

  watch: {
    screenWidth(val) {
      this.gaugeList.forEach((chartsItem) => {
        chartsItem.resize();
      });
      this.rightGaugeList.forEach((chartsItem) => {
        chartsItem.resize();
      });
    },
    allSetting(newV) {
      const location = newV.filter( (S) => {
        return S.id === 'location';
      });

      this.clusterName = location[0]?.value || '';
    },
    nodesData() {
      this.updateMetricsIoNodes();
    },
    podsData() {
      this.updateMetricsIoNodes();
    },
    nodesMetricsData() {
      this.updateMetricsIoNodes();
    },
    devices() {
      this.updateDeviceInfo();
    },
  },

  mounted() {
    window.onresize = () => {
      this.screenWidth = document.documentElement.clientWidth;
    };
  },

  methods: {
    drawGauge(gaugeData) {
      const chartContainerNames = ['cpuUsedGauge', 'memoryUsedGauge', 'podsUsedGauge'];

      chartContainerNames.forEach((ecItem, ecIndex) => {
        const params = gaugeData[ecItem];
        const rate = parseFloat(params.percent) / 100;
        const baseOptions = baseGaugeConfigGenerator(rate);

        const formatter = (param) => {
          return `{percent|${ params.percent }%}\n{type|${ params.type }}\n{describe|已使用${ params.total }${ params.unit }中的${ params.usage }${ params.unit }}`;
        };

        baseOptions.series[1].detail.formatter = formatter;

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

      hexbinContainerNames.forEach((ref, index) => {
        const list = hexbinData[index];
        const d3Node = d3.select(this.$refs[ref]);

        d3.scaleSequential(d3.interpolateLab('#8276b8', '#4646b0')).domain([0, 20]);

        const points = [
          [25, 50], [70, 50], [115, 50], [160, 50], [205, 50], [250, 50],
          [48, 89], [93, 89], [138, 89], [183, 89], [228, 89]
        ].splice(0, list.length);

        const mHexbin = hexbin().size([400, 100]);

        d3Node.selectAll('path')
          .data(mHexbin(points))
          .enter().append('path')
          .attr('class', (d, i) => {
            return hexbinClassNameGenerator(list[i].num);
          })
          .attr('d', mHexbin.hexagon(25))
          .attr('transform', d => `translate(${ d.x },${ d.y })`)
          .attr('stroke', (d, i) => {
            return list[i].isReady ? '#fff' : 'red';
          })
          .attr('stroke-width', '1')
          .attr('filter', 'url(#blurFilter)')
          .attr('fill', (d, i) => {
            return `url(#${ hexbinClassNameGenerator(list[i].num) })`;
          })
          .on('mouseover', (pointsInfo, pointsIndex, pathArray) => {
            const pathDom = pathArray[pointsIndex];
            const pathDomPosition = pathDom.getBoundingClientRect();

            tooltipRef.style.display = 'block';
            tooltipRef.style.top = `${ pathDomPosition.top - 30 }px`;
            tooltipRef.style.left = `${ pathDomPosition.left - 60 }px`;
            tooltipRef.innerHTML = list[pointsIndex].data;
            pathDom.setAttribute('transform', `scale(1.2) translate(${ pointsInfo.x * 0.8 },${ pointsInfo.y * 0.8 })`);
            setTimeout(() => {
              d3.select(this.$refs[ref]).append('path')
                .attr('d', mHexbin.hexagon(25))
                .attr('transform', `scale(1.2) translate(${ pointsInfo.x * 0.8 },${ pointsInfo.y * 0.8 })`)
                .attr('stroke', '#fff')
                .attr('stroke', (d, i) => {
                  return list[pointsIndex].isReady ? '#fff' : 'red';
                })
                .attr('stroke-width', '2')
                .attr('fill', (d, i) => {
                  return `url(#${ hexbinClassNameGenerator(list[pointsIndex].num) })`;
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
    drawRightGauge() {
      const { online, offline, total } = this.iotInfo;

      const chartInfo = {
        color:            ['#a0a2f4', '#fac40f'],
        defaultTextColor: '#454545',
        online,
        offline,
        total,
        displayNum:       total
      };

      const rightGaugeName = 'rightGaugeLeft';
      const ecDraw = echarts.init(this.$refs[rightGaugeName]);
      const option = rightGaugeConfigGenerator(chartInfo);

      ecDraw.setOption(option);
      ecDraw.on('legendselectchanged', (params) => {
        const { name, selected } = params;
        const onlineName = option.series[0].data[1].name;
        const offlineName = option.series[0].data[0].name;
        let num = 0;
        let color = '';

        if (selected[offlineName] && selected[onlineName]) {
          // both
          color = chartInfo.defaultTextColor;
          num = total;
        } else if (!selected[offlineName] && !selected[onlineName]) {
          // both off
          color = chartInfo.defaultTextColor;
          num = 0;
        } else if (selected[onlineName]) {
          color = chartInfo.color[0];
          num = online;
        } else {
          color = chartInfo.color[1];
          num = offline;
        }

        const curChartInfo = {
          ...chartInfo, displayNum: num, defaultTextColor: color
        };
        const newOption = rightGaugeConfigGenerator(curChartInfo);

        ecDraw.setOption(newOption);
      });
      this.rightGaugeList.push(ecDraw);
      setTimeout(() => {
        ecDraw.resize();
      }, 500);
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
        };
      });

      podsData.forEach((podItem, podIndex) => {
        const { spec } = podItem;
        const { nodeName } = spec;

        if (nodesMap[nodeName]) {
          nodesMap[nodeName]?.podList?.push(podItem); // eslint-disable-line
        }
      });

      let clusterCPU = 0;
      let clusterCPUCore = 0;
      let clusterMemory = 0;
      let clusterPods = 0;

      let clusterUsedCPU = 0;
      let clusterUsedMemory = 0;
      let clusterUsedPods = 0;
      // 分别对应CPU，内存和pod
      const hexbinData = [[], [], []];

      // 计算单个节点的CPU，内存和pod使用率
      Object.keys(nodesMap).map((name) => {
        let { usage, status, podList } = nodesMap[name]; // eslint-disable-line
        let isReady = '';

        status.conditions.forEach((item) => {
          if (item.type === 'Ready') {
            isReady = item.status === 'True';
          }
        });

        // When node is abnormal   TODO
        if (!podList || !usage) {
          podList = [];
          usage = { memory: 0, cpu: 0 };
        }

        const { cpu, memory, pods } = status.allocatable;

        let cpuUsedRate = 0;
        let memoryUsedRate = 0;
        let podsUsedRate = 0;

        if (isReady) {
          cpuUsedRate = (parseSi(usage.cpu) / parseInt(cpu, 10) * 100).toFixed(1);
          memoryUsedRate = (formatMemoryValue(usage.memory, 10) / formatMemoryValue(memory, 10) * 100).toFixed(1);
          podsUsedRate = (podList.length / parseInt(pods, 10) * 100).toFixed(1);

          // cluster total
          clusterCPU += parseInt(cpu, 10);
          clusterMemory += formatMemoryValue(memory, 10);
          clusterPods += parseInt(pods, 10);
          clusterCPUCore += parseInt(cpu, 10);
          // cluster total used
          clusterUsedCPU += parseSi(usage.cpu);
          clusterUsedMemory += formatMemoryValue(usage.memory, 10);
          clusterUsedPods += podList.length;
        }

        hexbinData[0].push({
          isReady,
          num:  parseFloat(cpuUsedRate),
          data: `${ name }: ${ cpuUsedRate }%`
        });

        hexbinData[1].push({
          isReady,
          num:  parseFloat(memoryUsedRate),
          data: `${ name }: ${ memoryUsedRate }%`
        });

        hexbinData[2].push({
          isReady,
          num:  parseFloat(podsUsedRate),
          data: `${ name }: ${ podsUsedRate }%`
        });

        return {
          cpuUsedRate,
          memoryUsedRate,
          podsUsedRate,
          name
        };
      });

      const clusterCPUUsedRate = (clusterUsedCPU / clusterCPU * 100).toFixed(2);
      const clusterMemoryUsedRate = (clusterUsedMemory / clusterMemory * 100).toFixed(2);
      const clusterPodsUsedRate = (clusterUsedPods / clusterPods * 100).toFixed(2);

      const echartInfo = {
        cpuUsedGauge: {
          type:    'CPU',
          unit:    '核',
          percent: clusterCPUUsedRate,
          total:   clusterCPUCore,
          usage:   clusterUsedCPU.toFixed(2)
        },
        memoryUsedGauge: {
          type:    'Memory',
          unit:    'GiB',
          percent: clusterMemoryUsedRate,
          total:   (clusterMemory / 1024 / 1024).toFixed(1),
          usage:   (clusterUsedMemory / 1024 / 1024).toFixed(1)
        },
        podsUsedGauge: {
          type:    'Pods',
          unit:    '',
          percent: clusterPodsUsedRate,
          total:   clusterPods,
          usage:   clusterUsedPods
        },
      };

      this.drawHexbin(hexbinData);
      this.drawGauge(echartInfo);
    },
    updateDeviceInfo() {
      const { devices } = this;
      const total = devices.length;
      let online = 0;
      let offline = 0;

      devices.forEach((device, index) => {
        for (let i = 0; i < device?.status?.conditions?.length; i++) {
          const condition = device.status.conditions[i];

          if (condition.status && condition.status === 'Unknown') {
            offline++;

            return;
          } else if (condition.status === 'False') {
            offline++;

            return;
          }
        }
        online++;
      });

      this.iotInfo = {
        total, online, offline
      };
      this.drawRightGauge();
    },
    editSetting() {
      this.flag = false;
      this.$nextTick(() => {
        if (this.$refs.nameInput) {
          this.$refs.nameInput.focus();
        }
      });
    },
    async input(v) {
      this.flag = true;
      const data = this.allSetting.filter( (S) => {
        return S.id === 'location';
      })[0];

      data.value = this.clusterName.trim();

      await this.$store.dispatch('management/request', {
        method:  'PUT',
        headers: {
          'content-type': 'application/json',
          accept:         'application/json',
        },
        url: `v1/edgeapi.cattle.io.settings/location`,
        data,
      });
    }
  },

};
</script>

<template>
  <div class="dashboard-wrapper">
    <client-only>
      <h3 class="header-border">
        <i class="position icon iconfont icon-local"></i>
        <div v-if="flag" class="name" :class="{'isEmpty': !clusterName.length }" @click="editSetting">
          {{ clusterName ? clusterName : '添加集群位置' }}
        </div>
        <input
          v-else
          ref="nameInput"
          v-model="clusterName"
          class="nameInput"
          maxlength="60"
          @blur="input"
        >
      </h3>
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
                <div ref="cpuUsedGauge" class="pie-container">
                </div>
              </div>
              <div class="item">
                <h4>每个节点内存使用率</h4>
                <div class="hexbin-container">
                  <svg ref="memoryUsageHexbin"></svg>
                </div>
                <h4>集群整体内存使用率</h4>
                <div ref="memoryUsedGauge" class="pie-container">
                </div>
              </div>
              <div class="item">
                <h4>每个节点Pod使用率</h4>
                <div class="hexbin-container">
                  <svg ref="podsUsageHexbin"></svg>
                </div>
                <h4>集群整体Pod数量</h4>
                <div ref="podsUsedGauge" class="pie-container">
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
          <DashboardEvents
            :events="events"
            :max="100"
          />
        </div>
        <div class="content-side">
          <div class="iot">
            <h3 class="module-title">
              <i class="icon iconfont icon-iot-management"></i>
              IoT设备
            </h3>
            <div class="pie">
              <div class="item">
                <div ref="rightGaugeLeft" class="item-content"></div>
              </div>
            </div>
            <div class="count">
              <div class="count-num count-num-border prompt-light-font">
                {{ iotInfo.online }}
              </div>
              <div class="count-num prompt-light-font">
                {{ iotInfo.offline }}
              </div>
              <div class="count-title">
                <i class="icon icon-dot online" />
                在线数量(个)
              </div>
              <div class="count-title">
                <i class="icon icon-dot offline" />
                离线数量(个)
              </div>
            </div>
          </div>
          <DashboardWorkload />
        </div>
      </div>
      <div ref="tooltip" class="dashboard-tooltip"></div>
      <svg class="liner">
        <defs>
          <linearGradient id="liner-deep" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3fa1ff" />
            <stop offset="100%" stop-color="#2d2894" />
          </linearGradient>
          <linearGradient id="liner-middle" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#56a7f2" />
            <stop offset="100%" stop-color="#7b9dfc" />
          </linearGradient>
          <linearGradient id="liner-shallow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#bde7fe" />
            <stop offset="100%" stop-color="#c7cdfa" />
          </linearGradient>
          <filter id="blurFilter" x="0" y="0">
            <feOffset result="offOut" in="SourceAlpha" dx="0" dy="1" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
      </svg>
    </client-only>
  </div>
</template>

<style lang="scss">
  .dashboard-wrapper {
    padding: 0 !important;
    background-color: #f6f7fb;
    min-width: 1440px;

    .nameInput {
      width: 800px;
    }

    .header-border {
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #ddd;
      border-top: 1px solid #dcdcdc;
      background-color: var(--body-bg);
      padding-left: 30px;
      .name {
        cursor: pointer;
        margin-left: 10px;
        font-size: 16px;
        font-weight: bold;
        color: var(--action-text);
      }

      .isEmpty {
        font-weight: normal;
        font-style: italic;
      }
      .time {
        font-size: 14px;
        font-weight: normal;
      }
      .position {
        font-size: 20px;
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
    }
    .content {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 10px;
      .content-main {
        min-height: 800px;
        width: 71%;
        display: grid;
        grid-template-rows: repeat(3, auto);
        .service {
          .icon {
            font-size: 25px;
          }
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
            }
            path {
              transition: all .3s ease-in-out;
              opacity: .8;
            }
            path:hover {
              transition: all .3s ease-in-out;
              opacity: 1;
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
          display: grid;
          padding: 21px 0 0;
          grid-template-columns: 50% 50%;
          div {
            box-sizing: border-box;
            width: 100%;
            text-align: center;
            &.count-num {
              font-size: 28px;
            }
            &.count-num-border {
              border-right: 1px solid #ddd;
            }
            &.count-title {
              font-size: 16px;
            }
            .icon {
              font-size: 16px;
              &.online {
                color: #a0a2f4;
              }
              &.offline {
                color: #fac40f;
              }
            }
          }
          div:last-child {
            list-style: none;
            border-right: none;
            padding-right: 0;
          }
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
