package org.example.diplomski.repository;

import org.example.diplomski.model.Dokument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DokumentRepository extends JpaRepository<Dokument, Long> {

    long countByFirmaIdFirma(Long firmaId);
}