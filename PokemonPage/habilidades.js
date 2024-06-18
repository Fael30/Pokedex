const listaDeAbilities = document.getElementById('lista-abilities');
const botaoCarregaAbilities = document.getElementById('carrega-abilities');
let contagemDeRegistrosAbilities = 0;
const limitePorCarregamentoAbilities = 20;
const totalAbilities = 358; // Número total de habilidades na PokeAPI

function capitalizarNome(nome) {
    return nome.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


async function carregarAbilities(quantidade, reiniciar = false) {
    try {
        const promessas = [];
        for (let i = contagemDeRegistrosAbilities + 1; i <= contagemDeRegistrosAbilities + quantidade; i++) {
            if (i <= totalAbilities) { // Evita requisições além do limite total de habilidades
                promessas.push(buscarDadosAbility(i));
            }
        }

        const abilities = await Promise.all(promessas);

        let novoHtml = '';
        abilities.forEach(ability => {
            const { nome, descricao } = ability;
            novoHtml += `
                <li class="ability-item">
                    <span class="ability-name">${nome}</span>
                    <span class="ability-description">${descricao}</span>
                </li>
            `;
        });

        if (reiniciar) {
            listaDeAbilities.innerHTML = novoHtml;
        } else {
            listaDeAbilities.innerHTML += novoHtml;
        }

        contagemDeRegistrosAbilities += quantidade;
        botaoCarregaAbilities.style.display = contagemDeRegistrosAbilities >= totalAbilities ? 'none' : 'block';

        document.getElementById("loader-container").style.display = "none";
    } catch (error) {
        console.error('Erro ao carregar as habilidades:', error);
    }
}

function carregarTabelaDeAbilities() {
    botaoCarregaAbilities.addEventListener('click', () => {
        document.getElementById("loader-container").style.display = "flex";
        carregarAbilities(limitePorCarregamentoAbilities);
    });
    document.getElementById("loader-container").style.display = "flex";
    carregarAbilities(limitePorCarregamentoAbilities, true);
}

window.onload = function() {
    carregarTabelaDeAbilities();
}

/* Função para voltar ao topo */
window.onscroll = function () { funcaoScroll() };

function funcaoScroll() {
    document.getElementById("myBtn").style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? "block" : "none";
}

function funcaoTopo() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/* Função de Navegação entre as páginas */
function navigateToPage(pageUrl) {
    window.location.href = pageUrl;
}
