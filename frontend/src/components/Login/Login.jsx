import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { criarUsuario } from "../../services/usuariosService";
import { useNavigate } from "react-router-dom";
import { mascararTelefone, mascararCep } from "../../utils/mascaras";
import "./Login.css";

const ENDERECO_INICIAL = {
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [endereco, setEndereco] = useState(ENDERECO_INICIAL);
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  function handleEnderecoChange(campo, valor) {
    setEndereco((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email || !senha || (!isLogin && (!nome || !telefone))) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, senha);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        // Aguarda o token estar disponível para a chamada autenticada ao backend
        await cred.user.getIdToken(true);
        await criarUsuario({ nome, telefone, endereco });
      }

      if (email === "admin@mars.com") {
        navigate("/dashboard");
      } else {
        navigate("/adquira");
      }
    } catch (err) {
      setErro(isLogin ? "Email ou senha inválidos" : "Erro ao cadastrar. Tente outra senha (mínimo 6 caracteres).");
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Mars Cervejaria</h2>

        <p className="subtitle">
          {isLogin ? "Faça seu login" : "Crie sua conta"}
        </p>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Telefone (ex: (11) 91234-5678)"
              maxLength={15}
              value={telefone}
              onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {!isLogin && (
          <>
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
          </>
        )}

        <button type="submit">
          {isLogin ? "Entrar" : "Cadastrar"}
        </button>

        {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}

        <p style={{ marginTop: '20px', cursor: 'pointer', color: '#ffb142' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Não tem conta? Cadastre-se aqui" : "Já possui conta? Faça login"}
        </p>

      </form>
    </div>
  );
}
