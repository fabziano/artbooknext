package br.com.fabziano.screen.principal;

import br.com.fabziano.screen.model.DadosEpisodio;
import br.com.fabziano.screen.model.DadosSerie;
import br.com.fabziano.screen.model.DadosTemporada;
import br.com.fabziano.screen.model.Episodio;
import br.com.fabziano.screen.service.ConsumoApi;
import br.com.fabziano.screen.service.ConverteDados;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Principal {
    public final String ENDERECO = "https://www.omdbapi.com/?t=";
    public final String KEY = "&apikey=26e22513";
    ConsumoApi api = new ConsumoApi();
    ConverteDados conversor = new ConverteDados();

    Scanner entrada = new Scanner(System.in);

    public void exibeMenu(){
        System.out.println("Buscar Série");
        var serie = entrada.nextLine();

            var json = api.obterDados(ENDERECO + serie.replace(" ", "+") + KEY);
            DadosSerie dadosSerie = conversor.obterDados(json, DadosSerie.class);

            List<DadosTemporada> temporadas = new ArrayList<>();

        for (int i = 1; i <= dadosSerie.totalTemporadas(); i++) {
            json = api.obterDados(ENDERECO + serie.replace(" ", "+") + "&Season=" + i + KEY);
            DadosTemporada dadosTemporada = conversor.obterDados(json, DadosTemporada.class);
            temporadas.add(dadosTemporada);
        }

        List<DadosEpisodio> dadosEpisodios = temporadas.stream()
                .flatMap(t -> t.episodios().stream())
                .collect(Collectors.toList());

        dadosEpisodios.stream()
                .filter(e -> !e.avaliacao().equalsIgnoreCase("N/A"))
                .sorted(Comparator.comparing(DadosEpisodio::avaliacao).reversed())
                .limit(5)
                .forEach(System.out::println);

         List<Episodio> episodios = temporadas.stream()
                 .flatMap(t -> t.episodios().stream()
                         .map(d -> new Episodio(t.numero(), d))
                 ).collect(Collectors.toList());

         episodios.forEach(System.out::println);

        System.out.println("Buscar episodio por ano");
        var ano = entrada.nextInt();
        entrada.nextLine();

        LocalDate dataBusca = LocalDate.of(ano, 1, 1);

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        episodios.stream()
                .filter(e -> e.getDataDeLancamento() != null && e.getDataDeLancamento().isAfter(dataBusca))
                .forEach(e -> System.out.println(
                        "Temporada: " + e.getTemporada() +
                                " Episodio: " + e.getTitulo() +
                                " Data Lançamento: " + e.getDataDeLancamento().format(formatador)

                        ));



    }
}
