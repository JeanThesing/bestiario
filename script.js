const container = document.querySelector('.cards-container');

function createCard(criatura) {
    const card = document.createElement('li');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${criatura.imagem.principal}" alt="${criatura.nome}">
        <h3>${criatura.nome}</h3>
        <p>HP: ${criatura.hp}</p>
        <p>ND: ${criatura.nd}</p>
        <p>Tamanho: ${criatura.classificacao.tamanho}</p>
        <p>Tipagem: ${criatura.classificacao.tipagem}</p>
        <p>Comportamento: ${criatura.classificacao.comportamento}</p>
    `;
    return card;
}

fetch('./criaturas.json')
    .then(response => response.json())
    .then(dados => {
        const criaturas = Object.values(dados.criaturas);

        preencheDataList(Object.values(criaturas)); // Preenche o datalist com as opções de criaturas

        // Cria e adiciona os cards ao container
        criaturas.forEach(criatura => {
            const card = createCard(criatura);
            container.appendChild(card);
        });
    });



/*====================PESQUISA=============================*/

// Range input event listener
const searchRange = document.getElementById('searchRange');
const searchRangeValor = document.getElementById('searchRangeValor');

searchRange.addEventListener('input', () => {
    searchRangeValor.textContent = searchRange.value;
}
);

// Limpa checkboxes de filtros qund apertar Limpar filtros
const limparFiltros = document.getElementById('limparFiltros');

limparFiltros.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.filtro input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
});

// Preenche o datalist com as opções de criaturas
function preencheDataList(criaturas) {
    const datalist = document.getElementById('listaCriaturas');
    datalist.innerHTML = ''; // Limpa o datalist antes de preenchê-lo
    criaturas.forEach(criatura => {
        const option = document.createElement('option');
        option.value = criatura.nome;
        datalist.appendChild(option);
    });
}
/*====================================================================*/


/*
teste com varias criaturas (json)
"Dorothy": {
            "nome": "Dorothy"
        },
        "Carlos": {
            "nome": "Carlos"
        },
        "Marcon": {
            "nome": "Marcon"
        },
        "Daryl": {
            "nome": "Daryl"
        },
        "Bolsonaro": {
            "nome": "Bolsonaro"
        },
        "Lula": {
            "nome": "Lula"
        },
        "Damon": {
            "nome": "Damon"
        }
*/