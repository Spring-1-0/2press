package com.spring.printFlow.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customers")
public class Customers {
   @Id
   private String _id;
   private String name;
   private String tel;
   private String refId;
   private String fileUrl;
   private Date createdAt;

   public Customers() {

   }

   public Customers(String name, String tel, String refId) {
      this.name = name;
      this.tel = tel;
      this.refId = refId;
      this.fileUrl = "https://cdn-icons-png.flaticon.com/256/149/149071.png";
      this.createdAt = new Date();
   }

   public String getId() {
      return _id;
   }

   public void setid(String _id) {
      this._id = _id;
   }

   public String getrefId() {
      return this.refId;
   }

   public void setfefId(String refId) {
      this.refId = refId;
   }

   public String getname() {
      return this.name;
   }

   public void setname(String name) {
      this.name = name;
   }

   public String getTel() {
      return tel;
   }

   public void setTel(String tel) {
      this.tel = tel;
   }

   public Date getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(Date createdAt) {
      this.createdAt = createdAt;
   }

   public String getFileUrl() {
      return fileUrl;
   }

   public String setFileUrl(String fileUrl) {
      return this.fileUrl = fileUrl;
   }

}