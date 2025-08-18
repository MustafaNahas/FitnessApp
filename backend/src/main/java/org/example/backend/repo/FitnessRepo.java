package org.example.backend.repo;

import org.example.backend.model.Workout;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FitnessRepo extends MongoRepository<Workout,String> {
    Workout getWorkoutById(String id);
}

