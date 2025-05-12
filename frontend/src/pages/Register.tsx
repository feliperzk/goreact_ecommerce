import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Heading, Text, Link, VStack, Container, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), undefined], 'As senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
}).required();

const Register: React.FC = () => {
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast({
        title: 'Conta criada com sucesso',
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
        <Heading>Criar uma conta</Heading>
        
        {error && (
          <Text color="red.500">{error}</Text>
        )}
        
        <Box as="form" w="100%" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Nome</FormLabel>
              <Input
                id="name"
                placeholder="Seu nome"
                {...register('name')}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            
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
            
            <FormControl isInvalid={!!errors.passwordConfirmation}>
              <FormLabel htmlFor="passwordConfirmation">Confirmar senha</FormLabel>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="Confirme sua senha"
                {...register('passwordConfirmation')}
              />
              <FormErrorMessage>{errors.passwordConfirmation?.message}</FormErrorMessage>
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              w="100%"
              mt={4}
              isLoading={loading}
            >
              Cadastrar
            </Button>
          </VStack>
        </Box>
        
        <Text>
          Já tem uma conta?{' '}
          <Link as={RouterLink} to="/login" color="blue.500">
            Faça login
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default Register; 