package br.com.fabziano.screen.principal;

import br.com.fabziano.screen.model.DadosEpisodio;
import br.com.fabziano.screen.model.DadosSerie;
import br.com.fabziano.screen.model.DadosTemporada;
import br.com.fabziano.screen.service.ConsumoApi;
import br.com.fabziano.screen.service.ConverteDados;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Principal {
    public final String ENDERECO = "https://www.omdbapi.com/?t=";
    public final String KEY = "&apikey=26e22513";
    ConsumoApi api = new ConsumoApi();
    ConverteDados conversor = new ConverteDados();

    Scanner entrada = new Scanner(System.in);

    public void exibeMenu(){
        System.out.println("Buscar Série");
        String serie = entrada.nextLine();

            var json = api.obterDados(ENDERECO + serie.replace(" ", "+") + KEY);
            DadosSerie dadosSerie = conversor.obterDados(json, DadosSerie.class);

            List<DadosTemporada> temporadas = new ArrayList<>();

        for (int i = 1; i <= dadosSerie.totalTemporadas(); i++) {
            json = api.obterDados(ENDERECO + serie.replace(" ", "+") + "&Season=" + i + KEY);
            DadosTemporada dadosTemporada = conversor.obterDados(json, DadosTemporada.class);
            temporadas.add(dadosTemporada);
        }
        
        temporadas.forEach(temporada -> {
            System.out.println("Temporada " + temporada.numero());
            temporada.episodios().forEach(episodio -> System.out.println("- " + episodio.titulo()));
        });

    }
}
