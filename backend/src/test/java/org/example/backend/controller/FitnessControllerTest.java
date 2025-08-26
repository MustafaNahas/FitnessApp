package org.example.backend.controller;

import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.example.backend.service.FitnessService;
import org.example.backend.service.IdService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureMockRestServiceServer;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "app.url=http://localhost")
@AutoConfigureMockMvc
@AutoConfigureMockRestServiceServer

class FitnessControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private FitnessRepo repo;
    @Autowired
    private FitnessService service;

//changes
    Workout dummy = new Workout("1", "Max", "Running", null, null, null, null, null);
    Workout dummy2 = new Workout("2", "Max","Lifting", "Description text2", null, null, null, 20.0);


    @BeforeEach
    void cleanDb() {
        repo.deleteAll();
    }

    @Test
    @DirtiesContext
    @WithMockUser
    void getAllWorkouts() throws Exception {
        // given
        repo.save(dummy);
        repo.save(dummy2);

        // when + then
        Map<String, Object> attributes = Map.of("login", "Max");
        OAuth2User oAuth2User = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "login"
        );

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(oAuth2User, "token", oAuth2User.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @DirtiesContext
    @WithMockUser
    void getWorkoutById() throws Exception {
        // given
        repo.save(dummy);

        // when + then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                  {
                    id : "1",
                    userName : "Max",
                    workoutName: "Running",
                    description: null,
                    "date": null,
                    "startTime": null,
                    "favorite": null,
                    "duration": null
                  }
                """));
    }

    @Test
    @DirtiesContext
    @WithMockUser
    void deleteWorkout_existingId_returns204() throws Exception {
        // given
        repo.save(dummy);

        // when + then
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workouts/{id}", "1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DirtiesContext
    @WithMockUser
    void deleteWorkout_nonExistingId_returns404() throws Exception {
        // when + then
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workouts/{id}", "doesNotExist"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DirtiesContext
    @WithMockUser
    void updateWorkout_existingId_returnsUpdatedWorkout() throws Exception {
        // given
        repo.save(dummy);

        // when + then
        mockMvc.perform(MockMvcRequestBuilders.put("/api/workouts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                {
                    "id": "1",
                    "userName" : "Max",
                    "workoutName": "Updated workout",
                    "description": "Updated description",
                    "date": null,
                    "startTime": null,
                    "favorite": false,
                    "duration": null
                }
"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.workoutName").value("Updated workout"));
    }

    @Test
    void updateWorkout_nonExistingId_returns404() throws Exception {
        // when + then
        mockMvc.perform(MockMvcRequestBuilders.put("/api/workouts/nonExisting")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                {
                    "id": "nonExisting",
                    "description": "Updated description",
                    "workoutName": "Updated workout"
                }
                """))
                .andExpect(status().isNotFound());
    }

    @MockitoBean
    private IdService idService;
    @Test
    void addWorkout() throws Exception {
        when(idService.generateId()).thenReturn("1");
        // when + then

        mockMvc.perform(MockMvcRequestBuilders.post("/api/workouts")
                        .contentType("application/json")
                        .content(
                            """
                            {
                              "description": "Description text",
                              "workoutName": "Running"
                            }
                            """
                        ))
                .andExpect(status().isCreated())
                .andExpect(content().json("""
                  {
                    id: "1",
                    description: "Description text",
                    workoutName: "Running"
                  }
                """));

    }
}
