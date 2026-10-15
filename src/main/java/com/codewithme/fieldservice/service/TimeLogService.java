package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.TimeLog;
import com.codewithme.fieldservice.repository.TimeLogRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;

    public TimeLogService(TimeLogRepository timeLogRepository) {
        this.timeLogRepository = timeLogRepository;
    }

    public List<TimeLog> getAllTimeLogs() {
        return timeLogRepository.findAll();
    }

    public List<TimeLog> getTimeLogsByWorkOrderId(Long workOrderId) {
        return timeLogRepository.findByWorkOrderId(workOrderId);
    }

    public List<TimeLog> getTimeLogsByTechnicianId(Long technicianId) {
        return timeLogRepository.findByTechnicianId(technicianId);
    }

    public TimeLog createTimeLog(TimeLog timeLog) {

        if (timeLog.getStartTime() == null) {
            throw new IllegalArgumentException("Start time is required");
        }

        if (timeLog.getEndTime() == null) {
            throw new IllegalArgumentException("End time is required");
        }

        if (timeLog.getEndTime().isBefore(timeLog.getStartTime())) {
            throw new IllegalArgumentException(
                    "End time cannot be before start time"
            );
        }

        long minutes = Duration.between(
                timeLog.getStartTime(),
                timeLog.getEndTime()
        ).toMinutes();

        timeLog.setDurationMinutes((int) minutes);

        return timeLogRepository.save(timeLog);
    }

    public void deleteTimeLog(Long id) {
        timeLogRepository.deleteById(id);
    }
}