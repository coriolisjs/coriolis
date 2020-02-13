import { get } from '../lib/object/get'

import { currentStoreId } from './currentStoreId'
import { storeList } from './storeList'

export const currentStoreSnapshot = ({ useProjection }) => (
  useProjection(currentStoreId),
  useProjection(storeList),
  (storeId, storeList) =>
    get(
      storeList.find(storeData => storeData.storeId === storeId),
      'snapshot$',
    )
)
