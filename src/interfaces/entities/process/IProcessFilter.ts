import { IProcessCreated } from './IProcessCreated'

export type IProcessFilter = Partial<
  Pick<IProcessCreated, 'status' | 'templateProcessId' | 'companyId' | 'userId'>
>
