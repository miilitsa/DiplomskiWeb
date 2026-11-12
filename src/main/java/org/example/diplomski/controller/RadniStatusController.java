package org.example.diplomski.controller;

import org.example.diplomski.model.RadniStatusZaposlenog;
import org.example.diplomski.service.LogAktivnostiService;
import org.example.diplomski.service.RadniStatusZaposlenogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/radni-statusi")
@CrossOrigin(origins = "http://localhost:5173")
public class RadniStatusController {

    private final RadniStatusZaposlenogService radniStatusService;
    private final LogAktivnostiService logAktivnostiService;

    public RadniStatusController(RadniStatusZaposlenogService radniStatusService,
                                 LogAktivnostiService logAktivnostiService) {
        this.radniStatusService = radniStatusService;
        this.logAktivnostiService = logAktivnostiService;
    }

    @GetMapping
    public List<RadniStatusZaposlenog> getAllRadniStatusi(
            @RequestParam(required = false) Long zaposleniId) {

        if (zaposleniId != null) {
            return radniStatusService.findByZaposleni(zaposleniId);
        }

        return radniStatusService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RadniStatusZaposlenog> getRadniStatusById(@PathVariable Long id) {
        return radniStatusService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private String bezNull(String vrednost) {
        return vrednost == null ? "" : vrednost;
    }

    @PostMapping
    public RadniStatusZaposlenog addRadniStatus(@RequestBody RadniStatusZaposlenog radniStatus) {
        RadniStatusZaposlenog sacuvan = radniStatusService.dodaj(radniStatus);
        logAktivnostiService.zabelezi("Dodat radni status: " + sacuvan.getTip()
                + " (" + bezNull(sacuvan.getZaposleni().getIme()) + " "
                + bezNull(sacuvan.getZaposleni().getPrezime()) + ")");
        return sacuvan;
    }

    @PutMapping("/{id}")
    public ResponseEntity<RadniStatusZaposlenog> updateRadniStatus(
            @PathVariable Long id,
            @RequestBody RadniStatusZaposlenog radniStatus) {

        return radniStatusService.findById(id)
                .map(postojeciStatus -> {
                    RadniStatusZaposlenog sacuvan = radniStatusService.izmeni(id, radniStatus);
                    logAktivnostiService.zabelezi("Izmenjen radni status: " + sacuvan.getTip()
                            + " (" + bezNull(sacuvan.getZaposleni().getIme()) + " "
                            + bezNull(sacuvan.getZaposleni().getPrezime()) + ")");
                    return ResponseEntity.ok(sacuvan);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRadniStatus(@PathVariable Long id) {

        return radniStatusService.findById(id)
                .map(radniStatus -> {
                    radniStatusService.deleteById(id);
                    logAktivnostiService.zabelezi("Obrisan radni status: " + radniStatus.getTip()
                            + " (" + bezNull(radniStatus.getZaposleni().getIme()) + " "
                            + bezNull(radniStatus.getZaposleni().getPrezime()) + ")");
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
