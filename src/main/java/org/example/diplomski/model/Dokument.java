package org.example.diplomski.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "dokument")
public class Dokument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDokumenta;

    private String naziv;

    @Enumerated(EnumType.STRING)
    private DokumentTip tip;

    private LocalDate datum;

    @ManyToOne
    @JoinColumn(name = "id_firma", nullable = false)
    private Firma firma;

    public Dokument() {
    }

    public Long getIdDokumenta() {
        return idDokumenta;
    }

    public void setIdDokumenta(Long idDokumenta) {
        this.idDokumenta = idDokumenta;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public DokumentTip getTip() {
        return tip;
    }

    public void setTip(DokumentTip tip) {
        this.tip = tip;
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