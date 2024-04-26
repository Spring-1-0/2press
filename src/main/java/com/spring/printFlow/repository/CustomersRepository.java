package com.spring.printFlow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.spring.printFlow.models.Customers;

public interface CustomersRepository extends MongoRepository<Customers, String> {


    Optional<Customers> findByRefId(String refId);

}
