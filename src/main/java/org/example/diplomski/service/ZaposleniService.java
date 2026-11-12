package org.example.diplomski.service;

import org.example.diplomski.model.Zaposleni;
import org.example.diplomski.repository.RadniStatusZaposlenogRepository;
import org.example.diplomski.repository.ZaposleniRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ZaposleniService {

    private final ZaposleniRepository zaposleniRepository;
    private final RadniStatusZaposlenogRepository radniStatusRepository;

    public ZaposleniService(ZaposleniRepository zaposleniRepository,
                            RadniStatusZaposlenogRepository radniStatusRepository) {
        this.zaposleniRepository = zaposleniRepository;
        this.radniStatusRepository = radniStatusRepository;
    }

    public List<Zaposleni> findAll() {
        return zaposleniRepository.findAll();
    }

    public Optional<Zaposleni> findById(Long id) {
        return zaposleniRepository.findById(id);
    }

    public Zaposleni save(Zaposleni zaposleni) {
        return zaposleniRepository.save(zaposleni);
    }

    @Transactional
    public void deleteById(Long id) {
        radniStatusRepository.deleteByZaposleniIdZaposleni(id);
        zaposleniRepository.deleteById(id);
    }
}
