package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func PostgresConnectionPool() (*pgxpool.Pool, error) {
	cfg := loadConfig()
	connStr := buildConnectionString(cfg)
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
