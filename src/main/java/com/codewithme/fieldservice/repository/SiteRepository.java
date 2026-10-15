package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.Site;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site,Long> {
}
