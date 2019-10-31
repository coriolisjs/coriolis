import { currentStoreId } from './currentStoreId'
import { storeList } from './storeList'
import { get } from '../lib/object/get'

export const currentStoreSnapshot = ({ useAggr }) => (
  useAggr(currentStoreId),
  useAggr(storeList),
  (storeId, storeList) =>
    get(storeList.find(storeData => storeData.storeId === storeId), 'snapshot$')
)
