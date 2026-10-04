const container = document.querySelector('.cards-container');

function createCard(criatura) {
    const card = document.createElement('li');
    card.classList.add('card');
    // metadados do card para filtragem
    card.dataset.tipagem = criatura.classificacao.tipagem;
    card.dataset.tamanho = criatura.classificacao.tamanho;
    card.dataset.comportamento = criatura.classificacao.comportamento;
    card.dataset.id = criatura.id;

    // Cria o card html
    // Imagem: <img src="${criatura.imagem.principal}" alt="${criatura.nome}">
    card.innerHTML = `
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
// FILTRAGENS DE QUAIS CARDS DEVEM APARECER POR MEIO DOS CHECKBOXES
//card.classList.add("invisivel")
//card.classList.remove("invisivel");
// procura card por card de criatura quais tem as informações que estão nos filtros selecionados, se tiver, mostra o card, se não tiver, esconde o car
//<ul class="cards-container"
// relação: se checkbox com data-(tamanho/comportamento/tipagem) estiver selecionado, então o card com a mesma informação deve aparecer, se não tiver, o card deve sumir
const filtros = document.querySelectorAll('.filtro input[type="checkbox"]')

function filtrarCards() {
    // quais checkboxes estão selecionados
    const selecionados = {
        tipagem: [],
        tamanho: [],
        comportamento: []
    };
    filtros.forEach(cb => {
        if (cb.checked){
            selecionados[cb.name].push(cb.value);
        }
    });

    //verifica cada card para saber se ele atende aos filtros
    document.querySelectorAll('.card').forEach(card => {
        let corresponde = true; // caso base: card aparece

        for (const grupo in selecionados) {
            const valores = selecionados[grupo];// filtros selecionados (ex: terreste, voador, etc)   
            const valorDoCard = card.dataset[grupo];// valor do card (ex terrestre)
            // se nenhum filtro foi marcado não restringe o card
            if (valores.length === 0) {
                continue;
            }
            // se o valor do card não está entre os marcados, ele não aparece
            if (!valores.includes(valorDoCard)) {
                corresponde = false;
            }
        }
        //mostra ou nao o card de acordo se ele corresponde aos filtros
        if (corresponde) {
            card.classList.remove('invisivel');
        } else {
            card.classList.add('invisivel');
        }
    });
}
// toda vez que altera um checkbox chama a fncao de filtro
filtros.forEach(cb => cb.addEventListener('change', filtrarCards));



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
    filtros.forEach(checkbox => {
        checkbox.checked = false;
    });
    filtrarCards(); // Atualiza a exibição dos cards após limpar os filtros
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