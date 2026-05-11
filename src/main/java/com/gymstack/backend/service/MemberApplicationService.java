package com.gymstack.backend.service;

import com.gymstack.backend.model.Member;
import com.gymstack.backend.model.MemberApplication;
import com.gymstack.backend.model.enums.ApplicationStatus;
import com.gymstack.backend.model.enums.MembershipType;
import com.gymstack.backend.repository.MemberApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberApplicationService {

    private static final String UPLOAD_DIR = "uploads";
    private static final String PDF_MIME_TYPE = "application/pdf";

    private final MemberApplicationRepository applicationRepository;
    private final MemberService memberService;

    public List<MemberApplication> listApplications() {
        return applicationRepository.findAll();
    }

    public MemberApplication submitApplication(String name,
                                               String surname,
                                               String address,
                                               MembershipType membershipType,
                                               MultipartFile document) {
        if (membershipType == MembershipType.STUDENT && (document == null || document.isEmpty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student document is required.");
        }

        if (document != null && !document.isEmpty()) {
            String originalName = document.getOriginalFilename();
            String lowerName = originalName == null ? "" : originalName.toLowerCase();
            String contentType = document.getContentType();
            boolean isPdf = lowerName.endsWith(".pdf") || PDF_MIME_TYPE.equals(contentType);
            if (!isPdf) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF documents are allowed.");
            }
        }

        String documentPath = null;
        String documentName = null;
        if (document != null && !document.isEmpty()) {
            try {
                Files.createDirectories(Path.of(UPLOAD_DIR));
                String safeName = UUID.randomUUID() + "_" + document.getOriginalFilename();
                Path target = Path.of(UPLOAD_DIR).resolve(safeName);
                Files.copy(document.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                documentPath = target.toString();
                documentName = document.getOriginalFilename();
            } catch (IOException ex) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store document.");
            }
        }

        MemberApplication application = new MemberApplication();
        application.setName(name);
        application.setSurname(surname);
        application.setAddress(address);
        application.setMembershipType(membershipType);
        application.setDocumentPath(documentPath);
        application.setDocumentName(documentName);
        application.setStatus(ApplicationStatus.PENDING);
        application.setCreatedAt(LocalDateTime.now());
        return applicationRepository.save(application);
    }

    public MemberApplication approveApplication(Long id) {
        MemberApplication application = getApplication(id);
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Application already processed.");
        }

        Member member = new Member();
        member.setName(application.getName());
        member.setSurname(application.getSurname());
        member.setAddress(application.getAddress());
        member.setMembershipType(application.getMembershipType());
        member.setJoinDate(LocalDate.now());
        member.setExpiryDate(memberService.calculateExpiryDate(application.getMembershipType(), member.getJoinDate()));
        member.setActive(true);
        memberService.createMember(member);

        application.setStatus(ApplicationStatus.APPROVED);
        return applicationRepository.save(application);
    }

    public MemberApplication rejectApplication(Long id) {
        MemberApplication application = getApplication(id);
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Application already processed.");
        }
        application.setStatus(ApplicationStatus.REJECTED);
        return applicationRepository.save(application);
    }

    public Path getDocumentPath(Long id) {
        MemberApplication application = getApplication(id);
        if (application.getDocumentPath() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found.");
        }
        return Path.of(application.getDocumentPath());
    }

    private MemberApplication getApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }
}

