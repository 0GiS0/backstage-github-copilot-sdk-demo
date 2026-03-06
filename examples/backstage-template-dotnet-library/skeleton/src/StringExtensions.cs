using System.Text.RegularExpressions;

namespace BACKSTAGE_ENTITY_NAME;

/// <summary>
/// Provides validation utilities for common data formats.
/// </summary>
public static partial class Validator
{
    /// <summary>
    /// Validates if the given string is a valid email address.
    /// </summary>
    /// <param name="email">The email address to validate.</param>
    /// <returns>True if the email is valid, false otherwise.</returns>
    public static bool IsValidEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        return EmailRegex().IsMatch(email);
    }

    /// <summary>
    /// Validates if the given string is a valid URL.
    /// </summary>
    /// <param name="url">The URL to validate.</param>
    /// <returns>True if the URL is valid, false otherwise.</returns>
    public static bool IsValidUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return false;

        return Uri.TryCreate(url, UriKind.Absolute, out var uri) 
            && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    /// <summary>
    /// Validates if the given string is a valid credit card number using the Luhn algorithm.
    /// </summary>
    /// <param name="cardNumber">The credit card number to validate (digits only or with spaces/dashes).</param>
    /// <returns>True if the card number passes Luhn validation, false otherwise.</returns>
    public static bool IsValidCreditCard(string? cardNumber)
    {
        if (string.IsNullOrWhiteSpace(cardNumber))
            return false;

        // Remove spaces and dashes
        var digits = cardNumber.Replace(" ", "").Replace("-", "");

        // Must be all digits and between 13-19 characters
        if (!DigitsOnlyRegex().IsMatch(digits) || digits.Length < 13 || digits.Length > 19)
            return false;

        // Luhn algorithm
        var sum = 0;
        var alternate = false;

        for (var i = digits.Length - 1; i >= 0; i--)
        {
            var digit = digits[i] - '0';

            if (alternate)
            {
                digit *= 2;
                if (digit > 9)
                    digit -= 9;
            }

            sum += digit;
            alternate = !alternate;
        }

        return sum % 10 == 0;
    }

    /// <summary>
    /// Validates if the given string is a valid phone number.
    /// Supports international formats with optional country code.
    /// </summary>
    /// <param name="phoneNumber">The phone number to validate.</param>
    /// <returns>True if the phone number format is valid, false otherwise.</returns>
    public static bool IsValidPhoneNumber(string? phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
            return false;

        return PhoneRegex().IsMatch(phoneNumber);
    }

    /// <summary>
    /// Validates if the given string is a valid IPv4 address.
    /// </summary>
    /// <param name="ipAddress">The IP address to validate.</param>
    /// <returns>True if the IP address is valid, false otherwise.</returns>
    public static bool IsValidIPv4(string? ipAddress)
    {
        if (string.IsNullOrWhiteSpace(ipAddress))
            return false;

        var parts = ipAddress.Split('.');
        if (parts.Length != 4)
            return false;

        foreach (var part in parts)
        {
            if (!int.TryParse(part, out var num) || num < 0 || num > 255)
                return false;

            // Check for leading zeros (invalid in standard notation)
            if (part.Length > 1 && part[0] == '0')
                return false;
        }

        return true;
    }

    /// <summary>
    /// Validates if the given value is within the specified range (inclusive).
    /// </summary>
    /// <typeparam name="T">The type of value to compare.</typeparam>
    /// <param name="value">The value to validate.</param>
    /// <param name="min">The minimum allowed value.</param>
    /// <param name="max">The maximum allowed value.</param>
    /// <returns>True if the value is within range, false otherwise.</returns>
    public static bool IsInRange<T>(T value, T min, T max) where T : IComparable<T>
    {
        return value.CompareTo(min) >= 0 && value.CompareTo(max) <= 0;
    }

    /// <summary>
    /// Validates if the given string matches a valid date format.
    /// </summary>
    /// <param name="dateString">The date string to validate.</param>
    /// <param name="format">The expected date format (default: yyyy-MM-dd).</param>
    /// <returns>True if the date string is valid, false otherwise.</returns>
    public static bool IsValidDate(string? dateString, string format = "yyyy-MM-dd")
    {
        if (string.IsNullOrWhiteSpace(dateString))
            return false;

        return DateTime.TryParseExact(
            dateString, 
            format, 
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None, 
            out _);
    }

    /// <summary>
    /// Validates password strength based on common security requirements.
    /// </summary>
    /// <param name="password">The password to validate.</param>
    /// <param name="minLength">Minimum required length (default: 8).</param>
    /// <param name="requireUppercase">Require at least one uppercase letter (default: true).</param>
    /// <param name="requireLowercase">Require at least one lowercase letter (default: true).</param>
    /// <param name="requireDigit">Require at least one digit (default: true).</param>
    /// <param name="requireSpecialChar">Require at least one special character (default: true).</param>
    /// <returns>A validation result with details about password strength.</returns>
    public static PasswordValidationResult ValidatePassword(
        string? password,
        int minLength = 8,
        bool requireUppercase = true,
        bool requireLowercase = true,
        bool requireDigit = true,
        bool requireSpecialChar = true)
    {
        var errors = new List<string>();

        if (string.IsNullOrEmpty(password))
        {
            errors.Add("Password cannot be empty");
            return new PasswordValidationResult(false, errors);
        }

        if (password.Length < minLength)
            errors.Add($"Password must be at least {minLength} characters long");

        if (requireUppercase && !password.Any(char.IsUpper))
            errors.Add("Password must contain at least one uppercase letter");

        if (requireLowercase && !password.Any(char.IsLower))
            errors.Add("Password must contain at least one lowercase letter");

        if (requireDigit && !password.Any(char.IsDigit))
            errors.Add("Password must contain at least one digit");

        if (requireSpecialChar && !SpecialCharRegex().IsMatch(password))
            errors.Add("Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;':\",./<>?)");

        return new PasswordValidationResult(errors.Count == 0, errors);
    }

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();

    [GeneratedRegex(@"^\d+$")]
    private static partial Regex DigitsOnlyRegex();

    [GeneratedRegex(@"^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$")]
    private static partial Regex PhoneRegex();

    [GeneratedRegex(@"[!@#$%^&*()_+\-=\[\]{}|;':"",./<>?]")]
    private static partial Regex SpecialCharRegex();
}

/// <summary>
/// Represents the result of a password validation.
/// </summary>
/// <param name="IsValid">Indicates whether the password is valid.</param>
/// <param name="Errors">List of validation errors, if any.</param>
public record PasswordValidationResult(bool IsValid, IReadOnlyList<string> Errors);
