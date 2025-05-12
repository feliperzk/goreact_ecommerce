import React, { useState } from 'react';
import { Box, Grid, Heading, Text, Spinner, Flex, useToast } from '@chakra-ui/react';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

// Dados de produtos para desenvolvimento local
const produtosExemplo = [
  {
    id: '1',
    name: 'Smartphone Premium',
    price: 1899.99,
    description: 'Smartphone com câmera de alta resolução, processador potente e bateria de longa duração.',
    image: 'https://placehold.co/300',
    stock: 15
  },
  {
    id: '2',
    name: 'Notebook Profissional',
    price: 4299.99,
    description: 'Notebook com processador de última geração, tela de alta resolução e design elegante.',
    image: 'https://placehold.co/300',
    stock: 8
  },
  {
    id: '3',
    name: 'Smartwatch Sport',
    price: 599.99,
    description: 'Relógio inteligente com monitoramento de atividades físicas, batimentos cardíacos e notificações.',
    image: 'https://placehold.co/300',
    stock: 22
  },
  {
    id: '4',
    name: 'Fone de Ouvido Bluetooth',
    price: 249.99,
    description: 'Fone sem fio com cancelamento de ruído, bateria de longa duração e qualidade de som excepcional.',
    image: 'https://placehold.co/300',
    stock: 30
  },
  {
    id: '5',
    name: 'Câmera Digital 4K',
    price: 2899.99,
    description: 'Câmera com gravação em 4K, estabilização de imagem e diversos modos de fotografia.',
    image: 'https://placehold.co/300',
    stock: 5
  },
  {
    id: '6',
    name: 'Smart TV 55"',
    price: 3299.99,
    description: 'Smart TV com resolução 4K, sistema operacional inteligente e conectividade completa.',
    image: 'https://placehold.co/300',
    stock: 12
  }
];

const Products = () => {
  const toast = useToast();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simula carregamento de dados
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  
  // Mockação de produtos
  const produtos = produtosExemplo;

  const adicionarAoCarrinho = (produto: any) => {
    addToCart(produto);
    toast({
      title: 'Produto adicionado ao carrinho',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Tela de carregamento
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Carregando produtos...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Box maxW="container.xl" mx="auto" px={4} py={8}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading as="h1" size="xl">
            Produtos
          </Heading>
        </Flex>

        {produtos.length === 0 ? (
          <Text fontSize="lg">Nenhum produto disponível no momento.</Text>
        ) : (
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)'
            }}
            gap={6}
          >
            {produtos.map((produto) => (
              <ProductCard
                key={produto.id}
                product={produto}
                onAddToCart={() => adicionarAoCarrinho(produto)}
              />
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Products; 