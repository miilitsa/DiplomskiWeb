package org.example.diplomski.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "obaveza")
public class Obaveza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idObaveza;

    @Enumerated(EnumType.STRING)
    private ObavezaTip tip;

    private BigDecimal iznos;

    private LocalDate datumDospeca;

    private boolean placeno;

    @ManyToOne
    @JoinColumn(name = "id_firma", nullable = false)
    private Firma firma;

    public Obaveza() {
    }

    public Long getIdObaveza() {
        return idObaveza;
    }

    public void setIdObaveza(Long idObaveza) {
        this.idObaveza = idObaveza;
    }

    public ObavezaTip getTip() {
        return tip;
    }

    public void setTip(ObavezaTip tip) {
        this.tip = tip;
    }

    public BigDecimal getIznos() {
        return iznos;
    }

    public void setIznos(BigDecimal iznos) {
        this.iznos = iznos;
    }

    public LocalDate getDatumDospeca() {
        return datumDospeca;
    }

    public void setDatumDospeca(LocalDate datumDospeca) {
        this.datumDospeca = datumDospeca;
    }

    public boolean isPlaceno() {
        return placeno;
    }

    public void setPlaceno(boolean placeno) {
        this.placeno = placeno;
    }

    public Firma getFirma() {
        return firma;
    }

    public void setFirma(Firma firma) {
        this.firma = firma;
    }
}