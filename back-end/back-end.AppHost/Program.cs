var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.back_end>("back-end");

builder.Build().Run();
