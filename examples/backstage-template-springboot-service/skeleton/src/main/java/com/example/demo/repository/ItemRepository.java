package com.example.demo.repository;

import com.example.demo.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Item entity operations.
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    /**
     * Find all active items.
     */
    List<Item> findByActiveTrue();

    /**
     * Find items by name containing (case-insensitive).
     */
    List<Item> findByNameContainingIgnoreCase(String name);

    /**
     * Check if an item exists with the given name.
     */
    boolean existsByNameIgnoreCase(String name);
}
