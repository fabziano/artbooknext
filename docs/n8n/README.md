# n8n

## Utilizei Docker Desktop 
- Criei um volume com nome `n8n_data`
- Fiz o pull da imagem do n8n

## Minhas configs com base na documentação

> container name: n8n 

- Ports: 

> host port: 5678

- Volumes:

>host path: n8n_data

>container path: /home/node/.n8n

- Environment variables 

>Variable: GENERIC_TIMEZONE

>Value: America/Sao_Paulo

>Variable: TZ

>Value: America/Sao_Paulo

>Variable: N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS

>Value: true

>Variable: N8N_RUNNERS_ENABLED

>Value: true
