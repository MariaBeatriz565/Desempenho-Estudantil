const porId = id => document.getElementById(id);
const formato = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const niveis = { Low: "Baixo", Medium: "Médio", High: "Alto" };
let estudantes = [];
let mediaAtual = null;
let metas = [];
let metaEditada = null;

function agrupar(registros, chave) {
  const grupos = new Map();
  for (const registro of registros) {
    const categoria = chave(registro);
    const grupo = grupos.get(categoria) || { soma: 0, total: 0 };
    grupo.soma += registro.nota;
    grupo.total++;
    grupos.set(categoria, grupo);
  }
  return grupos;
}

function criarGrafico(id, tipo, eixo, cor, linear = false) {
  return new Chart(porId(id), {
    type: tipo,
    data: {
      labels: [], datasets: [{
        data: [], borderColor: cor, backgroundColor: cor, borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false }, tooltip: {
          callbacks: {
            label: item => `Média: ${formato.format(item.parsed.y)} pontos · n = ${item.raw.total}`
          }
        }
      },
      scales: {
        x: { type: linear ? "linear" : "category", title: { display: true, text: eixo } },
        y: { beginAtZero: true, title: { display: true, text: "Nota média (pontos)" } }
      }
    }
  });
}

function preencherGrafico(grafico, grupos, categorias, rotulos) {
  grafico.data.labels = rotulos;
  grafico.data.datasets[0].data = categorias.map((categoria, indice) => {
    const grupo = grupos.get(categoria);
    return { x: rotulos[indice], y: grupo ? grupo.soma / grupo.total : null, total: grupo?.total };
  });
  grafico.update();
}

async function iniciarGraficos() {
  try {
    const resposta = await fetch("dados.json");
    if (!resposta.ok) throw new Error("Base indisponível");
    const base = await resposta.json();
    estudantes = base.registros.map(([horas, frequencia, recursos, nota]) =>
      ({ horas, frequencia, recursos, nota }));
    const horas = criarGrafico("horas", "line", "Horas estudadas (h)", "#A40062", true);
const frequencia = criarGrafico("frequencia", "bar", "Frequência às aulas (%)", "#D162A4");
const recursos = criarGrafico("recursos", "bar", "Nível de acesso a recursos", "#FF9B56");
    const atualizar = () => {
      const nivel = porId("filtro").value;
      const selecao = estudantes.filter(aluno => !nivel || aluno.recursos === nivel);
      const media = chave => selecao.length
        ? selecao.reduce((soma, aluno) => soma + aluno[chave], 0) / selecao.length
        : null;
      mediaAtual = media("nota");
      porId("total").textContent = formato.format(selecao.length);
      porId("nota").textContent = mediaAtual === null ? "—" : formato.format(mediaAtual);
      porId("presenca").textContent = selecao.length ? formato.format(media("frequencia")) + "%" : "—";
      const porHora = agrupar(selecao, aluno => aluno.horas);
      const horasOrdenadas = [...porHora.keys()].sort((a, b) => a - b);
      preencherGrafico(horas, porHora, horasOrdenadas, horasOrdenadas);
      preencherGrafico(frequencia, agrupar(selecao, aluno => Math.min(90, Math.floor(aluno.frequencia / 10) * 10)),
        [60, 70, 80, 90], ["60–69", "70–79", "80–89", "90–100"]);
      preencherGrafico(recursos, agrupar(selecao, aluno => aluno.recursos),
        Object.keys(niveis), Object.values(niveis));
      mostrarMetas();
    };
    porId("filtro").addEventListener("change", atualizar);
    atualizar();
    porId("dados-status").textContent = "";
  } catch (erro) {
    porId("dados-status").textContent = "Não foi possível carregar os gráficos. Confira a conexão e recarregue.";
    console.error(erro);
  }
}

async function apiMetas(metodo, caminho = "", dados) {
  const resposta = await fetch("https://parseapi.back4app.com/classes/MetaAcademica" + caminho, {
    method: metodo,
    headers: {
      "X-Parse-Application-Id": BACK4APP.appId,
      "X-Parse-JavaScript-Key": BACK4APP.javascriptKey,
      "Content-Type": "application/json"
    },
    body: dados ? JSON.stringify(dados) : undefined
  });
  if (!resposta.ok) throw new Error(`Back4App retornou HTTP ${resposta.status}`);
  return resposta.json();
}

function mostrarMetas() {
  const lista = porId("lista");
  lista.replaceChildren();
  for (const meta of metas) {
    const item = document.createElement("li");
    const detalhe = document.createElement("span");
    const diferenca = mediaAtual === null ? null : meta.notaAlvo - mediaAtual;
    const comparacao = diferenca === null ? "" : diferenca > 0
      ? ` · Faltam ${formato.format(diferenca)} pontos na média da seleção`
      : " · A média da seleção atingiu a meta";
    detalhe.textContent = `${meta.nome} · ${formato.format(meta.notaAlvo)} pontos${comparacao}`;
    const acoes = document.createElement("div");
    const editar = document.createElement("button");
    editar.textContent = "Editar";
    editar.onclick = () => {
      if (porId("campos").disabled) return;
      metaEditada = meta.objectId;
      porId("nome").value = meta.nome;
      porId("alvo").value = meta.notaAlvo;
      porId("salvar").textContent = "Salvar edição";
      porId("cancelar").hidden = false;
      porId("nome").focus();
    };
    const excluir = document.createElement("button");
    excluir.textContent = "Excluir";
    excluir.onclick = () => {
      if (porId("campos").disabled || !confirm(`Excluir a meta “${meta.nome}”?`)) return;
      executarMeta(async () => {
        await apiMetas("DELETE", "/" + encodeURIComponent(meta.objectId));
        metas = metas.filter(registro => registro.objectId !== meta.objectId);
        if (metaEditada === meta.objectId) limparFormulario();
      }, "Meta excluída.");
    };
    acoes.append(editar, excluir);
    item.append(detalhe, acoes);
    lista.append(item);
  }
}

function limparFormulario() {
  metaEditada = null;
  porId("form").reset();
  porId("salvar").textContent = "Cadastrar meta";
  porId("cancelar").hidden = true;
}

async function executarMeta(operacao, mensagem) {
  porId("campos").disabled = true;
  porId("meta-status").textContent = "Aguarde…";
  try {
    await operacao();
    mostrarMetas();
    porId("meta-status").textContent = mensagem;
  } catch (erro) {
    porId("meta-status").textContent = "Falha na comunicação com o Back4App. Confira a conexão, as chaves e as permissões da classe.";
    console.error(erro);
  } finally {
    porId("campos").disabled = false;
  }
}

function iniciarMetas() {
  if (!BACK4APP.appId || !BACK4APP.javascriptKey) {
    porId("meta-status").textContent = "Para habilitar as metas, configure o app Back4App conforme o README do projeto.";
    return;
  }
  porId("cancelar").onclick = limparFormulario;
  porId("form").addEventListener("submit", evento => {
    evento.preventDefault();
    const nome = porId("nome").value.trim();
    if (!nome) {
      porId("meta-status").textContent = "Digite um nome para a meta.";
      return;
    }
    const dados = { nome, notaAlvo: porId("alvo").valueAsNumber };
    executarMeta(async () => {
      if (metaEditada) {
        await apiMetas("PUT", "/" + encodeURIComponent(metaEditada), dados);
        metas = metas.map(meta => meta.objectId === metaEditada ? { ...meta, ...dados } : meta);
      } else {
        const criada = await apiMetas("POST", "", dados);
        metas.unshift({ ...dados, objectId: criada.objectId });
      }
      limparFormulario();
    }, "Meta salva.");
  });
  executarMeta(async () => {
    const pagina = 100;
    let resultados;
    do {
      const resposta = await apiMetas("GET", `?order=objectId&limit=${pagina}&skip=${metas.length}`);
      resultados = resposta.results;
      metas.push(...resultados);
    } while (resultados.length === pagina);
  }, "Metas carregadas.");
}

async function carregarIndicadorPublico() {
  try {
    const resposta = await fetch("https://api.worldbank.org/v2/country/BRA/indicator/SE.SEC.ENRR?format=json&mrv=1");
    if (!resposta.ok) throw new Error("API indisponível");
    const [, registros] = await resposta.json();
    const indicador = registros?.find(registro => Number.isFinite(registro.value));
    if (!indicador) throw new Error("Indicador indisponível");
    porId("indicador-publico").textContent = `${formato.format(indicador.value)}% em ${indicador.date}`;
  } catch {
    porId("indicador-publico").textContent = "Indicador indisponível no momento. Consulte a fonte abaixo.";
  }
}

iniciarGraficos();
iniciarMetas();
carregarIndicadorPublico();
