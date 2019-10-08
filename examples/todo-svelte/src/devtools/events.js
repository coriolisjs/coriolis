import { createEventBuilder } from 'coriolis'

export const viewChanged = createEventBuilder('Current Coriolis devtools view changed', viewname => viewname)
