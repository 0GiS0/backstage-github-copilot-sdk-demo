package com.example.demo.controller;

import com.example.demo.dto.CreateItemRequest;
import com.example.demo.dto.ItemResponse;
import com.example.demo.dto.UpdateItemRequest;
import com.example.demo.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Item operations.
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "Items", description = "Item management API")
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    @Operation(summary = "Get all items", description = "Retrieves a list of all items")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of items")
    public ResponseEntity<List<ItemResponse>> getAllItems(
            @RequestParam(required = false, defaultValue = "false") 
            @Parameter(description = "Filter only active items") 
            boolean activeOnly) {

        List<ItemResponse> items = activeOnly 
                ? itemService.getActiveItems() 
                : itemService.getAllItems();

        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item by ID", description = "Retrieves a specific item by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item found"),
            @ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<ItemResponse> getItemById(
            @PathVariable @Parameter(description = "Item ID") Long id) {

        ItemResponse item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/search")
    @Operation(summary = "Search items by name", description = "Search items containing the specified name")
    @ApiResponse(responseCode = "200", description = "Search results")
    public ResponseEntity<List<ItemResponse>> searchItems(
            @RequestParam @Parameter(description = "Search term") String name) {

        List<ItemResponse> items = itemService.searchByName(name);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    @Operation(summary = "Create a new item", description = "Creates a new item with the provided data")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Item created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ItemResponse> createItem(
            @Valid @RequestBody CreateItemRequest request) {

        ItemResponse created = itemService.createItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an item", description = "Updates an existing item with the provided data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item updated successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable @Parameter(description = "Item ID") Long id,
            @Valid @RequestBody UpdateItemRequest request) {

        ItemResponse updated = itemService.updateItem(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an item", description = "Deletes an item by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<Void> deleteItem(
            @PathVariable @Parameter(description = "Item ID") Long id) {

        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
