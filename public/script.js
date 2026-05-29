// define a url base da api para consultas de id
const API_BASE_URL = '/ids';

// inicializa os icones da biblioteca lucide na interface
lucide.createIcons();

// seleciona os elementos da pagina que serao manipulados
const arrowContainer = document.getElementById('arrowContainer');
const searchForm = document.getElementById('searchForm');
const input = document.getElementById('searchQuery');
const searchBtn = document.getElementById('searchBtn');
const btnTextSpan = document.getElementById('btnText');
const resultArea = document.getElementById('resultArea');

// atualiza o texto com o ano atual dinamicamente
document.getElementById('currentYear').innerText = new Date().getFullYear();

// revela a barra de pesquisa visualmente e oculta a seta de indicacao
function revealSearch() {
    if (searchForm.classList.contains('revealed')) return;
    searchForm.classList.add('revealed');
    arrowContainer.classList.add('hide');
}

// dispara a exibicao da barra de pesquisa ao clicar em qualquer parte do corpo da pagina
document.body.addEventListener('click', function(e) {
    if (searchForm.classList.contains('revealed')) return;
    revealSearch();
});

// dispara a exibicao ao clicar especificamente no container da seta e evita conflito de cliques
arrowContainer.addEventListener('click', function(e) {
    e.stopPropagation();
    revealSearch();
});

// busca o id informado na base de dados de forma assincrona
async function consultarApi(query) {
    // codifica o texto da busca para evitar erros de url
    const idParam = encodeURIComponent(query.trim());
    const url = `${API_BASE_URL}/${idParam}`;
    
    // realiza a requisicao http
    const response = await fetch(url);
    
    // lida com falhas na requisição
    if (!response.ok) {
        // interpreta o erro 404 como id n encontrado e retorna status limpo
        if (response.status === 404) {
            return { encontrado: false, mensagem: "Tudo limpo! Este ID não consta em nossa blacklist no momento." };
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    // converte a resposta recebida para o formato json
    const data = await response.json();
    
    // verifica se o id existe no retorno e cria o alerta de bloqueio
    if (data && data.id) {
        return {
            encontrado: true,
            mensagem: "ALERTA: Este ID encontra-se em nossa base de dados de contas recuperadas/roubadas. Não realize negociações."
        };
    }
    
    // retorna status limpo caso passe por todas as validacoes anteriores sem alerta
    return { encontrado: false, mensagem: "Tudo limpo! Este ID não consta em nossa blacklist no momento." };
}

// constroi e exibe visualmente o resultado da consulta na tela
function renderResult(result) {
    // verifica a flag do resultado para definir o estilo visual
    const isBlack = result.encontrado;
    
    // configura cores, icones e titulos dinamicos baseados no status da consulta
    const bgColor = isBlack ? 'bg-red-50 border-red-600' : 'bg-emerald-50 border-emerald-500';
    const textColor = isBlack ? 'text-red-900' : 'text-emerald-900';
    const iconBg = isBlack ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600';
    const lucideIcon = isBlack ? 'shield-alert' : 'shield-check';
    const title = isBlack ? 'Conta na Blacklist!' : 'Nenhum registro encontrado';
    
    const borderColor = isBlack ? 'border-red-200' : 'border-emerald-200';

    // cria a estrutura html contendo as informacoes do alerta
    const html = `
        <div class="animate-fade-in-up p-5 sm:p-6 rounded-2xl shadow-xl border-l-8 border ${borderColor} ${bgColor} ${textColor}">
            <div class="flex items-start gap-3 sm:gap-4">
                <div class="p-2 sm:p-3 rounded-full ${iconBg}">
                    <i data-lucide="${lucideIcon}" width="28" height="28"></i>
                </div>
                <div>
                    <h3 class="font-bold text-lg sm:text-xl mb-1 ${isBlack ? 'text-red-700' : 'text-emerald-700'}">
                        ${title}
                    </h3>
                    <p class="opacity-90 leading-relaxed font-medium text-sm sm:text-base">
                        ${result.mensagem}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // injeta o html gerado na area de resultados da página
    resultArea.innerHTML = html;
    
    // renderiza novamente os icones para que o novo elemento visual seja exibido
    lucide.createIcons();
}

// gerencia a ação de envio da busca e controla o estado da interface
async function handleSearch(e) {
    // impede o recarregamento padrão da pagina
    e.preventDefault();
    
    // captura o texto digitado ignorando espaços inuteis no inicio e no fim
    const query = input.value.trim();
    if (!query) return;

    // limpa a area de resultados e desativa o botão para evitar multiplos cliques
    resultArea.innerHTML = '';
    searchBtn.disabled = true;
    btnTextSpan.innerText = 'Buscando...';
    
    // oculta o icone da seta do botao durante a busca
    const chevronIcon = searchBtn.querySelector('[data-lucide="chevron-right"]');
    if (chevronIcon) chevronIcon.style.display = 'none';

    // executa o processo de consulta e renderiza o resultado
    try {
        const result = await consultarApi(query);
        renderResult(result);
    } catch (error) {
        console.error('Erro na consulta:', error);
        // exibe mensagem generica de falha caso ocorra erro na comunicação com a api
        resultArea.innerHTML = `<div class="bg-red-100 border-l-8 border-red-600 p-6 rounded-2xl text-red-800">Erro na consulta. Tente novamente.</div>`;
    } finally {
        // restaura o estado inicial do botão independentemente de sucesso ou erro
        searchBtn.disabled = false;
        btnTextSpan.innerText = 'Consultar';
        if (chevronIcon) chevronIcon.style.display = 'inline-flex';
    }
}

// monitora as ações de busca pelo envio do formulario --- clique no botão ou tecla enter
searchForm.addEventListener('submit', handleSearch);
searchBtn.addEventListener('click', handleSearch);
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSearch(e);
});