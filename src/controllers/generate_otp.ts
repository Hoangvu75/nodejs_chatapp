import * as API_LINK from "../constants/api_link";

export function generateOtpCode(app: any) {
  app.post(API_LINK.LINK_AUTHEN_GENERATE_OTP, async (req: any, res: any) => {
    res.status(200).send({ otp_code: otpCodeString() });
  });
}

function otpCodeString(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}
