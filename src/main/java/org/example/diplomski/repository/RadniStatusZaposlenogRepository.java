package org.example.diplomski.repository;

import org.example.diplomski.model.RadniStatusZaposlenog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RadniStatusZaposlenogRepository extends JpaRepository<RadniStatusZaposlenog, Long> {

    List<RadniStatusZaposlenog> findByZaposleniIdZaposleni(Long zaposleniId);

    void deleteByZaposleniIdZaposleni(Long zaposleniId);
}