export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export enum TodoFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
