# React+GO+postgreSQL e-commerce

## Características principais:
- **Arquitetura Limpa**: Organização em camadas com separação clara de responsabilidades
- **Sistema de Migrações**: Utiliza golang-migrate para controle de versão do banco de dados
- **Containerização**: Dockerfile otimizado com multi-stage build para redução do tamanho da imagem
- **Segurança**: Estrutura preparada para autenticação e autorização de usuários
- **Script de Inicialização**: Automatiza a execução de migrações antes de iniciar a aplicação
- **Modelagem de Dados**: Esquema relacional com tabelas para usuários e produtos
- **Ambiente Docker**: Totalmente containerizado para facilitar implantação e desenvolvimento

## Frontend
O frontend da aplicação é desenvolvido com as seguintes tecnologias:

- React 19 com TypeScript
- Chakra UI para componentes de interface
- React Router DOM para navegação
- Axios para chamadas de API

### Estrutura de diretórios:
- `/components`: Componentes reutilizáveis da aplicação
- `/pages`: Páginas da aplicação
- `/contexts`: Contextos React para gerenciamento de estado global
- `/services`: Serviços para comunicação com a API

## Backend
O backend é desenvolvido em Go seguindo princípios de arquitetura limpa e modular:

### Tecnologias utilizadas:
- Go com pgx para conexão com PostgreSQL
- Pool de conexões para gerenciamento eficiente de recursos do banco de dados
- Sistema de migrações para versionamento do banco de dados

### Estrutura do projeto:
- `/cmd/api`: Ponto de entrada da aplicação e configuração do servidor HTTP
- `/internal`: Componentes internos da aplicação
  - `/config`: Configurações da aplicação
  - `/product`: Lógica de negócios relacionada a produtos
  - `/auth`: Autenticação e autorização
- `/pkg`: Pacotes reutilizáveis
  - `/database`: Conexão e interação com o banco de dados
- `/migrations`: Scripts SQL para criação e atualização do esquema do banco de dados

O backend implementa um pool de conexões com o PostgreSQL, otimizando o desempenho e uso de recursos.

## Inicialização do Projeto
### As aplicações requerem um .env com as seguintes variáveis de ambiente:

- `POSTGRES_HOST`: Host do banco de dados
- `POSTGRES_PORT`: Porta do banco de dados
- `POSTGRES_DB`: Nome do banco de dados
- `POSTGRES_USER`: Usuário do banco de dados
- `POSTGRES_PASSWORD`: Senha do banco de dados
- `BACKEND_PORT`: Porta em que o servidor será executado
- `FRONTEND_PORT`: Porta em que o frontend será executado

Para iniciar todo o ambiente (frontend, backend e banco de dados) utilize o Docker Compose:

```bash
docker-compose up -d
```