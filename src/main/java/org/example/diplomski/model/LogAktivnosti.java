package org.example.diplomski.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_aktivnosti")
public class LogAktivnosti {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLog;

    private String akcija;

    private LocalDateTime datum;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    public LogAktivnosti() {
    }

    public Long getIdLog() {
        return idLog;
    }

    public void setIdLog(Long idLog) {
        this.idLog = idLog;
    }

    public String getAkcija() {
        return akcija;
    }

    public void setAkcija(String akcija) {
        this.akcija = akcija;
    }

    public LocalDateTime getDatum() {
        return datum;
    }

    public void setDatum(LocalDateTime datum) {
        this.datum = datum;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}