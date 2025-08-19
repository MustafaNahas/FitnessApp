package org.example.backend.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class IdServiceTest {

    @Test
    void generateId() {
        IdService idService = new IdService();
        String id = idService.generateId();

        // Check if the generated ID is not null or empty
        assertNotNull(id);
        assertFalse(id.isEmpty());
    }
}