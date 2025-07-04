using DataBase.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace back_end.Controllers.Task
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TaskController(TempdbContext context) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            if (id.Equals("all", StringComparison.CurrentCultureIgnoreCase))
            {
                return Ok(await context.Tasks.ToListAsync());
            }

            if (int.TryParse(id, out int taskId))
            {
                var task = await context.Tasks.FindAsync(taskId);
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
            //if (newTask == null || string.IsNullOrWhiteSpace(newTask.Title))
            //    return BadRequest("任務名稱不可為空");
            newTask.Id = Guid.NewGuid();
            context.Tasks.Add(newTask);
            await context.SaveChangesAsync();
            return Ok();
        }

        // 修改任務
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] DataBase.Models.Task updatedTask)
        {
            if (id != updatedTask.Id)
            {
                return BadRequest();
            }

            context.Entry(updatedTask).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!context.Tasks.Any(e => e.Id == id))
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
            var task = await context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            context.Tasks.Remove(task);
            await context.SaveChangesAsync();

            return NoContent();
        }

        
    }
}
