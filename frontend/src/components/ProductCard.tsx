import React from 'react';
import { Box, Image, Heading, Text, Button, Flex, Badge } from '@chakra-ui/react';

// Tipos para o produto
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

// Props do componente
type ProductCardProps = {
  product: Product;
  onAddToCart: () => void;
};

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Verifica se o produto está disponível em estoque
  const isOutOfStock = product.stock <= 0;
  
  // Formata o preço para exibição
  const formattedPrice = product.price.toFixed(2).replace('.', ',');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      shadow="md"
      transition="all 0.3s"
      _hover={{ 
        shadow: 'lg', 
        transform: 'translateY(-5px)'
      }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Área da imagem do produto */}
      <Box height="200px" position="relative">
        <Image
          src={product.image || 'https://placehold.co/300'}
          alt={product.name}
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="md"
        />
        
        {/* Badge de produto esgotado */}
        {isOutOfStock && (
          <Badge
            position="absolute"
            top="10px"
            right="10px"
            colorScheme="red"
            fontSize="0.8em"
            p={2}
          >
            Esgotado
          </Badge>
        )}
      </Box>

      {/* Informações do produto */}
      <Box mt={4} flex="1">
        <Heading size="md" noOfLines={2} height="50px">
          {product.name}
        </Heading>
        
        <Text mt={2} fontSize="lg" fontWeight="bold" color="blue.600">
          R$ {formattedPrice}
        </Text>
        
        <Text mt={2} color="gray.600" noOfLines={3} height="60px">
          {product.description}
        </Text>
      </Box>

      {/* Botão de adicionar ao carrinho */}
      <Flex mt={4}>
        <Button
          width="100%"
          colorScheme="blue"
          onClick={onAddToCart}
          isDisabled={isOutOfStock}
        >
          {isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductCard; 