async function buscarDadosAbility(id) {
    const url = `https://pokeapi.co/api/v2/ability/${id}/`;
    const response = await fetch(url);
    const data = await response.json();

    return {
        nome: capitalizarNome(data.name),
        descricao: data.effect_entries[0]?.effect || 'No description available'
    };
}