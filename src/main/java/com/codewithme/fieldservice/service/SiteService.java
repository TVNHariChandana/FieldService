
    package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Site;
import com.codewithme.fieldservice.repository.SiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class SiteService {

        private final SiteRepository siteRepository;

        public SiteService(SiteRepository siteRepository) {
            this.siteRepository = siteRepository;
        }

        public List<Site> getAllSites() {
            return siteRepository.findAll();
        }

        public Site getSiteById(Long id) {
            return siteRepository.findById(id).orElse(null);
        }

        public Site createSite(Site site) {
            return siteRepository.save(site);
        }

        public Site updateSite(Long id, Site site) {

            Site existingSite =
                    siteRepository.findById(id).orElse(null);

            if (existingSite != null) {

                existingSite.setAddress(site.getAddress());
                existingSite.setCity(site.getCity());
                existingSite.setState(site.getState());
                existingSite.setPincode(site.getPincode());
                existingSite.setCustomer(site.getCustomer());

                return siteRepository.save(existingSite);
            }

            return null;
        }

        public void deleteSite(Long id) {
            siteRepository.deleteById(id);
        }
    }
