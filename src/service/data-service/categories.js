'use strict';

class CategoriesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, item) => {
      item.category.forEach((categoryItem) => acc.add(categoryItem));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoriesService;
