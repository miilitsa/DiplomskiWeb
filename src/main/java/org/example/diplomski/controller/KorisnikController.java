package org.example.diplomski.controller;

import org.example.diplomski.model.Firma;
import org.example.diplomski.model.User;
import org.example.diplomski.model.UserRole;
import org.example.diplomski.repository.FirmaRepository;
import org.example.diplomski.service.LogAktivnostiService;
import org.example.diplomski.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/korisnici")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class KorisnikController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final LogAktivnostiService logAktivnostiService;
    private final FirmaRepository firmaRepository;

    public KorisnikController(UserService userService,
                              PasswordEncoder passwordEncoder,
                              LogAktivnostiService logAktivnostiService,
                              FirmaRepository firmaRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.logAktivnostiService = logAktivnostiService;
        this.firmaRepository = firmaRepository;
    }

    public record KorisnikDTO(Long idUser, String username, String role) {}
    public record NoviKorisnikRequest(String username, String password, String role) {}
    public record IzmenaKorisnikaRequest(String username, String role) {}

    @GetMapping
    public List<KorisnikDTO> getAllKorisnici() {
        return userService.findAll().stream()
                .map(user -> new KorisnikDTO(
                        user.getIdUser(),
                        user.getUsername(),
                        user.getRole().name()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> addKorisnik(@RequestBody NoviKorisnikRequest request) {

        if (request.username() == null || request.username().isBlank() ||
            request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Korisničko ime i lozinka su obavezni.");
        }

        if (userService.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Korisničko ime već postoji.");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(uloga(request.role()));

        userService.save(user);

        logAktivnostiService.zabelezi("Dodat korisnik: " + user.getUsername()
                + " (" + user.getRole() + ")");

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateKorisnik(
            @PathVariable Long id,
            @RequestBody IzmenaKorisnikaRequest request) {

        return userService.findById(id)
                .map(korisnik -> {

                    if (request.username() == null || request.username().isBlank()) {
                        return ResponseEntity.badRequest()
                                .<Object>body("Korisničko ime je obavezno.");
                    }

                    if (!korisnik.getUsername().equals(request.username()) &&
                            userService.existsByUsername(request.username())) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .<Object>body("Korisničko ime već postoji.");
                    }

                    korisnik.setUsername(request.username());
                    korisnik.setRole(uloga(request.role()));

                    userService.save(korisnik);

                    logAktivnostiService.zabelezi("Izmenjen korisnik: " + korisnik.getUsername()
                            + " (" + korisnik.getRole() + ")");

                    return ResponseEntity.ok().<Object>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKorisnik(
            @PathVariable Long id,
            Authentication authentication) {

        return userService.findById(id)
                .map(korisnik -> {

                    if (korisnik.getUsername().equalsIgnoreCase(authentication.getName())) {
                        return ResponseEntity.badRequest()
                                .<Object>body("Ne možete obrisati svoj nalog.");
                    }

                    logAktivnostiService.obrisiPoKorisniku(korisnik);

                    List<Firma> firmeKorisnika =
                            firmaRepository.findByZaduzeniKorisnikIdUser(id);

                    firmeKorisnika.forEach(firma ->
                            firma.setZaduzeniKorisnik(null));
                    firmaRepository.saveAll(firmeKorisnika);

                    userService.deleteById(id);

                    logAktivnostiService.zabelezi("Obrisan korisnik: " + korisnik.getUsername());

                    return ResponseEntity.noContent().<Object>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private UserRole uloga(String role) {
        return "ADMIN".equals(role) ? UserRole.ADMIN : UserRole.EMPLOYEE;
    }
}
