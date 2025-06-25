<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { addOtherInfo } from '@/utils'

const router = useRouter()
const { t } = useI18n()
const personConfig = useStore().personConfig
const prizeConfig = useStore().prizeConfig
const { getAllPersonList: allPersonList } = storeToRefs(personConfig)
const { getPrizeConfig: localPrizeList } = storeToRefs(prizeConfig)

const prizeList = ref<IPrizeConfig[]>([])
const curImportIdxForPrize = ref(-1)
const allDone = ref(false)

async function importPersonData() {
  prizeList.value = localPrizeList.value
  if (allPersonList.value.length > 0) {
    for (let i = 0; i < prizeList.value.length; i++) {
      const prize = prizeList.value[i]
      prize.personCount = allPersonList.value.filter(item => item.prizeGroupId === prize.id).length
      prize.votedCount = allPersonList.value.filter(item => item.prizeGroupId === prize.id).reduce((sum, item) => sum + (item.voteCount || 0), 0)
    }

    allDone.value = true
    return
  }
  for (let i = 0; i < prizeList.value.length; i++) {
    curImportIdxForPrize.value = i
    await new Promise(resolve => setTimeout(resolve, 1000))

    const prize = prizeList.value[i]
    const response = await axios.get(`/log-lottery/人员登记表-${prize.name}.xlsx`, { responseType: 'arraybuffer' })
    const data = new Uint8Array(response.data)
    const workBook = XLSX.read(data, { type: 'array', cellDates: true })
    const workSheet = workBook.Sheets[workBook.SheetNames[0]]
    const excelData = XLSX.utils.sheet_to_json(workSheet)
    const startId = (allPersonList.value.length > 0 ? Math.max(...allPersonList.value.map(item => item.id)) : 0) + 1
    const allData = addOtherInfo(excelData, prize, startId)
    personConfig.addNotPersonList(allData)

    prize.personCount = allData.length
    prize.votedCount = allData.reduce((sum, item) => sum + (item.voteCount || 0), 0)
    if (i === prizeList.value.length - 1) {
      allDone.value = true
    }
  }
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
  {
    label: i18n.global.t('data.voteCount'),
    props: 'voteCount',
  },
  {
    label: i18n.global.t('data.prizeGroup'),
    props: 'prizeGroupName',
  },
]
onMounted(() => {
  importPersonData()
})
</script>

<template>
  <div class="p-10">
    <div class="flex flex-row items-center">
      <h2>{{ allDone ? '导入完成' : `导入中，正在导入：${prizeList[curImportIdxForPrize]?.name || '_'}` }}</h2>
      <button v-if="allDone" class="btn btn-primary btn-md ml-5" @click="router.back()">开始抽奖</button>
    </div>

    <div class="flex flex-row gap-2">
      <p>汇总：</p>
      <p v-for="(prize, index) in prizeList" :key="index" class="pr-5">{{ prize.name }}: {{ prize.personCount || '_' }} 人, {{ prize.votedCount || '_' }} 票</p>
    </div>
    <DaiysuiTable :table-columns="tableColumns" :data="allPersonList" />
  </div>
</template>

<style lang='scss' scoped>

</style>
