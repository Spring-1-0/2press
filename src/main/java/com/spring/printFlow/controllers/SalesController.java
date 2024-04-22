package com.spring.printFlow.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.spring.printFlow.services.customerServices;

import com.spring.printFlow.models.Sales;
import com.spring.printFlow.services.reportServices;

@RestController
@RequestMapping("/api/reports")
public class SalesController {

    @Autowired
    private static final Logger LOGGER = LoggerFactory.getLogger(reportServices.class);

    private final reportServices reportServices;
    private final customerServices customerServices;


    public SalesController(reportServices reportServices,customerServices customerServices) {
        this.reportServices = reportServices;
        this.customerServices = customerServices;

    }

    @GetMapping("/sales")
    public ResponseEntity<?> getAllSales() {
        try {
            List<Sales> users = reportServices.getAllSales();
            return ResponseEntity.ok().body(users);
        } catch (Exception error) {
            // Return an error response with a message
            error.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened  fetching sales: ");

        }
    }

    @GetMapping("/sales/today")
    public ResponseEntity<?> getAllTodaysSales() {
        try {
            Float amount = reportServices.getSumOfTodaysSales();
            return ResponseEntity.ok().body(amount);
        } catch (Exception error) {
            // Return an error response with a message
            error.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened  fetching sales: ");

        }
    }


    @GetMapping("/sales/week")
    public ResponseEntity<?> getAllThisWeeksSales() {
        try {
            Float amount = reportServices.getSumOfSuccessfulSales();
            return ResponseEntity.ok().body(amount);
        } catch (Exception error) {
            // Return an error response with a message
            error.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened  fetching sales: ");

        }
    }


    @GetMapping("/sales/pending-and-failed")
    public ResponseEntity<?> getAllFailedAndPendingSales() {
        try {
            Float amount = reportServices.getAllFailedAndPendingSales();
            return ResponseEntity.ok().body(amount);
        } catch (Exception error) {
            // Return an error response with a message
            error.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened  fetching sales: ");

        }
    }


    @GetMapping("/sales/total")
    public ResponseEntity<?> getAllSuccessfulSales() {
        try {
            Float amount = reportServices.getAllSuccessfulSales();
            return ResponseEntity.ok().body(amount);
        } catch (Exception error) {
            // Return an error response with a message
            error.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened  fetching sales: ");

        }
    }


    @PostMapping("/sales/update-status")
    public ResponseEntity<?> updateSalesStatus(
    @RequestParam("_id") String _id, 
    @RequestParam("status") String status 
    ,@RequestParam("cusRefId") String cusRefId) {
 
       try {
         boolean sales = this.reportServices.updateSalesStatusByCusRefId(cusRefId, status);
         boolean file = this.customerServices.updateFileStatusById(_id, status);

          if(sales && file){
            return ResponseEntity.ok().body("sales updated succefully");
          }else{
            return ResponseEntity.ok().body("sales update was notsuccefully , please try again");
          }
         
       } catch (Exception error) {
          error.printStackTrace();
          LOGGER.error( error.getMessage(), error);
          // Return a generic error response
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error confirming sales");
       }
    }



    
}
