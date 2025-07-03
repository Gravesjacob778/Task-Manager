export interface IService{
  obtain(id: string): Promise<any>;
  create(task: any): Promise<any>;
  update(id: string, task: any): Promise<any>;
  delete(id: string): Promise<any>;
}