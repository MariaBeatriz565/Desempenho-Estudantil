# Dashboard de Desempenho Estudantil

Dashboard interativo desenvolvido para analisar fatores associados ao desempenho acadêmico de estudantes, utilizando visualizações de dados, indicadores estatísticos e integração com APIs.

O projeto permite explorar relações entre hábitos de estudo, frequência às aulas, acesso a recursos educacionais e resultados em avaliações, facilitando a interpretação dos dados por meio de uma interface web.

## Tecnologias utilizadas

- **HTML5:** estrutura e organização da aplicação.
- **CSS3:** estilização e responsividade da interface.
- **JavaScript:** manipulação dos dados, interatividade e lógica da aplicação.
- **Chart.js:** construção de gráficos dinâmicos.
- **API REST:** integração e gerenciamento de metas acadêmicas.
- **JSON:** armazenamento e leitura da base de estudantes.
- **Render:** hospedagem e publicação da aplicação.
- **Git e GitHub:** versionamento do código-fonte.

## Funcionalidades

### Análise de desempenho acadêmico

O dashboard apresenta indicadores e gráficos interativos para explorar os dados educacionais.

**Indicadores:**
- Quantidade de estudantes na seleção.
- Nota média dos estudantes.
- Frequência média às aulas.

**Visualizações:**
- Relação entre horas estudadas e notas.
- Relação entre frequência às aulas e desempenho.
- Comparação de notas por nível de acesso a recursos educacionais.

A aplicação também permite filtrar os resultados conforme o nível de acesso a recursos, atualizando os indicadores e gráficos apresentados.

### Gerenciamento de metas acadêmicas

Implementação de funcionalidades CRUD para acompanhamento de metas acadêmicas, permitindo:

- Cadastrar metas com nome e nota-alvo.
- Consultar metas registradas.
- Editar metas existentes.
- Excluir metas.

As metas permitem comparar os objetivos definidos com a média de desempenho dos estudantes selecionados.

### Integração com API pública

A aplicação também apresenta um indicador educacional disponibilizado pelo Banco Mundial, relacionado à taxa bruta de matrícula no ensino secundário no Brasil.

Esse indicador oferece contexto educacional complementar e é apresentado separadamente dos dados utilizados nas análises do dashboard.

## Base de dados

O projeto utiliza o dataset **Student Performance Factors**, disponibilizado na plataforma Kaggle.

A base reúne informações sobre fatores relacionados ao desempenho acadêmico, incluindo:

| Variável | Descrição |
|---|---|
| `Hours_Studied` | Quantidade de horas estudadas |
| `Attendance` | Frequência às aulas |
| `Exam_Score` | Nota obtida na avaliação |
| `Access_to_Resources` | Nível de acesso a recursos educacionais |

Os dados são utilizados para gerar indicadores e visualizações que permitem identificar padrões e associações entre as variáveis analisadas.

**Fonte:** [Student Performance Factors — Kaggle](https://www.kaggle.com/datasets/lainguyn123/student-performance-factors)

## Estrutura do projeto

```text
Desempenho-Estudantil/
├── css/
│   └── style.css
├── js/
│   └── script.js
├── dados.json
└── index.html
```

A estrutura apresenta os principais arquivos da aplicação. O diretório `js/` também contém arquivos auxiliares de configuração.

## Como executar

1. Clone o repositório:

```bash
git clone https://github.com/MariaBeatriz565/Desempenho-Estudantil.git
```

2. Acesse a pasta do projeto:

```bash
cd Desempenho-Estudantil
```

3. Abra a pasta no Visual Studio Code.

4. Execute a aplicação utilizando a extensão Live Server ou outro servidor HTTP local, permitindo o carregamento dos dados JSON.

**Observação:** as funcionalidades integradas a APIs externas dependem da configuração dos serviços e de sua disponibilidade.

## Demonstração

O projeto está publicado na plataforma Render.

**Aplicação web:** [Acessar Dashboard de Desempenho Estudantil](https://desempenho-estudantil.onrender.com)

**Repositório:** [GitHub — Desempenho Estudantil](https://github.com/MariaBeatriz565/Desempenho-Estudantil)

**Aplicação web:** adicionar link público do Render.

## Objetivo e aprendizado

O desenvolvimento deste projeto permitiu aplicar conceitos de desenvolvimento web, manipulação de dados e integração de sistemas, com foco na apresentação de informações educacionais.

Entre os conhecimentos trabalhados estão:

- Construção de dashboards interativos.
- Manipulação e processamento de dados em JavaScript.
- Desenvolvimento de gráficos com Chart.js.
- Integração com APIs REST.
- Implementação de operações CRUD.
- Versionamento de código e publicação de aplicações web.

O dashboard realiza análises descritivas e não utiliza modelos preditivos de Machine Learning. As relações apresentadas nos gráficos representam associações observadas na base de dados, sem estabelecer causalidade.

## Desenvolvimento

Projeto acadêmico desenvolvido em equipe, com foco na aplicação prática de tecnologias web, visualização de dados e integração com serviços externos.

**Ano:** 2026.
