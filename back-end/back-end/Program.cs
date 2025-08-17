using back_end.Infrastructure.Filters;
using DataBase.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;

namespace back_end;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.AddServiceDefaults();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("TaskManager", policy =>
            {
                policy.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            });
        });

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();
        builder.Services.AddDbContext<TempdbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Register local llama client (legacy)
        builder.Services.AddLocalLlama(builder.Configuration);
        // Register Semantic Kernel + LLamaSharpConnector
        builder.Services.AddLlamaSharpConnector(builder.Configuration);

        var app = builder.Build();

        app.MapDefaultEndpoints();

        app.UseMiddleware<Middleware.HttpResponseWrapperMiddleware>();

        
        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseCors("TaskManager");

        app.UseAuthorization();


        app.MapControllers();

        app.Run();
    }
}
