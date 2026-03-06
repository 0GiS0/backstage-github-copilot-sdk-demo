namespace BACKSTAGE_ENTITY_NAME.Tests;

public class ValidatorTests
{
    #region Email Validation Tests

    [Theory]
    [InlineData("test@example.com", true)]
    [InlineData("user.name@domain.org", true)]
    [InlineData("user+tag@example.co.uk", true)]
    [InlineData("invalid-email", false)]
    [InlineData("@nodomain.com", false)]
    [InlineData("noat.com", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    [InlineData("   ", false)]
    public void IsValidEmail_ShouldValidateCorrectly(string? email, bool expected)
    {
        // Act
        var result = Validator.IsValidEmail(email);

        // Assert
        result.Should().Be(expected);
    }

    #endregion

    #region URL Validation Tests

    [Theory]
    [InlineData("https://www.example.com", true)]
    [InlineData("http://example.com", true)]
    [InlineData("https://example.com/path/to/resource?query=1", true)]
    [InlineData("ftp://example.com", false)]
    [InlineData("not-a-url", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void IsValidUrl_ShouldValidateCorrectly(string? url, bool expected)
    {
        // Act
        var result = Validator.IsValidUrl(url);

        // Assert
        result.Should().Be(expected);
    }

    #endregion

    #region Credit Card Validation Tests

    [Theory]
    [InlineData("4532015112830366", true)]  // Valid Visa
    [InlineData("4532-0151-1283-0366", true)]  // Valid with dashes
    [InlineData("4532 0151 1283 0366", true)]  // Valid with spaces
    [InlineData("5425233430109903", true)]  // Valid Mastercard
    [InlineData("1234567890123456", false)]  // Invalid (fails Luhn)
    [InlineData("123", false)]  // Too short
    [InlineData("", false)]
    [InlineData(null, false)]
    [InlineData("abcd1234abcd1234", false)]  // Contains letters
    public void IsValidCreditCard_ShouldValidateCorrectly(string? cardNumber, bool expected)
    {
        // Act
        var result = Validator.IsValidCreditCard(cardNumber);

        // Assert
        result.Should().Be(expected);
    }

    #endregion

    #region Phone Number Validation Tests

    [Theory]
    [InlineData("+1234567890", true)]
    [InlineData("+1 (234) 567-8900", true)]
    [InlineData("123-456-7890", true)]
    [InlineData("123.456.7890", true)]
    [InlineData("abc", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void IsValidPhoneNumber_ShouldValidateCorrectly(string? phoneNumber, bool expected)
    {
        // Act
        var result = Validator.IsValidPhoneNumber(phoneNumber);

        // Assert
        result.Should().Be(expected);
    }

    #endregion

    #region IPv4 Validation Tests

    [Theory]
    [InlineData("192.168.1.1", true)]
    [InlineData("0.0.0.0", true)]
    [InlineData("255.255.255.255", true)]
    [InlineData("256.1.1.1", false)]  // Out of range
    [InlineData("192.168.1", false)]  // Missing octet
    [InlineData("192.168.01.1", false)]  // Leading zero
    [InlineData("192.168.1.1.1", false)]  // Too many octets
    [InlineData("", false)]
    [InlineData(null, false)]
    public void IsValidIPv4_ShouldValidateCorrectly(string? ipAddress, bool expected)
    {
        // Act
        var result = Validator.IsValidIPv4(ipAddress);

        // Assert
        result.Should().Be(expected);
    }

    #endregion

    #region Range Validation Tests

    [Theory]
    [InlineData(5, 1, 10, true)]
    [InlineData(1, 1, 10, true)]  // Inclusive min
    [InlineData(10, 1, 10, true)]  // Inclusive max
    [InlineData(0, 1, 10, false)]
    [InlineData(11, 1, 10, false)]
    public void IsInRange_WithIntegers_ShouldValidateCorrectly(int value, int min, int max, bool expected)
    {
        // Act
        var result = Validator.IsInRange(value, min, max);

        // Assert
        result.Should().Be(expected);
    }

    [Fact]
    public void IsInRange_WithDates_ShouldValidateCorrectly()
    {
        // Arrange
        var date = new DateTime(2024, 6, 15);
        var minDate = new DateTime(2024, 1, 1);
        var maxDate = new DateTime(2024, 12, 31);

        // Act
        var result = Validator.IsInRange(date, minDate, maxDate);

        // Assert
        result.Should().BeTrue();
    }

    #endregion

    #region Date Validation Tests

    [Theory]
    [InlineData("2024-01-15", "yyyy-MM-dd", true)]
    [InlineData("15/01/2024", "dd/MM/yyyy", true)]
    [InlineData("2024-13-01", "yyyy-MM-dd", false)]  // Invalid month
    [InlineData("not-a-date", "yyyy-MM-dd", false)]
    [InlineData("", "yyyy-MM-dd", false)]
    [InlineData(null, "yyyy-MM-dd", false)]
    public void IsValidDate_ShouldValidateCorrectly(string? dateString, string format, bool expected)
    {
        // Act
        var result = Validator.IsValidDate(dateString, format);

        // Assert
        result.Should().Be(expected);
    }

    [Fact]
    public void IsValidDate_WithDefaultFormat_ShouldUseIsoFormat()
    {
        // Act
        var result = Validator.IsValidDate("2024-01-15");

        // Assert
        result.Should().BeTrue();
    }

    #endregion

    #region Password Validation Tests

    [Fact]
    public void ValidatePassword_WithStrongPassword_ShouldReturnValid()
    {
        // Act
        var result = Validator.ValidatePassword("SecureP@ss123");

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void ValidatePassword_WithWeakPassword_ShouldReturnErrors()
    {
        // Act
        var result = Validator.ValidatePassword("weak");

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().NotBeEmpty();
        result.Errors.Should().Contain(e => e.Contains("at least 8 characters"));
        result.Errors.Should().Contain(e => e.Contains("uppercase"));
        result.Errors.Should().Contain(e => e.Contains("digit"));
        result.Errors.Should().Contain(e => e.Contains("special character"));
    }

    [Fact]
    public void ValidatePassword_WithNullPassword_ShouldReturnError()
    {
        // Act
        var result = Validator.ValidatePassword(null);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain("Password cannot be empty");
    }

    [Fact]
    public void ValidatePassword_WithCustomRequirements_ShouldValidateAccordingly()
    {
        // Act - Only require minimum length and digit
        var result = Validator.ValidatePassword(
            "password1",
            minLength: 8,
            requireUppercase: false,
            requireLowercase: true,
            requireDigit: true,
            requireSpecialChar: false);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    #endregion
}
