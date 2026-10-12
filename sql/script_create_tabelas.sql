USE bestiario;
-- =====================================================================
-- Esqueleto SQL para o JSON de criaturas (compatível com PostgreSQL;
-- para MySQL troque SERIAL por INT AUTO_INCREMENT)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela principal: campos simples e objetos 1:1 (classificacao,
-- ecologia, ecologia.organizacao) viram colunas da própria tabela
-- ---------------------------------------------------------------------
CREATE TABLE criaturas (
    id                      SERIAL PRIMARY KEY,         -- int auto increment
    nome                    VARCHAR(150) NOT NULL,      -- "Corneteiro"

    -- stats
    hp                      INT,
    ce                      INT,
    ca						INT,
    mov                     INT,

    -- classificacao
    class_tipagem           VARCHAR(50),                -- "Terrestre"
    class_tamanho           VARCHAR(50),                -- "Gigante"
    class_temperamento      VARCHAR(50),                -- "Neutro"

    -- ecologia (campos simples)
    eco_atividade           VARCHAR(50),                -- "Diurna"
    eco_reproducao          VARCHAR(255),               -- "Desconhecida"
    eco_expectativa_vida    VARCHAR(100),               -- "30 a 45 anos"

    -- ecologia.organizacao
    eco_organizacao_tipo        VARCHAR(50),            -- "Manada"
    eco_organizacao_quantidade  VARCHAR(100),           -- "10 a 20 indivíduos"

    -- imagem.principal
    imagem_principal        BLOB
);

-- ---------------------------------------------------------------------
-- imagem.galeria (array de strings)
-- ---------------------------------------------------------------------
CREATE TABLE criatura_galeria (
    id           SERIAL PRIMARY KEY,
    criatura_id  INT NOT NULL REFERENCES criaturas(id) ON DELETE CASCADE,
    caminho      VARCHAR(255) NOT NULL,
    ordem        INT NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------
-- ecologia.habitat (N:N) -> tabela de domínio + tabela de ligação
-- ---------------------------------------------------------------------
CREATE TABLE habitats (
    id    SERIAL PRIMARY KEY,
    nome  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE criatura_habitats (
    criatura_id  INT NOT NULL REFERENCES criaturas(id) ON DELETE CASCADE,
    habitat_id   INT NOT NULL REFERENCES habitats(id),
    PRIMARY KEY (criatura_id, habitat_id)
);

-- ---------------------------------------------------------------------
-- ecologia.dieta (N:N)
-- ---------------------------------------------------------------------
CREATE TABLE dietas (
    id    SERIAL PRIMARY KEY,
    nome  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE criatura_dietas (
    criatura_id  INT NOT NULL REFERENCES criaturas(id) ON DELETE CASCADE,
    dieta_id     INT NOT NULL REFERENCES dietas(id),
    PRIMARY KEY (criatura_id, dieta_id)
);

-- ---------------------------------------------------------------------
-- habilidades (array de objetos)
-- ---------------------------------------------------------------------
CREATE TABLE criatura_habilidades (
    id           SERIAL PRIMARY KEY,
    criatura_id  INT NOT NULL REFERENCES criaturas(id) ON DELETE CASCADE,
    nome         VARCHAR(150) NOT NULL,     -- "Cornetada"
    tipo         VARCHAR(50),               -- "Ativa"
    descricao    TEXT
);

-- ---------------------------------------------------------------------
-- descricao (array de objetos titulo/texto)
-- ---------------------------------------------------------------------
CREATE TABLE criatura_descricoes (
    id           SERIAL PRIMARY KEY,
    criatura_id  INT NOT NULL REFERENCES criaturas(id) ON DELETE CASCADE,
    titulo       VARCHAR(150) NOT NULL,     -- "Visão geral"
    texto        TEXT,
    ordem        INT NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------
-- som (array de objetos link/descricao)
-- ---------------------------------------------------------------------
CREATE TABLE criatura_sons (
    id           SERIAL PRIMARY KEY,
    criatura_id  INT NOT NULL REFERENCES criaturas(id) ON DELETE CASCADE,
    link         VARCHAR(500) NOT NULL,
    descricao    VARCHAR(255)
);
