const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fornRoutes = require('../routes/fornecedores');

// Listar fornecedores
const Home = async (req, res) => {
  try {
        res.render('Inicio/home', {
      title: 'Fornecedores',
      style: 'inicial/estilos_home.css', 
          });
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    res.status(500).render('error', { message: 'Erro ao carregar fornecedores' });
  }
};
module.exports = {Home};