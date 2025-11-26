# 4. Configuração Inicial do mkdocs.yml

Para ativar o tema Material, definir o nome do site e a ordem de navegação, edite o arquivo principal **`mkdocs.yml`**.

## Conteúdo do mkdocs.yml
```
site_name: MkDocs
nav:
    - Introdução: index.md
    - 1. Instalação do Python: python.md
    - 2. Instalação do MkDocs: mkdocs.md
    - 3. Criação do Projeto: projeto.md
    - 4. Configuração Inicial: yml.md
theme:
  name: material
  language: pt-BR
  features:
    - search.suggest
    - search.highlight
    - search.share
    - navigation.footer
  palette:
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      toggle:
        icon: material/weather-sunny
        name: Modo claro
    - media: "(prefers-color-scheme: light)"
      scheme: default
      toggle:
        icon: material/weather-night
        name: Modo escuro
plugins:
  - search
extra:
  generator: false
```

## Execução e Visualização

Para visualizar o site e começar a editar os arquivos com pré-visualização em tempo real, use:

`mkdocs serve`

O servidor local fica disponível em `http://127.0.0.1:8000/`.