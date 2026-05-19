package com.vas.vas_platform;

import com.vas.vas_platform.dto.BuyServiceRequest;
import com.vas.vas_platform.dto.CancelSubscriptionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class ServiceController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/buy-service")
    public String buyService(@RequestBody BuyServiceRequest request) {

        String sql = "BEGIN BUY_SERVICE(?, ?); END;";

        jdbcTemplate.update(
                sql,
                request.getSubscriberId(),
                request.getServiceId()
        );

        return "SERVICE PURCHASE SUCCESS";
    }

    @PostMapping("/cancel-subscription")
    public String cancelSubscription(@RequestBody CancelSubscriptionRequest request) {

        String sql = "BEGIN CANCEL_SUBSCRIPTION(?, ?); END;";

        jdbcTemplate.update(
                sql,
                request.getSubscriberId(),
                request.getServiceId()
        );

        return "SUBSCRIPTION CANCELLED";
    }
    @GetMapping("/services")
public List<Map<String, Object>> getServices() {

    String sql = """
            SELECT SERVICE_ID, SERVICE_NAME, SERVICE_TYPE, PRICE, STATUS
            FROM SERVICES
            WHERE STATUS = 1
            ORDER BY SERVICE_ID
            """;

    return jdbcTemplate.queryForList(sql);
}
}