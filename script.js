const container = document.querySelector('.cards-container');

function createCards(criatura) {
    const card = document.createElement('li');
    card.classList.add('card');
    // metadados do card para filtragem
    card.dataset.tipagem = criatura.classificacao.tipagem;
    card.dataset.tamanho = criatura.classificacao.tamanho;
    card.dataset.temperamento = criatura.classificacao.temperamento;
    card.dataset.nome = criatura.nome;
    card.dataset.id = criatura.id;
    card.dataset.hp = criatura.hp;
    card.dataset.nd = criatura.nd;
    card.dataset.mov = criatura.mov;

    // Cria o card html
    // Imagem: <img src="${criatura.imagem.principal}" alt="${criatura.nome}">
    card.innerHTML = `
        <img src="${criatura.imagem.principal}" alt="${criatura.nome}" class="card-imagem">
        <div class="card-conteudo">
            <h3>${criatura.nome}</h3>
            <section class="card-detalhes">
                <span class="stat">HP: ${criatura.hp}</span>
                <span class="stat">ND: ${criatura.nd}</span>
                <span class="stat">MOV: ${criatura.mov}m</span>
            </section>
        </div>
    `;
    return card;
}

let criaturasPorId = {};

fetch('./criaturas.json')
    .then(response => response.json())
    .then(dados => {
        const criaturas = Object.values(dados.criaturas);

        criaturasPorId = dados.criaturas;
        preencheDataList(Object.values(criaturas)); // Preenche o datalist com as opções de criaturas

        // Cria e adiciona os cards ao container
        Object.entries(dados.criaturas).forEach(([id, criatura]) => {
            const card = createCards(criatura);
            card.dataset.id = id;
            container.appendChild(card);
        });
        selectOrdenar.value = 'nome-asc';
        ordenarCards(); 
    });

function createFicha(criatura) {
    return `
        <h2 id="fichaTitulo">${criatura.nome}</h2>
        <img class="ficha-imagem-principal" src="${criatura.imagem.principal}" alt="${criatura.nome}">
        <section id="fichaDetalhes">
            <h3>Detalhes</h3>
            <p>HP: ${criatura.hp}</p>
            <p>ND: ${criatura.nd}</p>
            <p>MOV: ${criatura.mov}m</p>
            <p>Tamanho: ${criatura.classificacao.tamanho}</p>
            <p>Tipagem: ${criatura.classificacao.tipagem}</p>
            <p>Temperamento: ${criatura.classificacao.temperamento}</p>
        </section>
        <section class="fichaEcologia">
            <h3>Ecologia</h3>
            <p>Habitat: ${criatura.ecologia.habitat.join(', ')}</p>
            <p>Dieta: ${criatura.ecologia.dieta.join(', ')}</p>
            <p>Atividade: ${criatura.ecologia.atividade}</p>
            <p>Organização: ${criatura.ecologia.organizacao.tipo} (${criatura.ecologia.organizacao.quantidade})</p>
            <p>Reprodução: ${criatura.ecologia.reproducao}</p>
            <p>Expectativa de Vida: ${criatura.ecologia.expectativaDeVida || 'Desconhecida'}</p>
        </section>
        <section class="fichaHabilidades">
            <h3>Habilidades</h3>
            <ul>
                ${criatura.habilidades.map(hab => `<li><h4>${hab.nome}</h4><p>${hab.descricao}</p></li>`).join('')}
            </ul>
        </section>
        <section class="fichaDescricao">
            <h3>Descrição</h3>
            <p>${criatura.descricao}</p>
        </section>
        <section class="galeria">
            <h3>Galeria de Imagens</h3>
            ${criatura.imagem.galeria.map(img => `<img src="${img}" alt="${criatura.nome}">`).join('')}
        </section>
    `;
}

const ficha = document.getElementById('ficha');
const fichaConteudo = document.getElementById('fichaConteudo');

container.addEventListener('click', (e) => {
    const card = e.target.closest('.card'); //sobe do elemento clicado até o card
    if (!card) return;                      // clicou fora de um card
    const criatura = criaturasPorId[card.dataset.id];
    fichaConteudo.innerHTML = createFicha(criatura);
    ficha.showModal();
});

// Abre ficha quando clica no card
container.addEventListener('click', (e) => {
    const card = e.target.closest('.card'); // sobe do elemento clicado até o card
    if (!card) return;                      // clicou fora de um card

    const criatura = criaturasPorId[card.dataset.id];
    fichaConteudo.innerHTML = createFicha(criatura);
    ficha.showModal();
});
//fecha ficha quando clica fora do card
ficha.addEventListener('click', (e) => {
    if (e.target === ficha) ficha.close();
});



/*====================PESQUISA=============================*/
// SORTING CARDS POR SELECT
const selectOrdenar = document.getElementById('ordenar');

function ordenarCards() {
    const [campo, direcao] = selectOrdenar.value.split('-');

    const cards = Array.from(container.children);

    cards.sort((a, b) => {
        const resultado = a.dataset[campo].localeCompare(b.dataset[campo], undefined, { numeric: true });
        return direcao === 'asc' ? resultado : -resultado;
    });

    // reposiciona os cards na página na nova ordem
    cards.forEach(card => container.appendChild(card));
}

selectOrdenar.addEventListener('change', ordenarCards);
//// SEARCH BAR APLICACAO:
function normalizar(texto) {
    return texto
        .normalize('NFD')                 // "á" vira "a" + o acento solto
        .replace(/[\u0300-\u036f]/g, '')  // remove os acentos soltos
        .toLowerCase();
}

// FILTRAGENS DE QUAIS CARDS DEVEM APARECER POR MEIO DOS CHECKBOXES
//card.classList.add("invisivel")
//card.classList.remove("invisivel");
// procura card por card de criatura quais tem as informações que estão nos filtros selecionados, se tiver, mostra o card, se não tiver, esconde o car
//<ul class="cards-container"
// relação: se checkbox com data-(tamanho/temperamento/tipagem) estiver selecionado, então o card com a mesma informação deve aparecer, se não tiver, o card deve sumir
const filtros = document.querySelectorAll('.filtro input[type="checkbox"]')
const searchInput = document.getElementById('searchInput');

function filtrarCards() {
    const cards = document.querySelectorAll('.card');
    const textoBusca = normalizar(searchInput.value.trim());

    // quais checkboxes estão selecionados
    const selecionados = {
        tipagem: [],
        tamanho: [],
        temperamento: []
    };
    filtros.forEach(cb => {
        if (cb.checked) {
            selecionados[cb.name].push(cb.value);
        }
    });

    //verifica cada card para saber se ele atende aos filtros
    cards.forEach(card => {
        let corresponde = true; // caso base: card aparece
        if (textoBusca !== '' && !normalizar(card.dataset.nome).includes(textoBusca)) {
            corresponde = false;
        }

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

//Toda vez que digita na search bar chama a função de filtro
searchInput.addEventListener('input', filtrarCards);

// toda vez que altera um checkbox chama a fncao de filtro
filtros.forEach(cb => cb.addEventListener('change', filtrarCards));

// Range input event listener
const searchRange = document.getElementById('searchRange');
const searchRangeValor = document.getElementById('searchRangeValor');
const cardContainer = document.querySelector('.cards-container');
searchRange.addEventListener('input', () => {
    searchRangeValor.textContent = searchRange.value;
    cardContainer.style.setProperty('--colunas', searchRange.value);
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