package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.PartUsage;
import com.codewithme.fieldservice.service.PartUsageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/part-usage")
public class PartUsageController {

    private final PartUsageService partUsageService;

    public PartUsageController(PartUsageService partUsageService) {
        this.partUsageService = partUsageService;
    }

    @PostMapping("/work-order/{workOrderId}/part/{partId}")
    public PartUsage usePart(
            @PathVariable Long workOrderId,
            @PathVariable Long partId,
            @RequestParam Integer quantityUsed) {

        return partUsageService.usePart(
                workOrderId,
                partId,
                quantityUsed
        );
    }

    @GetMapping("/work-order/{workOrderId}")
    public List<PartUsage> getPartsUsedByWorkOrder(
            @PathVariable Long workOrderId) {

        return partUsageService.getPartsUsedByWorkOrder(workOrderId);
    }
}