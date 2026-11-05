import {MyRoutes} from "./index";
import React, {createContext, useState} from "react";
import {Light, Dark, AuthContextProvider, useUsuariosStore, SpinnerLoader} from "./index";
import {ThemeProvider} from "styled-components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useQuery } from "@tanstack/react-query";

export const ThemeContext = createContext(null);

function App() {
  const { mostrarUsuarios, datausuarios } = useUsuariosStore();
  //const [theme, setTheme] = useState("light");
  const theme =datausuarios?.tema==="0"?"light":"dark"
  const themeStyle = theme === "light" ? Light : Dark;
  const { isLoading, error } = useQuery({queryKey:["mostrar usuarios"], queryFn:() =>
    mostrarUsuarios()}
  );
  if (isLoading) {
    return <SpinnerLoader/>;;
  }
  if (error) {
    return <h1>Error..</h1>;
  }
  return (
    <>
    <ThemeContext.Provider value={{theme}}>
      <ThemeProvider theme={themeStyle}>
        <AuthContextProvider>
          <MyRoutes/>
        </AuthContextProvider>

      </ThemeProvider>
    </ThemeContext.Provider>
    </>
  );
}

export default App
