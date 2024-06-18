async function buscarDadosMove(id) {
    const url = `https://pokeapi.co/api/v2/move/${id}/`;
    const response = await fetch(url);
    const data = await response.json();

    return {
        nome: capitalizarNome(data.name),
        descricao: data.effect_entries[0]?.effect || 'No description available',
        poder: data.power || 'N/A',
        precisao: data.accuracy || 'N/A',
        pp: data.pp || 'N/A',
        tipo: capitalizarNome(data.type.name)
    };
}