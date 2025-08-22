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

import java.time.LocalDateTime;

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

    private final LocalDateTime t1 = LocalDateTime.of(2025, 8, 19, 7, 13, 43);
    private final LocalDateTime t2 = LocalDateTime.of(2025, 8, 20, 9, 0, 0);

    Workout dummy  = new Workout("1", "Description text",  "Running",  t1);
    Workout dummy2 = new Workout("2", "Description text2", "Lifting",  t2);

    @BeforeEach
    void cleanDb() {
        repo.deleteAll();
    }

    @Test
    void getAllWorkouts() throws Exception {
        repo.save(dummy);
        repo.save(dummy2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.id=='1')].workoutName").exists())
                .andExpect(jsonPath("$[?(@.id=='2')].workoutName").exists());
    }

    @Test
    void getWorkoutById() throws Exception {
        repo.save(dummy);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                  {
                    "id" : "1",
                    "description": "Description text",
                    "workoutName": "Running"
                  }
                """, false));
    }

    @Test
    void deleteWorkout_existingId_returns204() throws Exception {
        repo.save(dummy);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workouts/{id}", "1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteWorkout_nonExistingId_returns404() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workouts/{id}", "doesNotExist"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateWorkout_existingId_returnsUpdatedWorkout() throws Exception {
        repo.save(dummy);

        mockMvc.perform(
                        MockMvcRequestBuilders.put("/api/workouts/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                    {
                                      "id": "1",
                                      "description": "Updated description",
                                      "workoutName": "Updated workout"
                                    }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.workoutName").value("Updated workout"));
    }

    @Test
    void updateWorkout_nonExistingId_returns404() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.put("/api/workouts/nonExisting")
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

        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/workouts")
                                .contentType(MediaType.APPLICATION_JSON_VALUE)
                                .content("""
                                    {
                                      "description": "Description text",
                                      "workoutName": "Running"
                                    }
                                """))
                .andExpect(status().isCreated())
                .andExpect(content().json("""
                  {
                    "id": "1",
                    "description": "Description text",
                    "workoutName": "Running"
                  }
                """, false));
    }

    @Test
    void getWorkoutsInRange_whenWithinRange_returnsResults() throws Exception {
        repo.save(dummy);
        repo.save(dummy2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts/filter")
                        .param("from", "2025-08-19T00:00:00")
                        .param("to", "2025-08-19T23:59:59"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    void getWorkoutsInRange_whenNoResults_returnsEmptyList() throws Exception {
        repo.save(dummy);
        repo.save(dummy2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts/filter")
                        .param("from", "2025-08-21T00:00:00")
                        .param("to", "2025-08-22T00:00:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
