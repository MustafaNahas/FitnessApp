package org.example.backend.dto;
import lombok.With;

import java.sql.Date;
import java.sql.Time;
import java.util.Optional;

@With
public record WorkoutDto(String workoutName,
                         Optional<String> description,
                         Optional<Date> date,
                         Optional<Time> startTime,
                         Optional<Boolean> favorite,
                         Optional<Double> duration) { }