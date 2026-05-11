package com.gymstack.backend.service;

import com.gymstack.backend.model.AppRole;
import com.gymstack.backend.model.AppUser;
import com.gymstack.backend.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserService implements UserDetailsService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public AppUser registerUser(String username, String rawPassword) {
        if (appUserRepository.existsByUsername(username)) {
            throw new IllegalStateException("Username already exists");
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(AppRole.USER);

        return appUserRepository.save(user);
    }

    public AppUser createAdminIfMissing() {
        return appUserRepository.findByUsername("admin")
                .orElseGet(() -> {
                    AppUser admin = new AppUser();
                    admin.setUsername("admin");
                    admin.setPassword(passwordEncoder.encode("admin"));
                    admin.setRole(AppRole.ADMIN);
                    return appUserRepository.save(admin);
                });
    }
}

