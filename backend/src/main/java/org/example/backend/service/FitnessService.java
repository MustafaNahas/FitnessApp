package org.example.backend.service;

import org.example.backend.dto.WorkoutDto;
import org.example.backend.exception.NotFoundException;
import org.example.backend.repo.FitnessRepo;
import org.example.backend.model.Workout;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.example.backend.controller.AuthController.username;

@Service
public class FitnessService {
    // private final Mongo
    private final FitnessRepo repo;
    private final IdService idService;

    public FitnessService(FitnessRepo repo,IdService idService) {
        this.idService=idService;
        this.repo = repo;
    }


    public List<Workout> getAllWorkouts(String username){
        return repo.findAllByUserName(username);
    }

    public Workout addWorkout(WorkoutDto workoutDto) {
        if(workoutDto.workoutName()==null||workoutDto.workoutName().isBlank()){
            throw new NullPointerException("Workout cannot be null or blank.");
        }

        Workout newWorkout=new Workout(
                idService.generateId(),
                username,
                workoutDto.workoutName(),
                workoutDto.description(),
                workoutDto.date(),
                workoutDto.startTime(),
                workoutDto.favorite(),
                workoutDto.duration()
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
                .withDate(workoutDetails.date())
                .withStartTime(workoutDetails.startTime())
                .withFavorite(workoutDetails.favorite())
                .withDuration(workoutDetails.duration());

        return repo.save(updated);
    }

}
