const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

// Listar fornecedores
router.get('/', async (req, res) => {
  try {
        res.render('inicial/home', {
      title: 'Fornecedores',
      style: 'estilos_fornecedores.css', 
          });
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    res.status(500).render('error', { message: 'Erro ao carregar fornecedores' });
  }
});
module.exports = router;