# Painel de Bônus

Sistema web de controle de agendamentos e cálculo de bonificação, pensado para uma equipe de agendamento de revisões automotivas.

🔗 **Acesse:** [lorena-mendes-azolin.github.io/AutoService](https://lorena-mendes-azolin.github.io/AutoService/) (acesso com login)

## Sobre o projeto

Este é um projeto pessoal, que desenvolvi por iniciativa própria para aprender. A ideia veio de um problema real que eu via no meu trabalho: o controle de agendamentos, comparecimentos e bônus da equipe era feito de forma manual, o que tomava tempo e abria espaço para erros.

Usei essa situação como base para praticar a construção de um sistema completo, com regras de negócio de verdade: metas por marca, tipos de serviço que contam ou não para o bônus, fechamento mensal e controle de acesso por perfil. O sistema não está em uso na empresa: é um projeto de estudo.

<!-- Adicione aqui 2 ou 3 prints com dados fictícios, por exemplo:
![Painel inicial](imagens/prints/1-inicio.png)
![Agendamentos](imagens/prints/2-agendamentos.png)
-->

## Funcionalidades

- **Login com dois perfis:** administrador (gestão) e consultor, cada um com as telas e permissões do seu papel
- **Importação de planilhas mensais**, com regras de contagem por tipo de serviço e confirmação antes de importar
- **Cálculo de bonificação** a partir dos agendamentos e comparecimentos, com metas por marca
- **Fechamento do mês** pela gestão, com valor final por funcionário e exportação em PDF/Excel
- **Divergências:** o consultor sinaliza um problema e a gestão acompanha e resolve
- **Relatórios** e acompanhamento da evolução dos meses fechados
- **Backup** dos dados dentro do próprio sistema
- **Modo claro e escuro**

## Tecnologias

- HTML, CSS e JavaScript
- [Supabase](https://supabase.com/) (banco de dados e autenticação)
- GitHub Pages (hospedagem)

## O que aprendi

Foi meu primeiro projeto. Usei ferramentas de IA como apoio para aprender e resolver o que eu ainda não sabia, e com isso aprendi na prática a:

- transformar regras de negócio reais em funcionalidades
- organizar permissões diferentes para cada tipo de usuário
- trabalhar com banco de dados e autenticação
- tratar dados importados de planilhas e validar antes de salvar
- versionar e publicar um projeto com Git e GitHub

## Autora

**Lorena Mendes**, estudante de Análise e Desenvolvimento de Sistemas na Universidade Positivo
[LinkedIn](https://www.linkedin.com/in/lorena-mendes-tech) · [GitHub](https://github.com/lorena-mendes-azolin)
