document.addEventListener("DOMContentLoaded", () => {
    const previousButton = document.getElementById("previous-button");
    const nextButton = document.getElementById("next-button");
    const pokemonName = document.getElementById("pokemon-name");
    const pokemonImage = document.getElementById("pokemon-image");
    const pokemonTypesContainer = document.getElementById("pokemon-types");
    const pokemonStats = document.getElementById("pokemon-stats");
    const pokemonAdvantagesContainer = document.getElementById("pokemon-advantages");
    const pokemonDisadvantagesContainer = document.getElementById("pokemon-disadvantages");
    const pokemonDescription = document.getElementById("pokemon-description");
    const pokemonHeight = document.getElementById("pokemon-height");
    const pokemonWeight = document.getElementById("pokemon-weight");
    const pokemonGender = document.getElementById("pokemon-gender");
    const pokemonCategory = document.getElementById("pokemon-category");
    const pokemonAbilities = document.getElementById("pokemon-abilities");

    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const fetchPokemonData = async (id) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const pokemonData = await response.json();

            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
            if (!speciesResponse.ok) throw new Error('Network response was not ok');
            const speciesData = await speciesResponse.json();
            const description = speciesData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text;

            displayPokemonData(pokemonData, speciesData, description);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const displayPokemonData = (pokemon, species, description) => {
        pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`;
        pokemonImage.alt = pokemon.name;

        pokemonTypesContainer.innerHTML = `<strong>Types:</strong><br>${pokemon.types.map(typeInfo => `<span class="pokemon-type" style="background-color: ${typeColors[typeInfo.type.name]};">${capitalizeFirstLetter(typeInfo.type.name)}</span>`).join("")}`;

        pokemonStats.innerHTML = "<strong>Base Stats:</strong>";
        const statBarsContainer = document.createElement('div');
        statBarsContainer.className = 'stat-bars-container';
        pokemonStats.appendChild(statBarsContainer);

        pokemon.stats.forEach(stat => {
            const statBar = document.createElement('div');
            statBar.className = 'stat-bar';
            statBar.style.height = `${stat.base_stat}px`;

            const statName = document.createElement('span');
            statName.className = 'stat-name';
            statName.textContent = capitalizeFirstLetter(stat.stat.name);

            const statValue = document.createElement('span');
            statValue.className = 'stat-value';
            statValue.textContent = stat.base_stat;

            const statContainer = document.createElement('div');
            statContainer.className = 'stat-container';
            statContainer.appendChild(statName);
            statContainer.appendChild(statBar);
            statContainer.appendChild(statValue);
            statBarsContainer.appendChild(statContainer);
        });

        pokemonHeight.textContent = `Height: ${pokemon.height * 10} cm`;
        pokemonWeight.textContent = `Weight: ${pokemon.weight / 10} kg`;

        const genderRatio = species.gender_rate;
        if (genderRatio === -1) {
            pokemonGender.textContent = "Gender: Genderless";
        } else {
            const femaleRatio = species.gender_rate * 12.5;
            const maleRatio = 100 - femaleRatio;
            pokemonGender.textContent = `Gender: ${maleRatio}% Male / ${femaleRatio}% Female`;
        }

        pokemonCategory.textContent = `Category: ${capitalizeFirstLetter(species.genera.find(genus => genus.language.name === "en").genus)}`;

        pokemonAbilities.innerHTML = `<strong>Abilities:</strong><br>${pokemon.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(", ")}`;

        fetchTypeAdvantages(pokemon.types.map(typeInfo => typeInfo.type.url));

        pokemonDescription.textContent = description;
    };

    const fetchTypeAdvantages = async (typeUrls) => {
        let advantages = new Set();
        let disadvantages = new Set();

        for (const url of typeUrls) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const typeData = await response.json();

                typeData.damage_relations.double_damage_to.forEach(type => advantages.add(type.name));
                typeData.damage_relations.double_damage_from.forEach(type => disadvantages.add(type.name));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        pokemonAdvantagesContainer.innerHTML = `<strong>Advantages:</strong><br>${Array.from(advantages).map(type => `<span class="pokemon-type" style="background-color: ${typeColors[type]};">${type}</span>`).join("")}`;
        pokemonDisadvantagesContainer.innerHTML = `<strong>Disadvantages:</strong><br>${Array.from(disadvantages).map(type => `<span class="pokemon-type" style="background-color: ${typeColors[type]};">${type}</span>`).join("")}`;
    };

    previousButton.addEventListener("click", () => {
        const currentPokemonId = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
        if (currentPokemonId > 1) {
            updateUrlAndFetchData(currentPokemonId - 1);
        }
    });

    nextButton.addEventListener("click", () => {
        const currentPokemonId = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
        updateUrlAndFetchData(currentPokemonId + 1);
    });

    const updateUrlAndFetchData = (id) => {
        window.history.pushState(null, null, `?id=${id}`);
        fetchPokemonData(id);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');
    if (pokemonId) {
        fetchPokemonData(pokemonId);
    }
});
