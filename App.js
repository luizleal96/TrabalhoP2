// App.js
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { buscarSessao } from './src/auth';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  // 'carregando' | 'login' | 'cadastro' | 'home' | 'erro'
  const [tela, setTela] = useState('carregando');
  const [usuario, setUsuario] = useState(null);
  const [erroInicial, setErroInicial] = useState('');
  const [tentativaSessao, setTentativaSessao] = useState(0);

  useEffect(() => {
    let ativa = true;

    async function verificar() {
      try {
        const sessao = await buscarSessao();
        if (ativa && sessao) {
          setUsuario(sessao.user);
          setTela('home');
        } else if (ativa) {
          setTela('login');
        }
      } catch (e) {
        if (ativa) {
          setErroInicial(
            e instanceof Error
              ? e.message
              : 'Não foi possível verificar sua sessão.'
          );
          setTela('erro');
        }
      }
    }

    verificar();

    return () => {
      ativa = false;
    };
  }, [tentativaSessao]);

  function aoAutenticar(user) {
    setUsuario(user);
    setTela('home');
  }

  function aoSair() {
    setUsuario(null);
    setTela('login');
  }

  let conteudo;
  if (tela === 'carregando') {
    conteudo = (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  } else if (tela === 'login') {
    conteudo = (
      <LoginScreen
        onAutenticado={aoAutenticar}
        onIrParaCadastro={() => setTela('cadastro')}
      />
    );
  } else if (tela === 'cadastro') {
    conteudo = (
      <RegisterScreen
        onAutenticado={aoAutenticar}
        onIrParaLogin={() => setTela('login')}
      />
    );
  } else if (tela === 'erro') {
    conteudo = (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erroInicial}</Text>
        <TouchableOpacity
          style={styles.botaoTentar}
          onPress={() => {
            setErroInicial('');
            setTela('carregando');
            setTentativaSessao((tentativa) => tentativa + 1);
          }}
        >
          <Text style={styles.botaoTentarTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    conteudo = <HomeScreen usuario={usuario} onSair={aoSair} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      {conteudo}
    </>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  erro: {
    color: '#DC2626',
    fontSize: 15,
    marginHorizontal: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  botaoTentar: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  botaoTentarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
