package org.example.backend.security;


import jdk.jshell.Snippet;
import lombok.Builder;

@Builder
public record AppUser(String id,
                      String username,
                      String role) {

}
