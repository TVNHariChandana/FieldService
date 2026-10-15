
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.Assignment;
import com.codewithme.fieldservice.service.AssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/status/{status}")
    public List<Assignment> getAssignmentsByStatus(@PathVariable String status) {
        return assignmentService.getAssignmentsByStatus(status);
    }
    @GetMapping("/technician/{technicianId}")
    public List<Assignment>getAssignmentByTechnicianId(@PathVariable Long technicianId){
        return assignmentService.getAssignmentByTechnicianId(technicianId);
    }
    @GetMapping("/technician/{technicianId}/status/{status}")
    public List<Assignment>getAssignmentByTechnicianIdAndStatus(@PathVariable Long technicianId,@PathVariable String status){
        return assignmentService.getAssignmentByTechnicianIdAndStatus(technicianId,status);
    }
    @GetMapping("/{id}")
    public Assignment getAssignmentById(@PathVariable Long id) {

        return assignmentService.getAssignmentById(id);
    }

    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        return assignmentService.createAssignment(assignment);
    }

    @PutMapping("/{id}")
    public Assignment updateAssignment(
            @PathVariable Long id,
            @RequestBody Assignment assignment) {

        return assignmentService.updateAssignment(id, assignment);
    }

    @DeleteMapping("/{id}")
    public void deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
    }
}