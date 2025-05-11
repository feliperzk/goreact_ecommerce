#!/bin/sh
set -e

# Espera o banco de dados estar pronto
echo "Aguardando o banco de dados..."
sleep 10

# Executa as migrações
echo "Aplicando migrations..."
migrate -path=/app/migrations -database="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable" up

# Inicia a aplicação
echo "Iniciando a aplicação..."
exec ./main 