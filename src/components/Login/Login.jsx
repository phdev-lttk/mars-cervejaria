import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import  "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      navigate("/dashboard");
    } catch {
      setErro("Email ou senha inválidos");
    }
  }

  return (

    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Mars Cervejaria</h2>

        <p className="subtitle">
        Área Administrativa
        </p>
        
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
          Entrar
        </button>

        {erro && <p>{erro}</p>}

      </form>
    </div>
  );
}