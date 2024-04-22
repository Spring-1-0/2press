package com.spring.printFlow.services;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.printFlow.models.ActionTypes;
import com.spring.printFlow.models.Customers;
import com.spring.printFlow.models.Feedback;
import com.spring.printFlow.models.File;
import com.spring.printFlow.repository.ActionTypesRepository;
import com.spring.printFlow.repository.CustomersFilesRepository;
import com.spring.printFlow.repository.CustomersRepository;
import com.spring.printFlow.repository.FeedBackRepository;

@Service
public class customerServices {

   @Autowired

   private final CustomersRepository CustomersRepository;
   private final CustomersFilesRepository CustomersFilesRepository;
   private final ActionTypesRepository ActionTypesRepository;
   private final FeedBackRepository FeedBackRepository;

   private static final Logger LOGGER = LoggerFactory.getLogger(customerServices.class);

   // create instance of the user repository
   public customerServices(
         CustomersRepository CustomersRepository,
         CustomersFilesRepository CustomersFilesRepository,
         ActionTypesRepository ActionTypesRepository,
         FeedBackRepository FeedBackRepository) {
      this.CustomersRepository = CustomersRepository;
      this.CustomersFilesRepository = CustomersFilesRepository;
      this.ActionTypesRepository = ActionTypesRepository;
      this.FeedBackRepository = FeedBackRepository;
   }

   public File saveFile(File file) {
      return CustomersFilesRepository.save(file);
   }

   public Boolean updateFileStatusById(String id, String status) {
      Optional<File> optionalFile = CustomersFilesRepository.findById(id);

      if (optionalFile.isPresent()) {
          File file = optionalFile.get();
          file.setStatus(status);
          CustomersFilesRepository.save(file);
          return true; // Return true to indicate successful update
      } else {
          return false; // Return false to indicate that the file with the given ID was not found
      }
  }

   // fetch all services
   public List<Customers> getAllCustomers() {
      LOGGER.info("services : fetch all users..");
      return CustomersRepository.findAll();
   }

   public List<File> getAllCustomerFiles() {
      return CustomersFilesRepository.findAll();
   }

   public Optional<Customers> findById(String _id) {
      return CustomersRepository.findById(_id);
   }

   /**
    * 
    * @param refId
    * @return
    */
   public List<File> findByCusRefId(String refId) {
      return CustomersFilesRepository.findByCusRefId(refId);
   }

   // fetch all ActionTypes
   /***
    * get all ActionTypes
    * 
    * @return
    */
   public List<ActionTypes> getAllActionTypes() {
      LOGGER.info("services : fetch all action types..");
      return ActionTypesRepository.findAll();
   }

   /**
    * save customer files and credentials
    * 
    * @param request
    */

   public Customers saveCustomer(Customers customer) {
      return CustomersRepository.save(customer);
   }

   public void deleteById(String _id) {
      CustomersRepository.deleteById(_id);
   }

   public void deleteByCusRefId(String refId) {
      CustomersFilesRepository.deleteByCusRefId(refId);
   }

   public Feedback saveFeedback(Feedback feedback) {
      return FeedBackRepository.save(feedback);
   }

   public List<Feedback> getAllFeedback() {
      return FeedBackRepository.findAll();
   }

   public void deleteFeedbackById(String _id) {
      FeedBackRepository.deleteById(_id);
   }

}
