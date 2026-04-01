FROM php:8.2-apache

WORKDIR /var/www/html

# Dependências de sistema necessárias
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev zip unzip git && \
    docker-php-ext-install pdo pdo_pgsql && \
    rm -rf /var/lib/apt/lists/*

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

COPY . .

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
