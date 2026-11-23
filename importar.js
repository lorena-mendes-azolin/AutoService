// importar.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://potvtrepcoswvzmkewic.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iMbay5YOnrrehpqI9qU7HA_vMapr-DY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const USER_ID = 'bd9a6aa2-549c-4fef-b1f7-fea279a508fa';
const VALOR_BONUS_PADRAO = 10.00; // Altere se o valor unitário for diferente

// Converte "02/09" para "2026-09-02"
function formatarData(dataStr, mesPadrao) {
    if (!dataStr || dataStr.trim() === '' || dataStr.trim() === '.') return null;
    const partes = dataStr.trim().split('/');
    if (partes.length < 2) return null;
    const dia = partes[0].padStart(2, '0');
    const mes = partes[1].padStart(2, '0');
    const ano = partes.length === 3 ? partes[2] : '2026';
    return `${ano.length === 2 ? '20' + ano : ano}-${mes}-${dia}`;
}

async function importarMes(nomeArquivo, mesReferencia) {
    if (!fs.existsSync(nomeArquivo)) {
        console.log(`Arquivo ${nomeArquivo} não encontrado. Pulando...`);
        return;
    }

    const conteudo = fs.readFileSync(nomeArquivo, 'utf-8');
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim().length > 0);
    const cabecalho = linhas[0].split(',');

    const registros = [];

    for (let i = 1; i < linhas.length; i++) {
        // Trata separação por vírgula simples
        const cols = linhas[i].split(',');
        if (cols.length < 4 || !cols[1]) continue;

        const dataContato = formatarData(cols[0], mesReferencia);
        const nomeCliente = cols[1]?.trim();
        const placa = cols[2]?.trim()?.length <= 8 ? cols[2]?.trim() : (cols[3]?.trim() || '');
        const chassi = cols[2]?.trim()?.length > 8 ? cols[2]?.trim() : '';
        const revisao = parseInt(cols[4], 10) || null;
        const evento = cols[5]?.trim() || '';
        const os = cols[6]?.trim() || '';
        const dataRevisao = formatarData(cols[7], mesReferencia);
        const horario = cols[8]?.trim() || '';
        const statusRaw = (cols[9] || '').toUpperCase().trim();
        const unidade = cols[10]?.trim() || '';

        let status = 'pendente';
        if (statusRaw.includes('COMPARECEU') && !statusRaw.includes('NÃO')) {
            status = 'compareceu';
        } else if (statusRaw.includes('NÃO') || statusRaw.includes('FALTOU')) {
            status = 'faltou';
        }

        if (nomeCliente && dataRevisao) {
            registros.push({
                user_id: USER_ID,
                cliente_nome: nomeCliente,
                placa: placa,
                chassi: chassi,
                revisao: revisao,
                evento: evento,
                os: os,
                data_contato: dataContato,
                data_revisao: dataRevisao,
                horario: horario,
                status: status,
                unidade: unidade,
                valor_unitario: VALOR_BONUS_PADRAO
            });
        }
    }

    console.log(`Encontrados ${registros.length} agendamentos em ${nomeArquivo}. Enviando ao Supabase...`);

    const { data, error } = await supabase.from('agendamentos').insert(registros);
    if (error) {
        console.error(`Erro ao importar ${nomeArquivo}:`, error.message);
    } else {
        console.log(`✅ Sucesso! ${registros.length} agendamentos importados de ${nomeArquivo}!`);
    }
}

async function executar() {
    await importarMes('setembro.csv', '09');
    await importarMes('outubro.csv', '10');
    await importarMes('novembro.csv', '11');
    await importarMes('dezembro.csv', '12');
}

executar();