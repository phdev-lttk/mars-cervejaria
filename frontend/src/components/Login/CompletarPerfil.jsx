import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUsuario, updateUsuario } from '../../services/usuariosService';
import { mascararTelefone, mascararCep } from '../../utils/mascaras';
import './Login.css'; // Reaproveita os estilos do Login

const ENDERECO_INICIAL = {
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
};

export default function CompletarPerfil() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState(ENDERECO_INICIAL);

  useEffect(() => {
    async function checkPerfil() {
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const perfil = await getUsuario();
        // Se o perfil já tem dataNascimento, não precisa completar
        if (perfil && perfil.dataNascimento) {
          navigate('/confirmar-idade');
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao verificar perfil:", err);
        setLoading(false);
      }
    }
    checkPerfil();
  }, [user, navigate]);

  function handleEnderecoChange(campo, valor) {
    setEndereco(prev => ({ ...prev, [campo]: valor }));
  }

  function calcularIdade(dataNasc) {
    if (!dataNasc) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!telefone || !dataNascimento) {
      setErro("Telefone e Data de Nascimento são obrigatórios.");
      return;
    }

    const idade = calcularIdade(dataNascimento);
    if (idade === null || idade < 18) {
      setErro("Você precisa ter 18 anos ou mais para se cadastrar.");
      return;
    }

    try {
      await updateUsuario({ telefone, dataNascimento, endereco });
      navigate('/confirmar-idade');
    } catch (err) {
      console.error(err);
      setErro("Erro ao salvar os dados. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'white' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Completar Perfil</h2>
        <p className="subtitle" style={{ marginBottom: '24px' }}>
          Para continuar, precisamos de mais alguns dados.
        </p>

        <input
          type="tel"
          placeholder="Telefone (ex: (11) 91234-5678)"
          maxLength={15}
          value={telefone}
          onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
        />
        
        <label className="data-nasc-label">Data de Nascimento *</label>
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />

        <p className="endereco-titulo">Endereço de entrega</p>
        
        <input
          type="text"
          placeholder="Rua"
          value={endereco.rua}
          onChange={(e) => handleEnderecoChange("rua", e.target.value)}
        />

        <div className="login-row">
          <input
            type="text"
            placeholder="Número"
            value={endereco.numero}
            onChange={(e) => handleEnderecoChange("numero", e.target.value)}
          />
          <input
            type="text"
            placeholder="Complemento"
            value={endereco.complemento}
            onChange={(e) => handleEnderecoChange("complemento", e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Bairro"
          value={endereco.bairro}
          onChange={(e) => handleEnderecoChange("bairro", e.target.value)}
        />

        <div className="login-row">
          <input
            type="text"
            placeholder="Cidade"
            value={endereco.cidade}
            onChange={(e) => handleEnderecoChange("cidade", e.target.value)}
          />
          <input
            type="text"
            placeholder="Estado (UF)"
            maxLength={2}
            value={endereco.estado}
            onChange={(e) => handleEnderecoChange("estado", e.target.value.toUpperCase())}
          />
        </div>

        <input
          type="text"
          placeholder="CEP"
          maxLength={9}
          value={endereco.cep}
          onChange={(e) => handleEnderecoChange("cep", mascararCep(e.target.value))}
        />

        <button type="submit">Salvar e Continuar</button>

        {erro && (
          <div className="login-erro" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            {erro}
          </div>
        )}
      </form>
    </div>
  );
}
