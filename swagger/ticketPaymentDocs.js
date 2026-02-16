/**
 * @swagger
 * tags:
 *   - name: Ticket Payment
 *     description: Ticket Payment Management API
 */

/**
 * @swagger
 * /api/v1/ticketpay/ticketpaymentkey:
 *   post:
 *     summary: Generate payment key for ticket purchase
 *     tags: [Ticket Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - totalPrice
 *               - paymentmethod
 *             properties:
 *               ticketId:
 *                 type: string
 *                 description: ID of the ticket to purchase
 *                 example: "696d85bd747772b5fe0409e5a"
 *               totalPrice:
 *                 type: Number
 *                 description: Total price for the ticket(s)
 *                 example: 300
 *               paymentmethod:
 *                 type: string
 *                 description: Payment method (visa card or fawry)
 *                 enum: [visa card, fawry]
 *                 example: "visa card"
 *     responses:
 *       200:
 *         description: Payment key generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 paymentKey:
 *                   type: string
 *                   description: Generated payment key token
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid ticket ID or payment method
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/ticketpay/ticketfawrypayment:
 *   post:
 *     summary: Make a Fawry payment using the payment key
 *     tags: [Ticket Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentkey
 *               - paymentmethod
 *             properties:
 *               paymentkey:
 *                 type: string
 *                 example: "1234567890abcdef"
 *               paymentmethod:
 *                 type: string
 *                 example: fawry
 *     responses:
 *       200:
 *         description: Fawry bill reference returned successfully
 *       400:
 *         description: Payment failed or invalid payment method
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/ticketpay/ticketvisapayment:
 *   post:
 *     summary: Make a Visa Card payment using the payment key
 *     tags: [Ticket Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentkey
 *               - paymentmethod
 *             properties:
 *               paymentkey:
 *                 type: string
 *                 example: "1234567890abcdef"
 *               paymentmethod:
 *                 type: string
 *                 example: visa card
 *     responses:
 *       200:
 *         description: Visa card iframe URL returned successfully
 *       400:
 *         description: Payment failed or invalid payment method
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/v1/ticketpay/paymentconfirmation:
 *   get:
 *     summary: Get latest payment confirmation details
 *     description: Retrieve the most recent payment information for the authenticated user
 *     tags: [Ticket Payment]
 *     security:
 *       - bearerAuth: []
 *     
 *     responses:
 *       200:
 *         description: Payment data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                       example: Ahmed Ali
 *                     payment:
 *                       type: object
 *                       properties:
 *                         invoice_number:
 *                           type: number
 *                           example: 123456
 *                         payment_method:
 *                           type: string
 *                           example: visa card
 *                         issuing_date:
 *                           type: string
 *                           example: 2026-02-16
 *                         amount_paid:
 *                           type: number
 *                           example: 50
 *       401:
 *         description: Unauthorized - Token expired or user not logged in
 *       404:
 *         description: No payment history found
 *       500:
 *         description: Internal server error
 */