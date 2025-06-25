import { useGlobalConfig } from './globalConfig'
import { useLog } from './log'
import { usePersonConfig } from './personConfig'
import { usePrizeConfig } from './prizeConfig'
import { useSystem } from './system'

export default function useStore() {
  return {
    personConfig: usePersonConfig(),
    prizeConfig: usePrizeConfig(),
    globalConfig: useGlobalConfig(),
    system: useSystem(),
    log: useLog(),
  }
}
