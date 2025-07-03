using System;
using System.Collections.Generic;

namespace DataBase.Models;

public partial class Task
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? Priority { get; set; }

    public string? Status { get; set; }

    public DateOnly? DueDate { get; set; }

    public string? Tags { get; set; }
}
