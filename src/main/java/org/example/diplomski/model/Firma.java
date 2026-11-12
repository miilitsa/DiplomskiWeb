package org.example.diplomski.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "firma")
public class Firma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFirma;

    private String naziv;

    private String pib;

    private String maticniBroj;

    private LocalDate datumOsnivanja;

    private String tipFirme;

    private boolean pdvObveznik;

    private boolean pausalac;

    @JsonIgnore
    @Lob
    @Column(name = "logo", columnDefinition = "MEDIUMBLOB")
    private byte[] logo;

    @Column(name = "logo_tip")
    private String logoTip;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User zaduzeniKorisnik;

    public boolean isImaLogo() {
        return logo != null && logo.length > 0;
    }

    public Firma() {
    }

    public Long getIdFirma() {
        return idFirma;
    }

    public void setIdFirma(Long idFirma) {
        this.idFirma = idFirma;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getPib() {
        return pib;
    }

    public void setPib(String pib) {
        this.pib = pib;
    }

    public String getMaticniBroj() {
        return maticniBroj;
    }

    public void setMaticniBroj(String maticniBroj) {
        this.maticniBroj = maticniBroj;
    }

    public LocalDate getDatumOsnivanja() {
        return datumOsnivanja;
    }

    public void setDatumOsnivanja(LocalDate datumOsnivanja) {
        this.datumOsnivanja = datumOsnivanja;
    }

    public String getTipFirme() {
        return tipFirme;
    }

    public void setTipFirme(String tipFirme) {
        this.tipFirme = tipFirme;
    }

    public boolean isPdvObveznik() {
        return pdvObveznik;
    }

    public void setPdvObveznik(boolean pdvObveznik) {
        this.pdvObveznik = pdvObveznik;
    }

    public boolean isPausalac() {
        return pausalac;
    }

    public void setPausalac(boolean pausalac) {
        this.pausalac = pausalac;
    }

    public User getZaduzeniKorisnik() {
        return zaduzeniKorisnik;
    }

    public void setZaduzeniKorisnik(User zaduzeniKorisnik) {
        this.zaduzeniKorisnik = zaduzeniKorisnik;
    }

    public byte[] getLogo() {
        return logo;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoTip() {
        return logoTip;
    }

    public void setLogoTip(String logoTip) {
        this.logoTip = logoTip;
    }
}