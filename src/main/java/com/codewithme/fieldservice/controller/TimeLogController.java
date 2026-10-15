package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.TimeLog;
import com.codewithme.fieldservice.service.TimeLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/time-logs")
public class TimeLogController {

    private final TimeLogService timeLogService;

    public TimeLogController(TimeLogService timeLogService) {
        this.timeLogService = timeLogService;
    }

    @GetMapping
    public List<TimeLog> getAllTimeLogs() {
        return timeLogService.getAllTimeLogs();
    }

    @GetMapping("/work-order/{workOrderId}")
    public List<TimeLog> getTimeLogsByWorkOrder(
            @PathVariable Long workOrderId) {

        return timeLogService.getTimeLogsByWorkOrderId(workOrderId);
    }

    @GetMapping("/technician/{technicianId}")
    public List<TimeLog> getTimeLogsByTechnician(
            @PathVariable Long technicianId) {

        return timeLogService.getTimeLogsByTechnicianId(technicianId);
    }

    @PostMapping
    public TimeLog createTimeLog(@RequestBody TimeLog timeLog) {
        return timeLogService.createTimeLog(timeLog);
    }

    @DeleteMapping("/{id}")
    public void deleteTimeLog(@PathVariable Long id) {
        timeLogService.deleteTimeLog(id);
    }
}