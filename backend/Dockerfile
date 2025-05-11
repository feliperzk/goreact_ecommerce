FROM golang:1.24-alpine AS builder

WORKDIR /app

# instala golang-migrate
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# copia arquivos de dependências
COPY go.mod go.sum ./

# baixa asdependências
RUN go mod download

# copia a aplicação
COPY . .

# compila a aplicação
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# usa a imagem alpine linux como base
FROM alpine:latest

# instala dependências necessárias para o migrate
RUN apk add --no-cache ca-certificates

# define o diretório de trabalho
WORKDIR /app

# copia o binário da etapa de build
COPY --from=builder /app/main ./

# copia os arquivos de migração
COPY --from=builder /app/migrations ./migrations

# copia o binário migrate
COPY --from=builder /go/bin/migrate /usr/bin/migrate

# expõe a porta da aplicação
EXPOSE 8080

# script para executar as migrações e iniciar a aplicação
COPY --from=builder /app/scripts/entrypoint.sh ./
RUN chmod +x entrypoint.sh

# inicia a aplicação com as migrações
ENTRYPOINT ["./entrypoint.sh"] 