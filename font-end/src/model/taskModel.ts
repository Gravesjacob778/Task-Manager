export type Task = {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string; // DateOnly 建議對應為 string (格式如 "2025-06-04")
  tags?: string;
  tagsArray?: string[]; // 用於前端顯示的 tags 陣列
}