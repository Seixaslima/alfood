import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { MdArrowBackIosNew, MdArrowForwardIos, MdSearch } from "react-icons/md";

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("")
  const [pesquisa, setPesquisa] = useState("")
  const [ordenacao, setOrdenacao] = useState("none")

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, [])

  function carregarDados(url: string) {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(error => console.log(error))
  }

  function pesquisar() {
    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/', {
      params: {
        ordering: ordenacao,
        search: pesquisa
      }
    })
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
  }



  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      <form className={style.pesquisa} onSubmit={evento => {
        evento.preventDefault()
        pesquisar()
      }}>
        <TextField
          fullWidth
          label="Busque por um restaurante"
          variant="outlined"
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
        />
        <Select
          value={ordenacao}
          label="Ordenacao"
          onChange={e => setOrdenacao(e.target.value)}
        >
          <MenuItem value="none"> Nenhuma </MenuItem>
          <MenuItem value="nome"> Nome </MenuItem>
          <MenuItem value="id"> ID </MenuItem>

        </Select>
        <Button type='submit'>
          <MdSearch size={30} />
        </Button>
      </form>
      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
      {
        paginaAnterior &&
        <Button startIcon={<MdArrowBackIosNew />} onClick={() => carregarDados(paginaAnterior)}>
          Pagina anterior
        </Button>
      }
      {
        proximaPagina &&
        <Button endIcon={<MdArrowForwardIos />} onClick={() => carregarDados(proximaPagina)}>
          Proxima página
        </Button>
      }
    </section >)
}

export default ListaRestaurantes