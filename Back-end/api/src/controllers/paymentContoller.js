require('dotenv').config();
const axios = require("axios");
const api = process.env.PAYPAL_API
const apiClient = process.env.PAYPAL_API_CLIENT
const apiSecret = process.env.PAYPAL_API_SECRET

const createOrder = async (req, res) => {
    try {
        //Doc:  https://developer.paypal.com/docs/api/orders/v2/
        const { value, description } = req.body;
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value
                    },     
                    description
                }
            ],
            application_context: {
                brand_name: "BOX Tech",
                landing_page: "LOGIN", // LOGIN/BILLING/NO_PREFERENCE
                user_action: "PAY_NOW",
                return_url: "https://localhost:3000/capture-order",
                cancel_url: "https://localhost:3000/cancel-order"
            }
        }

        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        //Getting token: https://developer.paypal.com/reference/get-an-access-token/
        const { data: { access_token } } = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token", params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: apiClient,
                password: apiSecret
            }
        })

        //Create order: https://developer.paypal.com/api/rest/requests/
        const response = await axios.post(`${api}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        //response.config.data can be use to capture info
        res.json(response.data);

    } catch(error) {
        return res.status(500).send("Something went wrong");
    }
    
}

const captureOrder = async (req, res) => {
    //Capture order: https://developer.paypal.com/docs/api/orders/v2/
    const { token } = req.query;

    const response = await axios.post(`${api}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: apiClient,
            password: apiSecret
        }
    });
    // Bill > Order
    //---------------------------------------------------------------------------------------------------------
    //TODO: 'response' brings all data need to capture payment info, depending on how it's send you must check
    //      what data to bring.
    //--------------------------------------------------------------------
    // const link = await axios.get(response.data.links[0].href, {
    //     auth: {
    //         username: apiClient,
    //         password: apiSecret
    //     }
    // })

    // servicesId = JSON.parse(link.data.purchase_units[0].description);
    // const userMail = servicesId.pop()                                
    // Can post this info to get bills on the order
    // await axios.post(`https://localhost:3001/orders`, {
    //     purchaseId: link.data.id,
    //     status: link.data.status,
    //     servicesId,
    //     userMail
    // });
    //---------------------------------------------------------------------
    //TODO: add notification for a completed payment. 
    return res.redirect("https://localhost:3000/home");
}

const cancelOrder = (req, res) => {
    //TODO: add notification for payment declined.
    res.redirect("https://localhost:3000/home")
}

module.exports = {
    cancelOrder, 
    captureOrder,
    createOrder
};