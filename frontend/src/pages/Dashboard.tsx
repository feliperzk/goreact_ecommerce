import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Spinner, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Flex, Grid, GridItem, Badge, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

// Tipos de dados para pedidos
type ItemPedido = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

type Pedido = {
  id: string;
  items: ItemPedido[];
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  total: number;
  createdAt: string;
};

// Dados de exemplo para desenvolvimento
const pedidosExemplo: Pedido[] = [
  {
    id: 'ped-987654321',
    items: [
      {
        id: 'item-1',
        productId: '1',
        productName: 'Smartphone Premium',
        price: 1899.99,
        quantity: 1
      },
      {
        id: 'item-2',
        productId: '4',
        productName: 'Fone de Ouvido Bluetooth',
        price: 249.99,
        quantity: 2
      }
    ],
    status: 'COMPLETED',
    total: 2399.97,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ped-123456789',
    items: [
      {
        id: 'item-3',
        productId: '2',
        productName: 'Notebook Profissional',
        price: 4299.99,
        quantity: 1
      }
    ],
    status: 'PENDING',
    total: 4299.99,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const Dashboard = () => {
  // Hooks e estado
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Carregar pedidos
  useEffect(() => {
    const carregarPedidos = async () => {
      // Verificar autenticação
      if (!isAuthenticated()) {
        toast({
          title: 'Acesso restrito',
          description: 'Você precisa estar logado para acessar seus pedidos',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }

      try {
        // Simular tempo de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar dados mockados
        setPedidos(pedidosExemplo);
        setCarregando(false);
      } catch (error) {
        setErro(true);
        setCarregando(false);
        
        toast({
          title: 'Erro ao carregar pedidos',
          description: 'Não foi possível obter seus pedidos. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    carregarPedidos();
  }, [isAuthenticated, navigate, toast]);

  // Função para obter a cor do status
  const getCorStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'yellow';
    }
  };

  // Função para obter o texto do status
  const getTextoStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Entregue';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return 'Em processamento';
    }
  };

  // Função para tentar novamente
  const tentarNovamente = async () => {
    setCarregando(true);
    setErro(false);
    
    // Simular recarregamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setPedidos(pedidosExemplo);
    setCarregando(false);
  };

  // Exibir loading
  if (carregando) {
    return (
      <Box>
        <Header />
        <Box textAlign="center" py={10}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text mt={4} fontSize="lg">Carregando seus pedidos...</Text>
        </Box>
      </Box>
    );
  }

  // Exibir erro
  if (erro) {
    return (
      <Box>
        <Header />
        <Box textAlign="center" py={10}>
          <Text color="red.500" fontSize="lg" mb={4}>
            Não foi possível carregar seus pedidos
          </Text>
          <Button 
            colorScheme="blue" 
            onClick={tentarNovamente}
          >
            Tentar novamente
          </Button>
        </Box>
      </Box>
    );
  }

  // Formatar data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Formatar valor para exibição
  const formatarValor = (valor: number) => {
    return valor.toFixed(2).replace('.', ',');
  };

  return (
    <Box>
      <Header />
      <Box maxW="container.xl" mx="auto" px={4} py={8}>
        <Heading mb={6}>Meus Pedidos</Heading>

        {pedidos.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="xl" mb={4}>Você ainda não tem pedidos</Text>
            <Button 
              colorScheme="blue" 
              onClick={() => navigate('/products')}
            >
              Descobrir Produtos
            </Button>
          </Box>
        ) : (
          <Accordion allowToggle>
            {pedidos.map((pedido) => (
              <AccordionItem key={pedido.id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold">
                          Pedido #{pedido.id.substring(4, 12)}
                        </Text>
                        <Flex alignItems="center" gap={4}>
                          <Text>
                            {formatarData(pedido.createdAt)}
                          </Text>
                          <Badge colorScheme={getCorStatus(pedido.status)}>
                            {getTextoStatus(pedido.status)}
                          </Badge>
                          <Text fontWeight="bold">
                            R$ {formatarValor(pedido.total)}
                          </Text>
                        </Flex>
                      </Flex>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Grid 
                    templateColumns="repeat(4, 1fr)" 
                    gap={4} 
                    fontWeight="bold" 
                    mb={2} 
                    borderBottomWidth="1px" 
                    pb={2}
                  >
                    <GridItem>Produto</GridItem>
                    <GridItem>Preço Unit.</GridItem>
                    <GridItem>Quantidade</GridItem>
                    <GridItem>Subtotal</GridItem>
                  </Grid>
                  
                  {pedido.items.map((item) => (
                    <Grid 
                      key={item.id} 
                      templateColumns="repeat(4, 1fr)" 
                      gap={4} 
                      py={2} 
                      borderBottomWidth="1px"
                    >
                      <GridItem>{item.productName}</GridItem>
                      <GridItem>R$ {formatarValor(item.price)}</GridItem>
                      <GridItem>{item.quantity}</GridItem>
                      <GridItem>R$ {formatarValor(item.price * item.quantity)}</GridItem>
                    </Grid>
                  ))}
                  
                  <Flex justifyContent="flex-end" mt={4}>
                    <Text fontWeight="bold" fontSize="lg">
                      Total: R$ {formatarValor(pedido.total)}
                    </Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 