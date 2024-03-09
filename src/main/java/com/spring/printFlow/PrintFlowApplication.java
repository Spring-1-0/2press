package com.spring.printFlow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan("com.spring.printFlow.controllers")
@SpringBootApplication
public class PrintFlowApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrintFlowApplication.class, args);
	}

}
