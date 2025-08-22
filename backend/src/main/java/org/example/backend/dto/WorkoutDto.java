package org.example.backend.dto;

import lombok.With;
import java.time.LocalDateTime;

@With
public record WorkoutDto(
        String description,
        String workoutName,
        LocalDateTime dateTime
) { }
