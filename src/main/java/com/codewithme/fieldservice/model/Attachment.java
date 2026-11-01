
package com.codewithme.fieldservice.model;

import jakarta.persistence.*;
import lombok.*;
import com.codewithme.fieldservice.model.WorkOrder;
import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String contentType;

    @Column(length = 1000)
    private String storagePath;

    private Long sizeOfFile;

    private String cloudinaryId;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id")
    private WorkOrder workOrder;
}
