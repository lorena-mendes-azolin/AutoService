# Painel de Bônus – AutoService

Sistema de controle de agendamentos de revisões e de bonificação. Front-end em HTML, CSS e JavaScript puro, com Supabase (Auth, Postgres, RLS). Publicado no GitHub Pages. Projeto de aprendizado e portfólio da Lorena, sem orçamento (nada de plano pago do Supabase).

Pasta no PC: `C:\Users\dados\Desktop\TESTES\autoservice`. Publicação: commit e push pelo GitHub Desktop, depois Ctrl+F5.

## Regras de trabalho (sempre seguir)

- Responder em português, de forma concisa e direta. A Lorena está começando em programação: explicar o necessário sem jargão.
- Não alterar estilo, cores ou layout sem pedido explícito.
- Todo o CSS fica em `style.css`. Nada de `<style>` ou `style=""` nas páginas.
- Código sem comentários.
- Textos do site profissionais e diretos, sem subtítulos desnecessários.
- Modo escuro está aprovado: não alterar. Ajustes de tema só no modo claro (limpo e neutro, como a página de Agendamentos).
- Mudanças para celular não podem afetar o desktop.
- Nunca quebrar o sistema antes de uma apresentação. Código novo deve funcionar mesmo se um SQL novo ainda não foi rodado.
- Teste de segurança com usuário de teste fica por último.
- Cadastro de usuário novo é centralizado no sistema: Administração → Usuários → Novo usuário. Não editar código nem copiar id do Supabase para isso.
- Não há botão "alterar senha" para usuário logado (decisão de 06/11). Só "Esqueci minha senha" no login; o admin redefine senhas na tela de Usuários.
- Ao entregar arquivos: trocar a versão `?v=AAAAMMDDx` em todos os `.html` quando CSS ou JS mudar, para forçar o navegador a baixar de novo.

## Estrutura

Páginas: `login`, `inicio` (dashboard), `index` (Agendamentos), `relatorios`, `almoco` (só Toyota e admin), `divergencias`, `admin` (Gestão: Fechamento, Histórico, Usuários, Inativos, Backup), `importar`, `redefinir`.

Scripts principais:
- `tema.js`: tema claro/escuro, menu lateral, animações de entrada, Configurações (tamanho do texto, densidade, página inicial, animações, notificações), prerender.
- `avisos.js`: avisos, confirmações, contadores do menu (Divergências, Almoço), `aplicarInativos`.
- `conta.js`: sessão, sino de notificações. `login.js`: login, cadastro, efeito de bolha.
- `inicio.js`: dashboard. `script.js`: Agendamentos. `relatorios.js`: relatórios e gráficos.
- `admin.js`: Gestão. `importar.html` (script embutido): importação de planilhas e relatório de importação.
- `bonus.js`: cálculo de bônus. `backup.js`, `fechamento-export.js`, `almoco.js`, `divergencias.js`, `dropdown.js`, `seletor-mes.js`.

Tabelas e views no Supabase: `agendamentos`, `perfis`, `operadores_inativos`, `metas_mensais`, `fechamentos`, `meses_fechados`, `divergencias`, `almoco_itens`, `historico_alteracoes`, `vw_agendamentos_completos`. SQL em `sql/`.

Preferências no `<html>`: `data-tema`, `data-animacoes`, `data-texto`, `data-densidade`, `data-notificacoes`. Chaves de localStorage: `tema-painel`, `animacoes-painel`, `texto-painel`, `densidade-painel`, `notificacoes-painel`, `pagina-inicial-painel`, `contadores-painel`, `sino-painel`.

## Regras de negócio

- Visão admin: controle de agendamentos (importar e exportar). Visão usuário: valor de bonificação. Cada uma tem campos que a outra não tem.
- Só o admin altera status de comparecimento e valores (revisão facilitada e outros serviços). O consultor só visualiza.
- Nota de monitoria é lançada pela gestão no fechamento. O consultor vê "Aguardando". "Valor final do mês" só aparece com o mês fechado.
- Backup é feito dentro do sistema e é obrigatório antes de fechar o mês.
- Inativos: ex-funcionários com agendamentos que contam na meta total e da marca, mas sem linha de bônus. O Fechamento respeita o mês de inativação (`perfis.inativo_desde`). Ranking, filtros e relatórios hoje tratam todos os meses do inativo como inativo (possível melhoria: respeitar a data).
- Meta de 80% para quem tem mais de uma marca: critério ainda não confirmado.
- Equipe "Backup": usuária Patrícia (PATRICIAM) é vinculada à marca Backup, mas os agendamentos dela contam na marca em que ela agenda. Dayaneda (DAYANEDA) é da Hyundai e precisa ser usuária ativa.

## Importação de planilhas

Duas planilhas por mês, sem misturar operadores:

**Toyota** (6 operadoras: Lorena, Alany, Nicoly, Allana, Ana Lucia, Cristiane; inativos só com código sem espaços)
- Linhas OP-20 ("agendam fora") sempre excluídas.
- Chave da visita: data do agendamento + nome do cliente + placa + chassi.
- Revisões numeradas e Facilitadas contam e geram bônus.
- Serviços da mesma visita de uma revisão não são contados.
- Visita só com serviços vira UM agendamento "Outros serviços" (tipos juntos na observação, valor 0, conta em agendados e comparecidos, sem bônus).
- Facilitada + revisão numerada na mesma visita: conta só a Facilitada, para confirmação manual.
- Status: com O.S. = Compareceu; sem O.S. e data anterior à leitura = Não compareceu; demais = Pendente.
- Resultado conferido (novembro/2026): 377 válidos (Lorena 124, Alany 76, Allana 73, Cristiane 42, Ana Lucia 16, Nicoly 46).

**Outras marcas**
- Todos os serviços entram linha a linha, sem unificar por visita. Só revisões geram bônus.
- Nomes sem usuário viram inativos de equipe neutra (fora das metas de equipe), para o total bater (2779 em novembro/2026).

Antes de confirmar, o importador mostra um resumo e permite baixar o relatório detalhado (Excel e PDF) com unificados, revisão + Facilitada, duplicados e outras anomalias.

Agendamentos: filtros "Apenas revisões" e "Outros serviços". Outros serviços mostram "Sem bonificação" ao usuário e a caixa "Definir valor" ao admin.

## Cuidados técnicos

- Consultas grandes são paginadas em blocos de 1000, baixados em paralelo com contagem exata.
- A página só aparece depois do carregamento (`.conteudo-carregando` e `mostrarConteudo`). Páginas pré-carregadas pelo navegador só devem agir quando abertas de fato (`document.prerendering`).
- Erros do Supabase aparecem em português (`traduzirErro` em `avisos.js` e tratamento no `login.js`).
- Ao copiar arquivos para a pasta do PC, conferir tamanho e conteúdo depois: já ocorreram gravações antigas por cima.

## Pendências conhecidas

- Teste real com usuário comum (claro e escuro, desktop e celular) antes de apresentar; apresentação prevista só da visão do usuário.
- Teste de segurança com usuário de teste (por último).
- Cópia de demonstração com dados fictícios e README com prints (portfólio).
- Revisão do modo claro no celular.
- Decisões em aberto: tabela km → revisão, regra de meta multimarca, valores de bônus a bater com o suporte, caso Adriano (Revisão 05 + 15 no mesmo carro e dia, mantidas como duas).
- Deixar `inativo_desde` valer por mês em ranking, filtros e relatórios, se ela confirmar.
