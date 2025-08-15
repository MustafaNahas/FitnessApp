package org.example.backend.model;

import lombok.With;

@With
public record Workout(String id,
                      String description,
                      String workoutName) {
}
