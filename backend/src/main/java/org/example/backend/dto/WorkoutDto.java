package org.example.backend.dto;
import lombok.With;

//test
@With
public record WorkoutDto(String workoutName,
                         String description,
                         String date,
                         String startTime,
                         Boolean favorite,
                         Double duration) { }