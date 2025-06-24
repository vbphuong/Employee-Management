package com.example.demo.controller;

import com.example.demo.entity.Employee;
import com.example.demo.entity.Role;
import com.example.demo.model.EmployeeRequest;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class EmployeeController {

    private final EmployeeService employeeService;
    private final RoleRepository roleRepository;

    
    public EmployeeController(EmployeeService employeeService, RoleRepository roleRepository) {
        this.employeeService = employeeService;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.findAll();
    }

    @GetMapping("/{employeeId}")
    public Employee getEmployeeById(@PathVariable int employeeId) {
        return employeeService.findById(employeeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employee addEmployee(@Valid @RequestBody EmployeeRequest theEmployee) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.isEmpty()) {
            throw new IllegalStateException("Username cannot be null. Ensure you are authenticated.");
        }
        Employee employee = new Employee(theEmployee.getFirstName(), theEmployee.getLastName(), theEmployee.getEmail(), username);
        Employee savedEmployee = employeeService.save(employee);
        Role role = new Role();
        role.setUsername(username);
        role.setRole("USER");
        roleRepository.save(role);
        return savedEmployee;
    }

    @PutMapping("/{employeeId}")
    public Employee updateEmployee(@PathVariable int employeeId, @Valid @RequestBody EmployeeRequest theEmployee) {
        if (employeeService.findById(employeeId) == null) {
            throw new RuntimeException("Employee not found with id: " + employeeId);
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.isEmpty()) {
            throw new IllegalStateException("Username cannot be null. Ensure you are authenticated.");
        }
        Employee employee = new Employee(theEmployee.getFirstName(), theEmployee.getLastName(), theEmployee.getEmail(), username);
        employee.setId(employeeId);
        return employeeService.save(employee);
    }

    @DeleteMapping("/{employeeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable int employeeId) {
        if (employeeService.findById(employeeId) == null) {
            throw new RuntimeException("Employee not found with id: " + employeeId);
        }
        employeeService.deleteById(employeeId);
    }

    @GetMapping("/roles/{username}")
    public ResponseEntity<List<Role>> getRolesByUsername(@PathVariable String username) {
        List<Role> roles = roleRepository.findByUsername(username);
        if (roles.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(roles);
    }

    @PutMapping("/roles/{username}")
    public ResponseEntity<?> updateRole(@PathVariable String username, @RequestBody Role roleRequest) {
        List<Role> roles = roleRepository.findByUsername(username);
        if (roles.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Role role = roles.get(0);
        if (!roleRequest.getRole().equals("ADMIN") && !roleRequest.getRole().equals("MANAGER") && !roleRequest.getRole().equals("USER")) {
            return ResponseEntity.badRequest().body("Role must be ADMIN, MANAGER, or USER");
        }
        role.setRole(roleRequest.getRole());
        roleRepository.save(role);
        return ResponseEntity.ok().build();
    }
}