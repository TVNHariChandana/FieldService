package com.codewithme.fieldservice.service;


import com.codewithme.fieldservice.model.Technician;
import com.codewithme.fieldservice.repository.TechnicianRepository;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class TechnicianService {

        private final TechnicianRepository technicianRepository;

        public TechnicianService(TechnicianRepository technicianRepository) {
            this.technicianRepository = technicianRepository;
        }

        public List<Technician> getAllTechnicians() {
            return technicianRepository.findAll();
        }

        public Technician getTechnicianById(Long id) {
            return technicianRepository.findById(id).orElse(null);
        }

        public Technician createTechnician(Technician technician) {
            return technicianRepository.save(technician);
        }

        public Technician updateTechnician(Long id, Technician technician) {

            Technician existingTechnician =
                    technicianRepository.findById(id).orElse(null);

            if (existingTechnician != null) {
                existingTechnician.setName(technician.getName());
                existingTechnician.setEmail(technician.getEmail());
                existingTechnician.setPhone(technician.getPhone());
                existingTechnician.setSpecialization(technician.getSpecialization());

                return technicianRepository.save(existingTechnician);
            }

            return null;
        }

        public void deleteTechnician(Long id) {
            technicianRepository.deleteById(id);
        }
    }
