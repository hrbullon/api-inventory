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

const PAYMENT_METHOD_CASH = "4";

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
    PAYMENT_METHOD_CASH,
    HTTP_200,
    HTTP_400,
    HTTP_403,
    HTTP_404,
    MESSAGE_OK
};