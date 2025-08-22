package org.example.backend.model;

import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@With
@Document(collection = "workouts")
public record Workout(
        @Id
        String id,
        String description,
        String workoutName,
        LocalDateTime dateTime
) { }
