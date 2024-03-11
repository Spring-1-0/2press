package com.spring.printFlow.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.printFlow.models.Sales;
import com.spring.printFlow.repository.SalesRepository;

@Service
public class reportServices {

   @Autowired

   private final SalesRepository SalesRepository;

   private static final Logger LOGGER = LoggerFactory.getLogger(reportServices.class);

   // create instance of the user repository
   public reportServices(
         SalesRepository SalesRepository) {
      this.SalesRepository = SalesRepository;

   }

   // fetch all services
   public List<Sales> getAllSales() {
      LOGGER.info("services : fetch all users..");
      return SalesRepository.findAll();
   }

}
