package br.com.fabziano.filmes;

import br.com.fabziano.filmes.model.DadosSerie;
import br.com.fabziano.filmes.service.ConsumoApi;
import br.com.fabziano.filmes.service.ConverteDados;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FilmesApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(FilmesApplication.class, args);
	}


	@Override
	public void run(String... args) throws Exception {
			var api = new ConsumoApi();
			var json = api.obterDados("http://www.omdbapi.com/?t=gilmore+girls&apikey=26e22513");

		ConverteDados conversor = new ConverteDados();
		DadosSerie dados = conversor.obterDados(json, DadosSerie.class);
		System.out.println(dados);
	}
}
