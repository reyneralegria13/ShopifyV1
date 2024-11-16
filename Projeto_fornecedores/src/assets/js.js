document.addEventListener('DOMContentLoaded', function() {
    const pedidosContainer = document.getElementById('pedidos');
    const adicionarPedidoBtn = document.getElementById('adicionarPedido');
    let pedidoCount = 1;

    adicionarPedidoBtn.addEventListener('click', function() {
        const novoPedido = document.createElement('div');
        novoPedido.className = 'pedido';
        novoPedido.innerHTML = `
            <input type="text" name="pedidos[${pedidoCount}][item]" placeholder="Item (ex: coxa de frango)">
            <div class="quantidade-container">
                <button type="button" class="btn-quantidade" onclick="diminuirQuantidade(this)">-</button>
                <input type="number" name="pedidos[${pedidoCount}][quantidade]" value="0" readonly class="quantidade-input">
                <button type="button" class="btn-quantidade" onclick="aumentarQuantidade(this)">+</button>
            </div>
        `;
        pedidosContainer.appendChild(novoPedido);
        pedidoCount++;
    });
});

function aumentarQuantidade(btn) {
    const input = btn.previousElementSibling;
    input.value = parseInt(input.value) + 1;
}

function diminuirQuantidade(btn) {
    const input = btn.nextElementSibling;
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
    }
}