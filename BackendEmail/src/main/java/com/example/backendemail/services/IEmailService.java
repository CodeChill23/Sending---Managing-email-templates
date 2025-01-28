package com.example.backendemail.services;

import com.example.backendemail.Dtos.requests.SendEmailRequest;
import com.example.backendemail.entities.EmailTemplate;

public interface IEmailService {
    EmailTemplate createEmailTemplate(EmailTemplate emailTemplate);

    void sendEmailNotification(SendEmailRequest sendEmailRequest);

}
