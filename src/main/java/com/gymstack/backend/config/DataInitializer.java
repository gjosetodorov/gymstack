package com.gymstack.backend.config;

import com.gymstack.backend.service.AppUserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AppUserService appUserService;

    public DataInitializer(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @Override
    public void run(String... args) {
        appUserService.createAdminIfMissing();
    }
}

