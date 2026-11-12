package org.example.diplomski.controller;

import org.example.diplomski.model.Napomena;
import org.example.diplomski.service.LogAktivnostiService;
import org.example.diplomski.service.NapomenaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/napomene")
@CrossOrigin(origins = "http://localhost:5173")
public class NapomenaController {

    private final NapomenaService napomenaService;
    private final LogAktivnostiService logAktivnostiService;

    public NapomenaController(NapomenaService napomenaService,
                              LogAktivnostiService logAktivnostiService) {
        this.napomenaService = napomenaService;
        this.logAktivnostiService = logAktivnostiService;
    }

    @GetMapping
    public List<Napomena> getAllNapomene() {
        return napomenaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Napomena> getNapomenaById(@PathVariable Long id) {
        return napomenaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private String bezNull(String vrednost) {
        return vrednost == null ? "" : vrednost;
    }

    @PostMapping
    public Napomena addNapomena(@RequestBody Napomena napomena) {
        Napomena sacuvana = napomenaService.save(napomena);
        logAktivnostiService.zabelezi("Dodata napomena za firmu: "
                + bezNull(sacuvana.getFirma().getNaziv()));
        return sacuvana;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Napomena> updateNapomena(
            @PathVariable Long id,
            @RequestBody Napomena napomena) {

        return napomenaService.findById(id)
                .map(postojecaNapomena -> {
                    napomena.setIdNapomene(id);
                    Napomena sacuvana = napomenaService.save(napomena);
                    logAktivnostiService.zabelezi("Izmenjena napomena za firmu: "
                            + bezNull(sacuvana.getFirma().getNaziv()));
                    return ResponseEntity.ok(sacuvana);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNapomena(@PathVariable Long id) {

        return napomenaService.findById(id)
                .map(napomena -> {
                    napomenaService.deleteById(id);
                    logAktivnostiService.zabelezi("Obrisana napomena za firmu: "
                            + bezNull(napomena.getFirma().getNaziv()));
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
