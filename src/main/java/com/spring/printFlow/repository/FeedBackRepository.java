package com.spring.printFlow.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.spring.printFlow.models.Feedback;
public interface FeedBackRepository extends MongoRepository<Feedback, String>  {
   
}
