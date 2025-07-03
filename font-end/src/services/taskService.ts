import { Task } from "@/model/taskModel";
import { BaseService } from "./baseService";
import { IService } from "./serviceInterface";
import { HttpActionResponse } from "@/model/httpActionResponse";
class TaskService extends BaseService implements IService  {
  private baseUrl: string;

  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }

  async obtain(id: string): Promise<Task[]> {
    const response: HttpActionResponse = await this.get(`${this.baseUrl}/Task/Get/${id}`);
    const d = (response.data as Task[]).map((item: Task) => {
      return {
        ...item,
        dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split("T")[0] : "",
        tagsArray: item.tags ? item.tags.split(",") : [],
      };
    });
    return d;
  }

  async create(task: Task): Promise<boolean> {
    const response: HttpActionResponse = await this.post(`${this.baseUrl}/Task/Create`, task);
    return response.success;
  }

  async update(id: string, task: any): Promise<any> {
    return this.put(`${this.baseUrl}/Task/Update/${id}`, task);
  }

  async delete(id: string): Promise<any> {
    return this.delete(`${this.baseUrl}/Task/Delete/${id}`);
  }
}

const taskService = new TaskService('http://localhost:5157/api');
export default taskService;