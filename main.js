// main.js

// ---------- MENÚ RESPONSIVO ----------
const navMenu = document.getElementById('nav-menu');
const menuToggle = document.getElementById('menu-toggle');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// ---------- CLASES DEL CARRITO Y PRODUCTOS ----------
class Product {
    constructor(id, name, price, type, generation, image, rating) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.type = type;
        this.generation = generation;
        this.image = image;
        this.rating = rating;
    }
}

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.discount = 0; 
    }

    add(product) {
        if(!this.items.find(i => i.id === product.id)) {
            this.items.push(product);
            this.save();
        }
    }

    remove(index) {
        this.items.splice(index,1);
        this.save();
    }

    clear() {
        this.items = [];
        this.save();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        updateCartUI();
    }

    getTotal() {
        const sum = this.items.reduce((acc, item) => acc + item.price, 0);
        return sum;
    }
}

const cart = new Cart();

// ---------- CARRITO DE COMPRAS ----------
const productGrid = document.getElementById("products");
const cartIcon = document.getElementById("cart-icon");
const cartPopup = document.getElementById("cart-popup");
const closeCart = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const cartCountElement = document.getElementById("cart-count");

const productsData = Array.from({ length: 12 }, (_, i) => new Product(
    i+1,
    `Carta Pokémon ${i+1}`,
    Math.floor(Math.random() * 100) + 10,
    ["electric", "fire", "water"][Math.floor(Math.random() * 3)],
    ["kanto", "johto", "hoenn"][Math.floor(Math.random() * 3)],
    "https://via.placeholder.com/300x200",
    (Math.random() * 5).toFixed(1)
));

function renderProducts(productsToRender) {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    productsToRender.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Generación: ${product.generation}</p>
            <p>Tipo: ${product.type}</p>
            <p>$${product.price}</p>
            <button aria-label="Agregar ${product.name} al carrito">Agregar al carrito</button>
        `;

        const btn = productCard.querySelector('button');
        btn.addEventListener('click', () => {
            cart.add(product);
            animateFlyToCart(btn);
        });

        productGrid.appendChild(productCard);
    });
}

function animateFlyToCart(button) {
    const rect = button.getBoundingClientRect();
    const flyIcon = document.createElement('div');
    flyIcon.classList.add('fly-to-cart');
    flyIcon.style.left = rect.left + "px";
    flyIcon.style.top = rect.top + "px";
    document.body.appendChild(flyIcon);

    setTimeout(() => {
        document.body.removeChild(flyIcon);
    }, 800);
}

function updateCartUI() {
    if (!cartCountElement || !cartItemsContainer || !totalPriceElement) return;
    cartCountElement.textContent = cart.items.length;
    cartItemsContainer.innerHTML = "";
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">No hay productos en el carrito</p>`;
        totalPriceElement.textContent = "0.00";
        return;
    }

    const total = cart.getTotal();
    cart.items.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)}</p>
            <button class="remove-item" aria-label="Eliminar ${item.name} del carrito">Eliminar</button>
        `;
        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            cart.remove(index);
        });
        cartItemsContainer.appendChild(cartItem);
    });
    totalPriceElement.textContent = total.toFixed(2);
}

const clearCartBtn = document.getElementById("clear-cart");
const confirmModal = document.getElementById('confirm-modal');
const confirmClearCartBtn = document.getElementById('confirm-clear-cart');
const cancelClearCartBtn = document.getElementById('cancel-clear-cart');

clearCartBtn.addEventListener('click', () => {
    confirmModal.classList.add('show');
});

cancelClearCartBtn.addEventListener('click', () => {
    confirmModal.classList.remove('show');
});

confirmClearCartBtn.addEventListener('click', () => {
    cart.clear();
    confirmModal.classList.remove('show');
    updateCartUI();
});

const checkoutButton = document.getElementById("checkout");
if (checkoutButton) {
    checkoutButton.addEventListener("click", redirectToPayment);
}

function redirectToPayment() {
    if (cart.items.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    window.location.href = "payment.html";
}

cartIcon.addEventListener("click", () => {
    cartPopup.classList.toggle("active");
    cartPopup.setAttribute("aria-hidden", !cartPopup.classList.contains("active"));
});

closeCart.addEventListener("click", () => {
    cartPopup.classList.remove("active");
    cartPopup.setAttribute("aria-hidden", "true");
});

// Música
const music = document.getElementById("pokemon-music");
const playButton = document.getElementById("play-music");
const pauseButton = document.getElementById("pause-music");

playButton.addEventListener("click", () => {
    music.play();
    playButton.style.display = "none";
    pauseButton.style.display = "inline-block";
});

pauseButton.addEventListener("click", () => {
    music.pause();
    pauseButton.style.display = "none";
    playButton.style.display = "inline-block";
});

music.volume = 0.2;

// Suscripción
const subscribeBtn = document.getElementById("subscribeBtn");
const thankYouMessage = document.getElementById("thank-you-message");
const emailInput = document.getElementById("email");

subscribeBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if(email) {
        thankYouMessage.style.display = "inline-block"; 
        emailInput.value = "";
        setTimeout(() => {
            thankYouMessage.style.display = "none";
        }, 4000);
    } else {
        alert("Por favor, ingresa un correo válido.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
        cart.items = storedCart;
        updateCartUI();
    }
    renderProducts(productsData); // Muestra los productos sin filtros ni ordenamiento
});

// Chatbot
document.addEventListener("DOMContentLoaded", function() {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatbotWindow = document.getElementById("chatbot-window");
    const chatbotSend = document.getElementById("chatbot-send");
    const chatbotUserInput = document.getElementById("chatbot-user-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const closeChatbotBtn = document.getElementById('close-chatbot');

    const productosChat = [
        {nombre: "Pikachu", precio: 500, disponible: true},
        {nombre: "Charizard", precio: 1000, disponible: false},
        {nombre: "Bulbasaur", precio: 300, disponible: true}
    ];
    const metodosPago = ["Tarjeta de crédito", "Tarjeta de débito", "Transferencia bancaria"];
    const ubicacion = "Mercedes, Provincia de Buenos Aires";

    function getBotResponse(userMessage) {
        const msg = userMessage.toLowerCase();

        if (msg.includes("precio") || msg.includes("cuánto")) {
            let respuesta = "Estos son algunos precios de nuestras cartas:<br>";
            productosChat.forEach(p => {
                respuesta += `${p.nombre}: $${p.precio} ${p.disponible ? '(Disponible)' : '(Agotado)'}<br>`;
            });
            respuesta += "<br>Puedes ver más <a href='cartas.html'>Cartas</a>.";
            return respuesta;
        }

        if (msg.includes("pago") || msg.includes("pagar") || msg.includes("método")) {
            return "Aceptamos: " + metodosPago.join(", ") + "." + "<br>Más info en <a href='cartas.html'>Cartas</a> o <a href='boosters.html'>Boosters</a>.";
        }

        if (msg.includes("ubicacion") || msg.includes("están ubicados") || msg.includes("dónde")) {
            return "Estamos en " + ubicacion + "." + "<br>¡Visítanos o explora nuestro sitio!";
        }

        if (msg.includes("pokémon") || msg.includes("productos") || msg.includes("tienen") || msg.includes("disponible")) {
            let respuesta = "Tenemos las siguientes cartas Pokémon:<br>";
            productosChat.forEach(p => {
                respuesta += `${p.nombre} - ${p.disponible ? "Disponible" : "Agotado"}<br>`;
            });
            respuesta += "<br>Explora más <a href='cartas.html'>Cartas</a> y <a href='boosters.html'>Boosters</a>.";
            return respuesta;
        }

        if (msg.includes("ediciones limitadas") || msg.includes("exclusivo")) {
            return "¡Contamos con ediciones limitadas y coleccionables exclusivos! Visita nuestras <a href='cartas.html'>Cartas</a> para descubrir las novedades.";
        }

        return null;
    }

    function processUserMessage(userMessage) {
        const botMessage = getBotResponse(userMessage);
        if (botMessage !== null) {
            setTimeout(() => {
                const botDiv = appendMessage(botMessage, 'bot');
                addDefaultQuickReplies(botDiv);
            }, 500);
        } else {
            setTimeout(() => {
                const errorMsg = "No estoy seguro de cómo responder. Pregúntame sobre precios, métodos de pago, ubicación, disponibilidad o ediciones limitadas.";
                const botDiv = appendMessage(errorMsg, 'bot');
                addDefaultQuickReplies(botDiv);
            }, 500);
        }
    }

    function addDefaultQuickReplies(botDiv) {
        addQuickReplies(botDiv, [
            {texto: "Precios", msg: "Quiero saber precios"},
            {texto: "Métodos de pago", msg: "¿Qué métodos de pago aceptan?"},
            {texto: "Ubicación", msg: "¿Dónde están ubicados?"},
            {texto: "Disponibilidad", msg: "¿Qué cartas Pokémon tienen disponibles?"}
        ]);
    }

    function addQuickReplies(botDiv, opciones) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("quick-replies");
        opciones.forEach(op => {
            const btn = document.createElement("button");
            btn.classList.add("quick-reply-btn");
            btn.textContent = op.texto;
            btn.setAttribute("data-msg", op.msg);
            btn.addEventListener("click", () => {
                simulateUserMessage(op.msg);
            });
            wrapper.appendChild(btn);
        });
        botDiv.appendChild(wrapper);
    }

    function simulateUserMessage(text) {
        appendMessage(text, 'user');
        processUserMessage(text);
    }

    function sendUserMessage() {
        const userMessage = chatbotUserInput.value.trim();
        if (userMessage) {
            appendMessage(userMessage, 'user');
            chatbotUserInput.value = "";
            chatbotUserInput.focus();
            processUserMessage(userMessage);
        }
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerHTML = `<span>${text}</span>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return messageDiv;
    }

    chatbotBtn.addEventListener("click", function() {
        const isHidden = chatbotWindow.getAttribute("aria-hidden") === "true";
        chatbotWindow.style.display = isHidden ? "flex" : "none";
        chatbotWindow.setAttribute("aria-hidden", !isHidden);
    });

    chatbotSend.addEventListener("click", sendUserMessage);
    chatbotUserInput.addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotWindow.style.display = "none";
        chatbotWindow.setAttribute("aria-hidden", "true");
    });
});
