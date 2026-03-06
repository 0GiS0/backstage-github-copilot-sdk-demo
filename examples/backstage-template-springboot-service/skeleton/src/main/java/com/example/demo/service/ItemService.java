package com.example.demo.service;

import com.example.demo.dto.CreateItemRequest;
import com.example.demo.dto.ItemResponse;
import com.example.demo.dto.UpdateItemRequest;
import com.example.demo.exception.ItemNotFoundException;
import com.example.demo.model.Item;
import com.example.demo.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for Item business operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    /**
     * Get all items.
     */
    @Transactional(readOnly = true)
    public List<ItemResponse> getAllItems() {
        log.debug("Fetching all items");
        return itemRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Get all active items.
     */
    @Transactional(readOnly = true)
    public List<ItemResponse> getActiveItems() {
        log.debug("Fetching active items");
        return itemRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Get item by ID.
     */
    @Transactional(readOnly = true)
    public ItemResponse getItemById(Long id) {
        log.debug("Fetching item with id: {}", id);
        return itemRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ItemNotFoundException(id));
    }

    /**
     * Create a new item.
     */
    @Transactional
    public ItemResponse createItem(CreateItemRequest request) {
        log.info("Creating new item with name: {}", request.getName());

        Item item = Item.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();

        Item saved = itemRepository.save(item);
        log.info("Created item with id: {}", saved.getId());

        return toResponse(saved);
    }

    /**
     * Update an existing item.
     */
    @Transactional
    public ItemResponse updateItem(Long id, UpdateItemRequest request) {
        log.info("Updating item with id: {}", id);

        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));

        if (request.getName() != null) {
            item.setName(request.getName());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getActive() != null) {
            item.setActive(request.getActive());
        }

        Item saved = itemRepository.save(item);
        log.info("Updated item with id: {}", saved.getId());

        return toResponse(saved);
    }

    /**
     * Delete an item by ID.
     */
    @Transactional
    public void deleteItem(Long id) {
        log.info("Deleting item with id: {}", id);

        if (!itemRepository.existsById(id)) {
            throw new ItemNotFoundException(id);
        }

        itemRepository.deleteById(id);
        log.info("Deleted item with id: {}", id);
    }

    /**
     * Search items by name.
     */
    @Transactional(readOnly = true)
    public List<ItemResponse> searchByName(String name) {
        log.debug("Searching items with name containing: {}", name);
        return itemRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Convert Item entity to ItemResponse DTO.
     */
    private ItemResponse toResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .active(item.getActive())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
