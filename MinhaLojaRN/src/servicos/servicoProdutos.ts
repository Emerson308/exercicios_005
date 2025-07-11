import api from "../api/axiosConfig";
import { ProdutoAPI } from "../tipos/api";

export async function obterTodosProdutos():Promise<ProdutoAPI[]> {
    try {
        const resposta = await api.get<ProdutoAPI[]>('products');
        return resposta.data;
    }
    catch (erro: any){
        throw new Error(erro.message || 'Erro ao buscar produtos.');
    }
}

