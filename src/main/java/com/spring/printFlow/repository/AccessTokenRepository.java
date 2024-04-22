package com.spring.printFlow.repository;
import com.spring.printFlow.models.AccessToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface AccessTokenRepository extends MongoRepository<AccessToken, String> {

    
    void deleteByUser(String user); 
    AccessToken findByUser(String user);

}