package org.example.backend.controller;

import org.example.backend.model.Workout;
import org.example.backend.service.FitnessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")

public class FitnessController {
    private final FitnessService service;

    public FitnessController(FitnessService service) {
        this.service = service;
    }

    @GetMapping("/workouts")
    public List<Workout> getAllWorkouts(){
        return service.getAllWorkouts();
    }

    @GetMapping("/workouts/{id}")
    public Workout getWorkout(@PathVariable String id){
        return service.getWorkoutById(id);
    }

    @DeleteMapping("/workouts/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable String id){
        service.deleteWorkoutById(id);
        return ResponseEntity.noContent().build(); // 204
    }

}
