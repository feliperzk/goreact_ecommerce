import React from 'react';
import { Box, Flex, Heading, Button, Badge, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="blue.500" px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto">
        <Link to="/">
          <Heading size="lg" color="white">E-Commerce</Heading>
        </Link>

        <Flex alignItems="center">
          <Link to="/products">
            <Button variant="ghost" color="white" mr={2}>
              Produtos
            </Button>
          </Link>

          <Link to="/cart">
            <Button 
              variant="ghost" 
              color="white" 
              mr={2} 
              position="relative"
            >
              Carrinho
              {cartItemsCount > 0 && (
                <Badge 
                  position="absolute" 
                  top="-5px" 
                  right="-5px" 
                  colorScheme="red" 
                  borderRadius="full"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated() ? (
            <Menu>
              <MenuButton as={Button} colorScheme="whiteAlpha">
                {user?.name || 'Minha Conta'}
              </MenuButton>
              <MenuList>
                <Link to="/dashboard">
                  <MenuItem>Meus Pedidos</MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/login">
              <Button colorScheme="whiteAlpha">
                Entrar
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header; 