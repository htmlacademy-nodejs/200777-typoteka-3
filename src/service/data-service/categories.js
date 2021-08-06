'use strict';

class CategoriesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, item) => {
      item.categories.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoriesService;
