package org.example.backend.service;

import org.example.backend.dto.WorkoutDto;
import org.example.backend.exception.NotFoundException;
import org.example.backend.model.Workout;
import org.example.backend.repo.FitnessRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FitnessService {

    private final FitnessRepo repo;
    private final IdService idService;

    public FitnessService(FitnessRepo repo, IdService idService) {
        this.idService = idService;
        this.repo = repo;
    }

    public List<Workout> getAllWorkouts() {
        return repo.findAll();
    }

    public Workout addWorkout(WorkoutDto workoutDto) {
        if (workoutDto.workoutName() == null || workoutDto.workoutName().isBlank()) {
            throw new NullPointerException("Workout cannot be null or blank.");
        }

        Workout newWorkout = new Workout(
                idService.generateId(),
                workoutDto.description(),
                workoutDto.workoutName(),
                workoutDto.dateTime() != null ? workoutDto.dateTime() : LocalDateTime.now()
        );

        return repo.save(newWorkout);
    }

    public Workout getWorkoutById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Workout not found: " + id));
    }

    public void deleteWorkoutById(String id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Workout not found: " + id);
        }
        repo.deleteById(id);
    }

    public Workout updateWorkout(String id, Workout workoutDetails) {
        Workout existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Workout not found: " + id));

        Workout updated = existing
                .withDescription(workoutDetails.description())
                .withWorkoutName(workoutDetails.workoutName())
                .withDateTime(workoutDetails.dateTime() != null ? workoutDetails.dateTime() : existing.dateTime());

        return repo.save(updated);
    }

    public List<Workout> getWorkoutsInRange(LocalDateTime from, LocalDateTime to) {
        if (from == null && to == null) {
            return repo.findAll();
        }
        if (from == null) {
            return repo.findByDateTimeBetween(LocalDateTime.MIN, to);
        }
        if (to == null) {
            return repo.findByDateTimeBetween(from, LocalDateTime.MAX);
        }
        if (to.isBefore(from)) {
            throw new IllegalArgumentException("`to` must be after `from`");
        }
        return repo.findByDateTimeBetween(from, to);
    }
}
