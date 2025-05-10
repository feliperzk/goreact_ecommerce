package main

import (
	"backend/pkg/database"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	// configuração do backend e conexão com o banco de dados
	port := ":" + os.Getenv("BACKEND_PORT")
	fmt.Printf("Servidor iniciado na porta %s\n", port)

	// conexão com o banco de dados
	db, err := database.PostgresConnectionPool()
	if err != nil {
		log.Fatalf("Erro ao conectar com o banco de dados: %v", err)
	}

	// Endpoint raiz para teste
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World!")

		// Consulta SQL que concatena parâmetros
		query := "SELECT 'select com parametros ' || $1 || ', ' || $2 || ', ' || $3 as mensagem"

		// Parâmetros para a consulta
		params := []interface{}{"primeiroParametro", "segundoParametro", "terceiroParametro"}

		// Log da consulta que será executada
		fmt.Printf("\nExecutando consulta:\n%s\ncom os parâmetros: [%s] [%s] [%s] ",
			query, params[0], params[1], params[2])

		// Execução da consulta no banco de dados
		rows, err := database.ExecuteQuery(db, query, params...)
		if err != nil {
			fmt.Fprintf(w, "\nErro ao executar consulta: %v", err)
			return
		}
		defer rows.Close() // Garante que o recurso será liberado após o uso

		// Processa o resultado da consulta e envia para o cliente
		var mensagem string
		if rows.Next() {
			err := rows.Scan(&mensagem)
			if err != nil {
				fmt.Fprintf(w, "\nErro ao ler resultado: %v", err)
				return
			}
			fmt.Fprintf(w, "\nResultado da consulta: %s", mensagem)
		}

	})

	// Inicia o servidor se não houver erro
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Erro ao iniciar servidor: %v", err)
	}
}
