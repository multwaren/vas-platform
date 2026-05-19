package com.vas.vas_platform;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/top-services")
    public List<Map<String, Object>> getTopServices() {

        String sql = """
                SELECT
                    s.SERVICE_NAME,
                    COUNT(*) AS TOTAL_SALES
                FROM (
                    SELECT SERVICE_ID FROM SUBSCRIPTIONS
                    UNION ALL
                    SELECT SERVICE_ID FROM ONE_TIME_PURCHASES
                ) t
                JOIN SERVICES s
                    ON s.SERVICE_ID = t.SERVICE_ID
                GROUP BY s.SERVICE_NAME
                ORDER BY TOTAL_SALES DESC
                """;

        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/active-subscriptions")
public Map<String, Object> getActiveSubscriptions() {

    String sql = """
            SELECT COUNT(*) AS ACTIVE_SUBSCRIPTIONS
            FROM SUBSCRIPTIONS
            WHERE STATUS = 'ACTIVE'
            """;

    return jdbcTemplate.queryForMap(sql);
}


@GetMapping("/revenue")
public Map<String, Object> getRevenue() {

    String sql = """
            SELECT SUM(REVENUE) AS TOTAL_REVENUE
            FROM (
                SELECT s.PRICE AS REVENUE
                FROM SUBSCRIPTIONS sub
                JOIN SERVICES s
                    ON s.SERVICE_ID = sub.SERVICE_ID

                UNION ALL

                SELECT otp.AMOUNT AS REVENUE
                FROM ONE_TIME_PURCHASES otp
            )
            """;

    return jdbcTemplate.queryForMap(sql);
}

@GetMapping("/logs")
public List<Map<String, Object>> getLogs() {

    String sql = """
            SELECT LOG_ID,
                   ACTION_TYPE,
                   SUBSCRIBER_ID,
                   SERVICE_ID,
                   DESCRIPTION,
                   CREATED_AT
            FROM TRANSACTION_LOGS
            ORDER BY CREATED_AT DESC
            FETCH FIRST 20 ROWS ONLY
            """;

    return jdbcTemplate.queryForList(sql);
}

@GetMapping("/revenue-summary")
public Map<String, Object> getRevenueSummary() {

    String sql = """
            SELECT
                NVL(SUM(CASE WHEN TX_DATE >= SYSDATE - 1 THEN REVENUE ELSE 0 END), 0) AS LAST_24_HOURS,
                NVL(SUM(CASE WHEN TX_DATE >= SYSDATE - 7 THEN REVENUE ELSE 0 END), 0) AS LAST_7_DAYS,
                NVL(SUM(CASE WHEN TX_DATE >= ADD_MONTHS(SYSDATE, -1) THEN REVENUE ELSE 0 END), 0) AS LAST_30_DAYS
            FROM (
                SELECT s.PRICE AS REVENUE,
                       sub.START_DATE AS TX_DATE
                FROM SUBSCRIPTIONS sub
                JOIN SERVICES s
                    ON s.SERVICE_ID = sub.SERVICE_ID

                UNION ALL

                SELECT otp.AMOUNT AS REVENUE,
                       otp.PURCHASE_DATE AS TX_DATE
                FROM ONE_TIME_PURCHASES otp
            )
            """;

    return jdbcTemplate.queryForMap(sql);
}
@GetMapping("/business-days-performance")
public Map<String, Object> getBusinessDaysPerformance(
        @RequestParam String startDate,
        @RequestParam String endDate
) {

    String sql = """
            SELECT
                COUNT(*) AS TOTAL_SALES,
                NVL(SUM(REVENUE), 0) AS TOTAL_REVENUE
            FROM (
                SELECT s.PRICE AS REVENUE,
                       sub.START_DATE AS TX_DATE
                FROM SUBSCRIPTIONS sub
                JOIN SERVICES s
                    ON s.SERVICE_ID = sub.SERVICE_ID

                UNION ALL

                SELECT otp.AMOUNT AS REVENUE,
                       otp.PURCHASE_DATE AS TX_DATE
                FROM ONE_TIME_PURCHASES otp
            )
            WHERE TRUNC(TX_DATE)
                  BETWEEN TO_DATE(?, 'YYYY-MM-DD')
                  AND TO_DATE(?, 'YYYY-MM-DD')
              AND TO_CHAR(TX_DATE, 'DY', 'NLS_DATE_LANGUAGE=ENGLISH')
                  NOT IN ('SAT', 'SUN')
            """;

    return jdbcTemplate.queryForMap(sql, startDate, endDate);
}
@GetMapping("/subscriber-spending/{id}")
public Map<String, Object> getSubscriberSpending(@PathVariable int id) {

    String sql = """
            SELECT NVL(SUM(REVENUE), 0) AS USER_SPENDING
            FROM (
                SELECT s.PRICE AS REVENUE,
                       sub.SUBSCRIBER_ID
                FROM SUBSCRIPTIONS sub
                JOIN SERVICES s ON s.SERVICE_ID = sub.SERVICE_ID

                UNION ALL

                SELECT otp.AMOUNT AS REVENUE,
                       otp.SUBSCRIBER_ID
                FROM ONE_TIME_PURCHASES otp
            )
            WHERE SUBSCRIBER_ID = ?
            """;

    return jdbcTemplate.queryForMap(sql, id);
}
@GetMapping("/subscriber-subscriptions/{id}")
public List<Map<String, Object>> getSubscriberSubscriptions(
        @PathVariable int id
) {

    String sql = """
            SELECT DISTINCT
                s.SERVICE_NAME,
                s.SERVICE_TYPE,
                s.PRICE
            FROM SUBSCRIPTIONS sub
            JOIN SERVICES s
                ON s.SERVICE_ID = sub.SERVICE_ID
            WHERE sub.SUBSCRIBER_ID = ?
              AND sub.STATUS = 'ACTIVE'
            ORDER BY s.SERVICE_NAME
            """;

    return jdbcTemplate.queryForList(sql, id);
}


}


