package org.example.diplomski.service;

import org.example.diplomski.model.Obaveza;
import org.example.diplomski.repository.ObavezaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ObavezaService {

    private final ObavezaRepository obavezaRepository;

    public ObavezaService(ObavezaRepository obavezaRepository) {
        this.obavezaRepository = obavezaRepository;
    }

    public List<Obaveza> findAll() {
        return obavezaRepository.findAll();
    }

    public Optional<Obaveza> findById(Long id) {
        return obavezaRepository.findById(id);
    }

    public Obaveza save(Obaveza obaveza) {
        return obavezaRepository.save(obaveza);
    }

    public void deleteById(Long id) {
        obavezaRepository.deleteById(id);
    }
}