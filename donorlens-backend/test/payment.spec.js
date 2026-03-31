import {test, expect} from "@playwright/test"
import { userLoginAndGetToken } from "./helper/auth.helper.js"

let token;
let adminToken;
let ngoToken;

test.beforeAll(async({request}) => {
    token = await userLoginAndGetToken(request, {
        email: "john@example.com",
        password: "securePassword123"
    })

    adminToken = await userLoginAndGetToken(request, {
        email: "admin.donorlens@gmail.com",
        password: "admin123"
    })
    
})

test.describe("Payment API", () => {
    test("payment api health check, need to return 200", async({request}) => {
        const res = await request.get("payment/health")
        expect(res.status()).toBe(200)
    })

    test("make successfull payment with the correct details", async ({request}) => {
        const res = await request.post("payment", {
            headers : {
                Authorization : `Bearer ${token}`
            },
            data : {
                campaignId : "69ac148f96c25e1fdad7a3ee",
                amount: 200,
                currency : "lkr",
                paymentMethod : "CARD"
            }
        })
        expect(res.status()).toBe(201)
    })

    test("make failed payment with the negetive amount", async ({request}) => {
        const res = await request.post("payment", {
            headers : {
                Authorization : `Bearer ${token}`
            },
            data : {
                campaignId : "69ac148f96c25e1fdad7a3ee",
                amount: -200,
                currency : "lkr",
                paymentMethod : "CARD"
            }
        })
        expect(res.status()).toBe(400)
    })

    test("make failed payment with the zero amount", async ({request}) => {
        const res = await request.post("payment", {
            headers : {
                Authorization : `Bearer ${token}`
            },
            data : {
                campaignId : "69ac148f96c25e1fdad7a3ee",
                amount: 0,
                currency : "lkr",
                paymentMethod : "CARD"
            }
        })
        expect(res.status()).toBe(201)
    })

    test("make failed payment without the campaing id", async ({request}) => {
        const res = await request.post("payment", {
            headers : {
                Authorization : `Bearer ${token}`
            },
            data : {
                amount: 200,
                currency : "lkr",
                paymentMethod : "CARD"
            }
        })
        expect(res.status()).toBe(400)
    })

    test("make faild payment without content body", async ({request}) => {
        const res = await request.post("payment", {
            headers : {
                Authorization : `Bearer ${token}`
            },
            data : {}
        })
        expect(res.status()).toBe(400)
    })

    test("try to access the transaction details from normal user login", async({request}) => {
        const res = await request.get("payment", {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        expect(res.status()).toBe(200)
    })

    test("try to access the transaction details from admin user login", async({request}) => {
        const res = await request.get("payment", {
            headers : {
                Authorization : `Bearer ${adminToken}`
            }
        })
        expect(res.status()).toBe(200)
    })
})