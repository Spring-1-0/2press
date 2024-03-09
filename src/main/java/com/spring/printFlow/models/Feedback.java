package com.spring.printFlow.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

@Document(collection = "feedbacks")

public class Feedback {
   @Id
   private String _id;
   private String name;
   private String message;
   @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS")
   private Date createdAt;
   private String fileUrl;

   public Feedback(String name, String message) {
      this.name = name;
      this.message = message;
      this.fileUrl = "1709998590328_avatar-wrap.png";
      this.createdAt = new Date();
   }

   public String getname() {
      return name;
   }

   public void setname(String name) {
      this.name = name;
   }

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }

   public String getFileUrl() {
      return fileUrl;
   }

   public String setFileUrl(String fileUrl) {
      return this.fileUrl = fileUrl;
   }

   public Date getCreatedAt() {
      return createdAt;
   }

   public void setCreated_at(Date createdAt) {
      this.createdAt = createdAt;
   }
}
