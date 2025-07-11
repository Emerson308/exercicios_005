import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import TelaLogin from './src/telas/TelaLogin';
import { useState, useEffect } from 'react';
import { obterToken, removerToken } from './src/servicos/servicoArmazenamento';
import api from './src/api/axiosConfig';
import TelaProdutos from './src/telas/TelaProdutos';


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

  if(autenticado){
    return (
      <TelaProdutos aoLogout={lidarComLogout}/>
      // <View></View>
    )
  } else {
    return (
      <TelaLogin aoLoginSucesso={() => setAutenticado(true)}/>
    )
  }

}

const styles = StyleSheet.create({
  containerCentral: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
