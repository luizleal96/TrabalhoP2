# TrabalhoP2 - Expo + Neon Auth

Aplicativo em React Native/Expo com cadastro, login, verificação de sessão e logout usando Neon Auth.

## Requisitos

- Node.js LTS e npm
- Expo Go para testar em um celular, ou um navegador para a versão web
- Um projeto Neon com Better Auth habilitado e cadastro por e-mail/senha ativado

## Configuração

1. Instale as dependências:

   ```powershell
   npm install
   ```

2. Crie o arquivo `.env` na raiz do projeto usando `.env.example` como referência. Configure a **Auth Base URL** exibida em Neon Console > Better Auth > Configuration:

   ```env
   EXPO_PUBLIC_NEON_AUTH_URL=https://seu-endpoint.neonauth.../neondb/auth
   ```

   A URL de autenticação não é a connection string do PostgreSQL. Nunca coloque senha, connection string ou chave secreta em uma variável `EXPO_PUBLIC_`.

3. Inicie o Expo:

   ```powershell
   npx expo start -c
   ```

   Pressione `w` para abrir a versão web ou leia o QR code com o Expo Go no celular.

## Testes de build

```powershell
npx expo-doctor
npx expo install --check
npx expo export --platform android
npx expo export --platform web
```

O arquivo `.env` e os diretórios gerados/dependências são ignorados pelo Git.
