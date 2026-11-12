package org.example.diplomski.controller;

import org.example.diplomski.model.Dokument;
import org.example.diplomski.service.DokumentService;
import org.example.diplomski.service.LogAktivnostiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dokumenti")
@CrossOrigin(origins = "http://localhost:5173")
public class DokumentController {

    private final DokumentService dokumentService;
    private final LogAktivnostiService logAktivnostiService;

    public DokumentController(DokumentService dokumentService,
                              LogAktivnostiService logAktivnostiService) {
        this.dokumentService = dokumentService;
        this.logAktivnostiService = logAktivnostiService;
    }

    @GetMapping
    public List<Dokument> getAllDokumenti() {
        return dokumentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dokument> getDokumentById(@PathVariable Long id) {
        return dokumentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Dokument addDokument(@RequestBody Dokument dokument) {
        Dokument sacuvan = dokumentService.save(dokument);
        logAktivnostiService.zabelezi("Dodat dokument: " + sacuvan.getNaziv());
        return sacuvan;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dokument> updateDokument(
            @PathVariable Long id,
            @RequestBody Dokument dokument) {

        return dokumentService.findById(id)
                .map(postojeciDokument -> {
                    dokument.setIdDokumenta(id);
                    Dokument sacuvan = dokumentService.save(dokument);
                    logAktivnostiService.zabelezi("Izmenjen dokument: " + sacuvan.getNaziv());
                    return ResponseEntity.ok(sacuvan);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDokument(@PathVariable Long id) {

        return dokumentService.findById(id)
                .map(dokument -> {
                    dokumentService.deleteById(id);
                    logAktivnostiService.zabelezi("Obrisan dokument: " + dokument.getNaziv());
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
