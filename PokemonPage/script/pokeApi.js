/*Responsável por fazer uma requisição à API PokeAPI para obter dados de um Pokémon específico, dado seu ID. Retorna um objeto com informações como ID, nome, tipos, número e URL da imagem do Pokémon.*/
async function buscarDadosPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const response = await fetch(url);
    const data = await response.json();
    const tipos = data.types.map(t => t.type.name);

    function capitalizarPrimeiraLetra(string) {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    }
    const nome = capitalizarPrimeiraLetra(data.name);

    return {
        id: data.id,
        nome: nome,
        tipos: tipos,
        numero: data.id.toString().padStart(3, '0'),
        urlImagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
    };
}