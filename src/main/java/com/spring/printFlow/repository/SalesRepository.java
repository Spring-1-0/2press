package com.spring.printFlow.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.spring.printFlow.models.Sales;
public interface SalesRepository extends MongoRepository<Sales, String>  {

    Optional<Sales> findByCusRefId(String cusRefId);
   
}
