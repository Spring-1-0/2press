package com.spring.printFlow.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sales")
public class Sales {
   @Id
   private String _id;
   private String status;
   private Float amount;
   private String activity;
   private Date createdAt;
   private Date operatedAt;

   public Sales() {

   }

   public Sales(String status, String activity, Float amount) {
      this.status = status;
      this.activity = activity;
      this.amount = amount;
      this.createdAt = new Date();
      this.operatedAt = new Date();
   }

   public String get_id() {
      return _id;
   }

   public void set_id(String _id) {
      this._id = _id;
   }


   public String getStatus() {
      return status;
   }

   public void setStatus(String status) {
      this.status = status;
   }

   public Date getCreatedAt() {
      return createdAt;
   }

   public void setOperatedAt(Date operatedAt) {
      this.operatedAt = operatedAt;
   }

   public Date getOperatedAt() {
      return operatedAt;
   }

   public void setCreated_at(Date createdAt) {
      this.createdAt = createdAt;
   }

   public String getActivity() {
      return activity;
   }

   public void setActivity(String activity) {
      this.activity = activity;
   }

   public Float getamount() {
      return amount;
   }

   public Float setamount(Float amount) {
      return this.amount = amount;
   }



}