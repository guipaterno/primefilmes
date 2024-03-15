import React, { useState, useEffect } from "react";

import "./filme-info.css";
import { toast } from "react-toastify";

import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export const Filmes = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [filme, setFilme] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilme() {
      await api
        .get(`/movie/${id}`, {
          params: {
            api_key: "a1bcf4deb98fcc2517eb00a19d79cfd8",
            language: "pt-Br",
          },
        })
        .then((response) => {
          setFilme(response.data);
          setLoading(false);
        })
        .catch(() => {
          console.log("FILME NÃO ENCONTRADO");
          navigate("/", { replace: true });
          return;
        });
    }
    loadFilme();

    return () => {
      console.log("componente desmontado");
    };
  }, [navigate, id]);

  function salvarFilme() {
    const minhaLista = localStorage.getItem("@primefilmes");

    let filmesSalvos = JSON.parse(minhaLista) || [];

    const hasFilmes = filmesSalvos.some(
      (filmesSalvo) => filmesSalvo.id === filme.id
    );

    if (hasFilmes) {
      toast.warn("Esse filme já está na sua lista!")
      return;
    }

    filmesSalvos.push(filme);
    localStorage.setItem("@primefilmes", JSON.stringify(filmesSalvos));
    toast.success("Filme salvo com sucesso!");
  }

  if (loading) {
    return (
      <div className="filme-info">
        <h1>Carregando detalhes...</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="filme-info">
        <h1>{filme.title}</h1>
        <img
          src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
          alt={filme.title}
        />
        <h3>Sinopse</h3>
        <span>{filme.overview}</span>

        <strong>Avaliação: {filme.vote_average} / 10</strong>

        <div className="area-buttons">
          <button onClick={salvarFilme}>Salvar</button>
          <button>
            <a
              target="blank"
              rel="external"
              href={`https://www.youtube.com/results?search_query=${filme.title} Trailer`}
            >
              Trailer
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};
