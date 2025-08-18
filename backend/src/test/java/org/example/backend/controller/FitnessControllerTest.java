package org.example.backend.controller;

import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FitnessControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FitnessRepo repo;

    Workout dummy = new Workout("1", "Description text", "Running");

    @BeforeEach
    void setup() {
        repo.deleteAll();
    }

    @Test
    void getAllWorkouts_returnsList() throws Exception {
        repo.save(dummy);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].description").value("Description text"))
                .andExpect(jsonPath("$[0].workoutName").value("Running"));
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
}
