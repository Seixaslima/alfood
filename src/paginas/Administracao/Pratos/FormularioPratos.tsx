import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import ITags from "../../../interfaces/ITags";
import IRestaurante from "../../../interfaces/IRestaurante";
import IPrato from "../../../interfaces/IPrato";

const FormularioPrato = () => {

  const parametros = useParams()

  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tag, setTag] = useState("")
  const [restaurante, setRestaurante] = useState("")
  const [imagem, setImagem] = useState<File | null>(null)

  const [tags, setTags] = useState<ITags[]>([])
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])


  useEffect(() => {
    http.get<{ tags: ITags[] }>("tags/")
      .then(resposta => setTags(resposta.data.tags))
    http.get<IRestaurante[]>("restaurantes/")
      .then(resposta => setRestaurantes(resposta.data))

    if (parametros.id) {
      http.get<IPrato>(`pratos/${parametros.id}/`)
        .then(resposta => {
          setNomePrato(resposta.data.nome)
          setDescricao(resposta.data.descricao)
          setTag(resposta.data.tag)
          setRestaurante(`${resposta.data.restaurante}`)
        })
    }
  }, [parametros.id])


  function aoSubmeterForm(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const formData = new FormData();

    formData.append("nome", nomePrato)
    formData.append("tag", tag)
    formData.append("descricao", descricao)
    formData.append("restaurante", restaurante)

    if (imagem) {
      formData.append("imagem", imagem)
    }

    let url = ""
    let metodo = ""

    if (parametros.id) {
      url = `pratos/${parametros.id}/`
      metodo = "PATCH"
    } else {
      url = "pratos/"
      metodo = "POST"
    }

    http.request({
      url: url,
      method: metodo,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then(() => {
        setNomePrato("")
        setTag("")
        setDescricao("")
        setRestaurante("")
        setImagem(null)
        alert("Prato cadastrado com sucesso!")
      })
      .catch(error => console.log(error))
  }

  function carregarImagem(evento: React.ChangeEvent<HTMLInputElement>) {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0])
    } else {
      setImagem(null)
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography component="h1" variant="h6">Formulário restaurante</Typography>
      <Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm} >
        <TextField
          value={nomePrato}
          onChange={e => setNomePrato(e.target.value)}
          label="Nome do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <TextField
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          label="Descrição do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="tag-label">Tag</InputLabel>
          <Select
            labelId="tags-label"
            value={tag}
            label="Tag"
            onChange={evento => setTag(evento.target.value)}
          >
            {tags.map(tag =>
              <MenuItem key={tag.id} value={tag.value}>
                {tag.value}
              </MenuItem>)}

          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel id="restaurantes-label">Restaurante</InputLabel>
          <Select
            labelId="restaurantes-label"
            value={restaurante}
            label="Restaurante"
            onChange={evento => setRestaurante(evento.target.value)}
          >
            {restaurantes.map(restaurante =>
              <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>)}

          </Select>
        </FormControl>


        <input
          aria-label="Carregar imagem do prato"
          type="file"
          onChange={carregarImagem}
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

export default FormularioPrato