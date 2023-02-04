import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Login from "./Vistas/Login";
import Signup from "./Vistas/Signup";
import {
  setToken,
  deleteToken,
  getToken,
  initAxiosInterceptors,
} from "./Helpers/auth-helpers";
import Loading from "./components/Loading";

initAxiosInterceptors();

function App() {
  const [usuario, setUsuario] = useState(null); // no sabemos si hay un usuario autenticado
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [error, setError] = useState(null);

  async function login(email, password) {
    const { data } = await Axios.post("/api/usuarios/login", {
      email,
      password,
    });
    setUsuario(data.usuario);
    setToken(data.token);
  }

  async function signup(usuario) {
    const { data } = await Axios.post("/api/usuarios/signup", usuario);
    setUsuario(data.usuario);
    setToken(data.token);
  }

  function logout() {
    setUsuario(null);
    deleteToken();
  }

  useEffect(() => {
    async function cargarUsuario() {
      if (!getToken()) {
        setCargandoUsuario(false);
        return;
      }

      try {
        const { data: usuario } = await Axios.get("/api/usuarios/whoami");
        setUsuario(usuario);
        setCargandoUsuario(false);
      } catch (error) {
        console.log(error);
      }
    }

    cargarUsuario();
  }, []);

  function mostrarError(mensaje) {
    setError(mensaje);
  }

  function esconderError() {
    setError(null);
  }

  if (cargandoUsuario) {
    return (
      <Main>
        <Loading />
      </Main>
    );
  }

  return (
    <div className="ContenedorTemporal">
      <Nav />
      {/* <Signup signup={signup} /> */}
      <Login login={login} />
    </div>
  );
}

export default App;
