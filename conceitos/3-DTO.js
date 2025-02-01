function calcularTotalPedido(precoUnitario, quantidade){
  return precoUnitario * quantidade
}

function calcultarTota({precoUnitario, quantidade}){
  return precoUnitario * quantidade
}

const totalPedido2 = calcultarTota({
  precoUnitario: 20,
  quantidade: 3
});

const pedidoDTO = {
  precoUnitario: 20,
  quantidade: 3
}

const totalPedido3 = calcultarTota(pedidoDTO)

console.log(totalPedido2)
console.log(totalPedido3)