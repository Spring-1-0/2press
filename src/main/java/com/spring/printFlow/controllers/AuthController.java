package com.spring.printFlow.controllers;

import java.util.Date;
import java.util.Optional;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
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

import com.spring.printFlow.models.AccessToken;
import com.spring.printFlow.models.User;
import com.spring.printFlow.services.tokenService;
import com.spring.printFlow.services.userService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/users")
public class AuthController {
    @Autowired
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private final userService userService;
    @Autowired
    private final tokenService tokenService;

    public AuthController(userService userService, tokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;

    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(
            @RequestParam("password") String password,
            @RequestParam("usermail") String usermail) {

        try {

            // Check if any of the required parameters are empty
            if (StringUtils.isAnyBlank(password, usermail)) {
                return ResponseEntity.badRequest().body("Invalid input. Please provide all required fields.");
            }

            // Check if the user with the given usermail exists
            User existingUserOptional = userService.getUserByUsermail(usermail);

            if (existingUserOptional != null) {

                // get hashed password
                String hashedPassword = existingUserOptional.getPassword();

                LOGGER.info("Controller: Auth  logginin hashed pass: " + hashedPassword + " pure password " + password);

                // check password match // true or false
                boolean isPasswordCorrect = ValidationController.checkPassword(password, hashedPassword);

                if (isPasswordCorrect) {
                    existingUserOptional.setLastVisit(new Date()); // Set the updatedAt field to
                    // the current date
                    tokenService.deleteAccessTokenByUser(existingUserOptional.getId());

                    String token = Random();
                    String hashedToken = ValidationController.hashToken(token);
                    AccessToken accessToken = new AccessToken(existingUserOptional.getUsermail(), hashedToken,
                            existingUserOptional.getId());
                    tokenService.createAccessToken(accessToken);
                    // Map<String, Object> responseBody = new HashMap<>();
                    // responseBody.put("name", "your_name");
                    // responseBody.put("token", token);

                    // Return ResponseEntity with the Map as the body
                    return ResponseEntity.ok().body(existingUserOptional.getId() + "|" + token);

                } else {

                    return ResponseEntity.badRequest().body("Password is incorrect");

                }

            } else {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not exist");

            }

        } catch (Exception error) {
            // Handle or log the exception
            error.printStackTrace();
            LOGGER.error("Error logging in user: {}", error.getMessage(), error);

            // Return an error response with a message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened logging in user, Please try again");
        }

    }

    private String Random() {
        return RandomStringUtils.randomAlphanumeric(40);
    }

    @PostMapping("logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        try {

            String authorizationHeader = request.getHeader("Authorization");
            String[] parts = authorizationHeader.split("\\|");
            String user = parts[0].substring(7);
            tokenService.deleteAccessTokenByUser(user);
            return ResponseEntity.ok().body("Account logged out successfully..");

        } catch (Exception error) {

            error.printStackTrace();
            LOGGER.error("Error logging out user: {}", error.getMessage(), error);

            // Return an error response with a message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened logging in user, Please try again");

        }

    }

    @GetMapping("/token-exchange")
    protected ResponseEntity<?> tokenExchange(HttpServletRequest request, HttpServletResponse response) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            String[] parts = authorizationHeader.split("\\|");
            String user = parts[0].substring(7);
            AccessToken tokenUser = this.tokenService.getAccessTokenByUser(user);
            Optional<User> existingUserOptional = userService.findById(tokenUser.getuser());

            return ResponseEntity.ok().body(existingUserOptional);

        } catch (Exception error) {
            error.printStackTrace();
            LOGGER.error("Error logging out user: {}", error.getMessage(), error);

            // Return an error response with a message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something happened logging in user, Please try again");

        }
    }
}