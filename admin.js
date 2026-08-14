const productsDefault = [
  {"id": 1, "name": "Blusa Fitness Azul", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Azul", "sizes": {"P": 3, "M": 5, "G": 4, "GG": 1}, "image": "assets/blusa-azul.jpeg", "featured": true},
  {"id": 2, "name": "Blusa Fitness Lima", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Lima", "sizes": {"P": 2, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-lima.jpeg", "featured": true},
  {"id": 3, "name": "Blusa Fitness Bordô", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Bordô", "sizes": {"P": 2, "M": 4, "G": 4, "GG": 1}, "image": "assets/blusa-bordo.jpeg", "featured": true},
  {"id": 4, "name": "Blusa Fitness Verde", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Verde", "sizes": {"P": 3, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-verde.jpeg", "featured": true},
  {"id": 5, "name": "Blusa Fitness Rosa", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Rosa", "sizes": {"P": 3, "M": 5, "G": 3, "GG": 1}, "image": "assets/blusa-rosa.jpeg", "featured": true},
  {"id": 6, "name": "Blusa Fitness Cinza", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Cinza", "sizes": {"P": 2, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-cinza.jpeg", "featured": true},
  {"id": 7, "name": "Short Fitness Essential", "category": "Shorts", "price": 69.9, "salePrice": null, "color": "Preto", "sizes": {"P": 2, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-cinza.jpeg", "featured": false},
  {"id": 8, "name": "Conjunto Fitness Performance", "category": "Conjuntos", "price": 119.9, "salePrice": null, "color": "Preto", "sizes": {"P": 2, "M": 3, "G": 3, "GG": 1}, "image": "assets/blusa-azul.jpeg", "featured": false}
];

const configDefault = {
  "storeName": "ApMundoFitness",
  "tagline": "Moda fitness feminina para acompanhar seu ritmo.",
  "whatsapp": "5599999999999",
  "instagram": "@apmundofitness",
  "delivery": {"Retirada na loja": 0, "Entrega local": 10, "Entrega expressa": 15},
  "adminUser": "andreapaula",
  "adminPassword": "2707"
};

let products = [];
let config = JSON.parse(localStorage.getItem("apm_config") || "null") || configDefault;

// Carregar produtos do products.json primeiro
fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = JSON.parse(localStorage.getItem("apm_products") || "null") || data;
    render(); // atualiza o painel administrativo
  })
  .catch(error => {
    console.error("Erro ao carregar products.json:", error);
    products = productsDefault; // fallback se der erro
    render();
  });

const save = () => {
  localStorage.setItem("apm_products", JSON.stringify(products));
  localStorage.setItem("apm_config", JSON.stringify(config));
};

const money = n => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
const totalStock = p => Object.values(p.sizes||{}).reduce((a,b)=>a+Number(b||0),0);

function render(){
  document.getElementById("statProducts").textContent = products.length;
  document.getElementById("statStock").textContent = products.reduce((a,p)=>a+totalStock(p),0);
  document.getElementById("statAvailable").textContent = products.filter(p=>totalStock(p)>0).length;
  const html = products.map(p=>`
    <div class="admin-product">
      <img src="${p.image}">
      <div>
        <h4>${p.name}</h4>
        <small>${p.category} · ${p.color} · ${money(Number(p.salePrice||p.price))} · Estoque: ${totalStock(p)}</small>
      </div>
      <div class="admin-actions">
        <button onclick="openEditor(${p.id})">EDITAR</button>
        <button class="delete" onclick="del(${p.id})">EXCLUIR</button>
      </div>
    </div>`).join("");
  document.getElementById("dashboardList").innerHTML = html;
  document.getElementById("productsList").innerHTML = html;
}

function openEditor(id){
  const p = products.find(x=>x.id===id);
  document.getElementById("editorModal").classList.add("open");
  document.getElementById("editorTitle").textContent = p ? "Editar produto" : "Novo produto";
  document.getElementById("pId").value = p?.id || "";
  document.getElementById("pName").value = p?.name || "";
  document.getElementById("pCategory").value = p?.category || "Blusas";
  document.getElementById("pPrice").value = p?.price ?? "";
  document.getElementById("pSale").value = p?.salePrice ?? "";
  document.getElementById("pColor").value = p?.color || "";
  document.getElementById("pImage").value = p?.image || "assets/blusa-azul.jpeg";
  document.getElementById("sizeP").value = p?.sizes?.P ?? 0;
  document.getElementById("sizeM").value = p?.sizes?.M ?? 0;
  document.getElementById("sizeG").value = p?.sizes?.G ?? 0;
  document.getElementById("sizeGG").value = p?.sizes?.GG ?? 0;
  document.getElementById("pFeatured").checked = !!p?.featured;
}

function closeEditor(){document.getElementById("editorModal").classList.remove("open")}
function del(id){if(confirm("Excluir este produto?")){products=products.filter(p=>p.id!==id);save();render()}}

document.getElementById("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id = Number(document.getElementById("pId").value);
  const obj = {
    id: id || Date.now(),
    name: pName.value,
    category: pCategory.value,
    price: Number(pPrice.value),
    salePrice: pSale.value ? Number(pSale.value) : null,
    color: pColor.value,
    image: pImage.value,
    featured: pFeatured.checked,
    sizes: {
      P: Number(sizeP.value||0),
      M: Number(sizeM.value||0),
      G: Number(sizeG.value||0),
      GG: Number(sizeGG.value||0)
    }
  };
  if(id) products = products.map(p=>p.id===id?obj:p);
  else products.push(obj);
  save(); closeEditor(); render(); alert("Produto salvo com sucesso.");
});

function showView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  document.querySelectorAll(".sidebar nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  document.getElementById("viewTitle").textContent = id==="dashboard"?"Dashboard":id==="products"?"Produtos":"Configurações";
  if(id==="settings") loadSettings();
}

document.querySelectorAll(".sidebar nav button").forEach(b=>b.onclick=()=>showView(b.dataset.view));

function loadSettings(){
  sName.value = config.storeName || "";
  sInstagram.value = config.instagram || "";
  sWhatsapp.value = config.whatsapp || "";
  sTagline.value = config.tagline || "";
  renderDeliveryRows();
}

function renderDeliveryRows(){
  const box = document.getElementById("deliveryRows");
  box.innerHTML = Object.entries
}