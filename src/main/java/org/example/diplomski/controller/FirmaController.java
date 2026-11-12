package org.example.diplomski.controller;

import org.example.diplomski.model.Firma;
import org.example.diplomski.model.User;
import org.example.diplomski.repository.UserRepository;
import org.example.diplomski.service.FirmaService;
import org.example.diplomski.service.LogAktivnostiService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/firme")
@CrossOrigin(origins = "http://localhost:5173")
public class FirmaController {

    private final FirmaService firmaService;
    private final LogAktivnostiService logAktivnostiService;
    private final UserRepository userRepository;

    public FirmaController(FirmaService firmaService,
                           LogAktivnostiService logAktivnostiService,
                           UserRepository userRepository) {
        this.firmaService = firmaService;
        this.logAktivnostiService = logAktivnostiService;
        this.userRepository = userRepository;
    }

    public record KorisnikZaDodeluDTO(Long idUser, String username) {}

    @GetMapping("/zaduzeni-korisnici")
    public List<KorisnikZaDodeluDTO> zaduzeniKorisnici() {
        return userRepository.findAll().stream()
                .map(korisnik -> new KorisnikZaDodeluDTO(
                        korisnik.getIdUser(),
                        korisnik.getUsername()))
                .toList();
    }

    @GetMapping
    public List<Firma> getAllFirme() {
        return firmaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Firma> getFirmaById(@PathVariable Long id) {
        return firmaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addFirma(@RequestBody Firma firma) {

        if (firma.getPib() == null || !firma.getPib().matches("\\d{9}")) {
            return ResponseEntity.badRequest()
                    .body("PIB mora imati tačno 9 brojeva.");
        }

        if (firma.getMaticniBroj() == null || !firma.getMaticniBroj().matches("\\d{6}")) {
            return ResponseEntity.badRequest()
                    .body("Matični broj mora imati tačno 6 brojeva.");
        }

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            userRepository.findByUsername(authentication.getName())
                    .ifPresent(firma::setZaduzeniKorisnik);
        }

        Firma sacuvana = firmaService.save(firma);
        logAktivnostiService.zabelezi("Dodata firma: " + sacuvana.getNaziv());
        return ResponseEntity.ok(sacuvana);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFirma(
            @PathVariable Long id,
            @RequestBody Firma firma) {

        if (firma.getPib() == null || !firma.getPib().matches("\\d{9}")) {
            return ResponseEntity.badRequest()
                    .body("PIB mora imati tačno 9 brojeva.");
        }

        if (firma.getMaticniBroj() == null || !firma.getMaticniBroj().matches("\\d{6}")) {
            return ResponseEntity.badRequest()
                    .body("Matični broj mora imati tačno 6 brojeva.");
        }

        return firmaService.findById(id)
                .map(postojecaFirma -> {
                    firma.setIdFirma(id);

                    User noviZaduzeni = null;

                    if (firma.getZaduzeniKorisnik() != null
                            && firma.getZaduzeniKorisnik().getIdUser() != null) {
                        noviZaduzeni = userRepository
                                .findById(firma.getZaduzeniKorisnik().getIdUser())
                                .orElse(null);
                    }

                    firma.setZaduzeniKorisnik(
                            noviZaduzeni != null
                                    ? noviZaduzeni
                                    : postojecaFirma.getZaduzeniKorisnik());

                    firma.setLogo(postojecaFirma.getLogo());
                    firma.setLogoTip(postojecaFirma.getLogoTip());

                    Firma sacuvana = firmaService.save(firma);
                    logAktivnostiService.zabelezi("Izmenjena firma: " + sacuvana.getNaziv());
                    return ResponseEntity.ok(sacuvana);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFirma(@PathVariable Long id) {

        java.util.Optional<Firma> firma = firmaService.findById(id);

        if (firma.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String povezani = firmaService.povezaniPodaci(id);

        if (povezani != null) {
            return ResponseEntity.status(409)
                    .body("Firma se ne može obrisati. Prvo obrišite sve povezane podatke firme: "
                            + povezani + ".");
        }

        firmaService.deleteById(id);
        logAktivnostiService.zabelezi("Obrisana firma: " + firma.get().getNaziv());
        return ResponseEntity.noContent().build();
    }

    private static final Set<String> DOZVOLJENI_TIPOVI = Set.of(
            "image/png", "image/jpeg", "image/gif");

    @PostMapping("/{id}/logo")
    public ResponseEntity<?> dodajLogo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        java.util.Optional<Firma> firma = firmaService.findById(id);

        if (firma.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Niste izabrali sliku loga.");
        }

        String tipSlike = file.getContentType();

        if (tipSlike == null || !DOZVOLJENI_TIPOVI.contains(tipSlike)) {
            return ResponseEntity.badRequest()
                    .body("Logo mora biti slika u PNG, JPG ili GIF formatu.");
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body("Logo ne sme biti veći od 2MB.");
        }

        Firma izmenjena = firma.get();
        izmenjena.setLogo(file.getBytes());
        izmenjena.setLogoTip(tipSlike);
        firmaService.save(izmenjena);
        logAktivnostiService.zabelezi("Dodat logo firme: " + izmenjena.getNaziv());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/logo")
    public ResponseEntity<?> obrisiLogo(@PathVariable Long id) {

        java.util.Optional<Firma> firma = firmaService.findById(id);

        if (firma.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Firma izmenjena = firma.get();
        izmenjena.setLogo(null);
        izmenjena.setLogoTip(null);
        firmaService.save(izmenjena);
        logAktivnostiService.zabelezi("Uklonjen logo firme: " + izmenjena.getNaziv());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/logo")
    public ResponseEntity<byte[]> prikaziLogo(@PathVariable Long id) {

        java.util.Optional<Firma> firma = firmaService.findById(id);

        if (firma.isEmpty() || firma.get().getLogo() == null) {
            return ResponseEntity.notFound().build();
        }

        Firma pronadjena = firma.get();

        String tip = pronadjena.getLogoTip() != null
                ? pronadjena.getLogoTip()
                : MediaType.IMAGE_PNG_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(tip))
                .body(pronadjena.getLogo());
    }
}