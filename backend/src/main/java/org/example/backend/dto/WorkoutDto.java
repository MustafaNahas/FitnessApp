package org.example.backend.dto;
import lombok.With;
@With
public record WorkoutDto(String description, String workoutName) { }