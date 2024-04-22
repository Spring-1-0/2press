package com.spring.printFlow.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Calendar;
import java.util.Date;
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
      return SalesRepository.findAll();
   }

   public float getSumOfTodaysSales() {
      // Get today's date
      Date today = new Date();

      // Get today's sales
      List<Sales> todaysSales = SalesRepository.findAll().stream()
              .filter(sale -> this.isSuccessful(sale) && isSameDay(sale.getCreatedAt(), today))
              .collect(Collectors.toList());

      // Calculate sum of amounts
      float sum = 0.0f;
      for (Sales sale : todaysSales) {
          sum += sale.getamount();
      }
      return sum;
  }

   public Sales saveSales(Sales sale) {
      return SalesRepository.save(sale);
   }

   public void deleteSales(String id) {
      SalesRepository.deleteById(id);
   }

   public void deleteAllSales() {
      SalesRepository.deleteAll();
   }
   

     // Helper method to check if two dates are the same day
  private boolean isSameDay(Date date1, Date date2) {
   Calendar cal1 = Calendar.getInstance();
   Calendar cal2 = Calendar.getInstance();
   cal1.setTime(date1);
   cal2.setTime(date2);
   return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
           cal1.get(Calendar.MONTH) == cal2.get(Calendar.MONTH) &&
           cal1.get(Calendar.DAY_OF_MONTH) == cal2.get(Calendar.DAY_OF_MONTH);
}

public float getSumOfSuccessfulSales() {
   // Get today's date
   Date today = new Date();

   // Get the start of the week (Monday)
   Calendar startOfWeek = Calendar.getInstance();
   startOfWeek.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
   startOfWeek.set(Calendar.HOUR_OF_DAY, 0);
   startOfWeek.set(Calendar.MINUTE, 0);
   startOfWeek.set(Calendar.SECOND, 0);
   startOfWeek.set(Calendar.MILLISECOND, 0);

   // Get successful sales from Monday to today (inclusive)
   List<Sales> successfulSales = SalesRepository.findAll().stream()
           .filter(sale -> isSuccessful(sale) && isInRange(sale.getCreatedAt(), startOfWeek.getTime(), today))
           .collect(Collectors.toList());

   // Calculate sum of amounts
   float sum = 0.0f;
   for (Sales sale : successfulSales) {
       sum += sale.getamount();
   }
   return sum;
}


public Float getAllSuccessfulSales() {
   List<Sales> successfulSales = SalesRepository.findAll().stream()
   .filter(sale -> isSuccessful(sale))
   .collect(Collectors.toList());

// Calculate sum of amounts
float sum = 0.0f;
for (Sales sale : successfulSales) {
sum += sale.getamount();
}
return sum;
}


public Float getAllFailedAndPendingSales() {
   List<Sales> successfulSales = SalesRepository.findAll().stream()
   .filter(sale -> !isSuccessful(sale))
   .collect(Collectors.toList());

// Calculate sum of amounts
float sum = 0.0f;
for (Sales sale : successfulSales) {
sum += sale.getamount();
}
return sum;
}

private boolean isSuccessful(Sales sale) {
   return sale.getStatus().equals("successful");
}

private boolean isInRange(Date date, Date start, Date end) {
   return !date.before(start) && !date.after(end);
}

public boolean updateSalesStatusByCusRefId(String cusRefId, String status) {
   Optional<Sales> optionalSale = SalesRepository.findByCusRefId(cusRefId);
   if (optionalSale.isPresent()) { 
       Sales sale = optionalSale.get(); 
       sale.setStatus(status);  
       SalesRepository.save(sale);
       return true;
   } else {
       return false; 
   }
}

}