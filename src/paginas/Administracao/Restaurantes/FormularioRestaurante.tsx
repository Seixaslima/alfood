import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const FormularioRestaurante = () => {

  const [nomeRestaurante, setNomeRestaurante] = useState("")
  function aoSubmeterForm(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    axios.post("http://localhost:8000/api/v2/restaurantes/", {
      nome: nomeRestaurante
    })
      .then(e => {
        alert("Restaurante cadastrado com sucesso!")
      })
  }

  return (
    <form onSubmit={aoSubmeterForm}>
      <TextField
        value={nomeRestaurante}
        onChange={e => setNomeRestaurante(e.target.value)}
        label="Nome do Restaurante"
        variant="standard"
      />
      <Button type="submit" variant="outlined">Cadastrar</Button>
    </form>
  )
}

export default FormularioRestaurante