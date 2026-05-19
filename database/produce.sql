--------------------------------------------------------
--  File created - Tuesday-May-19-2026   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Procedure ADD_TRANSACTION_LOG
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "VAS_PLATFORM"."ADD_TRANSACTION_LOG" (
    p_action_type   IN VARCHAR2,
    p_subscriber_id IN NUMBER,
    p_service_id    IN NUMBER,
    p_description   IN VARCHAR2
)
AS
BEGIN
    INSERT INTO TRANSACTION_LOGS (
        LOG_ID,
        ACTION_TYPE,
        SUBSCRIBER_ID,
        SERVICE_ID,
        DESCRIPTION,
        CREATED_AT
    )
    VALUES (
        TRANSACTION_LOGS_SEQ.NEXTVAL,
        p_action_type,
        p_subscriber_id,
        p_service_id,
        p_description,
        SYSDATE
    );
END;

/
--------------------------------------------------------
--  DDL for Procedure BUY_SERVICE
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "VAS_PLATFORM"."BUY_SERVICE" (
    p_subscriber_id IN NUMBER,
    p_service_id    IN NUMBER
)
AS
    v_subscriber_count NUMBER;
    v_service_count NUMBER;
    v_balance NUMBER;
    v_price NUMBER;
    v_service_type VARCHAR2(20);
    v_duplicate NUMBER;
BEGIN

    -- Subscriber kontrol
    SELECT COUNT(*)
    INTO v_subscriber_count
    FROM SUBSCRIBERS
    WHERE SUBSCRIBER_ID = p_subscriber_id
      AND STATUS = 1;

    IF v_subscriber_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Subscriber not found or inactive');
    END IF;

    -- Service kontrol
    SELECT COUNT(*)
    INTO v_service_count
    FROM SERVICES
    WHERE SERVICE_ID = p_service_id
      AND STATUS = 1;

    IF v_service_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Service not found or inactive');
    END IF;

    -- Service bilgileri
    SELECT PRICE, SERVICE_TYPE
    INTO v_price, v_service_type
    FROM SERVICES
    WHERE SERVICE_ID = p_service_id;

    -- Subscriber balance
    SELECT BALANCE
    INTO v_balance
    FROM SUBSCRIBERS
    WHERE SUBSCRIBER_ID = p_subscriber_id;

    -- Bakiye kontrol
    IF v_balance < v_price THEN
        RAISE_APPLICATION_ERROR(-20003, 'Insufficient balance');
    END IF;

    -- Subscription servis
    IF v_service_type = 'SUBSCRIPTION' THEN

        -- duplicate kontrol
        SELECT COUNT(*)
        INTO v_duplicate
        FROM SUBSCRIPTIONS
        WHERE SUBSCRIBER_ID = p_subscriber_id
          AND SERVICE_ID = p_service_id
          AND STATUS = 'ACTIVE';

        IF v_duplicate > 0 THEN
            RAISE_APPLICATION_ERROR(-20004, 'Subscription already active');
        END IF;

        -- subscription ekle
        INSERT INTO SUBSCRIPTIONS (
            SUBSCRIPTION_ID,
            SUBSCRIBER_ID,
            SERVICE_ID,
            START_DATE,
            STATUS
        )
        VALUES (
            SUBSCRIPTIONS_SEQ.NEXTVAL,
            p_subscriber_id,
            p_service_id,
            SYSDATE,
            'ACTIVE'
        );

    ELSE

        -- one-time purchase
        INSERT INTO ONE_TIME_PURCHASES (
            PURCHASE_ID,
            SUBSCRIBER_ID,
            SERVICE_ID,
            PURCHASE_DATE,
            AMOUNT
        )
        VALUES (
            ONE_TIME_PURCHASES_SEQ.NEXTVAL,
            p_subscriber_id,
            p_service_id,
            SYSDATE,
            v_price
        );

    END IF;

    -- Balance dü?
    UPDATE SUBSCRIBERS
    SET BALANCE = BALANCE - v_price
    WHERE SUBSCRIBER_ID = p_subscriber_id;

    -- Log at
    ADD_TRANSACTION_LOG(
        'BUY_SERVICE',
        p_subscriber_id,
        p_service_id,
        'Service purchased successfully'
    );

    COMMIT;

END;

/
--------------------------------------------------------
--  DDL for Procedure CANCEL_SUBSCRIPTION
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "VAS_PLATFORM"."CANCEL_SUBSCRIPTION" (
    p_subscriber_id IN NUMBER,
    p_service_id    IN NUMBER
)
AS
    v_count NUMBER;
BEGIN

    SELECT COUNT(*)
    INTO v_count
    FROM SUBSCRIPTIONS
    WHERE SUBSCRIBER_ID = p_subscriber_id
      AND SERVICE_ID = p_service_id
      AND STATUS = 'ACTIVE';

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Active subscription not found');
    END IF;

    UPDATE SUBSCRIPTIONS
    SET STATUS = 'CANCELLED',
        END_DATE = SYSDATE
    WHERE SUBSCRIBER_ID = p_subscriber_id
      AND SERVICE_ID = p_service_id
      AND STATUS = 'ACTIVE';

    ADD_TRANSACTION_LOG(
        'CANCEL_SUBSCRIPTION',
        p_subscriber_id,
        p_service_id,
        'Subscription cancelled successfully'
    );

    COMMIT;

END;

/
