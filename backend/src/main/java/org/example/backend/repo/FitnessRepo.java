package org.example.backend.repo;

import org.example.backend.model.Workout;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FitnessRepo extends MongoRepository<Workout,String> {

    List<Workout> findAllByUserName(String userName);


}