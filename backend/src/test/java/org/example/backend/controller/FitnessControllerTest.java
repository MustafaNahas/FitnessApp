package org.example.backend.controller;

import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureMockRestServiceServer;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureMockRestServiceServer
class FitnessControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private FitnessRepo repo;

    Workout dummy=new Workout("1","Description text","Running");

    @Test
    @DirtiesContext
    void getAllWorkouts() throws Exception {
//        given
        repo.save(dummy);
//        when
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts"))
//                then
                .andExpect(status().isOk())
                .andExpect(content().json(
                """
                    [
                       {
                         id: "1",
                         description: "Description text",
                         workoutName: "Running"
                       },
                        {
                         id: "2",
                         description: "Description text2",
                         workoutName: "Lifting"
                       }
                    ]
                """
                ));
    }

    @Test
    void getWorkoutById() throws Exception {
        repo.save(dummy);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workouts/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                  {
                    id : "1",
                    description: "Description text",
                    workoutName: "Running"
                  }
                """));
    }
}