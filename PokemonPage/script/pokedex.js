const listaDePokemons = document.getElementById('pokemons');
const botaoCarregarMais = document.getElementById('carrega');
const botoesDeTipo = document.querySelectorAll('.type-button');
let contagemDeRegistros = 0;
const limitePorCarregamento = 15;
const limiteTotal = 1025;
let tipoSelecionado = 'all';
let cacheDePokemons = {}; // Cache para armazenar resultados filtrados

botoesDeTipo.forEach(botao => {
    botao.addEventListener('click', () => {
        tipoSelecionado = botao.getAttribute('data-type');
        contagemDeRegistros = 0;
        listaDePokemons.innerHTML = '';
        document.getElementById("loader-container").style.display = "flex";
        carregarItensPokemon(limitePorCarregamento, true);
    });
});

async function carregarItensPokemon(quantidade, reiniciar = false) {
    try {
        if (!cacheDePokemons[tipoSelecionado]) {
            const promessas = [];
            for (let i = 1; i <= limiteTotal; i++) {
                promessas.push(buscarDadosPokemon(i));
            }
            const todosPokemons = await Promise.all(promessas);
            cacheDePokemons[tipoSelecionado] = tipoSelecionado === 'all' ? todosPokemons : todosPokemons.filter(p => p.tipos.includes(tipoSelecionado));
        }

        const pokemonsFiltrados = cacheDePokemons[tipoSelecionado];
        const pokemonsParaMostrar = pokemonsFiltrados.slice(contagemDeRegistros, contagemDeRegistros + quantidade);
        let novoHtml = '';

        pokemonsParaMostrar.forEach(pokemon => {
            const { tipos, nome, numero, id, urlImagem } = pokemon;
            const tiposHtml = tipos.map(t => `<li class="type">${t}</li>`).join('');
            novoHtml += `
                <li class="pokemon ${tipos[0]}">
                    <a href="pokemon.html?id=${id}">
                        <div class="pokeinfo">
                            <span class="name" style="font-weight: bold;">${nome}</span>
                            <span class="number">#${numero}</span>
                            <ol class="types">
                                ${tiposHtml}
                            </ol>
                        </div>
                        <div class="pokeimg">
                            <img src="${urlImagem}" alt="${nome}">
                            <img class="imgbackground" src="images/fundo/pokeball.svg" alt="${nome}">
                        </div>
                    </a>
                </li>
            `;
        });

        if (reiniciar) {
            listaDePokemons.innerHTML = novoHtml;
        } else {
            listaDePokemons.innerHTML += novoHtml;
        }

        contagemDeRegistros += pokemonsParaMostrar.length;
        botaoCarregarMais.style.display = contagemDeRegistros >= pokemonsFiltrados.length ? 'none' : 'block';
        document.getElementById("loader-container").style.display = "none";

    } catch (error) {
        console.error('Erro ao carregar os Pokemons', error);
    }
}

function carregarTodasGeracoes() {
    carregarItensPokemon(limitePorCarregamento);
    botaoCarregarMais.addEventListener('click', () => carregarItensPokemon(limitePorCarregamento));
}

window.onload = function () {
    document.getElementById("loader-container").style.display = "flex";
    carregarTodasGeracoes();
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
