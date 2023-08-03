import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";

const FormularioRestaurante = () => {

  const parametros = useParams();
  const [nomeRestaurante, setNomeRestaurante] = useState("")

  useEffect(() => {
    if (parametros.id) {
      http.get(`restaurantes/${parametros.id}/`)
        .then(resposta => {
          setNomeRestaurante(resposta.data.nome)
        })
    }
  }, [parametros])

  function aoSubmeterForm(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (parametros.id) {
      http.put(`restaurantes/${parametros.id}/`, {
        nome: nomeRestaurante
      })
        .then(e => {
          alert("Restaurante atualizado com sucesso!")
        })
        .catch(e => console.log(e))
    } else {

      http.post("restaurantes/", {
        nome: nomeRestaurante
      })
        .then(e => {
          alert("Restaurante cadastrado com sucesso!")
        })
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography component="h1" variant="h6">Formulário restaurante</Typography>
      <Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>
        <TextField
          value={nomeRestaurante}
          onChange={e => setNomeRestaurante(e.target.value)}
          label="Nome do Restaurante"
          variant="standard"
          fullWidth
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="outlined"
          fullWidth
        >
          Cadastrar
        </Button>
      </Box>
    </Box>
  )
}

export default FormularioRestaurante