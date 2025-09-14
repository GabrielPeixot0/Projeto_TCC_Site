// --- VARIÁVEIS GLOBAIS ---
let cart = [];

// --- FUNÇÃO PARA VERIFICAR HORÁRIO DE FUNCIONAMENTO ---
function checkrestauranteopen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 19;
}

// --- FUNÇÃO PARA ATUALIZAR O MODAL DO CARRINHO ---
function updateCartModal() {
    const cartItemsConteiner = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCounter = document.getElementById("cart-count");

    if (!cartItemsConteiner || !cartTotal || !cartCounter) {
        console.error("Elementos do carrinho não encontrados.");
        return;
    }

    cartItemsConteiner.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("mb-4");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <p class="nome font-medium">${item.name}</p>
            <button class="remove-from-cart-btn" data-id="${item.id}">
                Remover
            </button>
        </div>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
    `;
        total += item.price * item.quantity;
        cartItemsConteiner.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.reduce((total, item) => total + item.quantity, 0);
}

// --- FUNÇÃO PARA ADICIONAR ITEM AO CARRINHO ---
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.name = name;
        existingItem.price = price;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCartModal();
}

// --- FUNÇÃO PARA REMOVER ITEM DO CARRINHO ---
function removeItemCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

// --- FUNÇÃO PARA EXIBIR TOAST ---
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

// --- FUNÇÃO PARA EXIBIR MODAL DE CONFIRMAÇÃO ---
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









// --- INICIALIZAÇÃO DO CÓDIGO APÓS O DOM SER CARREGADO ---
document.addEventListener("DOMContentLoaded", () => {
    // --- Referências aos elementos do DOM
    const menuContainer = document.getElementById("menu");
    const cartBtn = document.getElementById("cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartItemsConteiner = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const addressInput = document.getElementById("address-input");
    const addressWarn = document.getElementById("address-warn");
    const addressWarnEmptyCart = document.getElementById("address-warn-cart-empty");
    const bebidas = document.getElementById("bebidas");
    const spanItem = document.getElementById("date-span");

    // --- INTERAÇÃO DO ZOOM NA TELA ---
    let scale = 1;
    const main = document.querySelector("main");

    if (main) {
        document.addEventListener("wheel", function (e) {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    scale += 0.1;
                } else {
                    scale -= 0.1;
                }
                scale = Math.min(Math.max(0.5, scale), 2);
                main.style.transform = `scale(${scale})`;
                main.style.transformOrigin = "top center";
            }
        }, { passive: false });

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
                scale = 1;
                main.style.transform = `scale(${scale})`;
                main.style.transformOrigin = "top center";
            }
        });
    }

    // --- ABRE O MODAL DO CARRINHO ---
    if (cartBtn) {
        cartBtn.addEventListener("click", function () {
            updateCartModal();
            if (cartModal) {
                cartModal.classList.remove("hidden");
                cartModal.classList.add("flex");
            }
        });
    }

    // --- FECHA O MODAL AO CLICAR FORA ---
    if (cartModal) {
        cartModal.addEventListener("click", function (event) {
            if (event.target === cartModal) {
                cartModal.classList.add("hidden");
                cartModal.classList.remove("flex");
            }
        });
    }

    // --- FECHA O MODAL AO CLICAR NO BOTÃO FECHAR ---
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            if (cartModal) {
                cartModal.classList.add("hidden");
                cartModal.classList.remove("flex");
            }
        });
    }

    // --- ADICIONA ITENS DO MENU E BEBIDAS AO CARRINHO ---
    if (menuContainer) {
        menuContainer.addEventListener("click", function (event) {
            const parentButton = event.target.closest(".add-to-cart-btn");
            if (parentButton) {
                const id = parentButton.getAttribute("data-id");
                const name = parentButton.getAttribute("data-name");
                const price = parseFloat(parentButton.getAttribute("data-price"));
                addToCart(id, name, price);
            }
        });
    }
    if (bebidas) {
        bebidas.addEventListener("click", function (event) {
            const parentButton = event.target.closest(".add-to-cart-btn");
            if (parentButton) {
                const id = parentButton.getAttribute("data-id");
                const name = parentButton.getAttribute("data-name");
                const price = parseFloat(parentButton.getAttribute("data-price"));
                addToCart(id, name, price);
            }
        });
    }

    // --- REMOVE ITEM DO CARRINHO ---
    if (cartItemsConteiner) {
        cartItemsConteiner.addEventListener("click", function (event) {
            if (event.target.classList.contains("remove-from-cart-btn")) {
                const id = event.target.getAttribute("data-id");
                removeItemCart(id);
            }
        });
    }

    // --- AVISO DE ENDEREÇO ---
    if (addressInput) {
        addressInput.addEventListener("input", function (event) {
            let inputValue = event.target.value;
            if (inputValue !== "" && addressWarn) {
                addressInput.classList.remove("border-red-500");
                addressWarn.classList.add("hidden");
            }
        });
    }

    // --- FINALIZAR PEDIDO ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            const isOpen = checkrestauranteopen();
            if (!isOpen) {
                Toastify({
                    text: "Ops, o restaurante está fechado!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: { background: "#ef4444" },
                }).showToast();
                return;
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
                }).showToast();
                if (addressWarnEmptyCart) {
                    addressWarnEmptyCart.classList.remove("hidden");
                }
                return;
            }

            if (addressInput && addressInput.value === "") {
                if (addressWarn) {
                    addressWarn.classList.remove("hidden");
                }
                addressInput.classList.add("border-red-500");
                return;
            }

            const cartItems = cart.map(item => {
                return `${item.name} | Quantidade: (${item.quantity}) | Preço: R$${item.price.toFixed(2)}`;
            }).join("\n");

            const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const totalFormatted = `--------------------------------------------------\n| Total: R$ ${total.toFixed(2)}\n| Endereço: ${addressInput.value}`;
            const message = encodeURIComponent(cartItems + "\n" + totalFormatted);
            const phone = "91980842421";
            window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

            cart = [];
            updateCartModal();
        });
    }

    // --- ATUALIZA O ESTADO DO RESTAURANTE ---
    const isOpen = checkrestauranteopen();
    if (spanItem) {
        if (isOpen) {
            spanItem.classList.remove("bg-red-500");
            spanItem.classList.add("bg-green-600");
        } else {
            spanItem.classList.remove("bg-green-600");
            spanItem.classList.add("bg-red-500");
        }
    }

    // --- PRODUTOS DINÂMICOS E BANNER ---
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
        if (!container) return;
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
        if (e.target.closest(".upload-preview") && inputFile) {
            inputFile.click();
        }
        if (inputFile) {
            inputFile.addEventListener("change", () => {
                const file = inputFile.files[0];
                if (file) {
                    const imgURL = URL.createObjectURL(file);
                    if (uploadBox) {
                        uploadBox.innerHTML = `<img src="${imgURL}" alt="Preview">`;
                    }
                    item.imagem = imgURL;
                }
            });
        }

        // editar
        if (e.target.classList.contains("editar")) {
            item._backup = { ...item };
            item.emEdicao = true;
            renderTodos();
        }

        // salvar
        if (e.target.classList.contains("salvar")) {
            const novoNome = card.querySelector(".nome input")?.value?.trim();
            const novaDesc = card.querySelector(".descricao textarea")?.value?.trim();
            const novoPreco = card.querySelector(".preco input")?.value?.trim();
            const temImagem = uploadBox?.querySelector("img") !== null;

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
                }).showToast();
                return;
            }

            item.nome = novoNome;
            item.descricao = novaDesc;
            item.preco = parseFloat(novoPreco);
            item.emEdicao = false;

            if (item.novo) delete item.novo;
            if (item._backup) delete item._backup;

            renderTodos();
            showToast(`${tipo === "produto" ? "Produto" : "Bebida"} salvo com sucesso!`);
        }

        // cancelar
        if (e.target.classList.contains("cancelar")) {
            if (item.novo) {
                lista.splice(index, 1);
                showToast(`${tipo === "produto" ? "Produto" : "Bebida"} não salvo foi removido`);
            } else {
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
            if (card.querySelector(".nome input")) card.querySelector(".nome input").value = "";
            if (card.querySelector(".descricao textarea")) card.querySelector(".descricao textarea").value = "";
            if (card.querySelector(".preco input")) card.querySelector(".preco input").value = "";
            if (uploadBox) {
                uploadBox.innerHTML = `
                    <div class="add-image-upload">
                        <i class="bi bi-plus-circle"></i>
                        <p>Adicionar imagem</p>
                    </div>
                `;
            }
            showToast("Campos limpos");
        }

        // remover
        if (e.target.classList.contains("remover")) {
            const id = e.target.getAttribute("data-id");
            showConfirm(`Deseja remover este ${tipo}?`, () => {
                const itemIndexInCart = cart.findIndex(item => item.id === id);
                if (itemIndexInCart !== -1) {
                    cart.splice(itemIndexInCart, 1);
                    updateCartModal();
                }
                lista.splice(index, 1);
                renderTodos();
                showToast(`${tipo === "produto" ? "Produto" : "Bebida"} removido!`);
            });
        }
    });


    /////////////////////////////////////////////////////////////////////////////////
    ///////////////          BANNER          ///////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////


    // --- LÓGICA DO BANNER (mantida intacta) ---
    const bannerBackground = document.getElementById("bannerBackground");
    const logoImg = document.getElementById("logoImg");
    const restaurantName = document.getElementById("restaurantName");
    const bannerAddress = document.getElementById("restaurant-address");
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

    const removerLogoBtn = document.getElementById("removerLogoBtn");
    const logoContainer = document.getElementById("logoContainer");
    const removerFundoBtn = document.getElementById("removerFundoBtn");



    let originalData = {
        name: restaurantName.textContent.trim(),
        address: bannerAddress.textContent.trim(),
        backgroundImg: window.getComputedStyle(bannerBackground).backgroundImage,
        logoSrc: logoImg.src,
    };

    // Guarda o estado atual do fundo necessario para opacidade
    let currentBackgroundImage = window.getComputedStyle(bannerBackground).backgroundImage;

    let editing = false;
    let logoVisivel = true;
    let fundoVisivel = true;

    //  Modo de edição
    function renderEditMode() {
        if (editing) {
            // Esconde botões padrão e mostra os de edição
            defaultButtons.classList.add("hidden");
            editModeButtons.classList.remove("hidden");

            // Transforma texto em inputs
            restaurantName.innerHTML = `<input type="text" class="editable-input" value="${restaurantName.textContent.trim()}">`;
            bannerAddress.innerHTML = `<input type="text" class="editable-input" value="${bannerAddress.textContent.trim()}">`;

            // Adiciona classe de cursor para indicar que a imagem é clicável
            bannerBackground.classList.add("cursor-pointer");

            // aplica borda no fundo
            if (fundoVisivel) bannerBackground.classList.add("editing-border-fundo");

            // aplica borda na logo ou no placeholder
            const logoImg = document.getElementById("logoImg");
            const logoPlaceholder = document.getElementById("logoPlaceholder");
            if (logoImg) {
                logoImg.classList.add("cursor-pointer", "editing-border");
            }
            if (logoPlaceholder) {
                logoPlaceholder.classList.add("editing-border");
            }

        } else {
            // Esconde botões de edição e mostra os padrão
            defaultButtons.classList.remove("hidden");
            editModeButtons.classList.add("hidden");

            // Reverte para elementos de texto
            restaurantName.innerHTML = originalData.name;
            bannerAddress.innerHTML = originalData.address;

            bannerBackground.classList.remove("cursor-pointer", "editing-border-fundo");

            // remove borda tanto da logo quanto do placeholder
            const logoImg = document.getElementById("logoImg");
            const logoPlaceholder = document.getElementById("logoPlaceholder");
            if (logoImg) logoImg.classList.remove("editing-border", "cursor-pointer");
            if (logoPlaceholder) logoPlaceholder.classList.remove("editing-border");
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
        if (!editing) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let logoImg = document.getElementById("logoImg");
                    if (!logoImg) {
                        // Se não existir, recria antes
                        logoContainer.innerHTML = `
                        <img id="logoImg" src="" alt="Logo" class="w-32 h-32 object-cover rounded-full cursor-pointer">
                    `;
                        logoImg = document.getElementById("logoImg");
                    }
                    logoImg.src = e.target.result;

                    removerLogoBtn.textContent = "Remover";
                    logoVisivel = true;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // Remover logo/Adicionar logo
    removerLogoBtn.addEventListener("click", () => {
        if (logoVisivel) {
            // Remove a div
            logoContainer.style.display = "none";

            // Esconde o botão "Trocar logo"
            trocarLogoBtn.style.display = "none";

            // Atualiza texto do botão
            removerLogoBtn.textContent = "Adicionar logo";
            logoVisivel = false;

            // Permite clicar no placeholder para trocar logo
            document.getElementById("logoPlaceholder").addEventListener("click", () => {
                trocarLogoBtn.click();
            });

        } else {
            // Volta a div com placeholder
            logoContainer.style.display = "flex";
            logoContainer.innerHTML = `
            <div id="logoPlaceholder" 
                class="w-32 h-32 flex flex-col items-center justify-center 
                rounded-full text-gray-500 shadow-lg cursor-pointer editing-border">
                    <i class="bi bi-plus-square-dotted text-4xl"></i>
                    <span class="text-sm mt-1">Adicionar logo</span>
            </div>
        `;

            // Mostra o botão "Trocar logo" novamente
            trocarLogoBtn.style.display = "inline-block";

            // Atualiza texto do botão
            removerLogoBtn.textContent = "Remover";
            logoVisivel = true;

            // Reativa clique na logo para upload
            // Adiciona evento de clique para upload no placeholder
            const placeholder = document.getElementById("logoPlaceholder");
            placeholder.addEventListener("click", () => {
                if (!editing) return;
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            logoContainer.innerHTML = `
                    <img id="logoImg" src="${e.target.result}" 
                         alt="Logo" 
                         class="w-32 h-32 object-cover rounded-full cursor-pointer editing-border">
                `;

                            // reativa clique na nova logo para trocar
                            const logoImg = document.getElementById("logoImg");
                            logoImg.addEventListener("click", () => {
                                if (!editing) return;
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
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        }
    });
    

    // Trocar fundo
    trocarFundoBtn.addEventListener("click", () => {
        if (!editing) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    bannerBackground.style.backgroundImage = `url(${e.target.result})`;
                    //Atualiza a referência da imagem atual da opacidade
                    currentBackgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // Remover Fundo/Adicionar Fundo
    removerFundoBtn.addEventListener("click", () => {
        if (fundoVisivel) {
            // Limpa imagem, cor e opacidade
            bannerBackground.style.backgroundImage = "none";
            bannerBackground.style.backgroundColor = "transparent";
            bannerBackground.classList.remove("editing-border-fundo");

            // Atualiza referência (sem imagem)
            currentBackgroundImage = "none";

            // Esconde botão "Trocar fundo"
            trocarFundoBtn.style.display = "none";

            // Atualiza texto do botão
            removerFundoBtn.textContent = "Adicionar fundo";
            fundoVisivel = false;
        } else {
            // Restaura fundo "limpo" (sem imagem, só com borda)
            bannerBackground.style.backgroundImage = "none";
            bannerBackground.style.backgroundColor = "transparent";
            bannerBackground.classList.add("editing-border-fundo");

            // Atualiza referência (sem imagem)
            currentBackgroundImage = "none";

            // Mostra botão "Trocar fundo" novamente
            trocarFundoBtn.style.display = "inline-block";

            // Atualiza texto do botão
            removerFundoBtn.textContent = "Remover";
            fundoVisivel = true;
        }
    });

    // Opacidade de fundo
    function updateBackgroundOpacity(value) {
        // Se não houver imagem no fundo
        if (!currentBackgroundImage || currentBackgroundImage === "none") {
            opacityRange.value = 0;
            showToast("Opacidade indisponível");
            return;
        }

        // valor vai de 0 (sem overlay) até 0.8 (80%)
        const opacity = (value / 100) * 0.8;

        // Aplica gradiente + imagem atual
        bannerBackground.style.backgroundImage = `
        linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity})),
        ${currentBackgroundImage}
    `;
    }

    // Atualiza em tempo real ao mover a bolinha
    opacityRange.addEventListener("input", () => {
        updateBackgroundOpacity(opacityRange.value);
    });

    // Valor inicial (50%)
    window.addEventListener("load", () => {
        opacityRange.value = 50;
        updateBackgroundOpacity(50);
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
            address: bannerAddress.textContent.trim(),
            backgroundImg: window.getComputedStyle(bannerBackground).backgroundImage,
            logoSrc: logoImg.src,
        };
        renderEditMode();
    });

    // "Salvar"
    salvarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newName = restaurantName.querySelector("input").value;
        const newAddress = bannerAddress.querySelector("input").value;

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
        bannerAddress.innerHTML = originalData.address;

        // Reverte as imagens
        bannerBackground.style.backgroundImage = originalData.backgroundImg;
        logoImg.src = originalData.logoSrc;

        // Atualiza currentBackgroundImage para manter a consistência
        currentBackgroundImage = originalData.backgroundImg;

        // Finaliza o modo de edição
        editing = false;
        renderEditMode();
        showToast("Edição cancelada.");
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

