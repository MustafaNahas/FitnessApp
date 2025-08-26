package org.example.backend.controller;

import org.example.backend.dto.WorkoutDto;
import org.example.backend.model.Workout;
import org.example.backend.service.FitnessService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;



@RestController
@RequestMapping("/api")

public class FitnessController {
    private final FitnessService service;

    public FitnessController(FitnessService service, AuthController authController) {

        this.service = service;
    }

    @GetMapping("/workouts")
    public List<Workout> getAllWorkouts(@AuthenticationPrincipal OAuth2User user){
        String username = user.getAttribute("login");
        return service.getAllWorkouts(username);
    }

    @PostMapping("/workouts")
    public ResponseEntity<Workout> addWorkout(@RequestBody WorkoutDto workoutDto){
        return new ResponseEntity<>(service.addWorkout(workoutDto), HttpStatus.CREATED);
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
    @PutMapping("/workouts/{id}")
    public ResponseEntity<Workout> updateWorkout(
            @PathVariable String id,
            @RequestBody Workout workoutDetails) {
        Workout updated = service.updateWorkout(id, workoutDetails);
        return ResponseEntity.ok(updated);
    }

}
