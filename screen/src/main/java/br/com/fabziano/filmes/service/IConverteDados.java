package br.com.fabziano.filmes.service;

public interface IConverteDados {
    <T> T obterDados(String json, Class<T> classe);
}
