// Package database fornece funcionalidades para conexão e gerenciamento do banco de dados
package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func configurePoolSettings(config *pgxpool.Config) {
	config.MinConns = 1
	config.MaxConns = 3
	config.HealthCheckPeriod = 1 * time.Minute
}

func buildConnectionString() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_DB"),
	)
}

// valida a string de conexão, seta as configs e estabelece a conexao com o banco de dados
func PostgresConnectionPool() (*pgxpool.Pool, error) {

	connStr := buildConnectionString()
	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return nil, fmt.Errorf("erro ao analisar string de conexão: %v", err)
	}

	configurePoolSettings(config)
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		fmt.Println("erro ao montar a pool de conexões:", err)
		return nil, err
	}

	fmt.Println("conexão com o banco de dados estabelecida com sucesso!")
	return pool, nil
}

// executa um SELECT recebendo a query, os params e retorna os resultados
func ExecuteQuery(pool *pgxpool.Pool, query string, params ...interface{}) (pgx.Rows, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	// Cria um channel para comunicação entre goroutines
	resultChannel := make(chan struct {
		rows pgx.Rows
		err  error
	})

	// Inicia uma goroutine que executa a consulta de forma assíncrona
	go func() {
		rows, err := pool.Query(ctx, query, params...)
		resultChannel <- struct {
			rows pgx.Rows
			err  error
		}{rows, err}
	}()

	result := <-resultChannel

	if result.err != nil {
		return nil, fmt.Errorf("erro ao executar consulta assíncrona: %v", result.err)
	}

	return result.rows, nil
}
