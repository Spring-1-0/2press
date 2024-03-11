package com.spring.printFlow.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.spring.printFlow.models.Sales;
public interface SalesRepository extends MongoRepository<Sales, String>  {
   
}
