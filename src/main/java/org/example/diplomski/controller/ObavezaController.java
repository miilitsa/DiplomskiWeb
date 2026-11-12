package org.example.diplomski.controller;

import org.example.diplomski.model.Obaveza;
import org.example.diplomski.service.LogAktivnostiService;
import org.example.diplomski.service.ObavezaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/obaveze")
@CrossOrigin(origins = "http://localhost:5173")
public class ObavezaController {

    private final ObavezaService obavezaService;
    private final LogAktivnostiService logAktivnostiService;

    public ObavezaController(ObavezaService obavezaService,
                             LogAktivnostiService logAktivnostiService) {
        this.obavezaService = obavezaService;
        this.logAktivnostiService = logAktivnostiService;
    }

    @GetMapping
    public List<Obaveza> getAllObaveze() {
        return obavezaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Obaveza> getObavezaById(@PathVariable Long id) {
        return obavezaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Obaveza addObaveza(@RequestBody Obaveza obaveza) {
        Obaveza sacuvana = obavezaService.save(obaveza);
        logAktivnostiService.zabelezi("Dodata obaveza: " + sacuvana.getTip());
        return sacuvana;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Obaveza> updateObaveza(
            @PathVariable Long id,
            @RequestBody Obaveza obaveza) {

        return obavezaService.findById(id)
                .map(postojecaObaveza -> {
                    obaveza.setIdObaveza(id);
                    Obaveza sacuvana = obavezaService.save(obaveza);
                    logAktivnostiService.zabelezi("Izmenjena obaveza: " + sacuvana.getTip());
                    return ResponseEntity.ok(sacuvana);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteObaveza(@PathVariable Long id) {

        return obavezaService.findById(id)
                .map(obaveza -> {
                    obavezaService.deleteById(id);
                    logAktivnostiService.zabelezi("Obrisana obaveza: " + obaveza.getTip());
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}