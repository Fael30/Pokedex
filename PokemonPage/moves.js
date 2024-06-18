const listaDeMoves = document.getElementById('lista-moves');
const botaoCarregaMoves = document.getElementById('carrega');
let contagemDeRegistrosMoves = 0;
const limitePorCarregamentoMoves = 20;

function capitalizarNome(nome) {
    return nome.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function carregarMoves(quantidade, reiniciar = false) {
    try {
        const promessas = [];
        for (let i = contagemDeRegistrosMoves + 1; i <= contagemDeRegistrosMoves + quantidade; i++) {
            promessas.push(buscarDadosMove(i));
        }

        const moves = await Promise.all(promessas);

        let novoHtml = '';
        moves.forEach(move => {
            const { nome, descricao, poder, precisao, pp, tipo } = move;
            novoHtml += `
                <li class="move-item">
                    <span class="move-name">${nome}</span>
                    <span class="move-description">${descricao}</span>
                    <span class="move-power">Power: ${poder}</span>
                    <span class="move-accuracy">Accuracy: ${precisao}</span>
                    <span class="move-pp">PP: ${pp}</span>
                    <span class="move-type">Type: ${tipo}</span>
                </li>
            `;
        });

        if (reiniciar) {
            listaDeMoves.innerHTML = novoHtml;
        } else {
            listaDeMoves.innerHTML += novoHtml;
        }

        contagemDeRegistrosMoves += quantidade;
        botaoCarregaMoves.style.display = contagemDeRegistrosMoves >= 728 ? 'none' : 'block';

        document.getElementById("loader-container").style.display = "none";
    } catch (error) {
        console.error('Erro ao carregar os movimentos:', error);
    }
}

function carregarTabelaDeMoves() {
    botaoCarregaMoves.addEventListener('click', () => {
        document.getElementById("loader-container").style.display = "flex";
        carregarMoves(limitePorCarregamentoMoves);
    });
    document.getElementById("loader-container").style.display = "flex";
    carregarMoves(limitePorCarregamentoMoves, true);
}

window.onload = function() {
    carregarTabelaDeMoves();
}

window.onscroll = function () { funcaoScroll() };

function funcaoScroll() {
    document.getElementById("myBtn").style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? "block" : "none";
}

function funcaoTopo() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function navigateToPage(pageUrl) {
    window.location.href = pageUrl;
}
