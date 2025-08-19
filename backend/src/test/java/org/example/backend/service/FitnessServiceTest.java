package org.example.backend.service;

import org.example.backend.exception.NotFoundException;
import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FitnessServiceTest {

    @Mock
    FitnessRepo fitnessRepo;
    @InjectMocks
    FitnessService fitnessService;

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

    @Test
    void getWorkoutById_whenValidId_ThenReturnWorkout() {
        // Given
        String id = "1";
        Workout expectedWorkout = new Workout(id, "Description text", "Running");
        when(fitnessRepo.findById(id)).thenReturn(Optional.of(expectedWorkout));

        // When
        Workout actualWorkout = fitnessService.getWorkoutById(id);

        // Then
        assertEquals(expectedWorkout, actualWorkout);
        verify(fitnessRepo).findById(id);
    }

    @Test
    void getWorkoutById_whenInvalidId_ThenThrowException() {
        // Given
        String id = "1";
        when(fitnessRepo.findById(id)).thenReturn(Optional.empty());

        // When + Then
        assertThrows(NotFoundException.class,
                () -> fitnessService.getWorkoutById(id));


        verify(fitnessRepo).findById(id);
    }
    @Test
    void deleteWorkoutById_whenExists_deletes() {
        String id = "1";
        when(fitnessRepo.existsById(id)).thenReturn(true);

        fitnessService.deleteWorkoutById(id);

        verify(fitnessRepo).deleteById(id);
    }

    @Test
    void deleteWorkoutById_whenNotExists_throws() {
        String id = "doesNotExist";
        when(fitnessRepo.existsById(id)).thenReturn(false);

        assertThrows(NotFoundException.class,
                () -> fitnessService.deleteWorkoutById(id));
        verify(fitnessRepo, never()).deleteById(anyString());
    }



}