package org.example.backend.service;

import org.example.backend.repo.FitnessRepo;
import org.example.backend.model.Workout;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FitnessService {

    private final FitnessRepo repo;

    public FitnessService(FitnessRepo repo) {
        this.repo = repo;
    }

    Workout dummy  = new Workout("1","Description text","Running");
    Workout dummy2 = new Workout("2","Description text2","Lifting");
    List<Workout> workouts = List.of(dummy, dummy2);


    public List<Workout> getAllWorkouts(){
        if (repo.count() == 0) {
            repo.saveAll(workouts);
        }
        return repo.findAll();
    }

    public void deleteWorkoutById(String id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Workout not found: " + id);
        }
        repo.deleteById(id);
    }
}
