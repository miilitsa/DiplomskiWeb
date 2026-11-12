package org.example.diplomski.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "napomena")
public class Napomena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNapomene;

    private String tekst;

    private LocalDate datum;

    @ManyToOne
    @JoinColumn(name = "id_firma", nullable = false)
    private Firma firma;

    public Napomena() {
    }

    public Long getIdNapomene() {
        return idNapomene;
    }

    public void setIdNapomene(Long idNapomene) {
        this.idNapomene = idNapomene;
    }

    public String getTekst() {
        return tekst;
    }

    public void setTekst(String tekst) {
        this.tekst = tekst;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    public Firma getFirma() {
        return firma;
    }

    public void setFirma(Firma firma) {
        this.firma = firma;
    }
}