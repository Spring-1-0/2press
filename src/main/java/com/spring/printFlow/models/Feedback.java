package com.spring.printFlow.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "feedbacks")

public class Feedback {
   @Id
   private String _id;
   private String name;
   private String message;
   private Date createdAt;
   private String fileUrl;

   public Feedback(String name, String message) {
      this.name = name;
      this.message = message;
      this.fileUrl = "1707729273805_Screenshot 2023-11-19 171047.png";
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
