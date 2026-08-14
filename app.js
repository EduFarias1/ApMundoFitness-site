const defaultProducts = [{"id": 1, "name": "Blusa Fitness Azul", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Azul", "sizes": {"P": 3, "M": 5, "G": 4, "GG": 1}, "image": "assets/blusa-azul.jpeg", "featured": true}, {"id": 2, "name": "Blusa Fitness Lima", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Lima", "sizes": {"P": 2, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-lima.jpeg", "featured": true}, {"id": 3, "name": "Blusa Fitness Bordô", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Bordô", "sizes": {"P": 2, "M": 4, "G": 4, "GG": 1}, "image": "assets/blusa-bordo.jpeg", "featured": true}, {"id": 4, "name": "Blusa Fitness Verde", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Verde", "sizes": {"P": 3, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-verde.jpeg", "featured": true}, {"id": 5, "name": "Blusa Fitness Rosa", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Rosa", "sizes": {"P": 3, "M": 5, "G": 3, "GG": 1}, "image": "assets/blusa-rosa.jpeg", "featured": true}, {"id": 6, "name": "Blusa Fitness Cinza", "category": "Blusas", "price": 59.9, "salePrice": null, "color": "Cinza", "sizes": {"P": 2, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-cinza.jpeg", "featured": true}, {"id": 7, "name": "Short Fitness Essential", "category": "Shorts", "price": 69.9, "salePrice": null, "color": "Preto", "sizes": {"P": 2, "M": 4, "G": 3, "GG": 1}, "image": "assets/blusa-cinza.jpeg", "featured": false}, {"id": 8, "name": "Conjunto Fitness Performance", "category": "Conjuntos", "price": 119.9, "salePrice": null, "color": "Preto", "sizes": {"P": 2, "M": 3, "G": 3, "GG": 1}, "image": "assets/blusa-azul.jpeg", "featured": false}];
const defaultConfig = {"storeName": "ApMundoFitness", "tagline": "Moda fitness feminina para acompanhar seu ritmo.", "whatsapp": "5585984041477", "instagram": "@apmundofitness", "delivery": {"Retirada na loja": 0, "Entrega local": 10, "Entrega expressa": 15}, "adminUser": "andreapaula", "adminPassword": "2707"};
let products = JSON.parse(localStorage.getItem("apm_products") || "null") || defaultProducts;
let config = JSON.parse(localStorage.getItem("apm_config") || "null") || defaultConfig;
let cart = JSON.parse(localStorage.getItem("apm_cart") || "[]");
let payment = "PIX";
let currentFilter = "Todos";

const money = n => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
const save = () => { localStorage.setItem("apm_products", JSON.stringify(products)); localStorage.setItem("apm_config", JSON.stringify(config)); localStorage.setItem("apm_cart", JSON.stringify(cart)); };

function stock(p){ return Object.values(p.sizes||{}).reduce((a,b)=>a+Number(b||0),0); }
function price(p){ return Number(p.salePrice || p.price); }

function renderProducts(){
  const grid=document.getElementById("productGrid");
  const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
  const list=products.filter(p=>(currentFilter==="Todos"||p.category===currentFilter)&&(!q||`${p.name} ${p.category} ${p.color}`.toLowerCase().includes(q)));
  grid.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-image">
        ${p.salePrice?'<span class="tag">OFERTA</span>':''}
        <button class="heart" onclick="this.classList.toggle('liked')">♡</button>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3><div class="product-color">${p.color} · ${stock(p)>0?stock(p)+" disponíveis":"Esgotado"}</div>
        <div class="price">${p.salePrice?`<span class="old">${money(p.price)}</span>`:""}${money(price(p))}</div>
        <div class="product-actions">
          <button class="view" onclick="openProduct(${p.id})">VER DETALHES</button>
          <button class="add" ${stock(p)<=0?"disabled":""} onclick="openProduct(${p.id})">${stock(p)>0?"ESCOLHER":"ESGOTADO"}</button>
        </div>
      </div>
    </article>`).join("") || `<div style="grid-column:1/-1;padding:40px;text-align:center;color:#777">Nenhum produto encontrado.</div>`;
}
function openProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  const sizes=Object.entries(p.sizes||{}).filter(([,q])=>Number(q)>0);
  document.getElementById("modalProduct").innerHTML=`
    <img src="${p.image}" alt="${p.name}">
    <div class="modal-copy">
      <span class="eyebrow">${p.category.toUpperCase()}</span>
      <h2>${p.name}</h2><div class="price">${p.salePrice?`<span class="old">${money(p.price)}</span>`:""}${money(price(p))}</div>
      <p>Uma peça pensada para acompanhar sua rotina com conforto e estilo. Escolha a variação disponível e adicione ao seu carrinho.</p>
      <strong style="font-size:11px">TAMANHO</strong>
      <div class="size-list">${sizes.map(([s])=>`<button class="size-btn" data-size="${s}">${s}</button>`).join("")}</div>
      <button class="btn btn-primary full" id="modalAdd" ${sizes.length?"":"disabled"}>ADICIONAR AO CARRINHO →</button>
    </div>`;
  document.getElementById("productModal").classList.add("open");
  document.querySelectorAll(".size-btn").forEach((b,i)=>b.addEventListener("click",()=>{document.querySelectorAll(".size-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active")}));
  document.getElementById("modalAdd")?.addEventListener("click",()=>{
    const selected=document.querySelector(".size-btn.active")?.dataset.size;
    if(!selected){alert("Escolha um tamanho.");return}
    addToCart(p.id,selected); closeModal(); openCart();
  });
}
function addToCart(id,size){
  const p=products.find(x=>x.id===id); if(!p)return;
  const existing=cart.find(x=>x.id===id&&x.size===size);
  if(existing) existing.qty++; else cart.push({id,size,qty:1});
  save(); renderCart();
}
function renderCart(){
  const count=cart.reduce((a,b)=>a+b.qty,0); document.getElementById("cartCount").textContent=count;
  const items=document.getElementById("cartItems"), empty=document.getElementById("cartEmpty"), summary=document.getElementById("cartSummary");
  if(!cart.length){items.innerHTML="";empty.style.display="block";summary.style.display="none";return}
  empty.style.display="none";summary.style.display="block";
  items.innerHTML=cart.map((item,i)=>{const p=products.find(x=>x.id===item.id);return p?`
    <div class="cart-row"><img src="${p.image}" alt="${p.name}">
      <div><h4>${p.name}</h4><small>${p.color} · Tamanho ${item.size}</small><div class="qty"><button onclick="changeQty(${i},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${i},1)">+</button></div></div>
      <div style="text-align:right"><strong style="font-size:11px">${money(price(p)*item.qty)}</strong><button class="remove" onclick="removeItem(${i})">×</button></div>
    </div>`:""}).join("");
  const sub=cart.reduce((a,item)=>{const p=products.find(x=>x.id===item.id);return a+(p?price(p)*item.qty:0)},0);
  document.getElementById("subtotal").textContent=money(sub);
  renderDelivery(sub);
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save();renderCart()}
function removeItem(i){cart.splice(i,1);save();renderCart()}
function renderDelivery(sub){
  const sel=document.getElementById("deliverySelect");const opts=Object.entries(config.delivery||{});
  const current=sel.value;
  sel.innerHTML=opts.map(([n,v])=>`<option value="${v}">${n} — ${money(v)}</option>`).join("");
  if([...sel.options].some(o=>o.value===current))sel.value=current;
  const fee=Number(sel.value||0);document.getElementById("total").textContent=money(sub+fee);
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function closeModal(){document.getElementById("productModal").classList.remove("open")}
function checkout(){
  if(!cart.length){alert("Seu carrinho está vazio.");return}
  const deliveryName=document.getElementById("deliverySelect").selectedOptions[0]?.textContent||"Entrega";
  const fee=Number(document.getElementById("deliverySelect").value||0);
  const sub=cart.reduce((a,item)=>{const p=products.find(x=>x.id===item.id);return a+(p?price(p)*item.qty:0)},0);
  const total=sub+fee;
  const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `${item.qty}x ${p.name} — ${money(price(p)*item.qty)}\nTamanho: ${item.size} | Cor: ${p.color}`}).join("\n\n");
  const msg=`Olá, Andrea! Quero realizar um pedido pela ApMundoFitness. 🩷\n\n*PRODUTOS*\n${lines}\n\n*Subtotal:* ${money(sub)}\n*Entrega:* ${deliveryName}\n*Total:* ${money(total)}\n\n*Forma de pagamento:* ${payment}\n\nAguardo a confirmação do pedido.`;
  const phone=(config.whatsapp||"").replace(/\D/g,"");
  if(phone.length<10){alert("O WhatsApp da loja ainda não foi configurado. Entre no painel administrativo e altere o número.");return}
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,"_blank");
}
function loadConfig(){
  document.getElementById("instagramText").textContent=config.instagram||"@apmundofitness";
  const ig=(config.instagram||"").replace("@","");document.getElementById("instagramLink").href=`https://instagram.com/${ig}`;
  document.getElementById("year").textContent=new Date().getFullYear();
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;renderProducts()}));
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("modalClose").onclick=closeModal;document.getElementById("productModal").addEventListener("click",e=>{if(e.target.id==="productModal")closeModal()});
document.getElementById("checkoutBtn").onclick=checkout;
document.getElementById("deliverySelect").addEventListener("change",()=>renderDelivery());
document.querySelectorAll(".pay").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".pay").forEach(x=>x.classList.remove("active"));b.classList.add("active");payment=b.dataset.pay}));
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchPanel").classList.toggle("open");document.getElementById("searchInput").focus()};
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("whatsappContact").onclick=()=>{const phone=(config.whatsapp||"").replace(/\D/g,"");if(phone.length<10){alert("Configure o WhatsApp no painel administrativo.");return}window.open(`https://wa.me/${phone}?text=${encodeURIComponent("Olá, Andrea! Gostaria de conhecer os produtos da ApMundoFitness.")}`,"_blank")};
document.getElementById("goProducts").onclick=closeCart;
document.getElementById("menuBtn").onclick=()=>alert("No celular, use as categorias e os links do rodapé para navegar. O menu completo será expandido na próxima etapa.");
loadConfig();renderProducts();renderCart();
// Botão de contato direto
document.getElementById("whatsappContact").addEventListener("click", function() {
  window.open("https://wa.me/5585SEUNUMERO?text=Olá%20quero%20falar%20sobre%20os%20produtos", "_blank");
});

// Botão de finalizar compra
document.getElementById("checkoutBtn").addEventListener("click", function() {
  window.open("https://wa.me/5585984041477?text=Olá%20quero%20finalizar%20minha%20compra", "_blank");
});
