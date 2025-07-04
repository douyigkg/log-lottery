<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import type { IPersonConfig } from '@/types/storeType'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import i18n from '@/locales/i18n'
import { phoneFormatHide } from '@/utils'
import { readFileBinary } from '@/utils/file'

const { t } = useI18n()
const limitType = '.xlsx,.xls'
const personIdInfoMap = new Map()

const allPersonList = ref<IPersonConfig[]>([])
const delAllDataDialog = ref()

async function handleFileChange(e: Event) {
  const dataBinary = await readFileBinary(((e.target as HTMLInputElement).files as FileList)[0]!)
  const workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
  const workSheet = workBook.Sheets[workBook.SheetNames[0]]
  const excelData = XLSX.utils.sheet_to_json(workSheet)
  excelData.forEach((item: any) => {
    item.contact = item.phone || item.orderNo
    item.contactDesensitized = phoneFormatHide(item.contact)
    item.voteCount = item.count

    if (item.phone) {
      delete item.orderNo
    }
  })

  deleteAll()
  if (excelData.length <= 0) {
    return
  }

  excelData.forEach((item: any) => {
    const existPerson = allPersonList.value.find((person: IPersonConfig) => item.phone && person.phone === item.phone)
    if (existPerson) {
      existPerson.voteCount = existPerson.voteCount + item.voteCount
    }
    else {
      allPersonList.value.push(item)
    }
  })
  allPersonList.value.sort((a: IPersonConfig, b: IPersonConfig) => {
    return b.voteCount - a.voteCount
  }).forEach((item: IPersonConfig, index) => {
    item.id = index
    if (personIdInfoMap.has(item.contact)) {
      item.uid = personIdInfoMap.get(item.contact)
    }
    else {
      const id = personIdInfoMap.size + 1
      item.uid = `U202503${id.toString().padStart(7, '0')}`
      personIdInfoMap.set(item.contact, item.uid)
    }
  })
}
function exportData() {
  let data = JSON.parse(JSON.stringify(allPersonList.value))
  // 排除一些字段
  for (let i = 0; i < data.length; i++) {
    delete data[i].id
    delete data[i].contact
    delete data[i].count
  }
  let dataString = JSON.stringify(data)
  dataString = dataString
    .replaceAll(/uid/g, i18n.global.t('data.number'))
    .replaceAll(/contactDesensitized/g, i18n.global.t('data.contact'))
    .replaceAll(/phone/g, i18n.global.t('data.phone'))
    .replaceAll(/orderNo/g, i18n.global.t('data.orderNo'))
    .replaceAll(/name/g, i18n.global.t('data.name'))
    .replaceAll(/voteCount/g, i18n.global.t('data.voteCount'))

  data = JSON.parse(dataString)

  if (data.length > 0) {
    const dataBinary = XLSX.utils.json_to_sheet(data)
    const dataBinaryBinary = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(dataBinaryBinary, dataBinary, 'Sheet1')
    XLSX.writeFile(dataBinaryBinary, 'result_data.xlsx')
  }
}

function deleteAll() {
  allPersonList.value = []
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
    label: i18n.global.t('data.phone'),
    props: 'phone',
  },
  {
    label: i18n.global.t('data.orderNo'),
    props: 'orderNo',
  },
  {
    label: i18n.global.t('data.contact'),
    props: 'contactDesensitized',
  },
  {
    label: i18n.global.t('data.voteCount'),
    props: 'voteCount',
  },
]
onMounted(() => {
})
</script>

<template>
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
  <div class="min-w-1000px">
    <h2>{{ t('viewTitle.personManagement') }}</h2>
    <div class="flex gap-3">
      <div class="">
        <label for="explore">

          <div class="tooltip tooltip-bottom" :data-tip="t('tooltip.uploadExcelTip')">
            <input
              id="explore" type="file" class="" style="display: none" :accept="limitType"
              @change="handleFileChange"
            >

            <span class="btn btn-primary btn-sm">{{ t('button.importData') }}</span>
          </div>
        </label>
      </div>
      <button class="btn btn-accent btn-sm" @click="exportData">
        {{ t('button.exportResult') }}
      </button>
      <div>
        <span>总人数:</span>
        <span>{{ allPersonList.length }}</span>
      </div>
      <div>
        <span>总票数:</span>
        <span>{{ allPersonList.reduce((sum, item) => sum + (item.voteCount || 0), 0) }}</span>
      </div>
    </div>
    <DaiysuiTable :table-columns="tableColumns" :data="allPersonList" />
  </div>
</template>

<style lang='scss' scoped></style>
