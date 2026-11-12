package org.example.diplomski.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "zaposleni")
public class Zaposleni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idZaposleni;

    private String ime;

    private String prezime;

    @ManyToOne
    @JoinColumn(name = "id_firma", nullable = false)
    private Firma firma;

    private LocalDate datumZaposlenja;

    @Enumerated(EnumType.STRING)
    private UlogaZaposlenog uloga;

    @JsonIgnore
    @Lob
    @Column(name = "slika", columnDefinition = "MEDIUMBLOB")
    private byte[] slika;

    @Column(name = "slika_tip")
    private String slikaTip;

    public boolean isImaSliku() {
        return slika != null && slika.length > 0;
    }

    public Zaposleni() {
    }

    public Long getIdZaposleni() {
        return idZaposleni;
    }

    public void setIdZaposleni(Long idZaposleni) {
        this.idZaposleni = idZaposleni;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public UlogaZaposlenog getUloga() {
        return uloga;
    }

    public void setUloga(UlogaZaposlenog uloga) {
        this.uloga = uloga;
    }

    public Firma getFirma() {
        return firma;
    }

    public void setFirma(Firma firma) {
        this.firma = firma;
    }

    public LocalDate getDatumZaposlenja() {
        return datumZaposlenja;
    }

    public void setDatumZaposlenja(LocalDate datumZaposlenja) {
        this.datumZaposlenja = datumZaposlenja;
    }

    public byte[] getSlika() {
        return slika;
    }

    public void setSlika(byte[] slika) {
        this.slika = slika;
    }

    public String getSlikaTip() {
        return slikaTip;
    }

    public void setSlikaTip(String slikaTip) {
        this.slikaTip = slikaTip;
    }
}