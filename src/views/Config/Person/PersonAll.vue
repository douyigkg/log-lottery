<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import type {IPersonConfig, IPrizeConfig} from '@/types/storeType'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { addOtherInfo } from '@/utils'
import { readFileBinary } from '@/utils/file'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'

const { t } = useI18n()
const personConfig = useStore().personConfig
const prizeConfig = useStore().prizeConfig
const { getAllPersonList: allPersonList, getAlreadyPersonList: alreadyPersonList } = storeToRefs(personConfig)
const { getPrizeConfig: localPrizeList } = storeToRefs(prizeConfig)
const limitType = '.xlsx,.xls'
// const personList = ref<any[]>([])
const choosedPrizeGroup = ref<IPrizeConfig>()

const resetDataDialog = ref()
const delAllDataDialog = ref()
const importDataDialog = ref()

async function handleFileChange(e: Event) {
  const dataBinary = await readFileBinary(((e.target as HTMLInputElement).files as FileList)[0]!)
  const workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
  const workSheet = workBook.Sheets[workBook.SheetNames[0]]
  const excelData = XLSX.utils.sheet_to_json(workSheet)
  const startId = (allPersonList.value.length > 0 ? Math.max(...allPersonList.value.map(item => item.id)) : 0) + 1
  const allData = addOtherInfo(excelData, choosedPrizeGroup.value, startId)
  // personConfig.resetPerson()
  personConfig.addNotPersonList(allData)

  choosedPrizeGroup.value!.personCount += allData.length
  choosedPrizeGroup.value!.votedCount += allData.reduce((sum, item) => sum + (item.voteCount || 0), 0)
}
function exportData() {
  let data = JSON.parse(JSON.stringify(allPersonList.value))
  // 排除一些字段
  for (let i = 0; i < data.length; i++) {
    delete data[i].x
    delete data[i].y
    delete data[i].id
    delete data[i].createTime
    delete data[i].updateTime
    delete data[i].prizeId
    delete data[i].prizeGroupId
    // 修改字段名称
    if (data[i].isWin) {
      data[i].isWin = i18n.global.t('data.yes')
    }
    else {
      data[i].isWin = i18n.global.t('data.no')
    }
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
    .replaceAll(/prizeGroupName/g, i18n.global.t('data.prizeGroup'))

  data = JSON.parse(dataString)

  if (data.length > 0) {
    const dataBinary = XLSX.utils.json_to_sheet(data)
    const dataBinaryBinary = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(dataBinaryBinary, dataBinary, 'Sheet1')
    XLSX.writeFile(dataBinaryBinary, 'data.xlsx')
  }
}

function resetData() {
  personConfig.resetAlreadyPerson()
}

function deleteAll() {
  personConfig.deleteAllPerson()
}

function delPersonItem(row: IPersonConfig) {
  personConfig.deletePerson(row)
}

function choosePrizeGroup(row: IPrizeConfig) {
  choosedPrizeGroup.value = row
}

const tableColumns = [
  {
    label: i18n.global.t('data.number'),
    props: 'uid',
  },
  {
    label: i18n.global.t('data.name'),
    props: 'name',
  },
  {
    label: i18n.global.t('data.contact'),
    props: 'contact',
  },
  // {
  //   label: i18n.global.t('data.department'),
  //   props: 'department',
  // },
  // {
  //   label: i18n.global.t('data.avatar'),
  //   props: 'avatar',
  //   formatValue(row: any) {
  //     return row.avatar ? `<img src="${row.avatar}" alt="avatar" style="width: 50px; height: 50px;"/>` : '-'
  //   },
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
    label: i18n.global.t('data.prizeGroup'),
    props: 'prizeGroupName',
  },
  {
    label: i18n.global.t('data.isWin'),
    props: 'isWin',
    formatValue(row: IPersonConfig) {
      return row.isWin ? i18n.global.t('data.yes') : i18n.global.t('data.no')
    },
  },
  // {
  //   label: i18n.global.t('data.operation'),
  //   actions: [
  //     // {
  //     //     label: '编辑',
  //     //     type: 'btn-info',
  //     //     onClick: (row: any) => {
  //     //         delPersonItem(row)
  //     //     }
  //     // },
  //     {
  //       label: i18n.global.t('data.delete'),
  //       type: 'btn-error',
  //       onClick: (row: IPersonConfig) => {
  //         delPersonItem(row)
  //       },
  //     },
  //
  //   ],
  // },
]
onMounted(() => {
})
</script>

<template>
  <dialog id="my_modal_1" ref="resetDataDialog" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTip') }}
      </h3>
      <p class="py-4">
        {{ t('dialog.dialogResetWinner') }}
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="resetDataDialog.close()">
            {{ t('button.cancel') }}
          </button>
          <button class="btn" @click="resetData">
            {{ t('button.confirm') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="my_modal_1" ref="delAllDataDialog" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTip') }}
      </h3>
      <p class="py-4">
        {{ t('dialog.dialogDelAllPerson') }}
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="delAllDataDialog.close()">
            {{ t('button.cancel') }}
          </button>
          <button class="btn" @click="deleteAll">
            {{ t('button.confirm') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="my_modal_1" ref="importDataDialog" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTip') }}
      </h3>
      <p class="py-4">
        {{ t('dialog.dialogImportData') }}
      </p>
      <div class="flex w-full gap-3">
        <button v-for="item in localPrizeList" :key="item.id" class="btn btn-sm" :class="choosedPrizeGroup?.id === item.id ? 'btn-primary' : 'btn-outline'" @click="choosePrizeGroup(item)">{{ item.name }}</button>
      </div>
      <div v-show="choosedPrizeGroup" class="py-4">
        <label for="explore">
          <div class="tooltip tooltip-bottom" :data-tip="t('tooltip.uploadExcelTip')">
            <input id="explore" type="file" class="" style="display: none" :accept="limitType" @change="handleFileChange">
            <span class="w-32 btn btn-primary">{{ t('button.upload') }}</span>
          </div>
        </label>
      </div>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="importDataDialog.close()">
            {{ t('button.close') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <div class="min-w-1000px">
    <h2>{{ t('viewTitle.personManagement') }}</h2>
    <div class="flex gap-3">
      <button class="btn btn-error btn-sm" @click="delAllDataDialog.showModal()">
        {{ t('button.allDelete') }}
      </button>
      <div class="tooltip tooltip-bottom" :data-tip="t('tooltip.downloadTemplateTip')">
        <a
          class="no-underline btn btn-secondary btn-sm" :download="t('data.xlsxName')" target="_blank"
          :href="`/log-lottery/${t('data.xlsxName')}`"
        >{{ t('button.downloadTemplate') }}</a>
      </div>
      <button class="btn btn-primary btn-sm" @click="importDataDialog.showModal()">
        {{ t('button.importData') }}
      </button>
      <!-- <div class="">
        <label for="explore">

          <div class="tooltip tooltip-bottom" :data-tip="t('tooltip.uploadExcelTip')">
            <input
              id="explore" type="file" class="" style="display: none" :accept="limitType"
              @change="handleFileChange"
            >

            <span class="btn btn-primary btn-sm">{{ t('button.importData') }}</span>
          </div>
        </label>
      </div> -->
      <button class="btn btn-error btn-sm" @click="resetDataDialog.showModal()">
        {{ t('button.resetData') }}
      </button>
      <button class="btn btn-accent btn-sm" @click="exportData">
        {{ t('button.exportResult') }}
      </button>
      <div>
        <span>{{ t('table.luckyPeopleNumber') }}:</span>
        <span>{{ alreadyPersonList.length }}</span>
        <span>&nbsp;/&nbsp;</span>
        <span>{{ allPersonList.length }}</span>
      </div>
    </div>
    <DaiysuiTable :table-columns="tableColumns" :data="allPersonList" />
  </div>
</template>

<style lang='scss' scoped></style>
