package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Part;
import com.codewithme.fieldservice.repository.PartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartService {

    private final PartRepository partRepository;

    public PartService(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    public Part getPartById(Long id) {
        return partRepository.findById(id).orElse(null);
    }

    public Part createPart(Part part) {
        return partRepository.save(part);
    }

    public Part updatePart(Long id, Part part) {

        Part existingPart =
                partRepository.findById(id).orElse(null);

        if (existingPart != null) {
            existingPart.setName(part.getName());
            existingPart.setPartNumber(part.getPartNumber());
            existingPart.setQuantity(part.getQuantity());
            existingPart.setPrice(part.getPrice());

            return partRepository.save(existingPart);
        }

        return null;
    }

    public void deletePart(Long id) {
        partRepository.deleteById(id);
    }
}