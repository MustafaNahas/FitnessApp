package org.example.backend.controller;

import org.example.backend.model.Workout;
import org.example.backend.service.FitnessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
