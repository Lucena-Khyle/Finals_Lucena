
const products = [
  { category: "Helmets", name: "RACING HELMET", price: 120, image: "image/RACING HELMET.jpg" },
  { category: "Gloves", name: "RACING GLOVES", price: 40, image: "image/RACING GLOVES.jpg" },
  { category: "Jackets", name: "RIDING JACKET", price: 180, image: "image/RIDING JACKET.jpg" },
  { category: "Accessories", name: "SIDE MIRROR", price: 35, image: "image/SIDE MIRROR.jpg" },
  { category: "Lighting", name: "HEAD LIGHT FOR KEEWAY CR 150", price: 85, image: "image/HEAD LIGHT FOR KEEWAY CR 150.jpg" },
  { category: "Fuel System", name: "SKYLINE CR FUEL TANK", price: 150, image: "image/SKYLINE CR FUEL TANK.jpg" },
  { category: "gear", name: "GEAR SET", price: 200, image: "image/GEAR SET.jpg" },
  { category: "Clutch", name: "BREMBO RCS FOLDING CLUTCH LEVER", price: 50, image: "image/BREMBO RCS FOLDING CLUTCH LEVER.jpg" },
  { category: "Seats", name: "CLASSIC SEAT FOR CR 150", price: 90, image: "image/CLASSIC SEAT FOR CR 150.jpg" }
];


let cart = JSON.parse(localStorage.getItem("motovent_cart")) || [];
let currentCategory = "All";
let currentPage = 1;
const itemsPerPage = 6;

function saveCart() {
  localStorage.setItem("motovent_cart", JSON.stringify(cart));
  updateCartModal();
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

function renderCategories() {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const catContainer = document.getElementById("categories");
  catContainer.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary m-1";
    btn.textContent = cat;
    btn.onclick = () => {
      currentCategory = cat;
      currentPage = 1;
      renderProducts();
    };
    catContainer.appendChild(btn);
  });
}

function renderProducts() {
  const filtered = currentCategory === "All" ? products : products.filter(p => p.category === currentCategory);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  paginated.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-4 product-card";
    col.innerHTML = `
      <div class="card mb-3">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">$${p.price}</p>
          <button class="btn btn-primary" onclick="viewProduct('${p.name}')">View</button>
          <button class="btn btn-success" onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
        </div>
      </div>`;
    productList.appendChild(col);
  });
  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm " + (i === currentPage ? "btn-dark" : "btn-light");
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderProducts();
    };
    pagination.appendChild(btn);
  }
}

function getProductByName(name) {
  return products.find(p => p.name.toLowerCase() === name.toLowerCase());
}

function renderProductDetailsInline(name) {
  const product = getProductByName(name);
  if (!product) return;
  document.getElementById("mainImage").src = product.image;
  document.getElementById("mainImage").alt = product.name;
  document.getElementById("productTitle").textContent = product.name;
  document.getElementById("productDesc").textContent = product.description;
  document.getElementById("productPrice").textContent = `$${product.price}`;
  document.getElementById("addToCartButton").onclick = () => addToCart(product.name, product.price);
}

function viewProduct(name) {
  renderProductDetailsInline(name);
  document.getElementById("details").scrollIntoView({ behavior: "smooth" });
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  $("#cartModal").modal("show");
}

function updateCartModal() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "cart-item d-flex justify-content-between";
    li.innerHTML = `<span>${item.name}</span><span>$${item.price}</span>`;
    cartItems.appendChild(li);
    total += item.price;
  });
  document.getElementById("cartTotal").textContent = total.toFixed(2);
}

function revealOnScroll() {
  const sections = document.querySelectorAll("section");
  const windowHeight = window.innerHeight;
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < windowHeight - 100) {
      section.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput").addEventListener("input", function () {
    const search = this.value.toLowerCase();
    const cards = document.querySelectorAll(".product-card");
    cards.forEach(card => {
      const title = card.querySelector(".card-title").textContent.toLowerCase();
      card.style.display = title.includes(search) ? "" : "none";
    });
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    alert("Checkout complete! Thank you.");
    cart = [];
    saveCart();
  });

  renderCategories();
  renderProducts();
  updateCartModal();
  updateCartCount();
  renderProductDetailsInline(products[0].name);
});
