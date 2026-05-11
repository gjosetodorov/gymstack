package com.gymstack.backend.model;

import com.gymstack.backend.model.enums.MembershipType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;


@Entity
@Data
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String surname;
    private String address;

    private LocalDate joinDate;
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    private MembershipType membershipType;

    private boolean active;
}
