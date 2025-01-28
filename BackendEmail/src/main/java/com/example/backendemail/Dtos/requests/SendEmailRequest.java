package com.example.backendemail.Dtos.requests;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class SendEmailRequest {
    private Long idTemplate;
    private String[] recipients;
    private MultipartFile attachment;























    public MultipartFile getAttachment() {
        return attachment;
    }

    public void setAttachment(MultipartFile attachment) {
        this.attachment = attachment;
    }

    public Long getIdTemplate() {
        return idTemplate;
    }

    public void setIdTemplate(Long idTemplate) {
        this.idTemplate = idTemplate;
    }

    public SendEmailRequest(Long idTemplate, String[] recipients) {
        this.idTemplate = idTemplate;
        this.recipients = recipients;
    }

    public String[] getRecipients() {
        return recipients;
    }

    public void setRecipients(String[] recipients) {
        this.recipients = recipients;
    }
}
