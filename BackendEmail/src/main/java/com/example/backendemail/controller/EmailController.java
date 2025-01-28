package com.example.backendemail.controller;
import com.example.backendemail.Dtos.requests.SendEmailRequest;
import com.example.backendemail.entities.EmailTemplate;
import com.example.backendemail.repositroy.EmailRepository;
import com.example.backendemail.services.IEmailService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EmailController {

    public EmailController(EmailRepository emailRepository, IEmailService emailService) {
        this.emailRepository = emailRepository;
        this.emailService = emailService;
    }

    private final EmailRepository emailRepository;
    private final IEmailService emailService;

    @PostMapping("/addTemplate")
    public ResponseEntity<EmailTemplate> createEmailTemplate(@RequestBody EmailTemplate emailTemplate){
        EmailTemplate createdEmailTemplate=emailService.createEmailTemplate(emailTemplate);
        return ResponseEntity.ok(createdEmailTemplate);
    }



    @PostMapping(value = "/sendEmail",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> sendEmail(@ModelAttribute SendEmailRequest sendEmailRequest){
         emailService.sendEmailNotification(sendEmailRequest);
        return ResponseEntity.ok("sent successfully");
    }


    @GetMapping("/getTemplates")
    public ResponseEntity<List<EmailTemplate>> getTemplates(){
        List<EmailTemplate> L = emailRepository.findAll();
        return ResponseEntity.ok(L);
    }


}
