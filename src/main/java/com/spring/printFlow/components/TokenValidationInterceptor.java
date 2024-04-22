package com.spring.printFlow.components;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.spring.printFlow.controllers.ValidationController;
import com.spring.printFlow.services.tokenService;
import com.spring.printFlow.services.userService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.spring.printFlow.models.AccessToken;

@Component
public class TokenValidationInterceptor implements HandlerInterceptor {
    private static final Logger LOGGER = LoggerFactory.getLogger(TokenValidationInterceptor.class);
    @Autowired
    private tokenService tokenService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        String[] parts = authorizationHeader.split("\\|");
        // Check if the array has at least two parts
        if (parts.length < 2) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        String user = parts[0].substring(7);
        String token = parts[1];

        AccessToken hashedToken = this.tokenService.getAccessTokenByUser(user);
        String hashToken = hashedToken.gettoken();
        Boolean validate = ValidationController.checkToken(token, hashToken);
        if (!validate) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        return true;
    }
}