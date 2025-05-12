import React, { useState } from 'react';
import { Box, Heading, Text, Button, VStack, HStack, Image, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Divider, useToast, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  // Hooks e estados
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [processando, setProcessando] = useState(false);

  // Função para finalizar a compra
  const finalizarCompra = async () => {
    // Verifica se o usuário está logado
    if (!isAuthenticated()) {
      toast({
        title: 'Autenticação necessária',
        description: 'Você precisa estar logado para finalizar a compra',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    // Verifica se o carrinho tem itens
    if (items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho para finalizar a compra',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Inicia o processamento
      setProcessando(true);
      
      // Simula o tempo de processamento do pedido
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mostra mensagem de sucesso
      toast({
        title: 'Pedido realizado com sucesso!',
        description: 'Obrigado pela sua compra',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Limpa o carrinho e redireciona
      clearCart();
      navigate('/dashboard');
    } catch (error) {
      // Trata possíveis erros
      toast({
        title: 'Falha no processamento',
        description: 'Não foi possível finalizar seu pedido. Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // Finaliza o processamento
      setProcessando(false);
    }
  };

  // Renderiza a página do carrinho
  return (
    <Box>
      <Header />
      <Box maxW="container.xl" mx="auto" px={4} py={8}>
        <Heading mb={6}>Seu Carrinho</Heading>

        {items.length === 0 ? (
          // Carrinho vazio
          <Box textAlign="center" py={10}>
            <Text fontSize="xl" mb={4}>Seu carrinho está vazio</Text>
            <Button 
              colorScheme="blue" 
              onClick={() => navigate('/products')}
            >
              Continuar Comprando
            </Button>
          </Box>
        ) : (
          // Carrinho com itens
          <Box>
            <VStack spacing={4} align="stretch" mb={8}>
              {items.map(item => (
                <Box 
                  key={item.product.id} 
                  p={4} 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  shadow="sm"
                >
                  <Flex>
                    {/* Imagem do produto */}
                    <Image 
                      src={item.product.image || 'https://placehold.co/100'} 
                      alt={item.product.name} 
                      boxSize="100px" 
                      objectFit="cover" 
                      borderRadius="md" 
                      mr={4} 
                    />
                    
                    {/* Informações do produto */}
                    <Box flex="1">
                      <Heading size="md">{item.product.name}</Heading>
                      <Text 
                        color="blue.600" 
                        fontSize="lg" 
                        fontWeight="bold"
                      >
                        R$ {item.product.price.toFixed(2).replace('.', ',')}
                      </Text>
                      
                      {/* Controles de quantidade */}
                      <HStack mt={2} spacing={4}>
                        <NumberInput 
                          size="sm" 
                          maxW={20} 
                          defaultValue={item.quantity} 
                          min={1}
                          onChange={(valorString: string) => {
                            const quantidade = parseInt(valorString);
                            if (!isNaN(quantidade)) {
                              updateQuantity(item.product.id, quantidade);
                            }
                          }}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="outline" 
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          Remover
                        </Button>
                      </HStack>
                    </Box>
                    
                    {/* Subtotal do item */}
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>

            <Divider mb={6} />

            {/* Totais e ações finais */}
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Button 
                variant="outline" 
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>
              
              <Box textAlign="right">
                <Text fontSize="xl">
                  Total: <Text as="span" fontWeight="bold">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </Text>
                </Text>
              </Box>
            </Flex>

            {/* Botão de finalizar compra */}
            <Box textAlign="right">
              <Button 
                colorScheme="green" 
                size="lg" 
                onClick={finalizarCompra}
                isLoading={processando}
                loadingText="Processando"
              >
                Finalizar Compra
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Cart; 