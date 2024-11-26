const Home = async (req, res) => {
  try {
    // Renderiza a página inicial com os dados necessários
    res.render('Inicio/home', {
      title: 'Gestão de Fornecedores e Clientes',
      style: 'inicial/estilos_home.css', // Adicione o estilo específico da página inicial
    });
  } catch (error) {
    console.error('Erro ao carregar a página inicial:', error);
    res.status(500).render('error', { message: 'Erro ao carregar a página inicial' });
  }
};

// Exporta a função para ser usada em outras partes do código
module.exports = { Home };