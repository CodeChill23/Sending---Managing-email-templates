package com.example.backendemail.repositroy;

import com.example.backendemail.entities.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<EmailTemplate,Long> {
}
