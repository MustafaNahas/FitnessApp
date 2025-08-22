package org.example.backend.service;

import org.example.backend.dto.WorkoutDto;
import org.example.backend.exception.NotFoundException;
import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FitnessServiceTest {

    @Mock
    FitnessRepo fitnessRepo;

    @Mock
    IdService idService;

    @InjectMocks
    FitnessService fitnessService;

    // sample timestamps
    private final LocalDateTime t1 = LocalDateTime.of(2025, 8, 19, 7, 13, 43);
    private final LocalDateTime t2 = LocalDateTime.of(2025, 8, 20, 9, 0, 0);

    // sample data
    Workout dummy  = new Workout("1", "Description text",  "Running",  t1);
    Workout dummy2 = new Workout("2", "Description text2", "Lifting",  t2);

    @Test
    void getAllWorkouts() {
        when(fitnessRepo.findAll()).thenReturn(List.of(dummy, dummy2));

        List<Workout> workouts = fitnessService.getAllWorkouts();

        assertEquals(2, workouts.size());
        assertEquals(dummy, workouts.get(0));
        assertEquals(List.of(dummy, dummy2), workouts);
        verify(fitnessRepo).findAll();
    }

    @Test
    void addWorkout_insertsWithGeneratedId_andUsesNowWhenDateTimeNull() {
        // given
        WorkoutDto dto = new WorkoutDto("Test", "Running", null);
        when(idService.generateId()).thenReturn("1");

        Workout saved = new Workout("1", "Test", "Running", t1);
        when(fitnessRepo.save(any(Workout.class))).thenReturn(saved);

        // when
        Workout actual = fitnessService.addWorkout(dto);

        // then
        assertEquals(saved, actual);
        verify(idService).generateId();
        verify(fitnessRepo).save(any(Workout.class));
    }

    @Test
    void addWorkout_whenNullOrBlank_ThenThrowException() {
        WorkoutDto dto = new WorkoutDto("", "Running", null);
        assertThrows(NullPointerException.class, () -> fitnessService.addWorkout(dto));
        verifyNoInteractions(fitnessRepo);
    }

    @Test
    void getWorkoutById_whenValidId_ThenReturnWorkout() {
        String id = "1";
        Workout expected = dummy;
        when(fitnessRepo.findById(id)).thenReturn(Optional.of(expected));

        Workout actual = fitnessService.getWorkoutById(id);

        assertEquals(expected, actual);
        verify(fitnessRepo).findById(id);
    }

    @Test
    void getWorkoutById_whenInvalidId_ThenThrowException() {
        String id = "1";
        when(fitnessRepo.findById(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> fitnessService.getWorkoutById(id));
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

        assertThrows(NotFoundException.class, () -> fitnessService.deleteWorkoutById(id));
        verify(fitnessRepo, never()).deleteById(anyString());
    }

    @Test
    void updateWorkout_whenValidId_ThenReturnUpdatedWorkout() {
        String id = "1";
        Workout existing = dummy;
        // send new details (may change name/description and optionally dateTime)
        Workout details = new Workout(id, "New description", "New workout", t2);
        Workout expected = new Workout(id, "New description", "New workout", t2);

        when(fitnessRepo.findById(id)).thenReturn(Optional.of(existing));
        when(fitnessRepo.save(any(Workout.class))).thenReturn(expected);

        Workout actual = fitnessService.updateWorkout(id, details);

        assertEquals(expected, actual);
        verify(fitnessRepo).findById(id);
        verify(fitnessRepo).save(any(Workout.class));
    }

    @Test
    void updateWorkout_whenInvalidId_ThenThrowException() {
        String id = "nonExisting";
        Workout details = new Workout(id, "New description", "New workout", t2);
        when(fitnessRepo.findById(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> fitnessService.updateWorkout(id, details));
        verify(fitnessRepo).findById(id);
        verify(fitnessRepo, never()).save(any(Workout.class));
    }
}
