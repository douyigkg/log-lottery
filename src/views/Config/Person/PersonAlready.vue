<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import type { IPersonConfig } from '@/types/storeType'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from "xlsx"

const { t } = useI18n()
const personConfig = useStore().personConfig

const { getAlreadyPersonList: alreadyPersonList, getAlreadyPersonDetail: alreadyPersonDetail } = storeToRefs(personConfig)
// const personList = ref<any[]>(
//     alreadyPersonList
// )

// const deleteAll = () => {
//     personConfig.deleteAllPerson()
// }

const isDetail = ref(false)
function handleMoveNotPerson(row: IPersonConfig) {
  personConfig.moveAlreadyToNot(row)
}

function exportData() {
  let data = JSON.parse(JSON.stringify(alreadyPersonDetail.value))
  // 排除一些字段
  for (let i = 0; i < data.length; i++) {
    delete data[i].x
    delete data[i].y
    delete data[i].id
    delete data[i].createTime
    delete data[i].updateTime
    delete data[i].prizeId
    delete data[i].prizeGroupId
    delete data[i].prizeGroupName
    delete data[i].avatar
    delete data[i].isWin

    // 格式化数组为
    data[i].prizeTime = data[i].prizeTime.join(',')
    data[i].prizeName = data[i].prizeName.join(',')
  }
  let dataString = JSON.stringify(data)
  dataString = dataString
    .replaceAll(/uid/g, i18n.global.t('data.number'))
    .replaceAll(/contact/g, i18n.global.t('data.contact'))
    .replaceAll(/isWin/g, i18n.global.t('data.isWin'))
    .replaceAll(/department/g, i18n.global.t('data.department'))
    .replaceAll(/name/g, i18n.global.t('data.name'))
    .replaceAll(/identity/g, i18n.global.t('data.identity'))
    .replaceAll(/prizeName/g, i18n.global.t('data.prizeName'))
    .replaceAll(/prizeTime/g, i18n.global.t('data.prizeTime'))
    .replaceAll(/voteCount/g, i18n.global.t('data.voteCount'))

  data = JSON.parse(dataString)

  if (data.length > 0) {
    const dataBinary = XLSX.utils.json_to_sheet(data)
    const dataBinaryBinary = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(dataBinaryBinary, dataBinary, 'Sheet1')
    XLSX.writeFile(dataBinaryBinary, '获奖人员名单.xlsx')
  }
}

const tableColumnsList = [
  {
    label: i18n.global.t('data.number'),
    props: 'uid',
    sort: true,
  },
  {
    label: i18n.global.t('data.name'),
    props: 'name',
  },
  {
    label: i18n.global.t('data.contact'),
    props: 'contact',
    sort: true,
  },
  // {
  //   label: i18n.global.t('data.avatar'),
  //   props: 'avatar',
  //   formatValue(row: any) {
  //     return row.avatar ? `<img src="${row.avatar}" alt="avatar" style="width: 50px; height: 50px;"/>` : '-'
  //   },
  // },
  // {
  //   label: i18n.global.t('data.department'),
  //   props: 'department',
  // },
  // {
  //   label: i18n.global.t('data.identity'),
  //   props: 'identity',
  // },
  {
    label: i18n.global.t('data.voteCount'),
    props: 'voteCount',
  },
  {
    label: i18n.global.t('data.prizeName'),
    props: 'prizeName',
    sort: true,
  },
  {
    label: i18n.global.t('data.operation'),
    actions: [
      {
        label: i18n.global.t('data.removePerson'),
        type: 'btn-info',
        onClick: (row: IPersonConfig) => {
          handleMoveNotPerson(row)
        },
      },
    ],
  },
]
const tableColumnsDetail = [
  {
    label: i18n.global.t('data.number'),
    props: 'uid',
    sort: true,
  },
  {
    label: i18n.global.t('data.name'),
    props: 'name',
  },
  {
    label: i18n.global.t('data.contact'),
    props: 'contact',
    sort: true,
  },
  // {
  //   label: i18n.global.t('data.avatar'),
  //   props: 'avatar',
  //   formatValue(row: any) {
  //     return row.avatar ? `<img src="${row.avatar}" alt="avatar" style="width: 50px; height: 50px;"/>` : '-'
  //   },
  // },
  // {
  //   label: i18n.global.t('data.department'),
  //   props: 'department',
  // },
  // {
  //   label: i18n.global.t('data.identity'),
  //   props: 'identity',
  // },
  {
    label: i18n.global.t('data.prizeName'),
    props: 'prizeName',
    sort: true,
  },
  {
    label: i18n.global.t('data.prizeTime'),
    props: 'prizeTime',

  },
  {
    label: i18n.global.t('data.operation'),
    actions: [
      {
        label: i18n.global.t('data.removePerson'),
        type: 'btn-info',
        onClick: (row: IPersonConfig) => {
          handleMoveNotPerson(row)
        },
      },

    ],
  },
]
</script>

<template>
  <div class="overflow-y-auto">
    <h2>{{ t('viewTitle.winnerManagement') }}</h2>
    <div class="flex items-center justify-start gap-10">
      <button class="btn btn-accent btn-sm" @click="exportData">
        {{ t('button.exportResult') }}
      </button>
      <div>
        <span>{{ t('table.luckyPeopleNumber') }}：</span>
        <span>{{ alreadyPersonList.length }}</span>
      </div>
      <div class="flex flex-col">
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">{{ t('table.detail') }}:</span>
            <input v-model="isDetail" type="checkbox" class="border-solid toggle toggle-primary border-1">
          </label>
        </div>
      </div>
    </div>
    <DaiysuiTable v-if="!isDetail" :table-columns="tableColumnsList" :data="alreadyPersonList" />

    <DaiysuiTable v-if="isDetail" :table-columns="tableColumnsDetail" :data="alreadyPersonDetail" />
  </div>
</template>

<style lang='scss' scoped></style>
