import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';
import { Button } from '@mui/material';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("")

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



  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
      {paginaAnterior &&
        <Button startIcon={<MdArrowBackIosNew />} onClick={() => carregarDados(paginaAnterior)}>
          Pagina anterior
        </Button>}
      {proximaPagina &&
        <Button endIcon={<MdArrowForwardIos />} onClick={() => carregarDados(proximaPagina)}>
          Proxima página
        </Button>}
    </section>)
}

export default ListaRestaurantes