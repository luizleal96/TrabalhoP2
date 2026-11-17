// src/auth.js
// Chamadas ao Neon Auth (Managed Better Auth) usando fetch.

const AUTH_URL = process.env.EXPO_PUBLIC_NEON_AUTH_URL;

// O Neon Auth exige o cabeçalho "Origin" nos POSTs.
// O navegador envia sozinho; o React Native NÃO envia. Por isso enviamos aqui.
const ORIGIN = 'http://localhost:3000';

const MENSAGENS = {
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha incorretos.',
  USER_ALREADY_EXISTS: 'Este e-mail já está cadastrado.',
  PASSWORD_TOO_SHORT: 'A senha é muito curta (mínimo 8 caracteres).',
  INVALID_EMAIL: 'E-mail inválido.',
  INVALID_ORIGIN:
    'Origem não confiável. Confira a configuração de domínios no Neon Auth.',
  MISSING_ORIGIN:
    'O Neon Auth não recebeu o cabeçalho Origin. Confira a configuração do app.',
  MISSING_OR_NULL_ORIGIN:
    'O Neon Auth não recebeu o cabeçalho Origin. Confira a configuração do app.',
};

function traduzirErro(data, status) {
  const code = data && data.code ? String(data.code) : '';
  const chave = Object.keys(MENSAGENS).find((k) => code.startsWith(k));
  if (chave) return MENSAGENS[chave];
  return (data && data.message) || 'Erro inesperado (' + status + ').';
}

function obterAuthUrl() {
  const url = AUTH_URL && AUTH_URL.trim().replace(/\/+$/, '');
  if (!url) {
    throw new Error(
      'Variável EXPO_PUBLIC_NEON_AUTH_URL não encontrada. Confira o arquivo .env na raiz e reinicie o Expo.'
    );
  }
  if (/ep-xxxx/i.test(url)) {
    throw new Error(
      'A URL do Neon Auth ainda é um exemplo. Copie a Auth Base URL em Neon Console > Better Auth > Configuration e atualize o .env.'
    );
  }
  if (/^http:\/\//i.test(url)) {
    throw new Error('A URL do Neon Auth precisa usar HTTPS.');
  }

  if (!/^https:\/\/[^/\s?#]+(?:\/[^?#\s]*)?$/i.test(url)) {
    throw new Error(
      'A EXPO_PUBLIC_NEON_AUTH_URL não é válida. Copie a Auth Base URL completa do console Neon.'
    );
  }

  return url;
}

async function request(path, { method = 'GET', body } = {}) {
  const authUrl = obterAuthUrl();
  let resposta;
  try {
    resposta = await fetch(authUrl + path, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Origin: ORIGIN,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error(
      'Não foi possível conectar ao Neon Auth. Verifique a URL no .env, sua internet e se o Auth está habilitado no Neon.'
    );
  }

  const texto = await resposta.text();
  let data = null;
  let jsonInvalido = false;
  try {
    data = texto ? JSON.parse(texto) : null;
  } catch (e) {
    jsonInvalido = true;
  }

  if (!resposta.ok) {
    throw new Error(traduzirErro(data, resposta.status));
  }
  if (jsonInvalido) {
    throw new Error('O Neon Auth retornou uma resposta inválida. Tente novamente.');
  }
  return data;
}

export function cadastrar({ name, email, password }) {
  return request('/sign-up/email', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function entrar({ email, password }) {
  return request('/sign-in/email', {
    method: 'POST',
    body: { email, password },
  });
}

export function sair() {
  return request('/sign-out', { method: 'POST', body: {} });
}

export async function buscarSessao() {
  const data = await request('/get-session');
  return data && data.user ? data : null;
}
