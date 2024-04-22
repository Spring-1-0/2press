package com.spring.printFlow.services;
import com.spring.printFlow.repository.AccessTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.printFlow.models.AccessToken;
@Service
public class tokenService {
    
    @Autowired
    private AccessTokenRepository accessTokenRepository;
    /**
    * Create an access token 
    */
    public AccessToken createAccessToken(AccessToken accessToken) {
        return accessTokenRepository.save(accessToken);
    }

    public void deleteAllAccessTokensById(String _id) {
        accessTokenRepository.deleteById(_id);
    }
    /**
     * Deletes all access tokens associated with a given user.
     *
     * @param  user  the username of the user whose access tokens should be deleted
     */
    public void deleteAccessTokenByUser(String user) {
        accessTokenRepository.deleteByUser(user);
    }

    /**
     * 
     * find token by user
     */
    public AccessToken getAccessTokenByUser(String user) {
        return accessTokenRepository.findByUser(user);
    }
}
