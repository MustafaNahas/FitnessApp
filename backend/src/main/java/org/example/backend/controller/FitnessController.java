package org.example.backend.controller;

import org.example.backend.dto.WorkoutDto;
import org.example.backend.model.Workout;
import org.example.backend.service.FitnessService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FitnessController {
    private final FitnessService service;

    public FitnessController(FitnessService service) {
        this.service = service;
    }

    @GetMapping("/workouts")
    public List<Workout> getAllWorkouts(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to,

            @RequestParam(required = false)
            String period
    ) {
        if (period != null && !period.isBlank()) {
            LocalDate today = LocalDate.now();
            switch (period.toLowerCase()) {
                case "day" -> {
                    from = today.atStartOfDay();
                    to   = from.plusDays(1);
                }
                case "week" -> {
                    LocalDate monday = today.with(DayOfWeek.MONDAY);
                    from = monday.atStartOfDay();
                    to   = from.plusWeeks(1);
                }
                case "month" -> {
                    LocalDate firstOfMonth = today.withDayOfMonth(1);
                    from = firstOfMonth.atStartOfDay();
                    to   = from.plusMonths(1);
                }
                default -> throw new IllegalArgumentException("Unknown period. Use day|week|month.");
            }
        }

        return service.getWorkoutsInRange(from, to);
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
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/workouts/{id}")
    public ResponseEntity<Workout> updateWorkout(
            @PathVariable String id,
            @RequestBody Workout workoutDetails) {
        Workout updated = service.updateWorkout(id, workoutDetails);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/workouts/filter")
    public List<Workout> getWorkoutsByRange(
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to
    ) {
        return service.getWorkoutsInRange(from, to);
    }

}
