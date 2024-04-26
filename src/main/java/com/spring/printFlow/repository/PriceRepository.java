package com.spring.printFlow.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.spring.printFlow.models.Prices;

import java.util.List;
import java.util.Optional;
public interface PriceRepository extends MongoRepository<Prices, String>   {

    void deleteByTypeId( String _id);

    List<Prices> findByTypeId(String typeId);

    Optional<Prices> findByType(String type);

    List<Prices> findByColor(String color);
    

}
