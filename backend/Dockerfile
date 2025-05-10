FROM golang:1.24-alpine AS builder

WORKDIR /app

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

# define o diretório de trabalho
WORKDIR /app

# copia o binário da etapa de build
COPY --from=builder /app/main ./

# expõe a porta da aplicação
EXPOSE 8080

# inicia a aplicação
CMD ["./main"] 