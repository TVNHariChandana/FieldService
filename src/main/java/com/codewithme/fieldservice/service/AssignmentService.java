
    package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Assignment;
import com.codewithme.fieldservice.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class AssignmentService {

        private final AssignmentRepository assignmentRepository;

        public AssignmentService(AssignmentRepository assignmentRepository) {
            this.assignmentRepository = assignmentRepository;
        }

        public List<Assignment> getAssignmentsByStatus(String status) {
            return assignmentRepository.findByStatus(status);
        }
        public List<Assignment>getAssignmentByTechnicianId(long technicianId){
            return assignmentRepository.findByTechnicianId(technicianId);
        }
        public List<Assignment>getAssignmentByTechnicianIdAndStatus(long technicianId,String status){
            return assignmentRepository.findByTechnicianIdAndStatus(technicianId,status);
        }

        public Assignment getAssignmentById(Long id) {
            return assignmentRepository.findById(id).orElse(null);
        }

        public Assignment createAssignment(Assignment assignment) {
            return assignmentRepository.save(assignment);
        }

        public Assignment updateAssignment(Long id, Assignment assignment) {

            Assignment existingAssignment =
                    assignmentRepository.findById(id).orElse(null);

            if (existingAssignment != null) {

                existingAssignment.setServiceRequest(
                        assignment.getServiceRequest());

                existingAssignment.setTechnician(
                        assignment.getTechnician());

                existingAssignment.setStatus(
                        assignment.getStatus());

                return assignmentRepository.save(existingAssignment);
            }

            return null;
        }

        public void deleteAssignment(Long id) {
            assignmentRepository.deleteById(id);
        }
    }
