#!/bin/sh

echo "Esperando a que PostgreSQL esté disponible..."

while ! nc -z db 5432; do
  sleep 1
done

echo "PostgreSQL está disponible."

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Cargar fixtures (ajusta las rutas según donde tengas los archivos)
python manage.py loaddata apps/ambiente/fixtures/ambiente_fixture.json
python manage.py loaddata apps/equipos/fixtures/equipos_fixture.json

echo "Migraciones y fixtures cargados. Arrancando Django..."

exec "$@"