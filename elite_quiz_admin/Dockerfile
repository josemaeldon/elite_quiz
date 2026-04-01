FROM php:8.2-apache

WORKDIR /var/www/html

# Dependências de sistema necessárias
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev libzip-dev zip unzip git && \
    docker-php-ext-install pdo pdo_pgsql pgsql zip && \
    rm -rf /var/lib/apt/lists/*

# Enable mod_rewrite, suppress FQDN warning, and allow .htaccess overrides
RUN a2enmod rewrite \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && printf '<Directory /var/www/html>\n    AllowOverride All\n</Directory>\n' \
       > /etc/apache2/conf-available/allowoverride.conf \
    && a2enconf allowoverride

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

COPY . .

RUN chown -R www-data:www-data /var/www/html

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
