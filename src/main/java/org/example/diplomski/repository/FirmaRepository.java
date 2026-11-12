package org.example.diplomski.repository;

import org.example.diplomski.model.Firma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FirmaRepository extends JpaRepository<Firma, Long> {

    List<Firma> findByZaduzeniKorisnikIdUser(Long userId);
}