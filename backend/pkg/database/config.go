package database

import (
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

type databaseConfig struct {
	User     string
	Password string
	Host     string
	Port     string
	DBName   string
}

func loadConfig() *databaseConfig {
	return &databaseConfig{
		User:     os.Getenv("POSTGRES_USER"),
		Password: os.Getenv("POSTGRES_PASSWORD"),
		Host:     os.Getenv("POSTGRES_HOST"),
		Port:     os.Getenv("POSTGRES_PORT"),
		DBName:   os.Getenv("POSTGRES_DB"),
	}
}

func configurePoolSettings(config *pgxpool.Config) {
	config.MinConns = 1
	config.MaxConns = 3
}

func buildConnectionString(cfg *databaseConfig) string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.DBName,
	)
}
