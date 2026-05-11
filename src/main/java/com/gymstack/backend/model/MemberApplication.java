package com.gymstack.backend.model;

import com.gymstack.backend.model.enums.ApplicationStatus;
import com.gymstack.backend.model.enums.MembershipType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class MemberApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String surname;
    private String address;

    @Enumerated(EnumType.STRING)
    private MembershipType membershipType;

    private String documentPath;
    private String documentName;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDateTime createdAt;
}

