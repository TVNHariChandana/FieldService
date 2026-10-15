package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/total-work-orders")
    public long getTotalWorkOrders() {
        return dashboardService.getTotalWorkOrders();
    }

    @GetMapping("/open-work-orders")
    public long getOpenWorkOrders() {
        return dashboardService.getOpenWorkOrders();
    }

    @GetMapping("/in-progress-work-orders")
    public long getInProgressWorkOrders() {
        return dashboardService.getInProgressWorkOrders();
    }

    @GetMapping("/completed-work-orders")
    public long getCompletedWorkOrders() {
        return dashboardService.getCompletedWorkOrders();
    }

    @GetMapping("/low-priority")
    public long getLowPriorityWorkOrders() {
        return dashboardService.getLowPriorityWorkOrders();
    }

    @GetMapping("/medium-priority")
    public long getMediumPriorityWorkOrders() {
        return dashboardService.getMediumPriorityWorkOrders();
    }

    @GetMapping("/high-priority")
    public long getHighPriorityWorkOrders() {
        return dashboardService.getHighPriorityWorkOrders();
    }

    @GetMapping("/sla-breached")
    public long getSlaBreachedCount() {
        return dashboardService.getSlaBreachedCount();
    }

    @GetMapping("/total-parts")
    public long getTotalParts() {
        return dashboardService.getTotalParts();
    }

    @GetMapping("/out-of-stock-parts")
    public long getOutOfStockParts() {
        return dashboardService.getOutOfStockParts();
    }
}