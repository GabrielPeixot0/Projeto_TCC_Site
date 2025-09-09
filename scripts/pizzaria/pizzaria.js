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
const bebidas = document.getElementById("bebidas")

let cart = []

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

menu.addEventListener("click", function (event) {
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
// PRODUTOS DINÂMICOS
document.addEventListener("DOMContentLoaded", () => {
    const produtos = [
        { nome: "Pizza 5 queijos", descricao: "Mussarela, Catupiry, parmesão, Gorgonzola, Provolone.", preco: 19.9, imagem: "../../imagens/Pizza 5 queijos.avif" },
        { nome: "Pizza Peperoni", descricao: "Molho, Mussarela, Peperoni, orégano.", preco: 22.9, imagem: "../../imagens/Pizza de Peperoni.jpg" },
        { nome: "Pizza de Torresmo", descricao: "Molho, Mussarela, Torresmo, azeitona preta, cebola, orégano.", preco: 27.9, imagem: "../../imagens/Pizza de Bacon.avif" },
        { nome: "Pizza Portuguesa", descricao: "Molho, Mussarela, Calabresa, Milho Verde, Ovo, Pimentão, Cebola, Bacon.", preco: 27.9, imagem: "../../imagens/Pizza Portuguesa.webp" },
        { nome: "Pizza Frango com Catupiry", descricao: "Molho, Mussarela, Frango, Catupiry, orégano.", preco: 24.9, imagem: "../../imagens/Pizza Frango Catupiry.jpg" },
        { nome: "Pizza de Tomate", descricao: "Molho, Mussarela, Tomate, azeitona preta, cebola, alface.", preco: 25.9, imagem: "../../imagens/Pizza Tomate.avif" },
        { nome: "Pizza Cereja", descricao: "Chocolate, Cereja, confeito de Chocolate.", preco: 25.9, imagem: "../../imagens/Pizza Cereja.jpg" },
        { nome: "Pizza Doce", descricao: "Chocolate, Creme de Leite, Morango, confeito de Chocolate.", preco: 29.9, imagem: "../../imagens/Pizza Doce.avif" },
    ]

    const container = document.querySelector("#produtos-container")

    produtos.forEach((p, index) => {
        const card = document.createElement("div")
        card.classList.add("produto-card", "flex", "gap-3")
        card.dataset.index = index
        card.dataset.id = `produto-${index}` // <-- ID único fixo

        card.innerHTML = `
      <!-- Caixa de imagem -->
      <div class="upload-preview" data-index="${index}">
        ${p.imagem ? `<img src="${p.imagem}" alt="${p.nome}" />` : `<span>Adicionar imagem</span>`}
      </div>
      <input type="file" accept="image/*" class="input-imagem hidden" data-index="${index}">

      <!-- Conteúdo texto -->
      <div class="flex-1">
        <p class="nome font-bold">${p.nome}</p>
        <p class="descricao text-sm">${p.descricao}</p>

        <div class="flex items-center gap-2 justify-between mt-3">
          <p class="preco font-bold text-lg">R$ ${p.preco.toFixed(2)}</p>

           <button class="bg-gray-900 px-5 rounded add-to-cart-btn" 
              data-id="produto-${index}" 
              data-name="${p.nome}" 
              data-price="${p.preco.toFixed(2)}">
                <i class="fa fa-cart-plus text-lg text-white"></i>
          </button>

          <button class="btn limpar hidden">Limpar</button>
        </div>

        <!-- Botões de edição -->
        <div class="mt-2 flex gap-2">
          <button class="btn editar">Editar</button>
          <button class="btn salvar hidden">Salvar</button>
          <button class="btn cancelar hidden">Cancelar</button>
        </div>
      </div>
    `
        container.appendChild(card)
    })

    // Delegação de eventos
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".produto-card")
        if (!card) return

        const index = card.dataset.index
        const p = produtos[index]
        const nomeEl = card.querySelector(".nome")
        const descEl = card.querySelector(".descricao")
        const precoEl = card.querySelector(".preco")
        const uploadBox = card.querySelector(".upload-preview")
        const inputFile = card.querySelector(".input-imagem")

        // === CLICK NA IMAGEM ===
        if (e.target.closest(".upload-preview")) {
            inputFile.click()
        }

        // === UPLOAD IMAGEM ===
        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0]
            if (file) {
                const imgURL = URL.createObjectURL(file)
                uploadBox.innerHTML = `<img src="${imgURL}" alt="Preview">`
            }
        })

        // === EDITAR ===
        if (e.target.classList.contains("editar")) {
            nomeEl.innerHTML = `<input type="text" value="${p.nome}" class="input-text">`
            descEl.innerHTML = `<textarea class="input-text">${p.descricao}</textarea>`
            precoEl.innerHTML = `<input type="number" value="${p.preco}" class="input-text">`

            card.querySelector(".editar").classList.add("hidden")
            card.querySelector(".salvar").classList.remove("hidden")
            card.querySelector(".cancelar").classList.remove("hidden")

            if (e.target.classList.contains("editar")) {
                nomeEl.innerHTML = `<input type="text" value="${p.nome}" class="input-text">`
                descEl.innerHTML = `<textarea class="input-text">${p.descricao}</textarea>`
                precoEl.innerHTML = `<input type="number" value="${p.preco}" class="input-text">`

                // troca botões
                card.querySelector(".editar").classList.add("hidden")
                card.querySelector(".salvar").classList.remove("hidden")
                card.querySelector(".cancelar").classList.remove("hidden")

                card.querySelector(".add-to-cart-btn").classList.add("hidden")
                card.querySelector(".limpar").classList.remove("hidden")
            }

        }

        // === SALVAR ===
        if (e.target.classList.contains("salvar")) {
            const addToCartBtn = card.querySelector(".add-to-cart-btn")
            const novoNome = card.querySelector(".nome input").value.trim()
            const novaDesc = card.querySelector(".descricao textarea").value.trim()
            const novoPreco = card.querySelector(".preco input").value.trim()
            const temImagem = uploadBox.querySelector("img") !== null

            // validação
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
                return // impede salvar
            }

            // se passou na validação → salva normalmente
            p.nome = novoNome
            p.descricao = novaDesc
            p.preco = parseFloat(novoPreco)

            nomeEl.textContent = novoNome
            descEl.textContent = novaDesc
            precoEl.textContent = `R$ ${p.preco.toFixed(2)}`

            // Atualiza os atributos do botão do carrinho
            addToCartBtn.setAttribute("data-name", p.nome)
            addToCartBtn.setAttribute("data-price", p.preco.toFixed(2))
            card.querySelector(".editar").classList.remove("hidden")
            card.querySelector(".salvar").classList.add("hidden")
            card.querySelector(".cancelar").classList.add("hidden")
            card.querySelector(".add-to-cart-btn").classList.remove("hidden")
            card.querySelector(".limpar").classList.add("hidden")
        }

        // === CANCELAR ===
        if (e.target.classList.contains("cancelar")) {
            nomeEl.textContent = p.nome || "Adicionar nome"
            descEl.textContent = p.descricao || "Adicionar descrição"
            precoEl.textContent = p.preco ? `R$ ${p.preco.toFixed(2)}` : "Adicionar Preço"

            if (p.imagem) {
                uploadBox.innerHTML = `<img src="${p.imagem}" alt="${p.nome}">`
            } else {
                uploadBox.innerHTML = `<span>Adicionar imagem</span>`
            }

            // remove do carrinho também
            removeItemCart(p.nome)

            card.querySelector(".editar").classList.remove("hidden")
            card.querySelector(".salvar").classList.add("hidden")
            card.querySelector(".cancelar").classList.add("hidden")
            card.querySelector(".add-to-cart-btn").classList.remove("hidden")
            card.querySelector(".limpar").classList.add("hidden")
        }
        // === LIMPAR ===
        if (e.target.classList.contains("limpar")) {
            // zera os dados do produto no card
            nomeEl.innerHTML = `<input type="text" value="" class="input-text" placeholder="Adicionar nome">`
            descEl.innerHTML = `<textarea class="input-text" placeholder="Adicionar descrição"></textarea>`
            precoEl.innerHTML = `<input type="number" value="" class="input-text" placeholder="Adicionar Preço">`

            uploadBox.innerHTML = `<span>Adicionar imagem</span>`
            inputFile.value = "" // limpa o file input também
        }

    })
})
