# Eai Tirei Quem
[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](#) 
[![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=whitehttps://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=whitehttps://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=whit)](#)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)

Este projeto é uma API REST desenvolvida para gerenciar sorteios de amigo secreto, como parte da disciplina de Programação Web Back-End. A API possibilita a criação e gerenciamento de grupos, adição de participantes, realização de sorteios e visualização dos resultados, com integração de listas de desejos para cada usuário. Os dados são armazenados em arquivos JSON, e a autenticação é feita via JWT.

## Visão Geral
A API Eai Tirei Quem permite:
- Gerenciar usuários com permissões de administrador e participantes.
- Criar, editar e excluir grupos para o sorteio.
- Realizar e redistribuir sorteios de amigo secreto.
- Gerenciar listas de desejos individuais para cada usuário.

## Rotas da API

### Autenticação

```
  POST /api/auth/login
```
Autentica o usuário e retorna um token JWT.

Requisição do json:
```json
{
  "email": "admin123@gmail.com",
  "senha": "admin"
}
```
Resposta:
```json
{
  "token": "JWT_TOKEN",
  "usuario": {
      "id": "id admin",
      "nome": "admin",
      "email": "admin123@gmail.com",
      "senha": "admin",
      "função": "admin"
  }
}
```


### Usuários

```
  POST /api/usuarios/criar-usuario
```

Cria um novo usuário no sistema.

Requisição do json:
```json
{
  "nome": "Ana",
  "email": "ana@gmail.com",
  "senha": "ana123"
}
```

Resposta:
```json
{
  "id": 1,
  "nome": "Ana",
  "email": "ana@gmail.com",
  "criadoEm": "2024-12-16T00:00:00Z"
}
```

### Grupos
```
  POST /api/grupos/criar
```

Cria um novo grupo para o sorteio de amigo secreto.

Requisição do json:
```json
{
  "nome": "Grupo Amigo Secreto 1"
}
```

Resposta:
```json
{
  "id": 1,
  "nome": "Grupo Amigo Secreto 1",
  "participantes": ["admin"],
  "status": "aberto"
}
```

### Listas de Desejos
```
  POST /api/wishlists
```
Cria uma nova lista de desejos.

Requisição do json:
```json
{
  "items": [
    {
      "name": "Notebook i7",
      "description": "Notebook Dell",
      "price": 5000
    }
  ]
}
```

Resposta:
```json
{
  "id": 1,
  "userId": "admin",
  "items": [
    {
      "id": 1,
      "name": "Notebook i7",
      "description": "Notebook Dell",
      "price": 5000
    }
  ]
}
```

### Swagger

Acesse a documentação completa em Swagger na rota:
```
  http://localhost:3000/api-docs
```

## Integrantes:
<ul>
  <li><a href="https://github.com/anabmferraz">Ana Beatriz Maciel Ferraz</a></li>
  <li><a href="https://github.com/Thakirian">Thaisse Kirian Veiga</a></li>
</ul>
