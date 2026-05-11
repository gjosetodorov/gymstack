package com.gymstack.backend.controller;

import com.gymstack.backend.model.MemberApplication;
import com.gymstack.backend.model.enums.MembershipType;
import com.gymstack.backend.service.MemberApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberApplicationController {

    private final MemberApplicationService applicationService;

    @GetMapping("/applications")
    public List<MemberApplication> listApplications() {
        return applicationService.listApplications();
    }

    @PostMapping(value = "/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MemberApplication submitApplication(@RequestParam String name,
                                               @RequestParam String surname,
                                               @RequestParam String address,
                                               @RequestParam MembershipType membershipType,
                                               @RequestPart(required = false) MultipartFile document) {
        return applicationService.submitApplication(name, surname, address, membershipType, document);
    }

    @PostMapping("/applications/{id}/approve")
    public MemberApplication approveApplication(@PathVariable Long id) {
        return applicationService.approveApplication(id);
    }

    @PostMapping("/applications/{id}/reject")
    public MemberApplication rejectApplication(@PathVariable Long id) {
        return applicationService.rejectApplication(id);
    }

    @GetMapping("/applications/{id}/document")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Path documentPath = applicationService.getDocumentPath(id);
        Resource resource = new FileSystemResource(documentPath);
        String filename = documentPath.getFileName().toString();
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try {
            String contentType = Files.probeContentType(documentPath);
            if (contentType != null) {
                mediaType = MediaType.parseMediaType(contentType);
            }
        } catch (Exception ignored) {
            // Default to octet-stream when type detection fails.
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(resource);
    }
}
