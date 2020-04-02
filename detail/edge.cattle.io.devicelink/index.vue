<script>
/* eslint-disable */
import omit from 'lodash/omit';
import  _ from 'lodash'
import { get } from '@/utils/object';

import createEditView from '@/mixins/create-edit-view';
import { DESCRIPTION } from '@/config/labels-annotations';

export default {
  mixins:     [createEditView],
  data() {
    return { };
  },
  computed: {
    
  },
  watch: {
  }
};
</script>

<template>
  <div>
    <form>
      <div class="row">
        <div class="col span-6">
          <div class="title">Metadata</div>
          <div class="ltr">
            <div class="ltr span-6">
              <div class="label">名称</div>
              <div class="value">{{this.value.metadata.name}}</div>
            </div>
            <div class="ltr span-6">
              <div class="label">命名空间</div>
              <div class="value">{{this.value.metadata.namespace}}</div>
            </div>
            <div class="ltr span-6">
              <div class="label">创建时间</div>
              <div class="value">{{this.value.metadata.creationTimestamp}}</div>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="title">Model</div>
          <div class="ltr">
            <div class="ltr span-6">
              <div class="label">apiVersion</div>
              <div class="value">{{this.value.spec.model.apiVersion}}</div>
            </div>
            <div class="ltr span-6">
              <div class="label">kind</div>
              <div class="value">{{this.value.spec.model.kind}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col span-6">
          <div class="title">Adaptors</div>
          <div class="ltr">
            <div class="ltr span-6">
              <div class="label">name</div>
              <div class="value">{{this.value.status.adaptor.name}}</div>
            </div>
            <div class="ltr span-6">
              <div class="label">node</div>
              <div class="value">{{this.value.status.adaptor.node}}</div>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="title">status</div>
          <div class="ltr">
            <div class="ltr span-6" v-for="item  in this.value.status.conditions" :key="item.type">
              <div class="label">{{ item.type }}</div>
              <div class="value">{{ item.status }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col span-6">
          <div class="title">template</div>
          <div class="ltr">
            <div class="ltr span-6">
              <div class="label">设备名称</div>
              <div class="value">{{this.value.spec.template.metadata.labels && this.value.spec.template.metadata.labels.device}}</div>
            </div>
            <template v-if="this.value.spec.model.kind === 'BluetoothDevice'">
              <div class="ltr span-6">
                <div class="label">Name</div>
                <div class="value">{{this.value.spec.template.spec.name}}</div>
              </div>
              <template v-if="this.value.spec.template.spec.properties.length">
                <div class="ltr span-12">
                  <div class="value properties">属性:{{this.value.spec.template.spec.properties[0].name}}</div>
                </div>
                <div class="ltr span-6">
                  <div class="label">Description</div>
                  <div class="value">{{this.value.spec.template.spec.properties[0].description}}</div>
                </div>
                <div class="ltr span-6">
                  <div class="label">name</div>
                  <div class="value">{{this.value.spec.template.spec.properties[0].name}}</div>
                </div>
                <div class="ltr span-6">
                  <div class="label">characteristicUUID</div>
                  <div class="value">{{this.value.spec.template.spec.properties[0].visitor.characteristicUUID}}</div>
                </div>
                <div class="ltr span-6">
                  <div class="label">operationType</div>
                  <div class="value">
                    {{this.value.spec.template.spec.properties[0].visitor.dataConverter && this.value.spec.template.spec.properties[0].visitor.dataConverter.orderOfOperations[0].operationType}}
                  </div>
                </div>
                <div class="ltr span-6">
                  <div class="label">operationValue</div>
                  <div class="value">
                    {{this.value.spec.template.spec.properties[0].visitor.dataConverter && this.value.spec.template.spec.properties[0].visitor.dataConverter.orderOfOperations[0].operationValue}}
                  </div>
                </div>
                <div class="ltr span-6">
                  <div class="label">operationValue</div>
                  <div class="value">
                    {{this.value.spec.template.spec.properties[0].visitor.dataConverter && this.value.spec.template.spec.properties[0].visitor.dataConverter.orderOfOperations[0].operationValue}}
                  </div>
                </div>
                <div class="ltr span-12">
                  <div class="value properties">属性:{{this.value.spec.template.spec.properties[0].name}}</div>
                </div>
                <div class="ltr span-6">
                  <div class="label">Description</div>
                  <div class="value">{{this.value.spec.template.spec.properties[0].description}}</div>
                </div>
                <div class="ltr span-6">
                  <div class="label">name</div>
                  <div class="value">{{this.value.spec.template.spec.properties[0].name}}</div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #373d41;
  height: 32px;
}
.properties {
  font-weight: bold;
  font-size: 16px;
}

.ltr {
  display: flex;
  flex-wrap: wrap;

  .label {
    width: 140px;
    background-color: #fbfbfc;
    border-right: 1px solid #ecedee;
    border-left: 1px solid #ecedee;
    color: #73777a;
    padding: 14px 12px;
    position: relative;
    line-height: 20px;
    word-break: break-word;
    hyphens: auto;
    display: flex;
    align-items: center;
  }

  .value {
    color: #373d41;
    position: relative;
    padding: 14px 12px;
    flex: 1;
    line-height: 20px;
    word-break: break-word;
    hyphens: auto;
    display: flex;
    align-items: center;
  }
}
</style>