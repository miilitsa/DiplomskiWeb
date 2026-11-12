package org.example.diplomski.repository;

import org.example.diplomski.model.Zaposleni;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZaposleniRepository extends JpaRepository<Zaposleni, Long> {

    long countByFirmaIdFirma(Long firmaId);
}