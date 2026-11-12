package org.example.diplomski.repository;

import org.example.diplomski.model.Napomena;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NapomenaRepository extends JpaRepository<Napomena, Long> {

    long countByFirmaIdFirma(Long firmaId);
}