package com.gymstack.backend.repository;

import com.gymstack.backend.model.MemberApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberApplicationRepository extends JpaRepository<MemberApplication, Long> {
}

