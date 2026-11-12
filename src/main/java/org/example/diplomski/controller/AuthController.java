package org.example.diplomski.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.diplomski.model.User;
import org.example.diplomski.model.UserRole;
import org.example.diplomski.repository.UserRepository;
import org.example.diplomski.security.KorisnikOdgovor;
import org.example.diplomski.service.LogAktivnostiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LogAktivnostiService logAktivnostiService;
    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          LogAktivnostiService logAktivnostiService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.logAktivnostiService = logAktivnostiService;
    }

    public record LoginRequest(String username, String password) {}
    public record RegistracijaRequest(String username, String password) {}
    public record PromenaLozinkeRequest(String trenutnaLozinka, String novaLozinka) {}

    @PostMapping("/promeni-lozinku")
    public ResponseEntity<?> promeniLozinku(@RequestBody PromenaLozinkeRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (request.novaLozinka() == null || request.novaLozinka().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Nova lozinka je obavezna.");
        }

        User user = authentication == null
                ? null
                : userRepository.findByUsername(authentication.getName()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (request.trenutnaLozinka() == null ||
                !passwordEncoder.matches(request.trenutnaLozinka(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body("Pogrešna trenutna lozinka.");
        }

        user.setPassword(passwordEncoder.encode(request.novaLozinka()));
        userRepository.save(user);

        logAktivnostiService.zabelezi("Promenjena lična lozinka");

        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletRequest httpRequest,
                                   HttpServletResponse httpResponse) {

        try {

            String korisnickoIme =
                    request.username() == null ? "" : request.username().trim();

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            korisnickoIme,
                            request.password()));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, httpRequest, httpResponse);

            User user = userRepository.findByUsername(korisnickoIme).orElseThrow();

            if (!user.getUsername().equals(korisnickoIme)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Pogrešno korisničko ime ili lozinka.");
            }

            logAktivnostiService.zabelezi("Prijava u sistem");

            return ResponseEntity.ok(
                    new KorisnikOdgovor(user.getUsername(), user.getRole().name()));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Pogrešno korisničko ime ili lozinka.");
        }
    }

    @PostMapping("/registracija")
    public ResponseEntity<?> registracija(@RequestBody RegistracijaRequest request) {

        if (request.username() == null || request.username().isBlank() ||
            request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Korisničko ime i lozinka su obavezni.");
        }

        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Korisničko ime već postoji.");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(userRepository.count() == 0 ? UserRole.ADMIN : UserRole.EMPLOYEE);

        userRepository.save(user);

        logAktivnostiService.zabelezi(user, "Registracija novog naloga");

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> osveziStranicu() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userRepository.findByUsername(authentication.getName())
                .map(user -> ResponseEntity.ok(
                        new KorisnikOdgovor(user.getUsername(), user.getRole().name())))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {

        logAktivnostiService.zabelezi("Odjava iz sistema");

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.noContent().build();
    }
}
