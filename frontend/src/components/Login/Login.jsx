import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { criarUsuario, getUsuario } from "../../services/usuariosService";
import { useNavigate, useLocation } from "react-router-dom";
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

const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [endereco, setEndereco] = useState(ENDERECO_INICIAL);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Mensagem de sucesso vinda do cadastro
  const cadastroSucesso = location.state?.cadastroSucesso;

  function handleEnderecoChange(campo, valor) {
    setEndereco((prev) => ({ ...prev, [campo]: valor }));
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
    setErro("");
    setSucesso("");

    if (!email || !senha || (!isLogin && (!nome || !telefone || !dataNascimento))) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (isLogin) {
        // ── Login normal ──
        await signInWithEmailAndPassword(auth, email, senha);

        if (email === "admin@mars.com") {
          navigate("/dashboard");
        } else {
          try {
            const perfil = await getUsuario();
            if (!perfil.dataNascimento) {
              navigate("/completar-perfil");
            } else {
              navigate("/confirmar-idade");
            }
          } catch {
            navigate("/confirmar-idade");
          }
        }
      } else {
        // ── Cadastro ──
        const idade = calcularIdade(dataNascimento);
        if (idade === null || idade < 18) {
          setErro("Você precisa ter 18 anos ou mais para se cadastrar.");
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        await cred.user.getIdToken(true);
        await criarUsuario({ nome, telefone, dataNascimento, endereco });

        // Desloga após o cadastro — usuário deve fazer login manualmente
        await signOut(auth);

        // Volta para a aba de login e limpa a senha
        setIsLogin(true);
        setSenha("");
        
        // Atualiza a URL (state) para exibir a mensagem de sucesso verde
        navigate("/login", { state: { cadastroSucesso: true }, replace: true });
      }
    } catch (err) {
      console.error(err);
      setErro(
        isLogin
          ? "Email ou senha inválidos"
          : "Erro ao cadastrar. Tente outra senha (mínimo 6 caracteres)."
      );
    }
  }

  async function handleGoogleLogin() {
    setErro("");
    setSucesso("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Tenta buscar perfil existente; se não tiver, cria um básico
      let perfil;
      let perfilEstaCompleto = false;
      try {
        perfil = await getUsuario();
        if (perfil.dataNascimento && perfil.telefone) {
          perfilEstaCompleto = true;
        }
      } catch {
        // Perfil não existe — cria um básico com os dados do Google
        await user.getIdToken(true);
        perfil = await criarUsuario({
          nome: user.displayName || "Usuário Google",
          telefone: "",
          dataNascimento: "",
          endereco: ENDERECO_INICIAL,
        });
      }

      if (user.email === "admin@mars.com") {
        navigate("/dashboard");
      } else {
        if (perfilEstaCompleto) {
          navigate("/confirmar-idade");
        } else {
          navigate("/completar-perfil");
        }
      }
    } catch (err) {
      console.error(err);
      setErro("Não foi possível fazer login com o Google. Tente novamente.");
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Mars Cervejaria</h2>

        <p className="subtitle">
          {isLogin ? "Faça seu login" : "Crie sua conta"}
        </p>

        {/* Mensagem de sucesso após cadastro */}
        {isLogin && cadastroSucesso && (
          <div className="login-sucesso" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Conta criada com sucesso! Faça seu login.
          </div>
        )}

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
            <label className="data-nasc-label">Data de Nascimento *</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
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
                onChange={(e) =>
                  handleEnderecoChange("estado", e.target.value.toUpperCase())
                }
              />
            </div>

            <input
              type="text"
              placeholder="CEP"
              maxLength={9}
              value={endereco.cep}
              onChange={(e) =>
                handleEnderecoChange("cep", mascararCep(e.target.value))
              }
            />
          </>
        )}

        <button type="submit">
          {isLogin ? "Entrar" : "Cadastrar"}
        </button>

        {/* Divisor */}
        {isLogin && (
          <>
            <div className="login-divider">
              <span>ou</span>
            </div>

            {/* Botão Google */}
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleLogin}
            >
              <svg className="btn-google__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Entrar com Google
            </button>
          </>
        )}

        {erro && <p className="login-erro">{erro}</p>}
        {sucesso && <p className="login-sucesso">{sucesso}</p>}

        <p
          className="login-toggle"
          onClick={() => {
            setIsLogin(!isLogin);
            setErro("");
            setSucesso("");
          }}
        >
          {isLogin
            ? "Não tem conta? Cadastre-se aqui"
            : "Já possui conta? Faça login"}
        </p>
      </form>
    </div>
  );
}
