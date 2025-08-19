package org.example.backend.service;

import org.example.backend.dto.WorkoutDto;
import org.example.backend.exception.NotFoundException;
import org.example.backend.repo.FitnessRepo;
import org.example.backend.model.Workout;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FitnessService {
    // private final Mongo
    private final FitnessRepo repo;
    private final IdService idService;

    public FitnessService(FitnessRepo repo,IdService idService) {
        this.idService=idService;
        this.repo = repo;
    }

//     Workout dummy=new Workout("1","Description text","Running");
//     Workout dummy2=new Workout("2","Description text2","Lifting");
//     List<Workout> workouts=List.of(dummy,dummy2);
    public List<Workout> getAllWorkouts(){
        return repo.findAll();
    }

    public Workout addWorkout(WorkoutDto workoutDto) {
        if(workoutDto.workoutName()==null||workoutDto.workoutName().isBlank()){
            throw new IllegalArgumentException("Workout cannot be null or blank.");
        }

        Workout newWorkout=new Workout(
                idService.generateId(),
                workoutDto.description(),
                workoutDto.workoutName()
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
}
