package org.example.backend.model;

import lombok.With;

import java.sql.Date;
import java.sql.Time;

@With
public record Workout(String id,
                      String workoutName,
                      String description,
                      Date date,
                      Time startTime,
                      Boolean favorite,
                      Double duration
                      ) {
}
