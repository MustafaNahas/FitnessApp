package org.example.backend.dto;
import lombok.With;

import java.sql.Date;
import java.sql.Time;

//test
@With
public record WorkoutDto(String workoutName,
                         String description,
                         Date date,
                         Time startTime,
                         Boolean favorite,
                         Double duration) { }