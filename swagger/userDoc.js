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
 * /api/v1/users/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized (user not logged in)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/users/forgotpassword:
 *   post:
 *     summary: Send a password reset OTP to user's email
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
 *     summary: Reset password using OTP sent via email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: OTP received in email for resetting password 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - password
 *               - confirm_password
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "55555"
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
 *         description: Invalid OTP or passwords do not match
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
 *               currentpassword:
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
*               - email
*               - otp
*             properties:
*               email:
*                 type: string
*                 example: "test@gmail.com"
*               otp:
*                 type: string
*                 example: "99999"
*     responses:
*       200:
*         description: Email verified successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 verified:
*                   type: boolean
*                   example: true
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
*               - email
*             properties:
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
/**
 * @swagger
 *   /api/v1/users/profile/username:
 *   get:
 *     summary: return username
 *     tags: [Profile]
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
 *   /api/v1/users/profile/email:
 *   get:
 *     summary: return email
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     
 *     responses:
 *       200:
 *         description: return email
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 *   /api/v1/users/profile/photo:
 *   get:
 *     summary: return photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     
 *     responses:
 *       200:
 *         description: return photo
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 *   /api/v1/users/profile/getpaymentmethod:
 *   get:
 *     summary: return last payment method 
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     
 *     responses:
 *       200:
 *         description: return payment method 
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 *   /api/v1/users/profile/getbalance:
 *   get:
 *     summary: return balance and currency 
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     
 *     responses:
 *       200:
 *         description: return balance and currency 
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 *   /api/v1/users/profile/updateuserphoto:
 *   patch:
 *     summary: update user profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - photo
*             properties:
*               photo:
*                 type: string
*                 
 *     responses:
 *       200:
 *         description: photo updated
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 *   /api/v1/users/profile/updateusername:
 *   patch:
 *     summary: update username
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - name
*             properties:
*               name:
*                 type: string
*                 
 *     responses:
 *       200:
 *         description: name updated
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */