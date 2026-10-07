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

/*Cria parágrafos para a descrição das criaturas*/
// transforma "parágrafo 1\n\nparágrafo 2" em <p>...</p><p>...</p>
function criarParagrafos(texto) {
    return texto
        .split('\n\n')
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
}

function createDescricao(descricao) {
    if (!descricao || descricao.length === 0) return '';    // sem descrição: nenhuma seção

    // formato antigo (texto único): as criaturas que você ainda não migrou
    if (typeof descricao === 'string') {
        return `
            <section class="fichaDescricao">
                <h3>Descrição</h3>
                ${criarParagrafos(descricao)}
            </section>
        `;
    }
    // formato novo: lista de seções
    return `
        <section class="fichaDescricao">
            <h3>Descrição</h3>
            ${descricao.map(secao => `
                <div class="descricao-secao">
                    ${secao.titulo ? `<h4>${secao.titulo}</h4>` : ''}
                    ${criarParagrafos(secao.texto)}
                </div>
            `).join('')}
        </section>
    `;
}

/*Cria a ficha em si*/
function createFicha(criatura) {
    return `
        <h2 id="fichaTitulo">${criatura.nome}</h2>
        <img class="ficha-imagem-principal" src="${criatura.imagem.principal}" alt="${criatura.nome}">
        <section id="fichaDetalhes">
            <h3>Detalhes</h3>
            <dl>
                <dt>HP</dt>
                    <dd>${criatura.hp}</dd>
                
                <dt>ND</dt>
                    <dd>${criatura.nd}</dd>
                
                <dt>MOV</dt>
                    <dd>${criatura.mov}m</dd>
            </dl>
            <div id="filterDetails">
                <dl>
                    <dt>Tamanho</dt><dd>${criatura.classificacao.tamanho}</dd>
                    <dt>Tipagem</dt><dd>${criatura.classificacao.tipagem}</dd>
                    <dt>Temperamento</dt><dd>${criatura.classificacao.temperamento}</dd>
                </dl>
            <div>
        </section>
        <section class="fichaEcologia">
            <h3>Ecologia</h3>
            <dl>
            <dt>Habitat</dt>
                <dd>${criatura.ecologia.habitat.join(', ')}</dd>
            <dt>Dieta</dt>
                <dd>${criatura.ecologia.dieta.join(', ')}</dd>
            <dt>Atividade</dt>
                <dd>${criatura.ecologia.atividade}</dd>
            <dt>Organização</dt>
                <dd>${criatura.ecologia.organizacao.tipo} (${criatura.ecologia.organizacao.quantidade})</dd>
            <dt>Reprodução</dt>
                <dd>${criatura.ecologia.reproducao}</dd>
            <dt>Expectativa de Vida</dt>
                <dd>${criatura.ecologia.expectativaDeVida || 'Desconhecida'}</dd>
            </dl>
        </section>
        <section class="fichaHabilidades">
            <h3>Habilidades</h3>
            <ul>
                ${criatura.habilidades.map(hab => `<li><h4>${hab.nome}</h4><p>${hab.descricao}</p></li>`).join('')}
            </ul>
        </section>
        <section class="galeria">
            <h3>Galeria de Imagens</h3>
            ${criatura.imagem.galeria.map(img => `<img src="${img}" alt="${criatura.nome}">`).join('')}
        </section>
        ${createDescricao(criatura.descricao)}
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

/*=====================================================================
=============galeria abrir e fechar imagem (lightbox)====================
===================================================================*/

/*galeria abrir e fechar imagem (lightbox)*/
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lbAnterior = document.getElementById('lbAnterior');
const lbProximo = document.getElementById('lbProximo');

let imagensAtuais = [];//as img da ficha aberta principal + galeria
let indiceAtual = 0;//qual delas ta ampliada

function mostrarImagem(i) {
    const total = imagensAtuais.length;
    indiceAtual = (i + total) % total; //passa da última para a primeira, e vice-versa
    const img = imagensAtuais[indiceAtual];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
}

// abre ao clicar numa imagem da ficha
fichaConteudo.addEventListener('click', (e) => {
    const img = e.target.closest('.galeria img, .ficha-imagem-principal');
    if (!img) return;//clicou em outra coisa da ficha

    imagensAtuais = Array.from(
        fichaConteudo.querySelectorAll('.ficha-imagem-principal, .galeria img')
    );
    lbAnterior.hidden = lbProximo.hidden = imagensAtuais.length < 2;  //sem setas se so tem uma
    mostrarImagem(imagensAtuais.indexOf(img));
    lightbox.showModal();
});

//setas na tela
lbAnterior.addEventListener('click', () => mostrarImagem(indiceAtual - 1));
lbProximo.addEventListener('click', () => mostrarImagem(indiceAtual + 1));

//setas do teclado
lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrarImagem(indiceAtual - 1);
    if (e.key === 'ArrowRight') mostrarImagem(indiceAtual + 1);
});

//fecha clicando no fundo escuro
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
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
///SEARCH BAR APLICACAO:
function normalizar(texto) {
    return texto
        .normalize('NFD')// "á" vira "a" + o acento solto
        .replace(/[\u0300-\u036f]/g, '') // remove os acentos soltos
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

/*=========================RANDOM CREATURE===============================*/

const botaoAleatorio = document.getElementById('randomCreature');
let ultimoSorteado = null;

function sorteiaCriaturaRandom() {
    // só os cards que passaram pelos filtros e pela busca
    const visiveis = document.querySelectorAll('.card:not(.invisivel)');
    const ids = Array.from(visiveis, card => card.dataset.id);
    console.log('ids:', ids);

    if (ids.length === 0) return; // sem card tela

    let id;
    do {
        id = ids[Math.floor(Math.random() * ids.length)];
    } while (id === ultimoSorteado && ids.length > 1);

    ultimoSorteado = id;

    /*Abre Ficha aleatoria*/
    console.log('id sorteado:', id, '| criatura:', criaturasPorId[id]);
    fichaConteudo.innerHTML = createFicha(criaturasPorId[id]);
    ficha.showModal();
}
/*Botão de sortear craitura aleatoria*/
botaoAleatorio.addEventListener('click', sorteiaCriaturaRandom);
