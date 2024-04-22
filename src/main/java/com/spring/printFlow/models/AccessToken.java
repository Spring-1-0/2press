package com.spring.printFlow.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.util.Date;
import java.time.LocalDate;
@Document(collection = "accessToken")
public class AccessToken {
    @Id
    private String _id;
    private String name;
    private String token;
    private String user;
    private Date createdAt;
    private LocalDate expiredAt;

    public AccessToken(String name, String token, String user) {
        this.name = name;
        this.token = token;
        this.user = user;
        this.createdAt = new Date();
        this.expiredAt = LocalDate.now().plusDays(1); 
    }

    public String get_id() {
        return _id;
     }
  
     public void set_id(String _id) {
        this._id = _id;
     }

    public String getname() {
        return name;
    }

    public void setname(String name) {
        this.name = name;
    }

    public String gettoken() {
        return token;
    }

    public void settoken(String token) {
        this.token = token;
    }

    public String getuser() {
        return user;
    }

    public void setuser(String user) {
        this.user = user;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(LocalDate expiredAt) {
        this.expiredAt = expiredAt;
    }
}
