export interface IUserTrainingModifier {
  status: StatusType
}

enum StatusType {
  started = 'started',
  finished = 'finished'
}
