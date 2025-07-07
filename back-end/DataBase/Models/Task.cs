using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.InteropServices;

namespace DataBase.Models;

public class Task
{
    [Required]
    public Guid Id { get; set; } 
    [Required]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? Priority { get; set; }

    public string? Status { get; set; }

    public DateOnly? DueDate { get; set; }

    public string? Tags { get; set; }
}
