import { IMediaCreated } from 'interfaces/entities/media'
import {
  ITraining,
  ITrainingCreated,
  ITrainingModifier
} from 'interfaces/entities/training'

export interface newTrainingDto extends ITraining {
  mediaIds?: string[]
}

export interface createdTrainingDto extends ITrainingCreated {
  medias: IMediaCreated[]
}

export interface modifierTrainingDto extends ITrainingModifier {
  mediaIds?: string[]
}
