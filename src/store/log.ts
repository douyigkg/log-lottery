import { defineStore } from 'pinia'

export const useLog = defineStore('log', {
  state() {
    return {
      logList: [] as any[],
    }
  },
  getters: {
    // 获取全部配置
    getLogAll(state) {
      return state.logList
    },
  },
  actions: {
    addLog(log: any) {
      this.logList.push(log)
    },
    // 删除全部奖项
    deleteAllLog() {
      this.logList = []
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 如果要存储在localStorage中
        storage: localStorage,
        key: 'log',
      },
    ],
  },
})
