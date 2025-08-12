package br.com.fabziano.screen.service;

public interface IConverteDados {
    <T> T obterDados(String json, Class<T> classe);
}
