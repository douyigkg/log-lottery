export interface IPersonConfig {
    id: number;
    uid: string;
    name: string;
    department: string;
    identity: string;
    avatar: string;
    isWin: boolean;
    x: number;
    y: number
    createTime: string;
    updateTime: string;
    prizeName: string[];
    prizeId: string[];
    prizeTime: string[];
    prizeGroupId: string
    prizeGroupName: string
    voteCount: number
    phone: string
    orderNo: string
    contact: string
    contactDesensitized: string
}
export interface Separate {
  id: string
  count: number
  isUsedCount: number
}
export interface IPrizeConfig {
  id: number | string
  name: string
  sort: number
  isAll: boolean
  count: number
  isUsedCount: number
  picture: {
    id: string | number
    name: string
    url: string
  }
  separateCount: {
    enable: boolean
    countList: Separate[]
  }
  desc: string
  isShow: boolean
  isUsed: boolean
  frequency: number
  isRandomByVoteCount: boolean
  votedCount: number
  personCount: number
}
export interface IMusic {
  id: string
  name: string
  url: string
}

export interface IImage {
  id: string
  name: string
  url: string
}
