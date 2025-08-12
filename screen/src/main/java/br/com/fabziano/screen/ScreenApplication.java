package br.com.fabziano.screen;

import br.com.fabziano.screen.model.DadosEpisodio;
import br.com.fabziano.screen.model.DadosSerie;
import br.com.fabziano.screen.service.ConsumoApi;
import br.com.fabziano.screen.service.ConverteDados;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ScreenApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(ScreenApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
			var api = new ConsumoApi();
			var json = api.obterDados("http://www.omdbapi.com/?t=gilmore+girls&Season=1&Episode=5&apikey=26e22513");

		ConverteDados conversor = new ConverteDados();
		DadosEpisodio dados = conversor.obterDados(json, DadosEpisodio.class);
		System.out.println(dados);
	}
}
