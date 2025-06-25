import dayjs from 'dayjs'
// 筛选人员数据
export function filterData(tableData: any[], localRowCount: number) {
  const dataLength = tableData.length
  let j = 0
  for (let i = 0; i < dataLength; i++) {
    if (i % localRowCount === 0) {
      j++
    }
    tableData[i].x = i % localRowCount + 1
    tableData[i].y = j
    // tableData[i].id = i
    // 是否中奖
  }

  return tableData
}

export function addOtherInfo(personList: any[], prize: any, startId: number = 0) {
  const len = personList.length
  for (let i = 0; i < len; i++) {
    personList[i].id = startId + i
    personList[i].createTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    personList[i].updateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    personList[i].prizeName = [] as string[]
    personList[i].prizeTime = [] as string[]
    personList[i].prizeId = []
    personList[i].isWin = false
    personList[i].voteCount = personList[i].count
    delete personList[i].count
    if (prize) {
      personList[i].prizeGroupId = prize.id
      personList[i].prizeGroupName = prize.name
    }
  }

  return personList
}

export function selectCard(cardIndexArr: number[], tableData: any[], personId: number): number {
  const cardIndex = tableData.findIndex(item => item.id === personId)
  if (cardIndex >= 0) {
    return cardIndex
  }

  return selectRandomCard(cardIndexArr, tableData.length)
}

export function selectRandomCard(cardIndexArr: number[], tableLength: number): number {
  const cardIndex = Math.round(Math.random() * (tableLength - 1))
  if (cardIndexArr.includes(cardIndex)) {
    return selectRandomCard(cardIndexArr, tableLength)
  }

  return cardIndex
}

export function themeChange(theme: string) {
  // 获取根html
  const html = document.querySelectorAll('html')
  if (html) {
    html[0].setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }
}

// 手机号脱敏处理函数
export function phoneHide(phone: string): string {
  if (!phone) {
    return ''
  }

  const reg = /^(1\d\d)\d*(\d{4})$/ // 定义手机号正则表达式
  phone = phone.replace(reg, '$1****$2') // 替换中间四位为星号
  return phone // 返回脱敏后的手机号
}
export function phoneFormatHide(str: string): string {
  if (!str) {
    return ''
  }

  const reg = /^(.{3}).*(.{4})$/
  return str.replace(reg, '$1****$2') // 替换中间四位为星号
}

export function secureRandom(): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] / (0xFFFFFFFF + 1)
}
