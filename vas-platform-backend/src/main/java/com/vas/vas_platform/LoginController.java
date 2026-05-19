package com.vas.vas_platform;

import com.vas.vas_platform.dto.LoginRequest;
import com.vas.vas_platform.dto.SubscriberLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        String sql = """
                SELECT COUNT(*)
                FROM USERS
                WHERE USERNAME = ?
                AND PASSWORD = ?
                AND STATUS = 1
                """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                request.getUsername(),
                request.getPassword()
        );

        if (count != null && count > 0) {
            return "LOGIN SUCCESS";
        }

        return "INVALID USERNAME OR PASSWORD";
    }

    @PostMapping("/subscriber-login")
public Map<String, Object> subscriberLogin(
        @RequestBody SubscriberLoginRequest request
) {

    String sql = """
            SELECT SUBSCRIBER_ID, FULL_NAME, BALANCE
            FROM SUBSCRIBERS
            WHERE MSISDN = ?
            AND PASSWORD = ?
            AND STATUS = 1
            """;

    List<Map<String, Object>> result = jdbcTemplate.queryForList(
            sql,
            request.getMsisdn(),
            request.getPassword()
    );

    if (!result.isEmpty()) {
        return result.get(0);
    }

    return Map.of("error", "INVALID CREDENTIALS");
}
@GetMapping("/subscriber/{id}")
public Map<String, Object> getSubscriber(
        @PathVariable int id
) {

    String sql = """
            SELECT SUBSCRIBER_ID,
                   FULL_NAME,
                   BALANCE,
                   MSISDN
            FROM SUBSCRIBERS
            WHERE SUBSCRIBER_ID = ?
            """;

    return jdbcTemplate.queryForMap(sql, id);
}
}