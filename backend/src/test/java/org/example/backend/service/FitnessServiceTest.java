package org.example.backend.service;

import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FitnessServiceTest {

    Workout dummy = new Workout("1", "Description text", "Running");
    Workout dummy2 = new Workout("2", "Description text2", "Lifting");
    List<Workout> dummyWorkouts = List.of(dummy, dummy2);

    @Test
    void getAllWorkouts() {
        // Arrange
        FitnessRepo mockRepo = mock(FitnessRepo.class);
        FitnessService fitnessService = new FitnessService(mockRepo);

        when(mockRepo.findAll()).thenReturn(dummyWorkouts);

        // Act
        List<Workout> workouts = fitnessService.getAllWorkouts();

        // Assert
        assertEquals(2, workouts.size());
        assertEquals(dummy, workouts.getFirst());
    }

    @Test
    void deleteWorkoutById_whenExists_deletesSuccessfully() {
        // Arrange
        FitnessRepo mockRepo = mock(FitnessRepo.class);
        FitnessService fitnessService = new FitnessService(mockRepo);

        String id = "1";
        when(mockRepo.existsById(id)).thenReturn(true);

        // Act
        fitnessService.deleteWorkoutById(id);

        // Assert
        verify(mockRepo, times(1)).deleteById(id);
    }

    @Test
    void deleteWorkoutById_whenNotExists_throwsException() {
        // Arrange
        FitnessRepo mockRepo = mock(FitnessRepo.class);
        FitnessService fitnessService = new FitnessService(mockRepo);

        String id = "99";
        when(mockRepo.existsById(id)).thenReturn(false);

        // Act + Assert
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> fitnessService.deleteWorkoutById(id)
        );

        assertTrue(ex.getMessage().contains("Workout not found"));
        verify(mockRepo, never()).deleteById(anyString());
    }
}
