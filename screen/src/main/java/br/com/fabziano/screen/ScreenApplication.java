package br.com.fabziano.screen;

import br.com.fabziano.screen.model.DadosEpisodio;
import br.com.fabziano.screen.model.DadosSerie;
import br.com.fabziano.screen.model.DadosTemporada;
import br.com.fabziano.screen.principal.Principal;
import br.com.fabziano.screen.service.ConsumoApi;
import br.com.fabziano.screen.service.ConverteDados;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class ScreenApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(ScreenApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
			var api = new ConsumoApi();
			var json = api.obterDados("http://www.omdbapi.com/?t=gilmore+girls&apikey=26e22513");
			ConverteDados conversor = new ConverteDados();
			DadosSerie dadosSerie= conversor.obterDados(json, DadosSerie.class);


		List<DadosTemporada> temporadas = new ArrayList<>();

		for(int i = 1; i <= dadosSerie.totalTemporadas(); i++){
			json = api.obterDados("https://www.omdbapi.com/?t=gilmore+girls&Season="+ i +"&apikey=26e22513");
			DadosTemporada dadosTemporada = conversor.obterDados(json, DadosTemporada.class);
			temporadas.add(dadosTemporada);

		}

		Principal principal = new Principal();
		principal.exibeMenu();
	}
}
