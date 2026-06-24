/* ══════════════════════════════════════
   BERECK ONE — JavaScript
   Catálogo, Carrinho, CEP API, WhatsApp
   ══════════════════════════════════════ */

// ─── NÚMERO WHATSAPP ───────────────────────────────────────
// Coloque o número da Bereck One aqui (com código do país, sem + ou espaços)
const WHATSAPP_NUM = "14988349715"; // ← SUBSTITUA PELO SEU NÚMERO

// ─── CATÁLOGO DE PRODUTOS ──────────────────────────────────
const produtos = [
  {
    id: 1,
    nome: "ESSENTIAL",
    desc: "Camiseta básica premium com caimento perfeito. 100% algodão penteado.",
    preco: 89.90,
    cores: [
      { nome: "Preto",   hex: "#0A0A0A" },
      { nome: "Branco",  hex: "#F5F0E8" },
      { nome: "Cinza",   hex: "#6B6B6B" },
    ],
    tamanhos: ["M", "G", "GG"],
    imagem: "img.overs/over1.jpeg", // Coloque o caminho da foto aqui: "fotos/essential.jpg"
    emoji: "👕",
  },
  {
    id: 2,
    nome: "STATEMENT",
    desc: "Estampa gráfica exclusiva Bereck One. Algodão 30.1 fio a fio.",
    preco: 119.90,
    cores: [
      { nome: "Preto",   hex: "#0A0A0A" },
      { nome: "Dourado", hex: "#C9A84C" },
    ],
    tamanhos: ["M", "G", "GG"],
    imagem: null,
    emoji: "🖤",
  },
  {
    id: 3,
    nome: "OVERSIZE",
    desc: "Corte oversized moderno, caimento relaxado. Perfeita para o dia a dia.",
    preco: 109.90,
    cores: [
      { nome: "Off White", hex: "#F0EBE1" },
      { nome: "Areia",     hex: "#C2AA8F" },
      { nome: "Preto",     hex: "#0A0A0A" },
    ],
    tamanhos: ["M", "G", "GG"],
    imagem: null,
    emoji: "🌿",
  },
  {
    id: 4,
    nome: "LIMITED",
    desc: "Edição limitada com detalhes em dourado bordados. Peça de colecionador.",
    preco: 149.90,
    cores: [
      { nome: "Preto", hex: "#0A0A0A" },
    ],
    tamanhos: ["M", "G", "GG"],
    imagem: null,
    emoji: "⭐",
  },
  {
    id: 5,
    nome: "CLASSIC",
    desc: "O modelo que iniciou tudo. Corte reto clássico, durabilidade garantida.",
    preco: 79.90,
    cores: [
      { nome: "Branco",  hex: "#F5F0E8" },
      { nome: "Preto",   hex: "#0A0A0A" },
      { nome: "Navy",    hex: "#1B2A4A" },
      { nome: "Vinho",   hex: "#6B1A2A" },
    ],
    tamanhos: ["M", "G", "GG"],
    imagem: null,
    emoji: "🏆",
  },
 
  {
    id: 6,
    nome: "URBAN",
    desc: "Inspirada nas ruas. Estampa de camuflagem exclusiva Bereck One.",
    preco: 129.90,
    cores: [
      { nome: "Verde",  hex: "#3A4A35" },
      { nome: "Desert", hex: "#C2A87A" },
    ],
    tamanhos: ["M", "G", "GG"],
    imagem: null,
    emoji: "🏙️",
    
  },
  
];

// ─── ESTADO ────────────────────────────────────────────────
let carrinho = [];
let selecoes = {}; // {prodId: {cor, tamanho}}

// ─── RENDERIZAR PRODUTOS ───────────────────────────────────
function renderProdutos() {
  const grid = document.getElementById("produtosGrid");
  grid.innerHTML = "";

  produtos.forEach(p => {
    selecoes[p.id] = { cor: p.cores[0].nome, tamanho: null };

    const card = document.createElement("div");
    card.className = "produto-card";
    card.innerHTML = `
      <div class="produto-img" id="img-${p.id}" onclick="abrirModal(${p.id})" style="cursor:zoom-in" title="Clique para ver detalhes">
        ${p.imagem
          ? `<img src="${p.imagem}" alt="${p.nome}" />`
          : `<div class="produto-img-placeholder">
               <span class="icon">${p.emoji}</span>
               <span>FOTO EM BREVE</span>
             </div>`
        }
        <div class="cor-badge" id="cores-${p.id}">
          ${p.cores.map((c, i) => `
            <span
              class="cor-dot ${i === 0 ? 'ativo' : ''}"
              style="background:${c.hex}"
              title="${c.nome}"
              onclick="selecionarCor(${p.id}, '${c.nome}', this)"
            ></span>
          `).join("")}
        </div>
      </div>
      <div class="produto-info">
        <div class="produto-nome">${p.nome}</div>
        <div class="produto-desc">${p.desc}</div>
        <div class="tamanho-group" id="tam-${p.id}">
          ${p.tamanhos.map(t => `
            <button class="tam-btn" onclick="selecionarTam(${p.id}, '${t}', this)">${t}</button>
          `).join("")}
        </div>
        <div class="produto-footer">
          <div class="produto-preco">
            <small>a partir de</small>
            R$ ${p.preco.toFixed(2).replace(".", ",")}
          </div>
          <button class="btn-add" onclick="adicionarAoCarrinho(${p.id})">+ CARRINHO</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function selecionarCor(prodId, corNome, el) {
  selecoes[prodId].cor = corNome;
  const grupo = document.getElementById(`cores-${prodId}`);
  grupo.querySelectorAll(".cor-dot").forEach(d => d.classList.remove("ativo"));
  el.classList.add("ativo");
}

function selecionarTam(prodId, tam, el) {
  selecoes[prodId].tamanho = tam;
  const grupo = document.getElementById(`tam-${prodId}`);
  grupo.querySelectorAll(".tam-btn").forEach(b => b.classList.remove("ativo"));
  el.classList.add("ativo");
}

// ─── CARRINHO ─────────────────────────────────────────────
function adicionarAoCarrinho(prodId) {
  const sel = selecoes[prodId];
  if (!sel.tamanho) {
    showToast("⚠️ Selecione um tamanho!");
    return;
  }
  const prod = produtos.find(p => p.id === prodId);
  carrinho.push({
    id: Date.now(),
    prodId,
    nome: prod.nome,
    cor: sel.cor,
    tamanho: sel.tamanho,
    preco: prod.preco,
    emoji: prod.emoji,
  });
  atualizarCarrinho();
  showToast(`✅ ${prod.nome} adicionado!`);
  abrirCarrinho();
}

function removerDoCarrinho(itemId) {
  carrinho = carrinho.filter(i => i.id !== itemId);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const total = carrinho.reduce((s, i) => s + i.preco, 0);
  document.getElementById("cartCount").textContent = carrinho.length;
  document.getElementById("cartTotal").textContent = formatBRL(total);

  const container = document.getElementById("cartItems");
  if (carrinho.length === 0) {
    container.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
    return;
  }
  container.innerHTML = carrinho.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-nome">${item.nome}</div>
        <div class="cart-item-meta">${item.cor} · Tamanho ${item.tamanho}</div>
        <div class="cart-item-preco">${formatBRL(item.preco)}</div>
      </div>
      <button class="cart-item-del" onclick="removerDoCarrinho(${item.id})">✕</button>
    </div>
  `).join("");
}

function abrirCarrinho() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function fecharCarrinho() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

function irParaCadastro() {
  fecharCarrinho();
  document.getElementById("cadastro").scrollIntoView({ behavior: "smooth" });
  atualizarResumoCheckout();
}

function atualizarResumoCheckout() {
  const resumo = document.getElementById("checkoutResumo");
  if (carrinho.length === 0) { resumo.style.display = "none"; return; }
  resumo.style.display = "block";
  const total = carrinho.reduce((s, i) => s + i.preco, 0);
  document.getElementById("resumoItens").innerHTML = carrinho.map(i => `
    <div class="resumo-item">
      <span>${i.nome} (${i.cor} · ${i.tamanho})</span>
      <span>${formatBRL(i.preco)}</span>
    </div>
  `).join("");
  document.getElementById("resumoTotal").textContent = formatBRL(total);
}

// ─── CEP API ──────────────────────────────────────────────
function mascaraCEP(el) {
  let v = el.value.replace(/\D/g, "");
  if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 8);
  el.value = v;
  if (v.replace("-", "").length === 8) buscarCEP();
}

async function buscarCEP() {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  const status = document.getElementById("cepStatus");
  if (cep.length !== 8) { status.textContent = "CEP inválido."; status.className = "cep-status cep-erro"; return; }

  status.textContent = "Buscando..."; status.className = "cep-status";

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) throw new Error("CEP não encontrado");

    document.getElementById("rua").value     = data.logradouro || "";
    document.getElementById("bairro").value  = data.bairro     || "";
    document.getElementById("cidadeUF").value= `${data.localidade} / ${data.uf}`;
    status.textContent = "✔ Endereço encontrado!";
    status.className   = "cep-status cep-ok";
    document.getElementById("numero").focus();
  } catch {
    document.getElementById("rua").value     = "";
    document.getElementById("bairro").value  = "";
    document.getElementById("cidadeUF").value= "";
    status.textContent = "CEP não encontrado. Verifique e tente novamente.";
    status.className   = "cep-status cep-erro";
  }
}

// ─── PAGAMENTO ────────────────────────────────────────────
let pagamentoSel = "";
function selecionarPag(el) { pagamentoSel = el.value; }

// ─── FINALIZAR PEDIDO → WHATSAPP ─────────────────────────
function finalizarPedido() {
  // Validações
  const nome     = document.getElementById("nome").value.trim();
  const cpf      = document.getElementById("cpf").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const genero   = document.querySelector('input[name="genero"]:checked');
  const cep      = document.getElementById("cep").value.trim();
  const rua      = document.getElementById("rua").value.trim();
  const numero   = document.getElementById("numero").value.trim();
  const bairro   = document.getElementById("bairro").value.trim();
  const cidadeUF = document.getElementById("cidadeUF").value.trim();
  const tipoComp = document.getElementById("tipoComp").value;
  const numComp  = document.getElementById("numComp").value.trim();

  if (!nome)        { showToast("⚠️ Informe seu nome completo"); return; }
  if (cpf.length < 14)     { showToast("⚠️ CPF inválido");             return; }
  if (!genero)      { showToast("⚠️ Selecione seu gênero");      return; }
  if (telefone.length < 14){ showToast("⚠️ Telefone inválido");         return; }
  if (!rua)         { showToast("⚠️ Busque o CEP primeiro");     return; }
  if (!numero)      { showToast("⚠️ Informe o número");          return; }
  if (carrinho.length === 0){ showToast("⚠️ Carrinho vazio!");           return; }
  if (!pagamentoSel){ showToast("⚠️ Selecione a forma de pagamento"); return; }

  const total = carrinho.reduce((s, i) => s + i.preco, 0);
  const complemento = tipoComp ? `${tipoComp} ${numComp}`.trim() : "Sem complemento";

  // Montar mensagem
  const itens = carrinho.map((i, idx) =>
    `   ${idx + 1}. ${i.nome} — Cor: ${i.cor} | Tam: ${i.tamanho} | ${formatBRL(i.preco)}`
  ).join("\n");

  const msg = `
*NOVO PEDIDO — BERECK ONE*

━━━━━━━━━━━━━━━━━━━━━━━━
*DADOS DO CLIENTE*
Nome: ${nome}
CPF: ${cpf}
Gênero: ${genero.value.charAt(0).toUpperCase() + genero.value.slice(1)}
Telefone: ${telefone}

*ENDEREÇO DE ENTREGA*
CEP: ${cep}
Rua: ${rua}, Nº ${numero}
Complemento: ${complemento}
Bairro: ${bairro}
Cidade/UF: ${cidadeUF}

*ITENS DO PEDIDO*
${itens}

━━━━━━━━━━━━━━━━━━━━━━━━
*TOTAL: ${formatBRL(total)}*
*Pagamento: ${pagamentoSel}*
━━━━━━━━━━━━━━━━━━━━━━━━

Obrigado por comprar na Bereck One! 
  `.trim();

  const url = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// ─── MÁSCARAS ────────────────────────────────────────────
function mascaraCPF(el) {
  let v = el.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  el.value = v;
}

function mascaraTel(el) {
  let v = el.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  else v = v.replace(/(\d{0,2})/, "($1");
  el.value = v;
}

// ─── UTILS ───────────────────────────────────────────────
function formatBRL(val) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}


let modalProdId = null;
let modalCorSel = null;
let modalTamSel = null;

function abrirModal(prodId) {
  const prod = produtos.find(p => p.id === prodId);
  if (!prod) return;

  modalProdId = prodId;
  modalCorSel = prod.cores[0].nome;
  modalTamSel = selecoes[prodId]?.tamanho || null;

  // Preencher conteúdo
  document.getElementById("modalNome").textContent  = prod.nome;
  document.getElementById("modalDesc").textContent  = prod.desc;
  document.getElementById("modalCorNome").textContent = modalCorSel;
  document.getElementById("modalEmoji").textContent = prod.emoji;
  document.getElementById("modalPreco").textContent = formatBRL(prod.preco);

  // Imagem
  const img = document.getElementById("modalImg");
  const ph  = document.getElementById("modalPlaceholder");
  if (prod.imagem) {
    img.src = prod.imagem; img.alt = prod.nome;
    img.style.display = "block"; ph.style.display = "none";
  } else {
    img.style.display = "none"; ph.style.display = "flex";
  }

  // Cores
  const coresEl = document.getElementById("modalCores");
  coresEl.innerHTML = prod.cores.map((c, i) => `
    <span
      class="modal-cor-dot ${i === 0 ? 'ativo' : ''}"
      style="background:${c.hex}"
      title="${c.nome}"
      onclick="modalSelecionarCor('${c.nome}', this)"
    ></span>
  `).join("");

  // Tamanhos
  const tamsEl = document.getElementById("modalTams");
  tamsEl.innerHTML = prod.tamanhos.map(t => `
    <button
      class="modal-tam-btn ${modalTamSel === t ? 'ativo' : ''}"
      onclick="modalSelecionarTam('${t}', this)"
    >${t}</button>
  `).join("");

  // Botão adicionar
  document.getElementById("modalBtnAdd").onclick = () => adicionarDoModal();

  // Abrir
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function modalSelecionarCor(nome, el) {
  modalCorSel = nome;
  document.getElementById("modalCorNome").textContent = nome;
  document.getElementById("modalCores").querySelectorAll(".modal-cor-dot")
    .forEach(d => d.classList.remove("ativo"));
  el.classList.add("ativo");
}

function modalSelecionarTam(tam, el) {
  modalTamSel = tam;
  document.getElementById("modalTams").querySelectorAll(".modal-tam-btn")
    .forEach(b => b.classList.remove("ativo"));
  el.classList.add("ativo");
}

function adicionarDoModal() {
  if (!modalTamSel) { showToast("⚠️ Selecione um tamanho!"); return; }
  const prod = produtos.find(p => p.id === modalProdId);
  carrinho.push({
    id: Date.now(),
    prodId: modalProdId,
    nome: prod.nome,
    cor: modalCorSel,
    tamanho: modalTamSel,
    preco: prod.preco,
    emoji: prod.emoji,
  });
  // Sincronizar com seleções do card
  selecoes[modalProdId].cor = modalCorSel;
  selecoes[modalProdId].tamanho = modalTamSel;
  atualizarCarrinho();
  fecharModal();
  showToast(`✅ ${prod.nome} adicionado!`);
  abrirCarrinho();
}

// Fechar modal com ESC
document.addEventListener("keydown", e => {
  if (e.key === "Escape") fecharModal();
});

// ─── INIT ─────────────────────────────────────────────────
renderProdutos();