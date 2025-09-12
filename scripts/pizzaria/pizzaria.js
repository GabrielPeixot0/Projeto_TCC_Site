const menuContainer = document.getElementById("menu")
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
const bebidas = document.getElementById("bebidas")

let cart = []


/////////////////////////////////////////////////////////////////////////////////
// INTERAÇÃO DO ZOOM NA TELA
let scale = 1;
const main = document.querySelector("main");

// Intercepta scroll com Ctrl (zoom do navegador)
document.addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
        e.preventDefault(); // impede zoom do navegador

        if (e.deltaY < 0) {
            scale += 0.1; // zoom in
        } else {
            scale -= 0.1; // zoom out
        }

        scale = Math.min(Math.max(0.5, scale), 2); // limite de 50% a 200%
        main.style.transform = `scale(${scale})`;
        main.style.transformOrigin = "top center";
    }
}, { passive: false });

// Intercepta Ctrl + e Ctrl -
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        scale = Math.min(scale + 0.1, 2);
        main.style.transform = `scale(${scale})`;
        main.style.transformOrigin = "top center";
    }

    if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        scale = Math.max(scale - 0.1, 0.5);
        main.style.transform = `scale(${scale})`;
        main.style.transformOrigin = "top center";
    }

    if (e.ctrlKey && e.key === "0") {
        e.preventDefault();
        scale = 1; // reset
        main.style.transform = `scale(${scale})`;
        main.style.transformOrigin = "top center";
    }
});




/////////////////////////////////////////////////////////////////////////////////
// abir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal()
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

if (menuContainer) {
    menuContainer.addEventListener("click", function (event) {
        let parentButton = event.target.closest(".add-to-cart-btn")
        if (parentButton) {
            const id = parentButton.getAttribute("data-id")
            const name = parentButton.getAttribute("data-name")
            const price = parseFloat(parentButton.getAttribute("data-price"))
            addToCart(id, name, price)
        }
    })

    bebidas.addEventListener("click", function (event) {
        let parentButton = event.target.closest(".add-to-cart-btn")
        if (parentButton) {
            const id = parentButton.getAttribute("data-id")
            const name = parentButton.getAttribute("data-name")
            const price = parseFloat(parentButton.getAttribute("data-price"))
            addToCart(id, name, price)
        }
    })
}

// função para adicionar item ao carrinho
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id)
    if (existingItem) {
        existingItem.quantity += 1
        // também atualiza o preço e nome para refletir alterações
        existingItem.name = name
        existingItem.price = price
    } else {
        cart.push({ id, name, price, quantity: 1 })
    }

    updateCartModal()

    if (cart.length > 0) {
        const addressWarnEmptyCart = document.getElementById("address-warn-cart-empty")
        if (addressWarnEmptyCart) {
            addressWarnEmptyCart.classList.add("hidden")
        }
    }
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsConteiner.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("mb-4")

        cartItemElement.innerHTML = `  
      <div class="flex items-center justify-between">
          <p class="nome font-medium">${item.name}</p>
          <button class="remove-from-cart-btn" data-id="${item.id}">  
              Remover
          </button>
      </div>
      <p>Qtd: ${item.quantity}</p>
      <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
    `

        total += item.price * item.quantity
        cartItemsConteiner.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.reduce((total, item) => total + item.quantity, 0)
}

// remover item do carrinho
cartItemsConteiner.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const id = event.target.getAttribute("data-id")
        removeItemCart(id)
    }
})

function removeItemCart(id) {
    const index = cart.findIndex(item => item.id === id)
    if (index !== -1) {
        const item = cart[index]
        if (item.quantity > 1) {
            item.quantity -= 1
            //updateCartModal()
            //return
        } else {
            cart.splice(index, 1)
        }
        updateCartModal()
    }
}

/////////////////////////////////////////////////////////////////////////////////
// aviso input de endereço
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkrestauranteopen()
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "#ef4444" },
        }).showToast()
        return
    }

    if (cart.length === 0) {
        Toastify({
            text: "O carrinho está vazio!",
            duration: 6000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
                padding: "16px 32px",
                borderRadius: "8px",
                fontSize: "18px",
                textAlign: "center",
                width: "auto",
                maxWidth: "400px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            },
        }).showToast()
        addressWarnEmptyCart.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    const cartItems = cart.map(item => {
        return `${item.name} | Quantidade: (${item.quantity}) | Preço: R$${item.price.toFixed(2)}`
    }).join("\n")

    let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const totalFormatted = `--------------------------------------------------\n| Total: R$ ${total.toFixed(2)}\n| Endereço: ${addressInput.value}`
    const message = encodeURIComponent(cartItems + "\n" + totalFormatted)

    const phone = "91980842421"
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

    cart = []
    updateCartModal()
})

function checkrestauranteopen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 10 && hora < 19
}

const spanItem = document.getElementById("date-span")
const isOpen = checkrestauranteopen()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

/////////////////////////////////////////////////////////////////////////////////
///////////////          PRODUTOS DINÂMICOS       ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    // === LISTAS INICIAIS ===
    let produtosLista = [
        { nome: "Pizza 5 queijos", descricao: "Mussarela, Catupiry, parmesão, Gorgonzola, Provolone.", preco: 19.9, imagem: "../../imagens/Pizza 5 queijos.avif" },
        { nome: "Pizza Peperoni", descricao: "Molho, Mussarela, Peperoni, orégano.", preco: 22.9, imagem: "../../imagens/Pizza de Peperoni.jpg" },
        { nome: "Pizza de Torresmo", descricao: "Molho, Mussarela, Torresmo, azeitona preta, cebola, orégano.", preco: 27.9, imagem: "../../imagens/Pizza de Bacon.avif" },
        { nome: "Pizza Portuguesa", descricao: "Molho, Mussarela, Calabresa, Milho Verde, Ovo, Pimentão, Cebola, Bacon.", preco: 27.9, imagem: "../../imagens/Pizza Portuguesa.webp" },
        { nome: "Pizza Frango com Catupiry", descricao: "Molho, Mussarela, Frango, Catupiry, orégano.", preco: 24.9, imagem: "../../imagens/Pizza Frango Catupiry.jpg" },
        { nome: "Pizza de Tomate", descricao: "Molho, Mussarela, Tomate, azeitona preta, cebola, alface.", preco: 25.9, imagem: "../../imagens/Pizza Tomate.avif" },
        { nome: "Pizza Cereja", descricao: "Chocolate, Cereja, confeito de Chocolate.", preco: 25.9, imagem: "../../imagens/Pizza Cereja.jpg" },
        { nome: "Pizza Doce", descricao: "Chocolate, Creme de Leite, Morango, confeito de Chocolate.", preco: 29.9, imagem: "../../imagens/Pizza Doce.avif" },
    ];
    let bebidasLista = [
        { nome: "Coca-cola", descricao: "350 ml.", preco: 4.99, imagem: "../../imagens/Coca-cola.png" },
        { nome: "Guaraná Antartica", descricao: "1,5 L.", preco: 11.90, imagem: "../../imagens/Guarana Antartica.png" },
    ];

    // === CONTAINERS ===
    const produtosContainer = document.querySelector("#produtos");
    const bebidasContainer = document.querySelector("#bebidas");

    // === FUNÇÃO DE RENDERIZAÇÃO GENÉRICA ===
    function renderItens(lista, container, tipo) {
        container.innerHTML = "";

        lista.forEach((item, index) => {
            const card = document.createElement("div");
            card.classList.add("produto-card", "flex", "gap-3");
            card.dataset.index = index;
            card.dataset.tipo = tipo;

            if (item.emEdicao) {
                card.innerHTML = `
          <div class="upload-preview" data-index="${index}">
            ${item.imagem ? `<img src="${item.imagem}" alt="${item.nome}"  />` : `
              <div class="add-image-upload">
                <i class="bi bi-plus-circle"></i>
                <p>Adicionar imagem</p>
              </div>`}
          </div>
          <input type="file" accept="image/*" class="input-imagem hidden" data-index="${index}">
          <div class="flex-1">
            <p class="nome"><input type="text" value="${item.nome || ""}" class="input-text" placeholder="Adicionar nome"></p>
            <p class="descricao"><textarea class="input-text" placeholder="Adicionar descrição">${item.descricao || ""}</textarea></p>
            <p class="preco"><input type="number" value="${item.preco || ""}" class="input-text" placeholder="Adicionar preço"></p>
            <div class="mt-2 flex flex-col gap-2">
              <button class="btn limpar">Limpar</button>
              <div class="flex gap-2">
                <button class="btn salvar">Salvar</button>
                <button class="btn cancelar">Cancelar</button>
                <button class="btn remover hidden">Remover</button>
              </div>
            </div>
          </div>
        `;
            } else {
                card.innerHTML = `
          <div class="upload-preview" data-index="${index}">
            ${item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" />` : `
              <div class="add-image-upload">
                <i class="bi bi-plus-circle"></i>
                <p>Adicionar imagem</p>
              </div>`}
          </div>
          <input type="file" accept="image/*" class="input-imagem hidden" data-index="${index}">
          <div class="flex-1">
            <p class="nome font-bold">${item.nome}</p>
            <p class="descricao text-sm">${item.descricao}</p>
            <div class="flex items-center gap-2 justify-between mt-3">
              <p class="preco font-bold text-lg">R$ ${item.preco.toFixed(2)}</p>
              <button class="bg-gray-900 px-5 rounded add-to-cart-btn" 
                data-id="${tipo}-${index}" 
                data-name="${item.nome}" 
                data-price="${item.preco.toFixed(2)}">
                <i class="fa fa-cart-plus text-lg text-white"></i>
              </button>
            </div>
            <div class="mt-2 flex gap-2">
              <button class="btn editar">Editar</button>
              <button class="btn remover" data-id="${tipo}-${index}">Remover</button>
              <button class="btn salvar hidden">Salvar</button>
              <button class="btn cancelar hidden">Cancelar</button>
            </div>
          </div>
        `;
            }

            container.appendChild(card);
        });

        // botão "Adicionar"
        const addCard = document.createElement("div");
        addCard.classList.add("add-produto-card");
        addCard.innerHTML = `
      <div class="add-produto">
        <button class="add-produto-btn">
          <i class="bi bi-plus-square-dotted"></i>
          <p>Adicionar ${tipo}</p>
        </button>
      </div>
    `;
        addCard.addEventListener("click", () => {
            lista.push({ nome: "", descricao: "", preco: null, imagem: null, emEdicao: true, novo: true });
            renderTodos();
        });
        container.appendChild(addCard);
    }

    // === RENDERIZAR TODOS ===
    function renderTodos() {
        renderItens(produtosLista, produtosContainer, "produto");
        renderItens(bebidasLista, bebidasContainer, "bebida");
    }
    renderTodos();

    // === EVENTOS ===
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".produto-card");
        if (!card) return;

        const index = card.dataset.index;
        const tipo = card.dataset.tipo;
        const lista = tipo === "produto" ? produtosLista : bebidasLista;
        const item = lista[index];

        const uploadBox = card.querySelector(".upload-preview");
        const inputFile = card.querySelector(".input-imagem");

        // upload imagem
        if (e.target.closest(".upload-preview")) {
            inputFile.click();
        }
        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0];
            if (file) {
                const imgURL = URL.createObjectURL(file);
                uploadBox.innerHTML = `<img src="${imgURL}" alt="Preview">`;
                item.imagem = imgURL;
            }
        });

        // editar
        if (e.target.classList.contains("editar")) {
            // salva os valores originais em backup
            item._backup = { ...item };
            item.emEdicao = true;
            renderTodos();
        }

        // salvar
        if (e.target.classList.contains("salvar")) {
            const novoNome = card.querySelector(".nome input").value.trim();
            const novaDesc = card.querySelector(".descricao textarea").value.trim();
            const novoPreco = card.querySelector(".preco input").value.trim();
            const temImagem = uploadBox.querySelector("img") !== null;

            if (!novoNome || !novaDesc || !novoPreco || !temImagem) {
                Toastify({
                    text: "Por favor, preencha todos os campos",
                    duration: 6000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "var(--vermelho-claro)",
                        padding: "16px 32px",
                        borderRadius: "8px",
                        fontSize: "18px",
                        textAlign: "center",
                        width: "auto",
                        maxWidth: "400px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                }).showToast()
                return;
            }

            // aplica as alterações no objeto
            item.nome = novoNome;
            item.descricao = novaDesc;
            item.preco = parseFloat(novoPreco);
            item.emEdicao = false;

            // 🔑 remove a flag "novo" ao salvar pela primeira vez
            if (item.novo) delete item.novo;
            if (item._backup) delete item._backup; // apaga backup após salvar

            renderTodos();
            showToast(`${tipo === "produto" ? "Produto" : "Bebida"} salvo com sucesso!`);
        }

        // cancelar
        if (e.target.classList.contains("cancelar")) {
            if (item.novo) {
                // se for um item recém-criado e não salvo, remove apenas ele
                lista.splice(index, 1);
                showToast(`${tipo === "produto" ? "Produto" : "Bebida"} não salvo foi removido`);
            } else {
                // se já existia antes, apenas restaura o backup
                if (item._backup) {
                    Object.assign(item, item._backup);
                    delete item._backup;
                }
                item.emEdicao = false;
                showToast("Edição cancelada");
            }

            renderTodos();
        }

        // limpar
        if (e.target.classList.contains("limpar")) {
            card.querySelector(".nome input").value = "";
            card.querySelector(".descricao textarea").value = "";
            card.querySelector(".preco input").value = "";
            uploadBox.innerHTML = `
            <div class="add-image-upload">
                <i class="bi bi-plus-circle"></i>
                <p>Adicionar imagem</p>
            </div>
            `;
            showToast("Campos limpos");
        }

        // remover
        if (e.target.classList.contains("remover")) {
            const id = e.target.getAttribute("data-id"); // Obtém o ID do produto
            showConfirm(`Deseja remover este ${tipo}?`, () => {
                // Remover do carrinho
                const itemIndexInCart = cart.findIndex(item => item.id === id);
                if (itemIndexInCart !== -1) {
                    cart.splice(itemIndexInCart, 1);
                    updateCartModal(); // Atualiza o modal do carrinho
                }

                // Remover do grid (lista de produtos/bebidas)
                lista.splice(index, 1);
                renderTodos();
                showToast(`${tipo === "produto" ? "Produto" : "Bebida"} removido!`);
            });
        }


    });

    // === TOAST ===
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 100);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // === MODAL DE CONFIRMAÇÃO ===
    function showConfirm(message, onConfirm) {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";

        overlay.innerHTML = `
      <div class="modal-box">
        <h3>${message}</h3>
        <div class="modal-actions">
          <button class="modal-btn cancel">Cancelar</button>
          <button class="modal-btn confirm">Remover</button>
        </div>
      </div>
    `;

        document.body.appendChild(overlay);

        overlay.querySelector(".cancel").addEventListener("click", () => overlay.remove());
        overlay.querySelector(".confirm").addEventListener("click", () => {
            overlay.remove();
            onConfirm();
        });
    }
});

/////////////////////////////////////////////////////////////////////////////////
///////////////          BANNER          ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    // Referências aos elementos do HTML
    const bannerBackground = document.getElementById("bannerBackground");
    const logoImg = document.getElementById("logoImg");
    const restaurantName = document.getElementById("restaurantName");
    const address = document.getElementById("address");

    const defaultButtons = document.getElementById("defaultButtons");
    const editModeButtons = document.getElementById("editModeButtons");
    const editarBtn = document.getElementById("editarBtn");
    const salvarBtn = document.getElementById("salvarBtn");
    const cancelarBtn = document.getElementById("cancelarBtn");


    const opcoesBtn = document.getElementById("opcoesBtn");
    const optionsMenu = document.getElementById("optionsMenu");
    const trocarLogoBtn = document.getElementById("trocarLogoBtn");
    const trocarFundoBtn = document.getElementById("trocarFundoBtn");
    const opacityRange = document.getElementById("opacityRange");
    const corFundoBtn = document.getElementById("corFundoBtn");
    const limparMenuBtn = document.getElementById("limparMenuBtn");


    let originalData = {
        name: restaurantName.textContent.trim(),
        address: address.textContent.trim(),
        backgroundImg: window.getComputedStyle(bannerBackground).backgroundImage,
        logoSrc: logoImg.src,
    };

    let editing = false;

    //  Modo de edição
    function renderEditMode() {
        if (editing) {
            // Esconde botões padrão e mostra os de edição
            defaultButtons.classList.add("hidden");
            editModeButtons.classList.remove("hidden");

            // Transforma texto em inputs
            restaurantName.innerHTML = `<input type="text" class="editable-input" value="${restaurantName.textContent.trim()}">`;
            address.innerHTML = `<input type="text" class="editable-input" value="${address.textContent.trim()}">`;

            // Adiciona classe de cursor para indicar que a imagem é clicável
            bannerBackground.classList.add("cursor-pointer");
            logoImg.classList.add("cursor-pointer");

        } else {
            // Esconde botões de edição e mostra os padrão
            defaultButtons.classList.remove("hidden");
            editModeButtons.classList.add("hidden");

            // Reverte para elementos de texto
            restaurantName.innerHTML = originalData.name;
            address.innerHTML = originalData.address;

            // Remove classe de cursor
            bannerBackground.classList.remove("cursor-pointer");
            logoImg.classList.remove("cursor-pointer");
        }
    }

    // --- EVENT LISTENERS ---

    // Abrir/fechar menu de opções + troca de ícone
    opcoesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        optionsMenu.classList.toggle("hidden");

        const icon = opcoesBtn.querySelector("i");
        if (optionsMenu.classList.contains("hidden")) {
            icon.className = "fa-solid fa-angle-down"; // fechado
        } else {
            icon.className = "fa-solid fa-angle-up"; // aberto
        }
    });

    // Trocar logo
    trocarLogoBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    logoImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // Trocar fundo
    trocarFundoBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    bannerBackground.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // Opacidade de fundo
    opacityRange.addEventListener("input", () => {
        const value = opacityRange.value / 100;
        bannerBackground.style.backgroundColor = `rgba(0,0,0,${1 - value})`;
    });

    // Cor de fundo
    corFundoBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "color";
        input.onchange = (event) => {
            bannerBackground.style.backgroundColor = event.target.value;
        };
        input.click();
    });

    // Limpar (menu)
    limparMenuBtn.addEventListener("click", () => {
        bannerBackground.style.backgroundImage = "none";
        logoImg.src = "";
    });



    // "Editar"
    editarBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // <-- impede que o clique vá parar em outro elemento
        editing = true;
        originalData = {
            name: restaurantName.textContent.trim(),
            address: address.textContent.trim(),
            backgroundImg: window.getComputedStyle(bannerBackground).backgroundImage,
            logoSrc: logoImg.src,
        };
        renderEditMode();
    });

    // "Salvar"
    salvarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newName = restaurantName.querySelector("input").value;
        const newAddress = address.querySelector("input").value;

        if (newName.trim() === "" || newAddress.trim() === "") {
            Toastify({
                text: "Por favor, preencha todos os campos",
                duration: 6000,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "var(--vermelho-claro)",
                    padding: "16px 32px",
                    borderRadius: "8px",
                    fontSize: "18px",
                    textAlign: "center",
                    width: "auto",
                    maxWidth: "400px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
            }).showToast()
            return;
        }

        // Atualiza os dados originais
        originalData.name = newName;
        originalData.address = newAddress;

        // Finaliza o modo de edição
        editing = false;
        renderEditMode();
        showToast("Dados do banner salvos com sucesso!");
    });

    //"Cancelar"
    cancelarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Reverte para os dados originais do backup
        restaurantName.innerHTML = originalData.name;
        address.innerHTML = originalData.address;

        // Reverte as imagens
        bannerBackground.style.backgroundImage = originalData.backgroundImg;
        logoImg.src = originalData.logoSrc;

        // Finaliza o modo de edição
        editing = false;
        renderEditMode();
        showToast("Edição cancelada.");
    });

    // "Limpar"
    limparBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!editing) return;

        // Limpa os campos de input e as imagens
        restaurantName.querySelector("input").value = "";
        address.querySelector("input").value = "";
        bannerBackground.style.backgroundImage = "none";
        logoImg.src = "";

        showToast("Campos limpos.");
    });

    //  Upload de fundo
    bannerBackground.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!editing) return; // <-- Adicionado: Interrompe se não estiver em modo de edição
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    bannerBackground.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // Upload da logo
    logoImg.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!editing) return; // <-- Adicionado: Interrompe se não estiver em modo de edição
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    logoImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // TOAST //
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 100);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }


});