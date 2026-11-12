package org.example.diplomski.service;

import org.example.diplomski.model.Firma;
import org.example.diplomski.repository.DokumentRepository;
import org.example.diplomski.repository.FirmaRepository;
import org.example.diplomski.repository.NapomenaRepository;
import org.example.diplomski.repository.ObavezaRepository;
import org.example.diplomski.repository.ZaposleniRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FirmaService {

    private final FirmaRepository firmaRepository;
    private final ZaposleniRepository zaposleniRepository;
    private final ObavezaRepository obavezaRepository;
    private final DokumentRepository dokumentRepository;
    private final NapomenaRepository napomenaRepository;

    public FirmaService(FirmaRepository firmaRepository,
                        ZaposleniRepository zaposleniRepository,
                        ObavezaRepository obavezaRepository,
                        DokumentRepository dokumentRepository,
                        NapomenaRepository napomenaRepository) {
        this.firmaRepository = firmaRepository;
        this.zaposleniRepository = zaposleniRepository;
        this.obavezaRepository = obavezaRepository;
        this.dokumentRepository = dokumentRepository;
        this.napomenaRepository = napomenaRepository;
    }

    public List<Firma> findAll() {
        return firmaRepository.findAll();
    }

    public Optional<Firma> findById(Long id) {
        return firmaRepository.findById(id);
    }

    public Firma save(Firma firma) {
        return firmaRepository.save(firma);
    }

    /**
     * Vraća nazive podataka koji su još povezani sa firmom
     * (zaposleni, obaveze, dokumenti, napomene),
     * ili null ako firma nema ništa povezano.
     */
    public String povezaniPodaci(Long id) {
        List<String> delovi = new ArrayList<>();

        if (zaposleniRepository.countByFirmaIdFirma(id) > 0) {
            delovi.add("zaposlene");
        }
        if (obavezaRepository.countByFirmaIdFirma(id) > 0) {
            delovi.add("obaveze");
        }
        if (dokumentRepository.countByFirmaIdFirma(id) > 0) {
            delovi.add("dokumente");
        }
        if (napomenaRepository.countByFirmaIdFirma(id) > 0) {
            delovi.add("napomene");
        }

        return delovi.isEmpty() ? null : String.join(", ", delovi);
    }

    @Transactional
    public void deleteById(Long id) {
        firmaRepository.deleteById(id);
    }
}
