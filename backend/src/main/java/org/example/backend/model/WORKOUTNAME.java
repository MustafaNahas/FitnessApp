package org.example.backend.model;

import lombok.Getter;
@Getter
//for later use in the frontend
public enum WORKOUTNAME {
    RUNNING("Running"),
    WALKING("Walking"),
    CYCLING("Cycling"),
    WEIGHTTRAINNING("Weight training");

    private final String workoutName;

    WORKOUTNAME(String workoutName) {
        this.workoutName = workoutName;
    }
}