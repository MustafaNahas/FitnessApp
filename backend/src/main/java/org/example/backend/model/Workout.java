package org.example.backend.model;

import lombok.With;

//test
@With
public record Workout(String id,
                      String userName,
                      String workoutName,
                      String description,
                      String date,
                      String startTime,
                      Boolean favorite,
                      Double duration
                      ) {
}
