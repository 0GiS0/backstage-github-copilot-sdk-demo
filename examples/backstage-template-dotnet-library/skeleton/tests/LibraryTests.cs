namespace BACKSTAGE_ENTITY_NAME.Tests;

public class LibraryTests
{
    [Fact]
    public void Version_ShouldReturnValidVersion()
    {
        // Act
        var version = Library.Version;

        // Assert
        version.Should().NotBeNullOrEmpty();
        version.Should().MatchRegex(@"^\d+\.\d+\.\d+$");
    }
}
