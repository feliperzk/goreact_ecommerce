package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

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

	// atribui o resultado e retorna
	result := <-resultChannel
	if result.err != nil {
		return nil, fmt.Errorf("erro ao executar consulta assíncrona: %v", result.err)
	}

	return result.rows, nil
}
