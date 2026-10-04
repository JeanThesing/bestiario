const container = document.querySelector('.cards-container');

function createCard(criatura) {
    const card = document.createElement('div');
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
        Object.values(dados.criaturas).forEach(criatura => {
            const card = createCard(criatura);
            container.appendChild(card);
        });
    });