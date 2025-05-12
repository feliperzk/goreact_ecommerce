import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Heading, Text, Link, VStack, Container, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type LoginFormInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
}).required();

const Login: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
      toast({
        title: 'Login realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/products');
    } catch (err) {
      // Erro já tratado no AuthContext
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Entrar na sua conta</Heading>
        
        {error && (
          <Text color="red.500">{error}</Text>
        )}
        
        <Box as="form" w="100%" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                placeholder="seu@email.com"
                {...register('email')}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                {...register('password')}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              w="100%"
              mt={4}
              isLoading={loading}
            >
              Entrar
            </Button>
          </VStack>
        </Box>
        
        <Text>
          Não tem uma conta?{' '}
          <Link as={RouterLink} to="/register" color="blue.500">
            Cadastre-se
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default Login; 