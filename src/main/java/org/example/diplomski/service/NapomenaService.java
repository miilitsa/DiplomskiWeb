package org.example.diplomski.service;

import org.example.diplomski.model.Napomena;
import org.example.diplomski.repository.NapomenaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NapomenaService {

    private final NapomenaRepository napomenaRepository;

    public NapomenaService(NapomenaRepository napomenaRepository) {
        this.napomenaRepository = napomenaRepository;
    }

    public List<Napomena> findAll() {
        return napomenaRepository.findAll();
    }

    public Optional<Napomena> findById(Long id) {
        return napomenaRepository.findById(id);
    }

    public Napomena save(Napomena napomena) {
        return napomenaRepository.save(napomena);
    }

    public void deleteById(Long id) {
        napomenaRepository.deleteById(id);
    }
}
