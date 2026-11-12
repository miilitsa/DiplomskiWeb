package org.example.diplomski.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class PopuniUlogeZaposlenih {

    @Bean
    public ApplicationRunner popuniUloge(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.update(
                        "UPDATE zaposleni SET uloga = 'RADNIK' WHERE uloga IS NULL");
            } catch (Exception e) {
                System.err.println("Uloge zaposlenih nisu popunjene: " + e.getMessage());
            }
        };
    }

    @Bean
    public ApplicationRunner popuniZaduzeneKorisnikeFirma(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.update(
                        "UPDATE firma SET id_user = " +
                        "(SELECT id_user FROM users ORDER BY id_user LIMIT 1) " +
                        "WHERE id_user IS NULL");
            } catch (Exception e) {
                System.err.println("Zaduzeni korisnik greska : " + e.getMessage());
            }
        };
    }
}
