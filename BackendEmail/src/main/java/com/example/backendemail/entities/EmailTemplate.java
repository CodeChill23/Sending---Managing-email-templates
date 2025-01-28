package com.example.backendemail.entities;

import jakarta.persistence.*;


@Entity

public class EmailTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public EmailTemplate() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public EmailTemplate(Long id, String name, String subject, String content) {
        this.id = id;
        this.name = name;
        this.subject = subject;
        this.content = content;
    }

    private String subject;
    @Column(columnDefinition = "TEXT")
    private String content;
}
