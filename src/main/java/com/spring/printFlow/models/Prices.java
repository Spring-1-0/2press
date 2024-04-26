package com.spring.printFlow.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "prices")
public class Prices {
    @Id
    private String _id;
    private Date createdAt;
    private String typeId;
    private Float price;
    private String color;
    private String type;

    public Prices(String typeId, Float price, String color, String type) {
        this.typeId = typeId;
        this.price = price;
        this.color = color;
        this.type = type;
        this.createdAt = new Date();
    }

    public String getId() {
        return _id;
    }

    public void setid(String _id) {
        this._id = _id;
    }

    public Float getPrice() {
        return price;
    }

    public Float setPrice(Float price) {
        return this.price = price;
    }

    public String getColor() {
        return color;
    }

    public String setColor(String color) {
        return color;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }




}