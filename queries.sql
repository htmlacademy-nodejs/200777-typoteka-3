-- Получить список всех категорий
SELECT id, name FROM categories;

-- Получить список категорий для которых создана минимум одна публикация
SELECT id, name FROM categories
	JOIN article_categories
	ON id = category_id
	GROUP BY id;

-- Получить список категорий с количеством публикаций
SELECT id, title, count(article_id)
  FROM categories
  JOIN article_categories ON id = category_id
  GROUP BY count(article_id);

-- Получить список публикаций
SELECT articles.*,
  users.first_name,
  users.last_name,
  users.email,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC;

-- Получить полную информацию определённой публикации
SELECT articles.*,
  users.first_name,
  users.last_name,
  users.email,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id;

-- Получить список из 5 свежих комментариев
SELECT
	comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at
  LIMIT 5;

-- Получить список комментариев для определённой публикации
SELECT
	comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.created_at DESC;

-- Обновить заголовок определённой публикации на «Как я встретил 1 сентября»
UPDATE articles
SET title = 'Как я встретил 1 сентября'
WHERE id = 1;
