using DataBase.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back_end.Model;
namespace back_end.Controllers.Task
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly TempdbContext _context;

        public TaskController(TempdbContext context)
        {
            _context = context;
        }

        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            if (id.ToLower() == "all")
            {
                return Ok(await _context.Tasks.ToListAsync());
            }

            if (int.TryParse(id, out int taskId))
            {
                var task = await _context.Tasks.FindAsync(taskId);
                if (task == null)
                {
                    return NotFound();
                }
                return Ok(task);
            }

            return BadRequest("Invalid ID format");
        }

        // 新增任務
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DataBase.Models.Task newTask)
        {
            if (newTask == null || string.IsNullOrWhiteSpace(newTask.Title))
                return BadRequest("任務名稱不可為空");

            _context.Tasks.Add(newTask);
            await _context.SaveChangesAsync();
            HttpActionResponse httpActionResponse = new HttpActionResponse
            {
                Success = true,
                Message = "任務新增成功",
                Data = null
            };
            return Ok(httpActionResponse);
        }

        // 修改任務
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DataBase.Models.Task updatedTask)
        {
            if (id != updatedTask.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tasks.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 刪除任務
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("Seed")]
        public async Task<IActionResult> SeedData()
        {
            var existingTasks = await _context.Tasks.ToListAsync();
            var maxId = existingTasks.Any() ? existingTasks.Max(t => t.Id) : 0;

            var newTasks = new List<DataBase.Models.Task>
            {
                new DataBase.Models.Task
                {
                    Id = maxId + 1,
                    Title = "學習 Gemini API",
                    Description = "閱讀官方文件並嘗試使用 Gemini API。",
                    Priority = "高",
                    Status = "進行中",
                    DueDate = new DateOnly(2025, 7, 10),
                    Tags = "學習,API"
                },
                new DataBase.Models.Task
                {
                    Id = maxId + 2,
                    Title = "完成專案報告",
                    Description = "撰寫並提交關於本季專案的最終報告。",
                    Priority = "高",
                    Status = "待辦",
                    DueDate = new DateOnly(2025, 7, 15),
                    Tags = "工作,報告"
                },
                new DataBase.Models.Task
                {
                    Id = maxId + 3,
                    Title = "運動",
                    Description = "去健身房運動一小時。",
                    Priority = "中",
                    Status = "待辦",
                    DueDate = new DateOnly(2025, 7, 4),
                    Tags = "健康"
                }
            };

            _context.Tasks.AddRange(newTasks);
            await _context.SaveChangesAsync();

            return Ok("成功新增三筆範例資料。");
        }
    }
}
