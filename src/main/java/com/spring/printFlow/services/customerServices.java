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
import com.spring.printFlow.models.Prices;
import com.spring.printFlow.repository.ActionTypesRepository;
import com.spring.printFlow.repository.CustomersFilesRepository;
import com.spring.printFlow.repository.CustomersRepository;
import com.spring.printFlow.repository.FeedBackRepository;
import com.spring.printFlow.repository.PriceRepository;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;

@Service
public class customerServices {

   @Autowired

   private final CustomersRepository CustomersRepository;
   private final CustomersFilesRepository CustomersFilesRepository;
   private final ActionTypesRepository ActionTypesRepository;
   private final FeedBackRepository FeedBackRepository;
   private final PriceRepository priceRepository;

   private static final Logger LOGGER = LoggerFactory.getLogger(customerServices.class);

   // create instance of the user repository
   public customerServices(
         CustomersRepository CustomersRepository,
         CustomersFilesRepository CustomersFilesRepository,
         ActionTypesRepository ActionTypesRepository,
         FeedBackRepository FeedBackRepository,
         PriceRepository priceRepository) {
      this.CustomersRepository = CustomersRepository;
      this.CustomersFilesRepository = CustomersFilesRepository;
      this.ActionTypesRepository = ActionTypesRepository;
      this.FeedBackRepository = FeedBackRepository;
      this.priceRepository = priceRepository;
   }

   public File saveFile(File file) {
      return CustomersFilesRepository.save(file);
   }


   public Boolean updateFileStatusById(String id, String status) {
      Optional<File> optionalFile = CustomersFilesRepository.findById(id);

      if (optionalFile.isPresent()) {
         File file = optionalFile.get();
         String cusRefId = file.getcusRefId();
         Optional<Customers> customers = CustomersRepository.findByRefId(cusRefId);

         if (customers.isPresent()) {
            Customers customer = customers.get();
            String tel = customer.getTel();
            String message = "Hi, " + customer.getname() + "  Your work status has been updated to " + status;

            // Construct the URL for sending the SMS
            String url = "https://apps.mnotify.net/smsapi?key=hP9ShNpROpiDbXWtkPycMbPsr&to=" + tel +
                  "&msg=" + message + "&sender_id=PrintFlow";

            // Make an HTTP GET request to the mNotify API
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
               file.setStatus(status);
               CustomersFilesRepository.save(file);
               return true;
            } else {
               // Failed to send SMS, handle error
               return false;
            }
         } else {
            // Customer not found, handle error
            return false;
         }
      } else {
         // File not found, handle error
         return false;
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


     // fetch all ActionTypes
   /***
    * get all ActionTypes
    * 
    * @return
    */
    public List<ActionTypes> getAllActionTypes() {
      return ActionTypesRepository.findAll();
   }

   public void actionTypeDeleteById(String _id) {
      this.ActionTypesRepository.deleteById(_id);
      this.priceRepository.deleteByTypeId(_id);
   }

   public ActionTypes actionTypeSave(ActionTypes name) {
      return ActionTypesRepository.save(name);
   }

   public List<ActionTypes> findActionTypeByName(String name) {
      return this.ActionTypesRepository.findByName(name);
   }
   
   public Prices savePrice(Prices price) {
      return this.priceRepository.save(price);
   }


   public List<Prices> getAllTypesPrices() {
      return this.priceRepository.findAll();
   }

   public List<Prices> getPricesByTypeId(String typeId) {
      return this.priceRepository.findByTypeId(typeId);
   }

   public List<Prices> getPricesByColor(String type) {
      return this.priceRepository.findByColor(type);
   }

   public void deletePriceById(String _id) {
      this.priceRepository.deleteById(_id);
   }
   /**
    * Finds a list of Prices by the given name.
    *
    * @param  name  the name to search for
    * @return       a list of Prices with the given name
    */
   public Optional<Prices> findByTypeName(String type) {
      return this.priceRepository.findByType(type);
   }
}
