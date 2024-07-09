const ADMIN_ROLE = "ADM_ROLE";

const SALE_STATE_PENDING = "0";
const SALE_STATE_COMPLETED = "1"
const SALE_STATE_CANCELLED = "2";

const TRANSACTION_TYPE_SALE = "5";
const TRANSACTION_TYPE_CHANGE = "8";
const TRANSACTION_TYPE_CHECKOUT_OPEN = "1";
const TRANSACTION_TYPE_CHECKOUT_CLOSE = "2";
const TRANSACTION_TYPE_CHECKOUT_IN_CASH = "3";
const TRANSACTION_TYPE_CHECKOUT_OUT_CASH = "4";

const CHECKOUT_SESSION_STATE_ACTIVE = "1";
const CHECKOUT_SESSION_STATE_INACTIVE = "0";

const PRODUCT_INCREMENT = "increment";
const PRODUCT_DECREMENT = "decrement";
const PRODUCT_STATE_ACTIVE = "1";
const PRODUCT_STATE_DELETED = "0";

const PAYMENT_METHOD_CASH = "4";
const PAYMENT_DELETED_TRUE = "1";
const PAYMENT_DELETED_FALSE = "0";

const CHECKOUT_SALE = 5;

const HTTP_200 = 200;
const HTTP_400 = 400;
const HTTP_403 = 403;
const HTTP_404 = 404;

const MESSAGE_OK = 'ok';

module.exports = {
    ADMIN_ROLE,
    SALE_STATE_PENDING,
    SALE_STATE_COMPLETED,
    SALE_STATE_CANCELLED,
    CHECKOUT_SALE,
    TRANSACTION_TYPE_SALE,
    TRANSACTION_TYPE_CHANGE,
    TRANSACTION_TYPE_CHECKOUT_OPEN,
    TRANSACTION_TYPE_CHECKOUT_IN_CASH,
    TRANSACTION_TYPE_CHECKOUT_OUT_CASH,
    TRANSACTION_TYPE_CHECKOUT_CLOSE,
    CHECKOUT_SESSION_STATE_ACTIVE,
    CHECKOUT_SESSION_STATE_INACTIVE,
    PRODUCT_INCREMENT,
    PRODUCT_DECREMENT,
    PRODUCT_STATE_ACTIVE,
    PRODUCT_STATE_DELETED,
    PAYMENT_METHOD_CASH,
    PAYMENT_DELETED_TRUE,
    PAYMENT_DELETED_FALSE,
    HTTP_200,
    HTTP_400,
    HTTP_403,
    HTTP_404,
    MESSAGE_OK
};