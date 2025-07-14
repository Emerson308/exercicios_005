import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import TelaLogin from './src/telas/TelaLogin';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { obterToken, removerToken } from './src/servicos/servicoArmazenamento';
import api from './src/api/axiosConfig';
import TelaProdutos from './src/telas/TelaProdutos';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaDetalhesProdutos from './src/telas/TelaDetalhesProdutos';

const Pilha = createNativeStackNavigator();


export default function App() {


  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAutenticado(true);
      } else{
        setAutenticado(false);
      }
      setCarregandoInicial(false);
    };

    verificarAutenticacao();
  }, [])

  const lidarComLogout = async () => {
    await removerToken();
    delete api.defaults.headers.common['Authorization'];
    setAutenticado(false);
  }

  if (carregandoInicial){
    return (
      <View style={styles.containerCentral}>
        <ActivityIndicator 
          size={'large'}
        />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Pilha.Navigator screenOptions={{headerShown: false}}>
        {autenticado ? (
          <Pilha.Group>
            <Pilha.Screen name='Produtos' options={{title: 'Lista de Produtos'}}>
              {(props) => <TelaProdutos {...props} aoLogout={lidarComLogout} />}
            </Pilha.Screen>
            <Pilha.Screen name='DetalhesProduto' options={{title: 'Detalhes do produto'}}>
              {(props: any) => <TelaDetalhesProdutos {...props}/>}
            </Pilha.Screen>
          </Pilha.Group>
        ) : (
          <Pilha.Group>
            <Pilha.Screen name='Login' options={{title: "Entrar"}}>
              {(props) => <TelaLogin {...props} aoLoginSucesso={() => setAutenticado(true)}/>}
            </Pilha.Screen>
          </Pilha.Group>
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  containerCentral: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
