package org.example.backend.service;

import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FitnessServiceTest {
    Workout dummy=new Workout("1","Description text","Running");
    Workout dummy2=new Workout("2","Description text2","Lifting");
    List<Workout> dummyWorkouts=List.of(dummy,dummy2);
    @Test
    void getAllWorkouts() {
        FitnessRepo mockRepo=mock(FitnessRepo.class);
        FitnessService fitnessService=new FitnessService(mockRepo);

        when(mockRepo.findAll()).thenReturn(dummyWorkouts);
        List<Workout> workouts= fitnessService.getAllWorkouts();
        assertEquals(2,workouts.size());
        assertEquals(dummy,workouts.getFirst());
    }
}