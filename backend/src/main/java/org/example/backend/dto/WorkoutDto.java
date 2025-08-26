package org.example.backend.dto;
import lombok.With;

//test
@With
public record WorkoutDto(String userName,
                         String workoutName,
                         String description,
                         String date,
                         String startTime,
                         Boolean favorite,
                         Double duration) { }