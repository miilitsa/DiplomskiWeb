package org.example.diplomski.controller;

import org.example.diplomski.model.Zaposleni;
import org.example.diplomski.service.LogAktivnostiService;
import org.example.diplomski.service.ZaposleniService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/zaposleni")
@CrossOrigin(origins = "http://localhost:5173")
public class ZaposleniController {

    private final ZaposleniService zaposleniService;
    private final LogAktivnostiService logAktivnostiService;

    public ZaposleniController(ZaposleniService zaposleniService,
                               LogAktivnostiService logAktivnostiService) {
        this.zaposleniService = zaposleniService;
        this.logAktivnostiService = logAktivnostiService;
    }

    @GetMapping
    public List<Zaposleni> getAllZaposleni() {
        return zaposleniService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Zaposleni> getZaposleniById(@PathVariable Long id) {
        return zaposleniService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Zaposleni addZaposleni(@RequestBody Zaposleni zaposleni) {
        Zaposleni sacuvan = zaposleniService.save(zaposleni);
        logAktivnostiService.zabelezi("Dodat radnik: " + sacuvan.getIme() + " " + sacuvan.getPrezime());
        return sacuvan;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Zaposleni> updateZaposleni(
            @PathVariable Long id,
            @RequestBody Zaposleni zaposleni) {

        return zaposleniService.findById(id)
                .map(postojeciZaposleni -> {
                    zaposleni.setIdZaposleni(id);
                    zaposleni.setSlika(postojeciZaposleni.getSlika());
                    zaposleni.setSlikaTip(postojeciZaposleni.getSlikaTip());
                    Zaposleni sacuvan = zaposleniService.save(zaposleni);
                    logAktivnostiService.zabelezi("Izmenjen radnik: " + sacuvan.getIme() + " " + sacuvan.getPrezime());
                    return ResponseEntity.ok(sacuvan);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZaposleni(@PathVariable Long id) {

        return zaposleniService.findById(id)
                .map(zaposleni -> {
                    zaposleniService.deleteById(id);
                    logAktivnostiService.zabelezi("Obrisan radnik: " + zaposleni.getIme() + " " + zaposleni.getPrezime());
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private static final Set<String> DOZVOLJENI_TIPOVI = Set.of(
            "image/png", "image/jpeg", "image/gif");

    @PostMapping("/{id}/slika")
    public ResponseEntity<?> dodajSliku(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        java.util.Optional<Zaposleni> zaposleni = zaposleniService.findById(id);

        if (zaposleni.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Niste izabrali sliku.");
        }

        String tipSlike = file.getContentType();

        if (tipSlike == null || !DOZVOLJENI_TIPOVI.contains(tipSlike)) {
            return ResponseEntity.badRequest()
                    .body("Slika mora biti u PNG, JPG ili GIF formatu.");
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body("Slika ne sme biti veća od 2MB.");
        }

        Zaposleni izmenjeni = zaposleni.get();
        izmenjeni.setSlika(file.getBytes());
        izmenjeni.setSlikaTip(tipSlike);
        zaposleniService.save(izmenjeni);
        logAktivnostiService.zabelezi("Dodata slika radnika: " + izmenjeni.getIme() + " " + izmenjeni.getPrezime());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/slika")
    public ResponseEntity<?> obrisiSliku(@PathVariable Long id) {

        java.util.Optional<Zaposleni> zaposleni = zaposleniService.findById(id);

        if (zaposleni.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Zaposleni izmenjeni = zaposleni.get();
        izmenjeni.setSlika(null);
        izmenjeni.setSlikaTip(null);
        zaposleniService.save(izmenjeni);
        logAktivnostiService.zabelezi("Uklonjena slika radnika: " + izmenjeni.getIme() + " " + izmenjeni.getPrezime());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/slika")
    public ResponseEntity<byte[]> prikaziSliku(@PathVariable Long id) {

        java.util.Optional<Zaposleni> zaposleni = zaposleniService.findById(id);

        if (zaposleni.isEmpty() || zaposleni.get().getSlika() == null) {
            return ResponseEntity.notFound().build();
        }

        Zaposleni pronadjeni = zaposleni.get();

        String tip = pronadjeni.getSlikaTip() != null
                ? pronadjeni.getSlikaTip()
                : MediaType.IMAGE_PNG_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(tip))
                .body(pronadjeni.getSlika());
    }
}
