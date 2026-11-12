package org.example.diplomski.controller;

import org.example.diplomski.model.LogAktivnosti;
import org.example.diplomski.service.LogAktivnostiService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/aktivnosti")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LogAktivnostiController {

    private final LogAktivnostiService logAktivnostiService;

    public LogAktivnostiController(LogAktivnostiService logAktivnostiService) {
        this.logAktivnostiService = logAktivnostiService;
    }

    public record AktivnostDTO(Long idLog, String akcija, String datum, String korisnik) {}

    @GetMapping
    public List<AktivnostDTO> sveAktivnosti() {
        return logAktivnostiService.sveAktivnosti().stream()
                .map(log -> new AktivnostDTO(
                        log.getIdLog(),
                        log.getAkcija(),
                        log.getDatum().toString(),
                        log.getUser().getUsername()))
                .toList();
    }
}
