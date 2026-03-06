class Meme {
  constructor(id, title, description, imageUrl, category, tags, likes, views) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.category = category;
    this.tags = tags || [];
    this.likes = likes || 0;
    this.views = views || 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static fromRequest(data) {
    return new Meme(
      null, // ID will be assigned by the repository
      data.title,
      data.description,
      data.imageUrl,
      data.category,
      data.tags,
      data.likes,
      data.views
    );
  }

  updateFromRequest(data) {
    this.title = data.title;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.category = data.category;
    this.tags = data.tags;
    this.likes = data.likes;
    this.views = data.views;
    this.updatedAt = new Date();
  }

  static validateCreateRequest(data) {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (!data.imageUrl || data.imageUrl.trim().length === 0) {
      errors.push("Image URL is required");
    }

    if (!data.category || data.category.trim().length === 0) {
      errors.push("Category is required");
    }

    if (typeof data.likes !== "number" || data.likes < 0) {
      errors.push("Likes must be a non-negative number");
    }

    if (typeof data.views !== "number" || data.views < 0) {
      errors.push("Views must be a non-negative number");
    }

    return errors;
  }
}

module.exports = Meme;
