package org.example.diplomski.repository;

import org.example.diplomski.model.Obaveza;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObavezaRepository extends JpaRepository<Obaveza, Long> {

    long countByFirmaIdFirma(Long firmaId);
}