package com.spring.printFlow.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.printFlow.models.Sales;
import com.spring.printFlow.services.reportServices;

@RestController
@RequestMapping("/api/reports")
public class SalesController {

    @Autowired
    private static final Logger LOGGER = LoggerFactory.getLogger(reportServices.class);

    private final reportServices reportServices;

    public SalesController(reportServices reportServices) {
        this.reportServices = reportServices;
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

    
}
