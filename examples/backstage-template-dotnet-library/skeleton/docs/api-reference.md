# API Reference

## Library Class

The main entry point for library functionality.

### Properties

#### Version

```csharp
public static string Version { get; }
```

Gets the current library version.

### Methods

#### Process

```csharp
public static string Process(string input)
```

Processes the input string.

**Parameters:**
- `input`: The string to process

**Returns:** The processed string in uppercase

**Exceptions:**
- `ArgumentNullException`: Thrown when input is null

## StringExtensions

Extension methods for string manipulation.

### Truncate

```csharp
public static string Truncate(this string value, int maxLength)
```

Truncates a string to a maximum length.

**Parameters:**
- `value`: The string to truncate
- `maxLength`: Maximum length of the result

**Returns:** Truncated string

### IsNullOrWhiteSpace

```csharp
public static bool IsNullOrWhiteSpace(this string? value)
```

Checks if a string is null, empty, or contains only whitespace.

**Parameters:**
- `value`: The string to check

**Returns:** True if null, empty, or whitespace

### ToTitleCase

```csharp
public static string ToTitleCase(this string value)
```

Converts a string to title case.

**Parameters:**
- `value`: The string to convert

**Returns:** String in title case
