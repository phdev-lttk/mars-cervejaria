import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import  "./Login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

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
        await setDoc(doc(db, "usuarios", cred.user.uid), {
          nome,
          email,
          telefone
        });
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
              onChange={(e)=>setNome(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Telefone (ex: 11999999999)"
              value={telefone}
              onChange={(e)=>setTelefone(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e)=>setSenha(e.target.value)}
        />

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