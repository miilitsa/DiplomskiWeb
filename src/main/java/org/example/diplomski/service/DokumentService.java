package org.example.diplomski.service;

import org.example.diplomski.model.Dokument;
import org.example.diplomski.repository.DokumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DokumentService {

    private final DokumentRepository dokumentRepository;

    public DokumentService(DokumentRepository dokumentRepository) {
        this.dokumentRepository = dokumentRepository;
    }

    public List<Dokument> findAll() {
        return dokumentRepository.findAll();
    }

    public Optional<Dokument> findById(Long id) {
        return dokumentRepository.findById(id);
    }

    public Dokument save(Dokument dokument) {
        return dokumentRepository.save(dokument);
    }

    public void deleteById(Long id) {
        dokumentRepository.deleteById(id);
    }
}
