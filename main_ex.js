// Elementos HTML
const $list = document.getElementById('list');
const $error = document.getElementById('error');
const $spinner = document.getElementById('spinner');
const selectOrdenar = document.getElementById("ordenar");
const selectCategoria = document.getElementById("categoria");

const API = 'https://dummyjson.com'; // API pública de testes

let produtosGlobais = []; // para armazenar todos os produtos

function showSpinner(show) {
    $spinner.style.display = show ? 'flex' : 'none';
}

function showError(msg) {
    $error.textContent = msg  ? `<div class="alert alert-danger">${msg}</div>` : '';
}

//função para exibir os posts
function renderPosts(posts) {
    //innerHTML para modificar o elemento
    //.map transforma o JSON em HTML
    //for carro in carros é igual a post.map(p =>
    $list.innerHTML = posts.products.map(product => `
    <div class="card">
        <img src="${product.thumbnail}" alt="img">
        <p><strong>🏷️${product.title}</strong></p>
        <br>
        <p>📍 ${product.category}</p>
        <p>💰 R$ ${product.price}</p>
        <p>⭐ ${product.rating}</p>
        <p>📦 ${product.stock}</p>
        <button class="btn btn-primary"><i class="bi bi-cart-plus"></i> Comprar</button>
    </div>
  `).join('');
}

// Função para ordenar produtos
function ordenarProdutos(criterio) {
    let produtosOrdenados = [...produtosGlobais]; // cópia do array original

    if (criterio === "alfabetica") {
        produtosOrdenados.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criterio === "preco_1") {
        produtosOrdenados.sort((a, b) => a.price - b.price);}
    else if (criterio === "preco_2") {
        produtosOrdenados.sort((a, b) => b.price - a.price);


    }

    renderPosts({ products: produtosOrdenados });
}

// Evento do select de ordenação
selectOrdenar.addEventListener("change", (e) => {
    ordenarProdutos(e.target.value);
});

// Renderiza produtos
function renderProducts(products) {
    if (!products || products.length === 0) {
        $list.innerHTML = '<p class="text-center">Nenhum produto encontrado.</p>';
        return;
    }
    $list.innerHTML = products.map(renderProducts).join('');
}

// função assincrona que carrega os posts
async function getPosts() {
    showSpinner(true);
    showError('');
    try {
        //fazendo uma requisição GET
        const res = await fetch(`${API}/products`);

        //verifica se deu algum erro na API
        if (!res.ok) {
            throw new Error(`Erro HTTP ${res.status}`);
        }

        //aguarda o retoro da API
        const data = await res.json();

        produtosGlobais = data.products; // salva os produtos globalmente
        renderPosts({ products: produtosGlobais });
        //chama a função para exibir o resultado
    } catch (err) {
        showError(err.message || 'Falha ao buscar produtos');
    } finally {
        showSpinner(false);
    }
}

// Funções: showSpinner, showError, renderPosts, getPosts
    // ... (mantenha as funções que você já tinha)

    // Função para atualizar lista com categoria + ordenação
    function atualizarLista() {
        const categoria = selectCategoria.value;
        const criterio = selectOrdenar.value;

        let produtosFiltrados = categoria === "todas"
            ? produtosGlobais
            : produtosGlobais.filter(p => p.category === categoria);

        if (criterio === "alfabetica") produtosFiltrados.sort((a,b)=>a.title.localeCompare(b.title));
        else if (criterio === "preco_1") produtosFiltrados.sort((a,b)=>a.price - b.price);
        else if (criterio === "preco_2") produtosFiltrados.sort((a, b) => b.price - a.price);

        renderPosts({ products: produtosFiltrados });
    }

    // Event listeners
    selectOrdenar.addEventListener("change", atualizarLista);
    selectCategoria.addEventListener("change", atualizarLista);

    // Carregar produtos da API
    getPosts();

// // Executa quando a página carrega
// document.addEventListener('DOMContentLoaded', getPosts);



