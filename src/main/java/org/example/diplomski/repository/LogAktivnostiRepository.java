package org.example.diplomski.repository;

import org.example.diplomski.model.LogAktivnosti;
import org.example.diplomski.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogAktivnostiRepository extends JpaRepository<LogAktivnosti, Long> {

    List<LogAktivnosti> findAllByOrderByDatumDesc();

    List<LogAktivnosti> findTop10ByOrderByDatumDesc();

    void deleteByUser(User user);
}
