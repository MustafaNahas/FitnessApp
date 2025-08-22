package org.example.backend.controller;

import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.example.backend.service.IdService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureMockRestServiceServer;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureMockRestServiceServer
class FitnessControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private FitnessRepo repo;


    Workout dummy = new Workout("1", "Running", null, null, null, null, null);
    Workout dummy2 = new Workout("2", "Lifting", "Description text2", null, null, null, 20.0);


    @BeforeEach
    void cleanDb() {
        repo.deleteAll();
    }

    @Test
    void getAllWorkouts() throws Exception {
        // given
        repo.save(dummy);
        repo.save(dummy2);

        // when + then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.id=='1')].workoutName").exists())
                .andExpect(jsonPath("$[?(@.id=='2')].workoutName").exists());
    }

    @Test
    void getWorkoutById() throws Exception {
        // given
        repo.save(dummy);

        // when + then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                  {
                    id : "1",
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
    void deleteWorkout_existingId_returns204() throws Exception {
        // given
        repo.save(dummy);

        // when + then
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workouts/{id}", "1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteWorkout_nonExistingId_returns404() throws Exception {
        // when + then
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workouts/{id}", "doesNotExist"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateWorkout_existingId_returnsUpdatedWorkout() throws Exception {
        // given
        repo.save(dummy);

        // when + then
        mockMvc.perform(MockMvcRequestBuilders.put("/api/workouts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                {
                    "id": "1",
                    "workoutName": "Running",
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
