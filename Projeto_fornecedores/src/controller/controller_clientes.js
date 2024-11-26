const listarClientes = async (req, res) => {
    try {
      // Renderiza a página de clientes com os dados necessários
      res.render('Clientes/clientes', {
        title: 'Clientes',
        style: 'clientes/estilos_clientes.css', // Adicione o estilo específico da página de clientes, se necessário
      });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).render('error', { message: 'Erro ao carregar clientes' });
    }
  };
  
  // Exporta a função para ser usada em outras partes do código
  module.exports = { listarClientes };