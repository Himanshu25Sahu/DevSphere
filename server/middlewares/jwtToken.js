import dotenv from 'dotenv'
dotenv.config();

export const sendToken = (user, statusCode, res) => {
  const token = user.getJWT();
  const isProduction=process.env.NODE_ENV==="production";

  console.log("################### IN SENDTOKEN PRODUCTION : ",isProduction);
  
  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction?"lax":"none",
  };

  console.log("Token created:", token); // Debug log
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
  });
};
