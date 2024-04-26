package com.spring.printFlow.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.spring.printFlow.models.ActionTypes;
public interface ActionTypesRepository extends MongoRepository<ActionTypes, String>  {

    List<ActionTypes> findByName(String name);

   
}
