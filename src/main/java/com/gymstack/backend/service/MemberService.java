package com.gymstack.backend.service;

import com.gymstack.backend.model.Member;
import com.gymstack.backend.model.enums.MembershipType;
import com.gymstack.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public List<Member> getMembers() {
        List<Member> members = memberRepository.findAll();
        boolean updated = false;
        for (Member member : members) {
            if (applyExpiryRule(member)) {
                updated = true;
            }
        }
        if (updated) {
            memberRepository.saveAll(members);
        }
        return members;
    }

    public Member getMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
        if (applyExpiryRule(member)) {
            memberRepository.save(member);
        }
        return member;
    }

    public Member createMember(Member member) {
        member.setId(null);
        applyExpiryRule(member);
        return memberRepository.save(member);
    }

    public Member postMember(Member member) {
        return createMember(member);
    }

    public Member updateMember(Long id, Member updated) {
        Member existing = getMember(id);
        existing.setName(updated.getName());
        existing.setSurname(updated.getSurname());
        existing.setAddress(updated.getAddress());
        existing.setJoinDate(updated.getJoinDate());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setMembershipType(updated.getMembershipType());
        existing.setActive(updated.isActive());
        applyExpiryRule(existing);
        return memberRepository.save(existing);
    }

    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found");
        }
        memberRepository.deleteById(id);
    }

    public LocalDate calculateExpiryDate(MembershipType membershipType, LocalDate joinDate) {
        if (joinDate == null || membershipType == null) {
            return null;
        }
        return switch (membershipType) {
            case ANNUAL -> joinDate.plus(1, ChronoUnit.YEARS);
            case STUDENT, MONTHLY -> joinDate.plus(1, ChronoUnit.MONTHS);
        };
    }

    private boolean applyExpiryRule(Member member) {
        if (member.getExpiryDate() != null
                && !member.getExpiryDate().isAfter(LocalDate.now())
                && member.isActive()) {
            member.setActive(false);
            return true;
        }
        return false;
    }
}
