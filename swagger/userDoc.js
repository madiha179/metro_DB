/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User Management API
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               name:
 *                 type: string
 *                 example: user1
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 example: user1234
 *               confirm_password:
 *                 type: string
 *                 example: user1234
 *               phone:
 *                 type: string
 *                 example: 01234567890
 *               age:
 *                 type: number
 *                 example: 25
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: female
 *               ssn:
 *                 type: number
 *                 example: 12345678901234
 *               photo:
 *                 type: string
 *                 example: profile.jpg
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: login users 
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 example: user1234
 *     responses:
 *       200:
 *         description: user login successfully
 *       400:
 *         description: Invalid email or wrong password
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/v1/users/forgotpassword:
 *   post:
 *     summary: Send a password reset link to user's email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/users/resetpassword/{token}:
 *   patch:
 *     summary: Reset password using token sent via email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token received in email for resetting password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirm_password
 *             properties:
 *               password:
 *                 type: string
 *                 example: newPassword123
 *               confirm_password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or passwords do not match
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 *   /api/v1/users/changepassword:
 *   patch:
 *     summary: change password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cuurentpassword
 *               - password
 *               - confirm_password
 *             properties:
 *               cuurentpassword:
 *                  type: string
 *                  example: Password123
 *               password:
 *                 type: string
 *                 example: newPassword123
 *               confirm_password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password change successfully
 *       400:
 *         description: wrong current password or passwords do not match
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 *   /api/v1/users/profile/username:
 *   get:
 *     summary: return username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     
 *     responses:
 *       200:
 *         description: return username
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */
/**
* @swagger
* /api/v1/users/verifyOTP:
*   post:
*     summary: Verify user OTP
*     tags: [Users, UserOTPVerification]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - userId
*               - otp
*             properties:
*               userId:
*                 type: string
*                 example: "64f8a2c1b3e8f3a1d2c12345"
*               otp:
*                 type: integer
*                 example: 99999
*     responses:
*       200:
*         description: Email verified successfully
*       400:
*         description: Bad Request (Invalid OTP, expired OTP, or account issue)
*       500:
*         description: Server error
*/
/**
 * @swagger
* /api/v1/users/resendOTP:
*   post:
*     summary: resend user OTP
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - userId
*               - email
*             properties:
*               userId:
*                 type: string
*                 example: "64f8a2c1b3e8f3a1d2c12345"
*               email:
*                 type: string
*                 example: test@gmail.com
*     responses:
*       200:
*         description: Resend the OTP successfully
*       400:
*         description: Email or userId missing
*       500:
*         description: Server error
 */