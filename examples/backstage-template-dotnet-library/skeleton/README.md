# BACKSTAGE_ENTITY_NAME

BACKSTAGE_DESCRIPTION

## 📦 Installation

### From GitHub Packages (Private Registry)

#### 1️⃣ Configure NuGet source

Create a `nuget.config` file in your project root:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="github" value="https://nuget.pkg.github.com/BACKSTAGE_ORG_NAME/index.json" />
  </packageSources>
  <packageSourceCredentials>
    <github>
      <add key="Username" value="BACKSTAGE_ORG_NAME" />
      <add key="ClearTextPassword" value="%GITHUB_TOKEN%" />
    </github>
  </packageSourceCredentials>
</configuration>
```

#### 🔐 Authentication Options

| Entorno | Método recomendado |
|---------|-------------------|
| **GitHub Actions** | `GITHUB_TOKEN` (automático) |
| **Azure DevOps** | Service Connection o Variable Group |
| **Local (desarrollo)** | `gh auth token` o variable de entorno |

##### 🤖 En GitHub Actions

El `GITHUB_TOKEN` se inyecta automáticamente. Usa esto en tu workflow:

```yaml
- name: Restore dependencies
  run: dotnet restore
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

##### 💻 En desarrollo local

Opción A - Usando GitHub CLI:
```bash
# Autenticarse con GitHub CLI
gh auth login

# Configurar NuGet para usar el token
dotnet nuget update source github --username BACKSTAGE_ORG_NAME --password $(gh auth token) --store-password-in-clear-text
```

Opción B - Variable de entorno:
```bash
# Linux/macOS
export GITHUB_TOKEN="your_token_here"

# Windows PowerShell
$env:GITHUB_TOKEN = "your_token_here"
```

> 💡 **Tip**: Para tokens personales, créalos con permiso `read:packages` en [GitHub Settings](https://github.com/settings/tokens)

#### 2️⃣ Add the package

```bash
dotnet add package BACKSTAGE_ENTITY_NAME
```

### 🖥️ Package Manager Console

```powershell
Install-Package BACKSTAGE_ENTITY_NAME
```

## 🚀 Quick Start

```csharp
using BACKSTAGE_ENTITY_NAME;

// 📧 Validate email
var isValidEmail = Validator.IsValidEmail("user@example.com");
Console.WriteLine(isValidEmail); // Output: true

// 🌐 Validate URL
var isValidUrl = Validator.IsValidUrl("https://github.com");
Console.WriteLine(isValidUrl); // Output: true

// 💳 Validate credit card (Luhn algorithm)
var isValidCard = Validator.IsValidCreditCard("4532-0151-1283-0366");
Console.WriteLine(isValidCard); // Output: true

// 📱 Validate phone number
var isValidPhone = Validator.IsValidPhoneNumber("+1 (234) 567-8900");
Console.WriteLine(isValidPhone); // Output: true

// 🔢 Validate IPv4 address
var isValidIP = Validator.IsValidIPv4("192.168.1.1");
Console.WriteLine(isValidIP); // Output: true

// 📅 Validate date format
var isValidDate = Validator.IsValidDate("2024-01-15");
Console.WriteLine(isValidDate); // Output: true

// 🔐 Validate password strength
var passwordResult = Validator.ValidatePassword("SecureP@ss123");
Console.WriteLine(passwordResult.IsValid); // Output: true

// 📏 Validate range (works with any IComparable)
var isInRange = Validator.IsInRange(5, min: 1, max: 10);
Console.WriteLine(isInRange); // Output: true
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📧 **Email Validation** | RFC-compliant email format validation |
| 🌐 **URL Validation** | HTTP/HTTPS URL validation |
| 💳 **Credit Card Validation** | Luhn algorithm implementation |
| 📱 **Phone Validation** | International phone number formats |
| 🔢 **IPv4 Validation** | IP address format validation |
| 📅 **Date Validation** | Configurable date format validation |
| 🔐 **Password Validation** | Customizable password strength rules |
| 📏 **Range Validation** | Generic range validation for any `IComparable<T>` |

## 🔐 Password Validation Options

```csharp
var result = Validator.ValidatePassword(
    password: "mypassword",
    minLength: 8,              // Minimum 8 characters
    requireUppercase: true,    // At least one uppercase letter
    requireLowercase: true,    // At least one lowercase letter
    requireDigit: true,        // At least one number
    requireSpecialChar: true   // At least one special character
);

if (!result.IsValid)
{
    foreach (var error in result.Errors)
    {
        Console.WriteLine($"❌ {error}");
    }
}
```

## 📖 Documentation

For full documentation, visit the [TechDocs page](./docs/index.md).

## 🧪 Running Tests

```bash
dotnet test
```

## 🏗️ Building

```bash
dotnet build
```

## 📦 Creating NuGet Package

```bash
dotnet pack -c Release
```

## 🔄 CI/CD

This library uses GitHub Actions for continuous integration and deployment:

| Workflow | Trigger | Description |
|----------|---------|-------------|
| 🔍 **CI** | Push/PR to `main` | Build, test, and code coverage |
| 📤 **Publish** | GitHub Release | Publish to GitHub Packages |

## 📄 License

This project is licensed under the MIT License.
