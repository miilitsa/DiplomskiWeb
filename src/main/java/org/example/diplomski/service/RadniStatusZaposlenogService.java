package org.example.diplomski.service;

import org.example.diplomski.model.RadniStatusZaposlenog;
import org.example.diplomski.repository.RadniStatusZaposlenogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RadniStatusZaposlenogService {

    private final RadniStatusZaposlenogRepository radniStatusRepository;

    public RadniStatusZaposlenogService(RadniStatusZaposlenogRepository radniStatusRepository) {
        this.radniStatusRepository = radniStatusRepository;
    }

    public List<RadniStatusZaposlenog> findAll() {
        return radniStatusRepository.findAll();
    }

    public List<RadniStatusZaposlenog> findByZaposleni(Long zaposleniId) {
        return radniStatusRepository.findByZaposleniIdZaposleni(zaposleniId);
    }

    public Optional<RadniStatusZaposlenog> findById(Long id) {
        return radniStatusRepository.findById(id);
    }

    public RadniStatusZaposlenog save(RadniStatusZaposlenog radniStatus) {
        return radniStatusRepository.save(radniStatus);
    }

    @Transactional
    public RadniStatusZaposlenog dodaj(RadniStatusZaposlenog radniStatus) {
        radniStatus.setIdStatus(null);
        resiPreklapanja(radniStatus, null);
        return radniStatusRepository.save(radniStatus);
    }

    @Transactional
    public RadniStatusZaposlenog izmeni(Long id, RadniStatusZaposlenog radniStatus) {
        radniStatus.setIdStatus(id);
        resiPreklapanja(radniStatus, id);
        return radniStatusRepository.save(radniStatus);
    }

    // Dva radna statusa istog zaposlenog ne smeju da se preklapaju:
    // 1) status koji je počeo RANIJE a doseže u novi period -> zatvara se
    //    dan pre početka novog statusa;
    // 2) ako novi status počinje PRE postojećeg -> novi se skraćuje
    //    dan pre početka postojećeg.
    private void resiPreklapanja(RadniStatusZaposlenog novi, Long iskljuciId) {
        List<RadniStatusZaposlenog> postojeci = radniStatusRepository
                .findByZaposleniIdZaposleni(novi.getZaposleni().getIdZaposleni());

        for (RadniStatusZaposlenog stari : postojeci) {
            if (iskljuciId != null && stari.getIdStatus().equals(iskljuciId)) {
                continue;
            }

            LocalDate krajNovog = novi.getDatumDo();

            boolean sePreklapaju =
                    !stari.getDatumOd().isAfter(krajNovog == null ? LocalDate.MAX : krajNovog)
                            && (stari.getDatumDo() == null
                                    || !stari.getDatumDo().isBefore(novi.getDatumOd()));

            if (!sePreklapaju) {
                continue;
            }

            if (stari.getDatumOd().isBefore(novi.getDatumOd())) {
                stari.setDatumDo(novi.getDatumOd().minusDays(1));
                radniStatusRepository.save(stari);
            } else if (stari.getDatumOd().isAfter(novi.getDatumOd())
                    && (krajNovog == null
                            || stari.getDatumOd().minusDays(1).isBefore(krajNovog))) {
                novi.setDatumDo(stari.getDatumOd().minusDays(1));
            }
        }
    }

    public void deleteById(Long id) {
        radniStatusRepository.deleteById(id);
    }
}
