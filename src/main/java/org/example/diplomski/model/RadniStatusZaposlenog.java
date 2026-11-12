package org.example.diplomski.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "radni_status")
public class RadniStatusZaposlenog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idStatus;

    @ManyToOne
    @JoinColumn(name = "id_zaposleni", nullable = false)
    private Zaposleni zaposleni;

    @Enumerated(EnumType.STRING)
    private RadniStatus tip;

    private LocalDate datumOd;

    private LocalDate datumDo;

    public RadniStatusZaposlenog() {
    }

    public Long getIdStatus() {
        return idStatus;
    }

    public void setIdStatus(Long idStatus) {
        this.idStatus = idStatus;
    }

    public Zaposleni getZaposleni() {
        return zaposleni;
    }

    public void setZaposleni(Zaposleni zaposleni) {
        this.zaposleni = zaposleni;
    }

    public RadniStatus getTip() {
        return tip;
    }

    public void setTip(RadniStatus tip) {
        this.tip = tip;
    }

    public LocalDate getDatumOd() {
        return datumOd;
    }

    public void setDatumOd(LocalDate datumOd) {
        this.datumOd = datumOd;
    }

    public LocalDate getDatumDo() {
        return datumDo;
    }

    public void setDatumDo(LocalDate datumDo) {
        this.datumDo = datumDo;
    }
}