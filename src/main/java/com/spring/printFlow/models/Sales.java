package com.spring.printFlow.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sales")
public class Sales {
   @Id
   private String _id;
   private String status;
   private Double amount;
   private String activity;
   private String customer;
   private Date createdAt;
   private Date operatedAt;
   private String cusRefId;

   public Sales() {

   }

   public Sales(String status, String activity, Double amount, String customer ,String cusRefId) {
      this.status = status;
      this.activity = activity;
      this.amount = amount;
      this.customer = customer;
      this.createdAt = new Date();
      this.operatedAt = new Date();
      this.cusRefId = cusRefId;
   }

   public String getId() {
      return _id;
   }

   public void setid(String _id) {
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

   public void setCreatedAt(Date createdAt) {
      this.createdAt = createdAt;
   }

   public String getActivity() {
      return activity;
   }


   public String getcusRefId() {
      return cusRefId;
   }

   public void setfefId(String cusRefId) {
      this.cusRefId = cusRefId;
   }

   public void setActivity(String activity) {
      this.activity = activity;
   }

   public String getCustomer() {
      return customer;
   }

   public void setCustomer(String customer) {
      this.customer = customer;
   }

   public Double getamount() {
      return amount;
   }

   public Double setamount(Double amount) {
      return this.amount = amount;
   }

}