using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "${{values.name}}",
        Version = "v1",
        Description = "${{values.description}}"
    });
});

// Add health checks
builder.Services.AddHealthChecks();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BACKSTAGE_ENTITY_NAME v1");
        c.RoutePrefix = "docs";
    });
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Map health checks
app.MapHealthChecks("/health");

// Root endpoint
app.MapGet("/", () => new
{
    Service = "BACKSTAGE_ENTITY_NAME",
    Message = "Welcome to BACKSTAGE_ENTITY_NAME API",
    Docs = "/docs",
    Health = "/health"
});

app.Run();

// Make the implicit Program class public so test projects can access it
public partial class Program { }
