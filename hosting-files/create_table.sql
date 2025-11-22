-- SQL скрипт для создания таблицы blog_articles в MySQL
-- Выполните этот скрипт в phpMyAdmin на хостинге Reu.ru

CREATE TABLE IF NOT EXISTS blog_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT 'Заголовок статьи',
  category VARCHAR(100) NOT NULL COMMENT 'Категория (Аналитика, Кейсы, Автоматизация и т.д.)',
  short_description TEXT NOT NULL COMMENT 'Краткое описание для карточки',
  full_content TEXT NOT NULL COMMENT 'Полный текст статьи',
  image_url VARCHAR(500) DEFAULT '' COMMENT 'URL изображения для карточки',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Статьи блога';

-- Добавляем индексы для быстрого поиска
CREATE INDEX idx_category ON blog_articles(category);
CREATE INDEX idx_created_at ON blog_articles(created_at);

-- Вставляем тестовую статью
INSERT INTO blog_articles (title, category, short_description, full_content, image_url) VALUES
(
  'Оптимизация складских процессов: 5 ключевых метрик',
  'Аналитика',
  'Узнайте, какие показатели помогут повысить эффективность вашего склада на 30%',
  'Подробное руководство по ключевым метрикам складской логистики...',
  ''
);
