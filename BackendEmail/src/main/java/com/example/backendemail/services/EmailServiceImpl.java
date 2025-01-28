package com.example.backendemail.services;

import com.example.backendemail.Dtos.requests.SendEmailRequest;
import com.example.backendemail.entities.EmailTemplate;
import com.example.backendemail.repositroy.EmailRepository;

import jakarta.activation.DataHandler;
import jakarta.mail.BodyPart;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.util.Arrays;

@Service
public class EmailServiceImpl implements IEmailService{

    public EmailServiceImpl(EmailRepository emailRepository, JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.emailRepository = emailRepository;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    final private EmailRepository emailRepository;
    final private JavaMailSender mailSender;
    final private TemplateEngine templateEngine;
    @Value("UTF_8_ENCODING")
    private String UTF_8_ENCODING;

    @Value("EMAIL_TEMPLATE")
    private String EMAIL_TEMPLATE;

    @Value("TEXT_HTML_ENCODING")
    private String TEXT_HTML_ENCODING;
    @Override
    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) {
        return emailRepository.save(emailTemplate);
    }

    @Override
    public void sendEmailNotification(SendEmailRequest sendEmailRequest) {
        EmailTemplate emailTemplate=emailRepository.findById(sendEmailRequest.getIdTemplate()).orElseThrow();
        MimeMessage message=mailSender.createMimeMessage();

        try{

            MimeMessageHelper mimeMessageHelper=new MimeMessageHelper(message,true ,"UTF-8");
            mimeMessageHelper.setFrom("code&chill@gmail.com");
            mimeMessageHelper.setSubject(emailTemplate.getSubject());
            String[] recipients = Arrays.stream(sendEmailRequest.getRecipients())
                    .map(email -> email.replaceAll("[\\[\\]]", "").trim())
                    .toArray(String[]::new);
            mimeMessageHelper.setTo(recipients);
            MimeMultipart mimeMultipart=new MimeMultipart("related");
            addHtmlContentToEmail(mimeMultipart,emailTemplate.getContent());
            if(sendEmailRequest.getAttachment() !=null && !sendEmailRequest.getAttachment().isEmpty()){
                addAttachment(sendEmailRequest.getAttachment(),mimeMultipart);
            }
            message.setContent(mimeMultipart);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void addHtmlContentToEmail(MimeMultipart mimeMultipart,String content) throws MessagingException {
        Context context=new Context();
        context.setVariable("template",content);
        String text = templateEngine.process("HtmlTemplateStandards",context);
        BodyPart messageBodyPart=new MimeBodyPart();
        messageBodyPart.setContent(text,"text/html");
        mimeMultipart.addBodyPart(messageBodyPart);
    }

    public void addAttachment(MultipartFile attachment,MimeMultipart mimeMultipart) throws IOException, MessagingException {
        String attachmentFileName=attachment.getOriginalFilename();
        byte[] attachmentBytes= attachment.getBytes();
        String attachmentContentType=attachment.getContentType();
        BodyPart attachmentBodyPart=new MimeBodyPart();
        attachmentBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(attachmentBytes,attachmentContentType)));
        attachmentBodyPart.setFileName(attachmentFileName);
        mimeMultipart.addBodyPart(attachmentBodyPart);
    }


}
