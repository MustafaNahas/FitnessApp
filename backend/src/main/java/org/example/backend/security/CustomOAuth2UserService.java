package org.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AppUserRepo appUserRepo;



@Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oauthUser = super.loadUser(userRequest);
        AppUser appUser = appUserRepo.findById(oauthUser.getName())
                .orElseGet(() -> createAndSaveUser(oauthUser));

        return new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(appUser.role())),oauthUser.getAttributes(),"id");
    }

    private AppUser createAndSaveUser(OAuth2User oauthUser) {
        AppUser newUser = AppUser.builder()
                .id(oauthUser.getName())
                .username(oauthUser.getAttribute("login"))
                .role("USER")
                .build();

        return appUserRepo.save(newUser);
    }
}