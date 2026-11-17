import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { LOGIN_MUTATION } from "../apollo/graphql/mutations/login.gql";
import { RESEND_VERIFICATION_EMAIL_MUTATION } from "../apollo/graphql/mutations/ResendLink.gql.ts";
import type {
  LoginInput,
  LoginResponse,
  ResendVerificationEmailResponse,
} from "../types/auth";
import loginImage from "../assets/loginImage.jpg";
import "../styles/login.css";
import "./../App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/loginSchema";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [loginMutation, { loading }] = useMutation<
    { login: LoginResponse },
    { input: LoginInput }
  >(LOGIN_MUTATION);

  const [resendVerificationEmailMutation] = useMutation<
    { resendVerificationEmail: ResendVerificationEmailResponse },
    { email: string }
  >(RESEND_VERIFICATION_EMAIL_MUTATION);

  const VerificationToast = ({ email }: { email: string }) => {
    const [sending, setSending] = useState(false);

    const handleResend = async () => {
      try {
        setSending(true);
        const { data } = await resendVerificationEmailMutation({
          variables: { email },
        });
        setSending(false);
        toast.dismiss();
        if (data?.resendVerificationEmail.success) {
          toast.success(data.resendVerificationEmail.message || "Email sent!");
        } else {
          toast.error(
            data?.resendVerificationEmail.message ||
              "Failed to resend verification email",
          );
        }
      } catch (err) {
        setSending(false);
        toast.dismiss();
        toast.error("Something went wrong. Please try again later.");
        console.error(err);
      }
    };

    return (
      <div>
        Your email is not verified.{" "}
        <button
          className="btn btn-link p-0"
          onClick={handleResend}
          disabled={sending}
        >
          {sending ? "Sending..." : "Resend verification email"}
        </button>
      </div>
    );
  };

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await loginMutation({ variables: { input: data } });
      const loginData = response.data?.login;

      if (!loginData) {
        toast.error("Unexpected error. Please try again.");
        return;
      }

      if (
        loginData.message === "Email not verified. Please verify your email."
      ) {
        toast.info(<VerificationToast email={data.email} />, {
          autoClose: false,
          closeOnClick: true,
          draggable: true,
          position: "top-right",
        });
        return;
      }

      if (!loginData.success) {
        toast.error(loginData.message || "Login failed");
        return;
      }

      toast.success(loginData.message || "Login successful");
      dispatch(setCredentials(loginData));

      setTimeout(() => {
        if (loginData.user?.role === "admin") {
          navigate("/admin");
        } else if (loginData.user?.role === "investor") {
          navigate("/investor");
        }
      }, 500);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Try again later.");
    }
  };

  return (
    <Container fluid className="vw-100 vh-100 p-0 m-0 container-bg">
      <Row className="h-100 w-100 m-0">
        <Col
          md={6}
          className="d-flex flex-column overflow-hidden justify-content-center align-items-center col-bg position-relative"
        >
          <div className="main-container">
            <div className="text-center">
              <img src={Logo} alt="Propomy Logo" width={42} height={42} />
              <h2 className="mt-2 welcome-title">Welcome to Propomy</h2>
            </div>

            <div className="mt-3">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-1" controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    placeholder="Email Address"
                    size="lg"
                    className="custom-input"
                    {...register("email")}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message as string}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      size="lg"
                      className="custom-input "
                      {...register("password")}
                      isInvalid={!!errors.password}
                    />
                    <span
                      className="login-span"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible size={20} />
                      ) : (
                        <AiFillEye size={20} />
                      )}
                    </span>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message as string}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="login-btn-container">
                  <Button
                    className="login-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </Form>
            </div>

            <div className="fw-light text-center mt-4 text-16">
              Forget password? <Link to="/forget-password">Click here</Link>
            </div>

            <div className="fw-light text-center mt-3 text-16">
              Need help? Call <a href="tel:8447640583">(844) 764-0583</a> or
              email us at{" "}
              <a href="mailto:Support@Propomy.com">Support@Propomy.com</a> —
              Mon–Fri, 8AM-6PM EST
            </div>
          </div>

          {/* Footer section */}
          <div className="position-fixed left-0 bottom-0 px-3 pb-4 login-footer-responsive">
            <hr className="my-4" />
            <div className="fw-light text-center text-16">
              Don’t have an account?{" "}
              <Link className="link-blue" to="/signup">
                Sign up today!
              </Link>
            </div>
          </div>
        </Col>

        <Col md={6} className="p-0 d-none d-md-block h-100">
          <img src={loginImage} alt="Login" className="login-img" />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
