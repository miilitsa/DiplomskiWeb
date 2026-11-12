package org.example.diplomski.service;

import org.example.diplomski.model.LogAktivnosti;
import org.example.diplomski.model.User;
import org.example.diplomski.repository.LogAktivnostiRepository;
import org.example.diplomski.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogAktivnostiService {

    private final LogAktivnostiRepository logAktivnostiRepository;
    private final UserRepository userRepository;

    public LogAktivnostiService(LogAktivnostiRepository logAktivnostiRepository,
                                UserRepository userRepository) {
        this.logAktivnostiRepository = logAktivnostiRepository;
        this.userRepository = userRepository;
    }

    public void zabelezi(String akcija) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return;
        }

        userRepository.findByUsername(authentication.getName())
                .ifPresent(user -> zabelezi(user, akcija));
    }

    public void zabelezi(User user, String akcija) {

        LogAktivnosti log = new LogAktivnosti();
        log.setAkcija(akcija);
        log.setDatum(LocalDateTime.now());
        log.setUser(user);

        logAktivnostiRepository.save(log);
    }

    public List<LogAktivnosti> sveAktivnosti() {
        return logAktivnostiRepository.findAllByOrderByDatumDesc();
    }

    @Transactional
    public void obrisiPoKorisniku(User user) {
        logAktivnostiRepository.deleteByUser(user);
    }
}
