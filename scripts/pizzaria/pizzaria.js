const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsConteiner = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const addressWarnEmptyCart = document.getElementById("address-warn-cart-empty")
const bebidas = document.getElementById("bebidas");

// produto 1
// Seletores principais
const card = document.getElementById("produto-card");
const formArea = document.getElementById("form-area");
const formButtons = document.getElementById("form-buttons");
const editArea = document.getElementById("edit-area");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const btnEditar = document.getElementById("btn-editar");
const preview = document.getElementById("preview");
const inputImagem = document.getElementById("produto-imagem");

let cart = []
let imagemAtual = ""; // guarda o src da imagem

//produto 1
// Ao clicar em salvar
btnSalvar.addEventListener("click", () => {
    const nome = document.getElementById("produto-nome").value;
    const descricao = document.getElementById("produto-descricao").value;
    const preco = document.getElementById("produto-preco").value;

    if (!nome || !descricao || !preco) {
        Toastify({
            text: "Por favor, preencha todos os campos",
            duration: 6000,
            close: true,
            gravity: "top", // A gravidade vai controlar se é "top" ou "bottom", mas não muda muito o centralizado
            position: "center", // Isso coloca a notificação no centro da tela
            stopOnFocus: true,
            style: {
                background: "var(--vermelho-claro)", // Definindo a cor do fundo da mensagem
                padding: "16px 32px", // Aumentando o padding para tornar o toast maior
                borderRadius: "8px", // Fazendo os cantos arredondados
                fontSize: "18px", // Aumentando o tamanho da fonte
                textAlign: "center", // Garantindo que o texto esteja centralizado dentro do toast
                width: "auto", // Fazendo com que o toast tenha largura automática com base no conteúdo
                maxWidth: "400px", // Define um limite de largura para o toast
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adiciona uma sombra para o toast
            },
        }).showToast();
        return;
    }

    // Substitui formulário pelo layout final
    formArea.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <p class="nome">${nome}</p>
                <p class="descricao" >${descricao}</p>
            </div>
        </div>

        <div class="flex justify-between items-center mt-2">
            <p class="preco" style="font-size:1.1rem; font-weight:500;">
                R$ ${parseFloat(preco).toFixed(2)}
            </p>
            <button 
                class="add-to-cart-btn bg-gray-900 px-4 py-2 rounded"
                data-name="${nome}"
                data-price="${parseFloat(preco).toFixed(2)}">
                     <i class="fa fa-cart-plus text-white"></i>
            </button>
        </div>
    `;

    // mantém a imagem no preview
    if (imagemAtual) {
        preview.innerHTML = `<img src="${imagemAtual}" alt="Produto">`;
    }

    // alterna botões
    formButtons.style.display = "none";
    editArea.style.display = "block";
});

// Cancelar → limpa tudo
btnCancelar.addEventListener("click", () => {
    const nome = document.getElementById("produto-nome").value;

    // Remove do carrinho caso já esteja adicionado
    if (nome) {
        removeItemCart(nome);
    }
    
    // Limpa formulário
    document.getElementById("produto-nome").value = "";
    document.getElementById("produto-descricao").value = "";
    document.getElementById("produto-preco").value = "";
    imagemAtual = "";
    preview.innerHTML = `<span>+</span><p>Adicionar imagem</p>`;


});

// Editar → reconstrói o formulário e mantém imagem
btnEditar.addEventListener("click", () => {
    const nomeAtual = formArea.querySelector(".nome").innerText;
    const descricaoAtual = formArea.querySelector(".descricao").innerText;
    const precoAtual = formArea.querySelector(".preco").innerText.replace("R$ ", "").trim();

    // Reconstrói formulário
    formArea.innerHTML = `
    <input 
        type="text" 
        id="produto-nome" 
        value="${nomeAtual}" 
        placeholder="Adicionar nome" 
        class="input-text"
    >
    <textarea 
        id="produto-descricao" 
        placeholder="Adicionar descrição ..." 
        class="input-text"
    >${descricaoAtual}</textarea>
    <input 
        type="number" 
        id="produto-preco" 
        value="${precoAtual}" 
        placeholder="Adicionar Preço ..." 
        class="input-text"
    >
`;

    // mantém imagem no preview
    if (imagemAtual) {
        preview.innerHTML = `<img src="${imagemAtual}" alt="Produto">`;
    } else {
        preview.innerHTML = `<span>+</span><p>Adicionar imagem</p>`;
    }

    // alterna botões
    formButtons.style.display = "flex";
    editArea.style.display = "none";
});




// Upload de imagem
inputImagem.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagemAtual = reader.result; // salva base64 da imagem
            preview.innerHTML = `<img src="${imagemAtual}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});



document.getElementById("btn-cancelar").addEventListener("click", () => {
    document.getElementById("produto-nome").value = "";
    document.getElementById("produto-descricao").value = "";
    document.getElementById("produto-preco").value = "";
    preview.innerHTML = `<span>+</span><p>Adicionar imagem</p>`;
});





/////////////////////////////////////////////////////////////////////////


// abir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

// fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// ao clicar em "fechar" o modal é fechado
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //adicionar item ao carrinho
        addToCart(name, price)
    }
})

bebidas.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //adiciona a bebida ao carrinho
        addToCart(name, price)
    }
})


// função para adicionar item ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        //se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

    if (cart.length > 0) {
        const addressWarnEmptyCart = document.getElementById('address-warn-cart-empty');
        if (addressWarnEmptyCart) {
            addressWarnEmptyCart.classList.add("hidden");
        }
    }

}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsConteiner.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("mb-4");

        cartItemElement.innerHTML = `  
            <div class="flex items-center justify-between">
                <p1 class="nome font-medium">${item.name}</p1>
                <button class="remove-from-cart-btn" data-name="${item.name}">  
                    Remover
                </button>
            </div>
            <p1>Qtd: ${item.quantity}</p1>
            <p></p>
            <p1 class="font-medium">R$ ${item.price.toFixed(2)}</p1>
        `;

        total += item.price * item.quantity;

        cartItemsConteiner.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Atualiza o contador com a quantidade total de itens no carrinho
    cartCounter.innerHTML = cart.reduce((total, item) => total + item.quantity, 0);
}

//Função para remover o item do carrinho
cartItemsConteiner.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];


        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

// aviso de mensagem de erro ao invalidar email, e borda vermelha na box de mensg, e sumir a borda quando digitar de novo.

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkrestauranteopen();
    if (!isOpen) {

        Toastify({
            text: "Ops, o restaurante esta fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();


        return;
    }

    if (cart.length === 0) {
        // Exibe a mensagem de erro se o carrinho estiver vazio
        Toastify({
            text: "O carrinho está vazio!",
            duration: 6000,
            close: true,
            gravity: "top", // A gravidade vai controlar se é "top" ou "bottom", mas não muda muito o centralizado
            position: "center", // Isso coloca a notificação no centro da tela
            stopOnFocus: true,
            style: {
                background: "#ef4444", // Definindo a cor do fundo da mensagem
                padding: "16px 32px", // Aumentando o padding para tornar o toast maior
                borderRadius: "8px", // Fazendo os cantos arredondados
                fontSize: "18px", // Aumentando o tamanho da fonte
                textAlign: "center", // Garantindo que o texto esteja centralizado dentro do toast
                width: "auto", // Fazendo com que o toast tenha largura automática com base no conteúdo
                maxWidth: "400px", // Define um limite de largura para o toast
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adiciona uma sombra para o toast
            },
        }).showToast();

        addressWarnEmptyCart.classList.remove("hidden")
        addressInput.classList.add("border-red-500")

        return; // Impede a execução do restante do código se o carrinho estiver vazio
    }

    //if(cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar pedido para API Whatsapp 
    const cartItems = cart.map((item) => {
        return (
            `${item.name} 
        | Quantidade: (${item.quantity}) 
        | Preço: R$${item.price.toFixed(2)} 
        `
        );
    }).join("\n"); // Adicionando quebra de linha entre cada item

    // Calcular o total
    let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalFormatted = `--------------------------------------------------\n| Total: R$ ${total.toFixed(2)}\n| Endereço: ${addressInput.value}`;
    const message = encodeURIComponent(cartItems + "\n" + totalFormatted);

    const phone = "91980842421";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");


    cart = [];
    updateCartModal();


})

function checkrestauranteopen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 19;
    //restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkrestauranteopen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}



document.addEventListener("DOMContentLoaded", () => {
    // Lista de produtos
    const produtos = [
        {
            nome: "Pizza Italiana",
            descricao: "Muçarela, Catupiry, parmesão, Gorgonzola, Provolone.",
            preco: 25.0,
            imagem: "../../imagens/Pizza Italiana.avif"
        },
        {
            nome: "Pizza Calabresa",
            descricao: "Calabresa fatiada, cebola roxa e orégano.",
            preco: 22.0,
            imagem: "../../imagens/Pizza Calabresa.avif"
        },
        // ... até 9 produtos
    ];

    const container = document.querySelector("#produtos-container");

    produtos.forEach((p) => {
        const card = document.createElement("div");
        card.classList.add("produto-card");

        card.innerHTML = `
      <div class="upload-box">
        <div class="upload-preview">
          <img src="${p.imagem}" alt="${p.nome}">
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex justify-between items-center">
          <div>
            <p class="nome">${p.nome}</p>
            <p class="descricao">${p.descricao}</p>
          </div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <p class="preco" style="font-size:1.1rem; font-weight:500;">
            R$ ${p.preco.toFixed(2)}
          </p>
          <button 
            class="add-to-cart-btn bg-gray-900 px-4 py-2 rounded"
            data-name="${p.nome}"
            data-price="${p.preco.toFixed(2)}">
            <i class="fa fa-cart-plus text-white"></i>
          </button>
        </div>
      </div>
    `;

        container.appendChild(card);
    });
});


////////////////////////////////////////////////////////////////////////////////////////////
