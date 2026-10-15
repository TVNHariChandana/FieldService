package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.Technician;
import com.codewithme.fieldservice.service.TechnicianService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @RestController
    @RequestMapping("/technicians")
    public class TechnicianController {

        private final TechnicianService technicianService;

        public TechnicianController(TechnicianService technicianService) {
            this.technicianService = technicianService;
        }

        @GetMapping
        public List<Technician> getAllTechnicians() {
            return technicianService.getAllTechnicians();
        }

        @GetMapping("/{id}")
        public Technician getTechnicianById(@PathVariable Long id) {
            return technicianService.getTechnicianById(id);
        }

        @PostMapping
        public Technician createTechnician(@RequestBody Technician technician) {
            return technicianService.createTechnician(technician);
        }

        @PutMapping("/{id}")
        public Technician updateTechnician(
                @PathVariable Long id,
                @RequestBody Technician technician) {
            return technicianService.updateTechnician(id, technician);
        }

        @DeleteMapping("/{id}")
        public void deleteTechnician(@PathVariable Long id) {
            technicianService.deleteTechnician(id);
        }
    }

