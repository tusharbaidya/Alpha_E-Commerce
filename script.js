const products = [
  { id: 1, name: "AirSound Pro Headphones", cat: "Electronics", price: 2499, rating: 4.8, emoji: "🎧", badge: "BESTSELLER", desc: "Wireless over-ear headphones with immersive sound and long battery life." },
  { id: 2, name: "Urban Runner Sneakers", cat: "Fashion", price: 3299, rating: 4.7, emoji: "👟", badge: "NEW", desc: "Lightweight everyday sneakers designed for comfort and casual style." },
  { id: 3, name: "Minimal Desk Lamp", cat: "Home", price: 1599, rating: 4.5, emoji: "💡", badge: "POPULAR", desc: "Modern desk lamp with warm lighting for work, reading and study." },
  { id: 4, name: "Classic Chrono Watch", cat: "Accessories", price: 4499, rating: 4.9, emoji: "⌚", badge: "TOP RATED", desc: "A timeless chronograph-inspired watch with a comfortable strap." },
  { id: 5, name: "Smart Fitness Band", cat: "Electronics", price: 1999, rating: 4.4, emoji: "⌚", badge: "NEW", desc: "Track activity and daily movement with a lightweight smart band." },
  { id: 6, name: "Everyday Oversized Tee", cat: "Fashion", price: 899, rating: 4.6, emoji: "👕", badge: "SALE", desc: "Soft cotton oversized T-shirt with a relaxed everyday fit." },
  { id: 7, name: "Ceramic Coffee Set", cat: "Home", price: 1299, rating: 4.7, emoji: "☕", badge: "POPULAR", desc: "Minimal ceramic cup set made for relaxed mornings." },
  { id: 8, name: "Leather Wallet", cat: "Accessories", price: 1199, rating: 4.6, emoji: "👝", badge: "SALE", desc: "Slim wallet with practical card storage and a classic finish." }
];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
const $ = id => document.getElementById(id), money = n => "₹" + n.toLocaleString("en-IN");
function render() {
  let list = [...products], c = $("cat").value, q = $("searchInput").value.toLowerCase(), s = $("sort").value;
  if (c !== "All") list = list.filter(p => p.cat === c);
  if (q) list = list.filter(p => (p.name + p.cat + p.desc).toLowerCase().includes(q));
  if (s === "low") list.sort((a, b) => a.price - b.price); if (s === "high") list.sort((a, b) => b.price - a.price); if (s === "rating") list.sort((a, b) => b.rating - a.rating);
  $("products").innerHTML = list.map(p => `<article class="product"><div class="pic"><span class="badge">${p.badge}</span><span class="emoji">${p.emoji}</span></div><div class="info"><small>${p.cat}</small><h3>${p.name}</h3><div class="rating">★★★★★ ${p.rating}</div><div class="bottom"><b>${money(p.price)}</b><button class="add" onclick="add(${p.id})">Add to Cart</button></div><button class="view" onclick="details(${p.id})">View details →</button></div></article>`).join("");
  $("empty").style.display = list.length ? "none" : "block";
}
function add(id) { let x = cart.find(i => i.id === id); x ? x.qty++ : cart.push({ id, qty: 1 }); save(); toast("Added to cart") }
function save() { localStorage.setItem("cart", JSON.stringify(cart)); renderCart() }
function renderCart() {
  $("count").textContent = cart.reduce((a, x) => a + x.qty, 0);
  $("items").innerHTML = cart.length ? cart.map(x => { let p = products.find(p => p.id === x.id); return `<div class="item"><div class="thumb">${p.emoji}</div><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button onclick="qty(${p.id},-1)">−</button> ${x.qty} <button onclick="qty(${p.id},1)">+</button></div><button class="remove" onclick="removeItem(${p.id})">Remove</button></div><b>${money(p.price * x.qty)}</b></div>` }).join("") : `<p style="text-align:center;color:#777;padding:50px 10px">Your cart is empty 🛒</p>`;
  let sub = cart.reduce((a, x) => a + products.find(p => p.id === x.id).price * x.qty, 0), ship = sub && sub < 999 ? 79 : 0;
  $("subtotal").textContent = money(sub); $("shipping").textContent = ship ? money(ship) : "FREE"; $("total").textContent = money(sub + ship);
}
function qty(id, n) { let x = cart.find(i => i.id === id); x.qty += n; if (x.qty < 1) cart = cart.filter(i => i.id !== id); save() }
function removeItem(id) { cart = cart.filter(i => i.id !== id); save() }
function details(id) { let p = products.find(x => x.id === id); $("modalContent").innerHTML = `<div class="modalGrid"><div class="modalPic">${p.emoji}</div><div><small>${p.cat}</small><h2>${p.name}</h2><div class="rating">★★★★★ ${p.rating}</div><p>${p.desc}</p><h3>${money(p.price)}</h3><button class="btn" onclick="add(${p.id});closeModal()">Add to Cart</button></div></div>`; $("modal").classList.add("open") }
function closeModal() { $("modal").classList.remove("open") }
function toast(t) { $("toast").textContent = t; $("toast").classList.add("show"); clearTimeout(window.t); window.t = setTimeout(() => $("toast").classList.remove("show"), 1800) }
$("cat").onchange = render; $("sort").onchange = render; $("searchInput").oninput = render;
document.querySelectorAll(".cats button").forEach(b => b.onclick = () => { $("cat").value = b.dataset.cat; render(); $("shop").scrollIntoView({ behavior: "smooth" }) });
$("cartBtn").onclick = () => { $("drawer").classList.add("open"); $("overlay").classList.add("open") };
function closeCart() { $("drawer").classList.remove("open"); $("overlay").classList.remove("open") }
$("closeCart").onclick = closeCart; $("overlay").onclick = closeCart;
$("searchBtn").onclick = () => { $("search").classList.toggle("open"); $("searchInput").focus() }; $("closeSearch").onclick = () => $("search").classList.remove("open");
$("modalClose").onclick = closeModal; $("modal").onclick = e => { if (e.target.id === "modal") closeModal() };
$("checkout").onclick = () => toast(cart.length ? "Demo checkout — connect payment gateway." : "Your cart is empty");
$("newsForm").onsubmit = e => { e.preventDefault(); toast("Thanks for subscribing!"); e.target.reset() };
$("hamb").onclick = () => $("links").classList.toggle("open");
$("year").textContent = new Date().getFullYear(); render(); renderCart();
